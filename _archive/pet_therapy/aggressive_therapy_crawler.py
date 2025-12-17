"""
AGGRESSIVE PET THERAPY PROVIDER WEBSITE CRAWLER
For the 837 UNCERTAIN providers only (excludes 132 confirmed + 20 protected)

Checks websites for THERAPY and AUTISM keywords
Categorizes into: KEEP, FLAG_FOR_REVIEW, or REJECT

LOGIC:
- Has THERAPY keywords → KEEP
- NO therapy BUT has AUTISM keywords → FLAG_FOR_REVIEW
- NO therapy AND NO autism → REJECT

Usage:
    python aggressive_therapy_crawler.py uncertain_837_to_crawl.csv
"""

import csv
import json
import time
import re
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup
from collections import defaultdict
import sys

# ============================================================================
# KEYWORD DEFINITIONS
# ============================================================================

# PRIMARY: Strong therapy indicators
THERAPY_KEYWORDS = [
    r'\btherapy\b', r'\btherapeutic\b', r'\btreatment\b',
    r'\brehabilitation\b', r'\brehab\b',
    r'\bintervention\b', r'\bcounseling\b', r'\bcounselling\b',
    
    # Specific therapy types
    r'animal[- ]assisted therapy', r'equine[- ]assisted therapy',
    r'hippotherapy', r'pet therapy', r'canine therapy',
    r'therapeutic riding', r'therapeutic horsemanship',
    
    # Clinical therapy types
    r'occupational therapy', r'\bOT\b', r'physical therapy', r'\bPT\b',
    r'speech therapy', r'behavioral therapy', r'ABA therapy',
    r'psychotherapy', r'mental health therapy',
    
    # Therapy services
    r'therapy services', r'therapeutic services',
    r'therapy program', r'therapeutic program',
    r'therapy center', r'therapeutic center',
]

# SECONDARY: Autism-specific keywords
AUTISM_KEYWORDS = [
    r'\bautism\b', r'\bautistic\b', r'\bASD\b',
    r'autism spectrum', r'on the spectrum',
    r'asperger', r'aspergers',
    r'neurodivergent', r'neurodiverse', r'neurodiversity',
    r'developmental disabilit', r'special needs',
    r'sensory processing', r'sensory integration',
]

# EXCLUSION: Red flags that indicate NON-therapy services
EXCLUSION_KEYWORDS = [
    r'veterinary clinic', r'animal hospital', r'pet hospital',
    r'emergency vet', r'urgent care.*animal',
    r'dog grooming', r'pet grooming', r'boarding kennel',
    r'pet daycare', r'dog daycare',
    r'obedience training(?!.*therapy)', r'puppy training(?!.*therapy)',
]

# ============================================================================
# CRAWLER CLASS
# ============================================================================

class TherapyCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.timeout = 10
        
    def clean_url(self, url):
        """Clean and validate URL"""
        if not url or url == 'None' or url == 'nan':
            return None
        
        url = str(url).strip()
        if not url or url.lower() == 'none':
            return None
            
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        
        return url
    
    def crawl_website(self, url, max_pages=5):
        """Crawl website and extract text content"""
        if not url:
            return None, "No website"
        
        try:
            # Get homepage
            response = self.session.get(url, timeout=self.timeout, allow_redirects=True)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer"]):
                script.decompose()
            
            # Get all text
            text = soup.get_text(separator=' ', strip=True)
            text = re.sub(r'\s+', ' ', text).lower()
            
            # Also check common subpages
            subpages_to_check = []
            for link in soup.find_all('a', href=True):
                href = link['href'].lower()
                # Look for therapy/services/about pages
                if any(keyword in href for keyword in ['therap', 'service', 'about', 'program']):
                    full_url = urljoin(url, link['href'])
                    if urlparse(full_url).netloc == urlparse(url).netloc:
                        subpages_to_check.append(full_url)
            
            # Check up to max_pages subpages
            subpage_texts = []
            for subpage in subpages_to_check[:max_pages-1]:
                try:
                    sub_response = self.session.get(subpage, timeout=self.timeout)
                    sub_soup = BeautifulSoup(sub_response.content, 'html.parser')
                    for script in sub_soup(["script", "style"]):
                        script.decompose()
                    subpage_text = sub_soup.get_text(separator=' ', strip=True).lower()
                    subpage_texts.append(subpage_text)
                    time.sleep(0.5)  # Be nice to servers
                except:
                    continue
            
            # Combine all text
            full_text = text + ' ' + ' '.join(subpage_texts)
            
            return full_text, "Success"
            
        except requests.Timeout:
            return None, "Timeout"
        except requests.RequestException as e:
            return None, f"Error: {str(e)[:100]}"
        except Exception as e:
            return None, f"Parse error: {str(e)[:100]}"
    
    def analyze_content(self, text, provider_name):
        """Analyze text for THERAPY and AUTISM keywords"""
        if not text:
            return {
                'has_therapy': False,
                'has_autism': False,
                'has_exclusions': False,
                'therapy_matches': [],
                'autism_matches': [],
                'exclusion_matches': [],
                'decision': 'REJECT',
                'reason': 'No website content'
            }
        
        # Check for therapy keywords
        therapy_matches = []
        for keyword in THERAPY_KEYWORDS:
            if re.search(keyword, text, re.IGNORECASE):
                therapy_matches.append(keyword)
        
        # Check for autism keywords
        autism_matches = []
        for keyword in AUTISM_KEYWORDS:
            if re.search(keyword, text, re.IGNORECASE):
                autism_matches.append(keyword)
        
        # Check for exclusion keywords
        exclusion_matches = []
        for keyword in EXCLUSION_KEYWORDS:
            if re.search(keyword, text, re.IGNORECASE):
                exclusion_matches.append(keyword)
        
        has_therapy = len(therapy_matches) > 0
        has_autism = len(autism_matches) > 0
        has_exclusions = len(exclusion_matches) > 0
        
        # DECISION LOGIC
        if has_therapy:
            decision = 'KEEP'
            reason = f'Found {len(therapy_matches)} therapy keyword(s)'
        elif has_autism:
            decision = 'FLAG_FOR_REVIEW'
            reason = f'Has autism keywords ({len(autism_matches)}) but NO therapy keywords'
        else:
            decision = 'REJECT'
            if has_exclusions:
                reason = f'No therapy, no autism, has exclusions ({len(exclusion_matches)})'
            else:
                reason = 'No therapy or autism keywords found'
        
        return {
            'has_therapy': has_therapy,
            'has_autism': has_autism,
            'has_exclusions': has_exclusions,
            'therapy_matches': therapy_matches[:5],  # Top 5 matches
            'autism_matches': autism_matches[:5],
            'exclusion_matches': exclusion_matches[:3],
            'decision': decision,
            'reason': reason
        }

# ============================================================================
# MAIN PROCESSING
# ============================================================================

