#!/usr/bin/env python3
"""
ABA Provider Verification Crawler (Updated)
Distinguishes Applied Behavior Analysis (ABA) from general Behavioral Therapy.
"""

import pandas as pd
import requests
from bs4 import BeautifulSoup
import re
import time
from urllib.parse import urljoin, urlparse
from datetime import datetime


class ABAVerificationCrawler:
    def __init__(self, input_csv):
        self.input_csv = input_csv
        self.df = pd.read_csv(input_csv)
        self.results = []
        
        # --- Updated search term logic ---
        self.aba_terms = [
            r'\bABA\b',
            r'\bApplied Behavior Analysis\b',
            r'\bApplied Behaviour Analysis\b',  # UK spelling
            r'\bBCBA\b',
            r'\bRBT\b',
            r'board certified behavior analyst'
        ]

        # New: broader non-ABA behavioral terms
        self.behavior_analysis_terms = [
            r'behavior analysis',
            r'behavioral therapy',
            r'behavior modification',
            r'behavior specialist'
        ]
        
        self.autism_terms = [
            r'\bautism\b',
            r'\bASD\b',
            r'autism spectrum',
            r'autistic',
            r'asperger'
        ]
        
        self.pediatric_therapy_terms = {
            'speech': [r'speech therapy', r'speech.language', r'speech patholog', r'\bSLP\b'],
            'ot': [r'occupational therapy', r'\bOT\b', r'occupational therapist'],
            'pt': [r'physical therapy', r'\bPT\b', r'physical therapist']
        }
        
        self.pediatric_indicators = [
            r'\bpediatric\b',
            r'\bchildren\b',
            r'\bkids\b',
            r'\bchild\b',
            r'\byouth\b',
            r'\badolescent\b',
            r'\binfant\b',
            r'\btoddler\b'
        ]
        
        self.page_paths = [
            '', '/about', '/about-us', '/aboutus', '/services',
            '/our-services', '/what-we-do', '/programs', '/therapy', '/treatments'
        ]
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
    # ---------------------- Utility Functions ----------------------
    def is_valid_website(self, website):
        if not website or pd.isna(website):
            return False
        website = str(website).strip()
        if not website or website in ('null', 'None'):
            return False
        if 'flddresources.qlarant.com' in website:
            return False
        if not website.startswith(('http://', 'https://')):
            website = 'https://' + website
        return True
    
    def fetch_page(self, url, timeout=10):
        try:
            response = self.session.get(url, timeout=timeout, allow_redirects=True)
            if response.status_code == 200:
                return response.text
        except:
            pass
        return None
    
    def search_text(self, text, patterns):
        if not text:
            return False, []
        matches = []
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                matches.append(pattern)
        return len(matches) > 0, matches
    
    def extract_text_from_html(self, html):
        if not html:
            return ""
        soup = BeautifulSoup(html, 'html.parser')
        for script in soup(["script", "style"]):
            script.decompose()
        text = soup.get_text(separator=' ')
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        return ' '.join(chunk for chunk in chunks if chunk)
    
    # ---------------------- Core Crawl Logic ----------------------
    def crawl_website(self, website):
        result = {
            'website': website,
            'has_valid_website': False,
            'pages_crawled': 0,
            'aba_found': False,
            'aba_pages': [],
            'aba_matches': [],
            'behavior_analysis_found': False,
            'behavior_analysis_pages': [],
            'behavior_analysis_matches': [],
            'autism_found': False,
            'autism_pages': [],
            'autism_matches': [],
            'pediatric_speech_found': False,
            'pediatric_ot_found': False,
            'pediatric_pt_found': False,
            'therapy_pages': [],
            'therapy_matches': {},
            'recommendation': 'UNKNOWN',
            'notes': ''
        }
        
        if not self.is_valid_website(website):
            result['notes'] = 'No valid website or FL-DD database link'
            result['recommendation'] = 'FLAG_FOR_REVIEW'
            return result
        
        result['has_valid_website'] = True
        if not website.startswith(('http://', 'https://')):
            website = 'https://' + website
        parsed = urlparse(website)
        base_url = f"{parsed.scheme}://{parsed.netloc}"
        
        for path in self.page_paths:
            url = urljoin(base_url, path)
            html = self.fetch_page(url)
            if not html:
                continue

            result['pages_crawled'] += 1
            text = self.extract_text_from_html(html)

            # Strict ABA check
            aba_found, aba_matches = self.search_text(text, self.aba_terms)
            if aba_found:
                result['aba_found'] = True
                result['aba_pages'].append(path if path else 'home')
                result['aba_matches'].extend(aba_matches)

            # Broader behavioral analysis check
            behavior_found, behavior_matches = self.search_text(text, self.behavior_analysis_terms)
            if behavior_found and not result['aba_found']:
                result['behavior_analysis_found'] = True
                result['behavior_analysis_pages'].append(path if path else 'home')
                result['behavior_analysis_matches'].extend(behavior_matches)

            autism_found, autism_matches = self.search_text(text, self.autism_terms)
            if autism_found:
                result['autism_found'] = True
                result['autism_pages'].append(path if path else 'home')
                result['autism_matches'].extend(autism_matches)

            pediatric_found, _ = self.search_text(text, self.pediatric_indicators)
            if pediatric_found:
                for therapy_type, patterns in self.pediatric_therapy_terms.items():
                    therapy_found, matches = self.search_text(text, patterns)
                    if therapy_found:
                        page_key = path if path else 'home'
                        if therapy_type == 'speech':
                            result['pediatric_speech_found'] = True
                        elif therapy_type == 'ot':
                            result['pediatric_ot_found'] = True
                        elif therapy_type == 'pt':
                            result['pediatric_pt_found'] = True
                        if page_key not in result['therapy_pages']:
                            result['therapy_pages'].append(page_key)
                        if therapy_type not in result['therapy_matches']:
                            result['therapy_matches'][therapy_type] = []
                        result['therapy_matches'][therapy_type].extend(matches)

            time.sleep(0.5)

        # --- Updated recommendation logic ---
        if result['aba_found']:
            result['recommendation'] = 'KEEP_AS_ABA'
            result['notes'] = f"ABA verified on pages: {', '.join(result['aba_pages'])}"
        elif result['behavior_analysis_found']:
            result['recommendation'] = 'KEEP_RECATEGORIZE_BEHAVIOR_ANALYSIS'
            result['notes'] = f"Behavior Analysis found (non-ABA): {', '.join(result['behavior_analysis_pages'])}"
        elif result['autism_found']:
            result['recommendation'] = 'KEEP_RECATEGORIZE_AUTISM'
            result['notes'] = f"Autism services found on: {', '.join(result['autism_pages'])}"
        elif result['pediatric_speech_found'] or result['pediatric_ot_found'] or result['pediatric_pt_found']:
            therapies = []
            if result['pediatric_speech_found']: therapies.append('Speech')
            if result['pediatric_ot_found']: therapies.append('OT')
            if result['pediatric_pt_found']: therapies.append('PT')
            result['recommendation'] = 'KEEP_RECATEGORIZE_THERAPY'
            result['notes'] = f"Pediatric therapy found: {', '.join(therapies)}"
        elif result['pages_crawled'] == 0:
            result['recommendation'] = 'FLAG_WEBSITE_DOWN'
            result['notes'] = 'Website could not be crawled (down or blocked)'
        else:
            result['recommendation'] = 'FLAG_FOR_REMOVAL'
            result['notes'] = f"Crawled {result['pages_crawled']} pages — no ABA, autism, or therapy found"
        
        return result
    
    # ---------------------- Processing ----------------------
    def process_providers(self, limit=None):
        aba_providers = self.df[self.df['service_type'].str.contains('ABA', case=False, na=False)]
        if limit:
            aba_providers = aba_providers.head(limit)
        
        print(f"Processing {len(aba_providers)} ABA-labeled providers...\n")
        
        for idx, row in aba_providers.iterrows():
            provider_name = row['provider_name']
            website = row['website']
            
            print(f"[{idx+1}/{len(aba_providers)}] {provider_name}")
            print(f"Website: {website}")
            
            result = self.crawl_website(website)
            result['provider_id'] = row['id']
            result['provider_name'] = provider_name
            result['phone'] = row.get('phone', '')
            result['city'] = row.get('city', '')
            result['state'] = row.get('state', '')
            
            self.results.append(result)
            print(f"Result: {result['recommendation']} — {result['notes']}\n")
            
            if len(self.results) % 50 == 0:
                self.save_results(f'checkpoint_{len(self.results)}')
        
        print(f"\n✓ Processed {len(self.results)} providers")
        return self.results
    
    # ---------------------- Saving ----------------------
    def save_results(self, suffix='final'):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f'aba_verification_{suffix}_{timestamp}.csv'
        
        output_data = []
        for result in self.results:
            output_data.append({
                'provider_id': result['provider_id'],
                'provider_name': result['provider_name'],
                'phone': result['phone'],
                'city': result['city'],
                'state': result['state'],
                'website': result['website'],
                'has_valid_website': result['has_valid_website'],
                'pages_crawled': result['pages_crawled'],
                'aba_found': result['aba_found'],
                'aba_pages': '|'.join(result['aba_pages']),
                'behavior_analysis_found': result.get('behavior_analysis_found', False),
                'behavior_analysis_pages': '|'.join(result.get('behavior_analysis_pages', [])),
                'autism_found': result['autism_found'],
                'autism_pages': '|'.join(result['autism_pages']),
                'pediatric_speech_found': result['pediatric_speech_found'],
                'pediatric_ot_found': result['pediatric_ot_found'],
                'pediatric_pt_found': result['pediatric_pt_found'],
                'therapy_pages': '|'.join(result['therapy_pages']),
                'recommendation': result['recommendation'],
                'notes': result['notes']
            })
        
        df_output = pd.DataFrame(output_data)
        df_output.to_csv(output_file, index=False)
        print(f"\n✓ Saved results to: {output_file}")
        self.generate_summary()
        return output_file
    
    def generate_summary(self):
        if not self.results:
            return
        total = len(self.results)
        def count(tag): return sum(1 for r in self.results if r['recommendation'] == tag)
        keep_as_aba = count('KEEP_AS_ABA')
        recat_behavior = count('KEEP_RECATEGORIZE_BEHAVIOR_ANALYSIS')
        recat_autism = count('KEEP_RECATEGORIZE_AUTISM')
        recat_therapy = count('KEEP_RECATEGORIZE_THERAPY')
        flag_removal = count('FLAG_FOR_REMOVAL')
        flag_review = count('FLAG_FOR_REVIEW')
        flag_down = count('FLAG_WEBSITE_DOWN')
        
        print("\n" + "="*60)
        print("VERIFICATION SUMMARY")
        print("="*60)
        print(f"Total providers checked: {total}")
        print(f"✓ Keep as ABA: {keep_as_aba} ({keep_as_aba/total*100:.1f}%)")
        print(f"↻ Recategorize as Behavior Analysis (non-ABA): {recat_behavior} ({recat_behavior/total*100:.1f}%)")
        print(f"↻ Recategorize as Autism Services: {recat_autism} ({recat_autism/total*100:.1f}%)")
        print(f"↻ Recategorize as Therapy: {recat_therapy} ({recat_therapy/total*100:.1f}%)")
        print(f"⚠ Flag for removal: {flag_removal} ({flag_removal/total*100:.1f}%)")
        print(f"⚠ Flag for review (no website): {flag_review} ({flag_review/total*100:.1f}%)")
        print(f"⚠ Website down/blocked: {flag_down} ({flag_down/total*100:.1f}%)")
        print("="*60)


def main():
    input_file = 'Supabase_Providers_table_10-23-2025_0550_DL.csv'
    print("ABA Provider Verification Crawler (Updated)")
    print("="*60)
    crawler = ABAVerificationCrawler(input_file)
    print("\nStarting full crawl of ABA-labeled providers...")
    print("Progress saved every 50 providers.\n")
    crawler.process_providers(limit=None)
    output_file = crawler.save_results()
    print(f"\n✓ Complete! Results saved to: {output_file}")


if __name__ == "__main__":
    main()
