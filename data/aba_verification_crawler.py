#!/usr/bin/env python3
"""
ABA Provider Verification Crawler
Verifies if providers actually offer ABA services by crawling their websites
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
        
        # Search terms
        self.aba_terms = [
            r'\bABA\b',
            r'applied behavior(?:al)? analysis',
            r'applied behavior(?:al)? therapy',
            r'\bBCBA\b',
            r'board certified behavior analyst'
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
        
        # Common page paths to check
        self.page_paths = [
            '',  # Home
            '/about',
            '/about-us',
            '/aboutus',
            '/services',
            '/our-services',
            '/what-we-do',
            '/programs',
            '/therapy',
            '/treatments'
        ]
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
    def is_valid_website(self, website):
        """Check if website URL is valid"""
        if not website or pd.isna(website):
            return False
        website = str(website).strip()
        if not website or website == 'null' or website == 'None':
            return False
        # Skip FL-DD database links
        if 'flddresources.qlarant.com' in website:
            return False
        if not website.startswith(('http://', 'https://')):
            website = 'https://' + website
        return True
    
    def fetch_page(self, url, timeout=10):
        """Fetch webpage content"""
        try:
            response = self.session.get(url, timeout=timeout, allow_redirects=True)
            if response.status_code == 200:
                return response.text
            return None
        except:
            return None
    
    def search_text(self, text, patterns):
        """Search for patterns in text"""
        if not text:
            return False, []
        
        text_lower = text.lower()
        matches = []
        
        for pattern in patterns:
            if re.search(pattern, text_lower, re.IGNORECASE):
                matches.append(pattern)
        
        return len(matches) > 0, matches
    
    def extract_text_from_html(self, html):
        """Extract clean text from HTML"""
        if not html:
            return ""
        soup = BeautifulSoup(html, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        text = soup.get_text(separator=' ')
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    
    def crawl_website(self, website):
        """Crawl website and check for ABA, autism, and therapy services"""
        result = {
            'website': website,
            'has_valid_website': False,
            'pages_crawled': 0,
            'aba_found': False,
            'aba_pages': [],
            'aba_matches': [],
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
        
        # Normalize website URL
        if not website.startswith(('http://', 'https://')):
            website = 'https://' + website
        
        parsed = urlparse(website)
        base_url = f"{parsed.scheme}://{parsed.netloc}"
        
        # Try to crawl pages
        for path in self.page_paths:
            url = urljoin(base_url, path)
            
            html = self.fetch_page(url)
            if html:
                result['pages_crawled'] += 1
                text = self.extract_text_from_html(html)
                
                # Check for ABA
                aba_found, aba_matches = self.search_text(text, self.aba_terms)
                if aba_found:
                    result['aba_found'] = True
                    result['aba_pages'].append(path if path else 'home')
                    result['aba_matches'].extend(aba_matches)
                
                # Check for autism terms
                autism_found, autism_matches = self.search_text(text, self.autism_terms)
                if autism_found:
                    result['autism_found'] = True
                    result['autism_pages'].append(path if path else 'home')
                    result['autism_matches'].extend(autism_matches)
                
                # Check for pediatric therapy
                pediatric_found, _ = self.search_text(text, self.pediatric_indicators)
                
                if pediatric_found:
                    # Check each therapy type
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
            
            # Be polite - delay between requests
            time.sleep(0.5)
        
        # Make recommendation
        if result['aba_found']:
            result['recommendation'] = 'KEEP_AS_ABA'
            result['notes'] = f"ABA verified on pages: {', '.join(result['aba_pages'])}"
        elif result['autism_found']:
            result['recommendation'] = 'KEEP_RECATEGORIZE_AUTISM'
            result['notes'] = f"Autism services found on: {', '.join(result['autism_pages'])}, but no explicit ABA mention"
        elif result['pediatric_speech_found'] or result['pediatric_ot_found'] or result['pediatric_pt_found']:
            therapies = []
            if result['pediatric_speech_found']:
                therapies.append('Speech')
            if result['pediatric_ot_found']:
                therapies.append('OT')
            if result['pediatric_pt_found']:
                therapies.append('PT')
            result['recommendation'] = 'KEEP_RECATEGORIZE_THERAPY'
            result['notes'] = f"Pediatric therapy found: {', '.join(therapies)}"
        elif result['pages_crawled'] == 0:
            result['recommendation'] = 'FLAG_WEBSITE_DOWN'
            result['notes'] = 'Website could not be crawled (down or blocked)'
        else:
            result['recommendation'] = 'FLAG_FOR_REMOVAL'
            result['notes'] = f"Crawled {result['pages_crawled']} pages - no ABA, autism, or pediatric therapy found"
        
        return result
    
    def process_providers(self, limit=None):
        """Process all providers with ABA in service_type"""
        # Filter for ABA providers
        aba_providers = self.df[self.df['service_type'].str.contains('ABA', case=False, na=False)]
        
        if limit:
            aba_providers = aba_providers.head(limit)
        
        print(f"Processing {len(aba_providers)} ABA providers...")
        
        for idx, row in aba_providers.iterrows():
            provider_name = row['provider_name']
            website = row['website']
            
            print(f"\n[{idx+1}/{len(aba_providers)}] Processing: {provider_name}")
            print(f"Website: {website}")
            
            result = self.crawl_website(website)
            result['provider_id'] = row['id']
            result['provider_name'] = provider_name
            result['phone'] = row.get('phone', '')
            result['city'] = row.get('city', '')
            result['state'] = row.get('state', '')
            
            self.results.append(result)
            
            print(f"Result: {result['recommendation']}")
            print(f"Notes: {result['notes']}")
            
            # Save checkpoint every 50 providers
            if len(self.results) % 50 == 0:
                self.save_results(f'checkpoint_{len(self.results)}')
        
        print(f"\n✓ Processed {len(self.results)} providers")
        return self.results
    
    def save_results(self, suffix='final'):
        """Save results to CSV"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_file = f'aba_verification_{suffix}_{timestamp}.csv'  # Saves in current directory
        
        # Prepare data for CSV
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
        
        # Generate summary
        self.generate_summary()
        
        return output_file
    
    def generate_summary(self):
        """Generate summary statistics"""
        if not self.results:
            return
        
        total = len(self.results)
        keep_as_aba = sum(1 for r in self.results if r['recommendation'] == 'KEEP_AS_ABA')
        recategorize_autism = sum(1 for r in self.results if r['recommendation'] == 'KEEP_RECATEGORIZE_AUTISM')
        recategorize_therapy = sum(1 for r in self.results if r['recommendation'] == 'KEEP_RECATEGORIZE_THERAPY')
        flag_removal = sum(1 for r in self.results if r['recommendation'] == 'FLAG_FOR_REMOVAL')
        flag_review = sum(1 for r in self.results if r['recommendation'] == 'FLAG_FOR_REVIEW')
        flag_down = sum(1 for r in self.results if r['recommendation'] == 'FLAG_WEBSITE_DOWN')
        
        print("\n" + "="*60)
        print("VERIFICATION SUMMARY")
        print("="*60)
        print(f"Total providers checked: {total}")
        print(f"✓ Keep as ABA: {keep_as_aba} ({keep_as_aba/total*100:.1f}%)")
        print(f"↻ Recategorize as Autism Services: {recategorize_autism} ({recategorize_autism/total*100:.1f}%)")
        print(f"↻ Recategorize as Therapy: {recategorize_therapy} ({recategorize_therapy/total*100:.1f}%)")
        print(f"⚠ Flag for removal: {flag_removal} ({flag_removal/total*100:.1f}%)")
        print(f"⚠ Flag for review (no website): {flag_review} ({flag_review/total*100:.1f}%)")
        print(f"⚠ Website down/blocked: {flag_down} ({flag_down/total*100:.1f}%)")
        print("="*60)


def main():
    # Update this path to where you have the CSV on your PC
    # Example: 'C:/Projects/ASD-Directory/data/Supabase_Providers_table_10-23-2025_0550_DL.csv'
    input_file = 'Supabase_Providers_table_10-23-2025_0550_DL.csv'
    
    print("ABA Provider Verification Crawler")
    print("="*60)
    
    crawler = ABAVerificationCrawler(input_file)
    
    # Processing ALL providers (no limit)
    print("\nStarting full crawl of ALL ABA providers...")
    print("This will take several hours. Progress saved every 50 providers.\n")
    
    crawler.process_providers(limit=None)  # No limit - processes all providers
    
    output_file = crawler.save_results()
    
    print(f"\n✓ Complete! Results saved to: {output_file}")
    print("\nNext steps:")
    print("1. Review the output CSV")
    print("2. Update database based on recommendations")


if __name__ == "__main__":
    main()