def process_providers(input_csv):
    """Process all providers from CSV"""
    
    crawler = TherapyCrawler()
    
    # Load providers
    providers = []
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            providers.append(row)
    
    print(f"Loaded {len(providers)} uncertain providers to crawl")
    print("=" * 80)
    
    # Results
    results = {
        'KEEP': [],
        'FLAG_FOR_REVIEW': [],
        'REJECT': [],
        'NO_WEBSITE': []
    }
    
    stats = defaultdict(int)
    
    # Process each provider
    for i, provider in enumerate(providers, 1):
        name = provider.get('provider_name', 'Unknown')
        website = crawler.clean_url(provider.get('website', ''))
        
        print(f"\n[{i}/{len(providers)}] {name}")
        
        if not website:
            print("  ❌ No website")
            result = {
                **provider,
                'crawl_status': 'No website',
                'decision': 'NO_WEBSITE',
                'reason': 'No website available',
                'has_therapy': False,
                'has_autism': False
            }
            results['NO_WEBSITE'].append(result)
            stats['no_website'] += 1
            continue
        
        print(f"  🌐 Crawling: {website}")
        
        # Crawl website
        text, status = crawler.crawl_website(website)
        
        if not text:
            print(f"  ⚠️  Crawl failed: {status}")
            result = {
                **provider,
                'crawl_status': status,
                'decision': 'REJECT',
                'reason': 'Could not crawl website',
                'has_therapy': False,
                'has_autism': False
            }
            results['REJECT'].append(result)
            stats['crawl_failed'] += 1
        else:
            # Analyze content
            analysis = crawler.analyze_content(text, name)
            
            decision = analysis['decision']
            
            if decision == 'KEEP':
                print(f"  ✅ KEEP - {analysis['reason']}")
            elif decision == 'FLAG_FOR_REVIEW':
                print(f"  ⚠️  FLAG - {analysis['reason']}")
            else:
                print(f"  ❌ REJECT - {analysis['reason']}")
            
            result = {
                **provider,
                'crawl_status': 'Success',
                'decision': decision,
                'reason': analysis['reason'],
                'has_therapy': analysis['has_therapy'],
                'has_autism': analysis['has_autism'],
                'has_exclusions': analysis['has_exclusions'],
                'therapy_keywords': ', '.join(analysis['therapy_matches'][:3]),
                'autism_keywords': ', '.join(analysis['autism_matches'][:3])
            }
            
            results[decision].append(result)
            stats[decision.lower()] += 1
        
        # Rate limiting
        time.sleep(1)
        
        # Save progress every 50 providers
        if i % 50 == 0:
            save_results(results, stats)
            print(f"\n💾 Progress saved at {i}/{len(providers)}")
    
    # Final save
    save_results(results, stats)
    print_final_summary(stats, len(providers))

def save_results(results, stats):
    """Save results to JSON files"""
    
    for category, providers in results.items():
        if providers:
            filename = f"uncertain_{category.lower()}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(providers, f, indent=2, ensure_ascii=False)
    
    # Save stats
    with open('uncertain_crawl_stats.json', 'w') as f:
        json.dump(dict(stats), f, indent=2)

def print_final_summary(stats, total):
    """Print final summary"""
    print("\n" + "=" * 80)
    print("🎉 CRAWL COMPLETE!")
    print("=" * 80)
    print(f"\nTotal providers crawled: {total}")
    print(f"\n📊 RESULTS:")
    print(f"  ✅ KEEP:              {stats.get('keep', 0):4d} ({stats.get('keep', 0)/total*100:.1f}%)")
    print(f"  ⚠️  FLAG_FOR_REVIEW:  {stats.get('flag_for_review', 0):4d} ({stats.get('flag_for_review', 0)/total*100:.1f}%)")
    print(f"  ❌ REJECT:            {stats.get('reject', 0):4d} ({stats.get('reject', 0)/total*100:.1f}%)")
    print(f"  🚫 NO_WEBSITE:        {stats.get('no_website', 0):4d} ({stats.get('no_website', 0)/total*100:.1f}%)")
    print(f"  ⚠️  CRAWL_FAILED:     {stats.get('crawl_failed', 0):4d}")
    print(f"\n📁 Output files:")
    print(f"  - uncertain_keep.json")
    print(f"  - uncertain_flag_for_review.json")
    print(f"  - uncertain_reject.json")
    print(f"  - uncertain_no_website.json")
    print(f"  - uncertain_crawl_stats.json")

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python aggressive_therapy_crawler.py uncertain_837_to_crawl.csv")
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    print("=" * 80)
    print("AGGRESSIVE THERAPY CRAWLER")
    print("Crawling ONLY the 837 uncertain providers")
    print("=" * 80)
    
    process_providers(input_file)
