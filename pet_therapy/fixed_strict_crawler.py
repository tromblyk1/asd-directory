"""
FIXED STRICT PET THERAPY CRAWLER
Excludes animal rehabilitation (therapy FOR animals)
Only keeps animal-ASSISTED therapy (therapy FOR humans USING animals)

CRITICAL DISTINCTION:
❌ Animal rehab/rehabilitation = Therapy FOR injured pets (veterinary service)
✅ Animal-assisted therapy = Using animals to help humans with disabilities

Usage:
    python fixed_strict_crawler.py uncertain_837_to_crawl.csv
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
# FIXED KEYWORD DEFINITIONS
# ============================================================================

# HIGH CONFIDENCE: Explicitly animal-ASSISTED therapy (animals help HUMANS)
ANIMAL_ASSISTED_THERAPY_KEYWORDS = [
    r'animal[- ]assisted therapy',
    r'animal[- ]assisted psychotherapy',
    r'pet[- ]assisted therapy',
    r'equine[- ]assisted therapy',
    r'equine[- ]assisted psychotherapy',
    r'hippotherapy',
    r'therapeutic riding',
    r'therapeutic horsemanship',
    r'therapy dog',
    r'therapy animal',
    r'service dog training',
    r'assistance dog training',
]

# MEDIUM CONFIDENCE: Context that suggests animal therapy for humans
HUMAN_BENEFIT_KEYWORDS = [
    r'children with autism',
    r'autism spectrum',
    r'special needs',
    r'disabilities',
    r'developmental',
    r'veterans',
    r'PTSD',
    r'mental health.*(?:horse|animal|dog)',
]

# EXCLUSIONS: Animal rehab/veterinary services (therapy FOR animals)
ANIMAL_REHAB_EXCLUSIONS = [
    r'animal rehabilitation(?!.*(?:for people|for children|for humans))',
    r'pet rehabilitation',
    r'canine rehabilitation(?!.*service)',
    r'dog rehabilitation(?!.*service)',
    r'equine rehabilitation(?!.*therap)',
    r'veterinary rehabilitation',
    r'vet rehab',
    r'animal physical therapy(?!.*for people)',
    r'pet physical therapy',
    r'canine physical therapy(?!.*service)',
    r'dog physical therapy(?!.*service)',
    r'animal chiropractic',
    r'pet chiropractic',
    r'veterinary physical therapy',
    r'animal hydrotherapy(?!.*assisted)',
    r'canine hydrotherapy(?!.*service)',
]

# Other NON-animal therapy exclusions
NON_ANIMAL_THERAPY = [
    r'physical therapy(?!.*(?:horse|equine|dog|animal|pet))',
    r'occupational therapy(?!.*(?:horse|equine|dog|animal|pet))',
    r'speech therapy(?!.*(?:horse|equine|dog|animal|pet))',
    r'chiropractic(?!.*(?:horse|equine|dog|animal|pet)).*(?:for people|human)',
    r'massage therapy(?!.*(?:horse|equine|dog|animal|pet))',
    r'psychotherapy(?!.*(?:horse|equine|dog|animal|pet|assisted))',
    r'counseling(?!.*(?:horse|equine|dog|animal|pet|assisted))',
    r'ABA therapy(?!.*(?:horse|equine|dog|animal|pet))',
]

ANIMAL_WORDS = [
    r'\bhorse\b', r'\bequine\b', r'\bequestrian\b',
    r'\bdog\b', r'\bcanine\b',
    r'\bpet\b', r'\banimal\b',
    r'\bpony\b', r'\bponies\b',
]

THERAPY_WORDS = [
    r'\btherapy\b', r'\btherapeutic\b',
    r'\btreatment\b', r'\brehabilitation\b',
    r'\bintervention\b',
]

AUTISM_KEYWORDS = [
    r'\bautism\b', r'\bautistic\b', r'\bASD\b',
    r'autism spectrum', r'asperger',
    r'neurodivergent', r'special needs',
]

# ============================================================================
# CRAWLER CLASS
# ============================================================================

class FixedStrictCrawler:
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
            response = self.session.get(url, timeout=self.timeout, allow_redirects=True)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for script in soup(["script", "style", "nav", "footer"]):
                script.decompose()
            
            text = soup.get_text(separator=' ', strip=True)
            text = re.sub(r'\s+', ' ', text).lower()
            
            # Check subpages
            subpages_to_check = []
            for link in soup.find_all('a', href=True):
                href = link['href'].lower()
                if any(keyword in href for keyword in ['therap', 'service', 'program', 'about']):
                    full_url = urljoin(url, link['href'])
                    if urlparse(full_url).netloc == urlparse(url).netloc:
                        subpages_to_check.append(full_url)
            
            subpage_texts = []
            for subpage in subpages_to_check[:max_pages-1]:
                try:
                    sub_response = self.session.get(subpage, timeout=self.timeout)
                    sub_soup = BeautifulSoup(sub_response.content, 'html.parser')
                    for script in sub_soup(["script", "style"]):
                        script.decompose()
                    subpage_text = sub_soup.get_text(separator=' ', strip=True).lower()
                    subpage_texts.append(subpage_text)
                    time.sleep(0.5)
                except:
                    continue
            
            full_text = text + ' ' + ' '.join(subpage_texts)
            
            return full_text, "Success"
            
        except requests.Timeout:
            return None, "Timeout"
        except requests.RequestException as e:
            return None, f"Error: {str(e)[:100]}"
        except Exception as e:
            return None, f"Parse error: {str(e)[:100]}"
    
    def check_animal_therapy_proximity(self, text):
        """Check if animal words appear near therapy words"""
        matches = []
        words = text.split()
        
        for i, word in enumerate(words):
            for animal_kw in ANIMAL_WORDS:
                if re.search(animal_kw, word):
                    context = ' '.join(words[max(0, i-25):min(len(words), i+25)])
                    for therapy_kw in THERAPY_WORDS:
                        if re.search(therapy_kw, context):
                            matches.append(f"{animal_kw} + {therapy_kw}")
                            break
        
        return matches
    
    def analyze_content(self, text, provider_name):
        """FIXED analysis that excludes animal rehab (therapy FOR animals)"""
        if not text:
            return {
                'decision': 'REJECT',
                'confidence': 'NONE',
                'reason': 'No website content',
                'score': 0,
                'evidence': []
            }
        
        evidence = []
        score = 0
        
        # CHECK 1: Animal REHAB exclusions (therapy FOR animals) - STRONG NEGATIVE
        animal_rehab_matches = []
        for keyword in ANIMAL_REHAB_EXCLUSIONS:
            if re.search(keyword, text, re.IGNORECASE):
                animal_rehab_matches.append(keyword)
                score -= 10  # Heavy penalty
        
        if animal_rehab_matches:
            evidence.append(f"🚫 ANIMAL REHAB: {animal_rehab_matches[0][:40]}")
            # If it's animal rehab, immediately reject
            return {
                'decision': 'REJECT',
                'confidence': 'HIGH',
                'reason': 'Animal rehabilitation service (therapy FOR animals, not for humans)',
                'score': score,
                'evidence': evidence
            }
        
        # CHECK 2: Animal-ASSISTED therapy keywords (HIGH CONFIDENCE)
        animal_assisted_matches = []
        for keyword in ANIMAL_ASSISTED_THERAPY_KEYWORDS:
            if re.search(keyword, text, re.IGNORECASE):
                animal_assisted_matches.append(keyword)
                score += 10  # Strong positive
        
        if animal_assisted_matches:
            evidence.extend([f"✓ {kw}" for kw in animal_assisted_matches[:3]])
        
        # CHECK 3: Human benefit context
        human_benefit_matches = []
        for keyword in HUMAN_BENEFIT_KEYWORDS:
            if re.search(keyword, text, re.IGNORECASE):
                human_benefit_matches.append(keyword)
                score += 3
        
        if human_benefit_matches:
            evidence.extend([f"✓ {kw[:30]}" for kw in human_benefit_matches[:2]])
        
        # CHECK 4: Animal + therapy proximity (MEDIUM)
        proximity_matches = self.check_animal_therapy_proximity(text)
        if proximity_matches and not animal_rehab_matches:
            score += len(proximity_matches) * 1  # Reduced weight
            evidence.extend([f"~ {pm}" for pm in proximity_matches[:2]])
        
        # CHECK 5: Non-animal therapy (NEGATIVE)
        non_animal_matches = []
        for keyword in NON_ANIMAL_THERAPY:
            if re.search(keyword, text, re.IGNORECASE):
                non_animal_matches.append(keyword)
                score -= 3
        
        if non_animal_matches:
            evidence.extend([f"✗ {kw[:30]}" for kw in non_animal_matches[:2]])
        
        # CHECK 6: Autism context
        has_autism = any(re.search(kw, text, re.IGNORECASE) for kw in AUTISM_KEYWORDS)
        if has_autism:
            evidence.append("(autism-related)")
        
        # DECISION LOGIC
        if score >= 10:
            decision = 'KEEP'
            confidence = 'HIGH'
            reason = f'Clear animal-ASSISTED therapy (score: {score})'
        elif score >= 5:
            decision = 'KEEP'
            confidence = 'MEDIUM'
            reason = f'Likely animal-assisted therapy (score: {score})'
        elif score >= 2:
            decision = 'REVIEW'
            confidence = 'LOW'
            reason = f'Some indicators but unclear (score: {score})'
        else:
            decision = 'REJECT'
            confidence = 'NONE' if score < -5 else 'LOW'
            if non_animal_matches:
                reason = 'Non-animal therapy, no animal-assisted evidence'
            else:
                reason = 'No animal-assisted therapy evidence'
        
        return {
            'decision': decision,
            'confidence': confidence,
            'reason': reason,
            'score': score,
            'evidence': evidence[:6]
        }

# ============================================================================
# MAIN PROCESSING
# ============================================================================

def process_providers(input_csv):
    """Process all providers from CSV"""
    
    crawler = FixedStrictCrawler()
    
    providers = []
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            providers.append(row)
    
    print(f"Loaded {len(providers)} uncertain providers to crawl")
    print("=" * 80)
    print("FIXED CRAWLER - Excludes animal rehab (therapy FOR animals)")
    print("=" * 80)
    
    results = {
        'KEEP': [],
        'REVIEW': [],
        'REJECT': [],
        'NO_WEBSITE': []
    }
    
    stats = defaultdict(int)
    
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
                'score': 0
            }
            results['NO_WEBSITE'].append(result)
            stats['no_website'] += 1
            continue
        
        print(f"  🌐 {website}")
        
        text, status = crawler.crawl_website(website)
        
        if not text:
            print(f"  ⚠️  Crawl failed: {status}")
            result = {
                **provider,
                'crawl_status': status,
                'decision': 'REJECT',
                'reason': 'Could not crawl website',
                'score': 0
            }
            results['REJECT'].append(result)
            stats['crawl_failed'] += 1
        else:
            analysis = crawler.analyze_content(text, name)
            decision = analysis['decision']
            
            if decision == 'KEEP':
                print(f"  ✅ KEEP - {analysis['confidence']} confidence")
            elif decision == 'REVIEW':
                print(f"  ⚠️  REVIEW - {analysis['reason']}")
            else:
                print(f"  ❌ REJECT - {analysis['reason']}")
            
            print(f"     {analysis['reason']}")
            if analysis['evidence']:
                print(f"     Evidence: {', '.join(analysis['evidence'][:3])}")
            
            result = {
                **provider,
                'crawl_status': 'Success',
                'decision': decision,
                'confidence': analysis['confidence'],
                'reason': analysis['reason'],
                'score': analysis['score'],
                'evidence': ' | '.join(analysis['evidence'])
            }
            
            results[decision].append(result)
            stats[decision.lower()] += 1
        
        time.sleep(1)
        
        if i % 50 == 0:
            save_results(results, stats)
            print(f"\n💾 Progress saved at {i}/{len(providers)}")
    
    save_results(results, stats)
    print_final_summary(stats, len(providers))

def save_results(results, stats):
    """Save results to JSON files"""
    for category, providers in results.items():
        if providers:
            filename = f"fixed_{category.lower()}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(providers, f, indent=2, ensure_ascii=False)
    
    with open('fixed_crawl_stats.json', 'w') as f:
        json.dump(dict(stats), f, indent=2)

def print_final_summary(stats, total):
    """Print final summary"""
    print("\n" + "=" * 80)
    print("🎉 FIXED CRAWL COMPLETE!")
    print("=" * 80)
    print(f"\nTotal providers crawled: {total}")
    print(f"\n📊 RESULTS:")
    print(f"  ✅ KEEP:              {stats.get('keep', 0):4d} ({stats.get('keep', 0)/total*100:.1f}%)")
    print(f"  ⚠️  REVIEW:            {stats.get('review', 0):4d} ({stats.get('review', 0)/total*100:.1f}%)")
    print(f"  ❌ REJECT:            {stats.get('reject', 0):4d} ({stats.get('reject', 0)/total*100:.1f}%)")
    print(f"  🚫 NO_WEBSITE:        {stats.get('no_website', 0):4d}")
    print(f"\n📁 Output files:")
    print(f"  - fixed_keep.json")
    print(f"  - fixed_review.json")
    print(f"  - fixed_reject.json")
    print(f"  - fixed_no_website.json")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fixed_strict_crawler.py uncertain_837_to_crawl.csv")
        sys.exit(1)
    
    process_providers(sys.argv[1])