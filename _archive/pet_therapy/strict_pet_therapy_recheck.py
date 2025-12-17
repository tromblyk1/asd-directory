"""
STRICT PET THERAPY RE-CHECKER
Re-checks the 132 "CONFIRMED" providers with STRICT animal-specific criteria

MUST have animal component + therapy:
- Animal-assisted therapy, pet therapy, equine therapy, canine therapy
- Therapeutic riding, hippotherapy
- Service dog training (for therapy/assistance)
- Animal intervention programs

REJECTS:
- Regular therapy (physical, occupational, speech) without animal component
- Chiropractors, counselors, psychologists (unless animal-assisted)
- Regular ABA/autism centers (unless they use animals)

Usage:
    python strict_pet_therapy_recheck.py confirmed_132_recheck.csv
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
# STRICT KEYWORD DEFINITIONS
# ============================================================================

# HIGH CONFIDENCE: Explicitly animal-based therapy
ANIMAL_THERAPY_KEYWORDS = [
    r'animal[- ]assisted therapy',
    r'animal[- ]assisted psychotherapy',
    r'pet therapy',
    r'pet[- ]assisted therapy',
    r'equine[- ]assisted therapy',
    r'equine[- ]assisted psychotherapy',
    r'equine therapy',
    r'hippotherapy',
    r'therapeutic riding',
    r'therapeutic horsemanship',
    r'canine therapy',
    r'dog therapy',
    r'service dog training',
    r'therapy dog training',
    r'animal intervention',
    r'equine intervention',
]

# MEDIUM CONFIDENCE: Animal + therapy proximity (within ~50 characters)
# We'll check if animal words appear near therapy words
ANIMAL_WORDS = [
    r'\bhorse\b', r'\bequine\b', r'\bequestrian\b',
    r'\bdog\b', r'\bcanine\b', r'\bpuppy\b',
    r'\bpet\b', r'\banimal\b',
    r'\bpony\b', r'\bponies\b',
]

THERAPY_WORDS = [
    r'\btherapy\b', r'\btherapeutic\b',
    r'\btreatment\b', r'\brehabilitation\b',
    r'\bintervention\b', r'\bcounseling\b',
]

# Autism keywords (for context, but not enough alone)
AUTISM_KEYWORDS = [
    r'\bautism\b', r'\bautistic\b', r'\bASD\b',
    r'autism spectrum', r'asperger',
    r'neurodivergent', r'special needs',
]

# EXCLUSIONS: Non-animal therapy that should be rejected
NON_ANIMAL_THERAPY = [
    r'physical therapy(?!.*(?:horse|equine|dog|animal|pet))',
    r'occupational therapy(?!.*(?:horse|equine|dog|animal|pet))',
    r'speech therapy(?!.*(?:horse|equine|dog|animal|pet))',
    r'chiropractic(?!.*(?:horse|equine|dog|animal|pet))',
    r'massage therapy(?!.*(?:horse|equine|dog|animal|pet))',
    r'psychotherapy(?!.*(?:horse|equine|dog|animal|pet|assisted))',
    r'counseling(?!.*(?:horse|equine|dog|animal|pet|assisted))',
    r'ABA therapy(?!.*(?:horse|equine|dog|animal|pet))',
]

# ============================================================================
# CRAWLER CLASS
# ============================================================================

class StrictTherapyCrawler:
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
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer"]):
                script.decompose()
            
            # Get all text
            text = soup.get_text(separator=' ', strip=True)
            text = re.sub(r'\s+', ' ', text).lower()
            
            # Check subpages for therapy/services/programs
            subpages_to_check = []
            for link in soup.find_all('a', href=True):
                href = link['href'].lower()
                if any(keyword in href for keyword in ['therap', 'service', 'program', 'about']):
                    full_url = urljoin(url, link['href'])
                    if urlparse(full_url).netloc == urlparse(url).netloc:
                        subpages_to_check.append(full_url)
            
            # Check subpages
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
        
        # Split text into chunks
        words = text.split()
        
        for i, word in enumerate(words):
            # Check if this word matches animal keyword
            for animal_kw in ANIMAL_WORDS:
                if re.search(animal_kw, word):
                    # Look within next 50 words for therapy keyword
                    context = ' '.join(words[max(0, i-25):min(len(words), i+25)])
                    for therapy_kw in THERAPY_WORDS:
                        if re.search(therapy_kw, context):
                            matches.append(f"{animal_kw} + {therapy_kw}")
                            break
        
        return matches
    
    def analyze_content(self, text, provider_name):
        """Strict analysis requiring animal + therapy"""
        if not text:
            return {
                'is_pet_therapy': False,
                'confidence': 'NONE',
                'decision': 'REJECT',
                'reason': 'No website content',
                'evidence': []
            }
        
        evidence = []
        score = 0
        
        # CHECK 1: Explicit animal therapy keywords (HIGH CONFIDENCE)
        animal_therapy_matches = []
        for keyword in ANIMAL_THERAPY_KEYWORDS:
            if re.search(keyword, text, re.IGNORECASE):
                animal_therapy_matches.append(keyword)
                score += 5
        
        if animal_therapy_matches:
            evidence.extend([f"✓ {kw}" for kw in animal_therapy_matches[:3]])
        
        # CHECK 2: Animal + therapy proximity (MEDIUM CONFIDENCE)
        proximity_matches = self.check_animal_therapy_proximity(text)
        if proximity_matches:
            score += len(proximity_matches) * 2
            evidence.extend([f"~ {pm}" for pm in proximity_matches[:3]])
        
        # CHECK 3: Check for NON-animal therapy (NEGATIVE)
        non_animal_matches = []
        for keyword in NON_ANIMAL_THERAPY:
            if re.search(keyword, text, re.IGNORECASE):
                non_animal_matches.append(keyword)
                score -= 3
        
        if non_animal_matches:
            evidence.extend([f"✗ {kw}" for kw in non_animal_matches[:2]])
        
        # CHECK 4: Has autism context (adds context but not enough alone)
        has_autism = any(re.search(kw, text, re.IGNORECASE) for kw in AUTISM_KEYWORDS)
        if has_autism:
            evidence.append("(autism-related)")
        
        # DECISION LOGIC
        if score >= 5:
            decision = 'KEEP'
            confidence = 'HIGH'
            reason = f'Clear animal therapy evidence (score: {score})'
        elif score >= 2:
            decision = 'REVIEW'
            confidence = 'MEDIUM'
            reason = f'Some animal therapy indicators (score: {score})'
        else:
            decision = 'REJECT'
            confidence = 'LOW' if score > -3 else 'NONE'
            if non_animal_matches:
                reason = 'Non-animal therapy detected, no animal therapy found'
            else:
                reason = 'No animal therapy evidence found'
        
        return {
            'is_pet_therapy': decision == 'KEEP',
            'confidence': confidence,
            'decision': decision,
            'reason': reason,
            'evidence': evidence[:5],
            'score': score
        }

# ============================================================================
# MAIN PROCESSING
# ============================================================================

def process_providers(input_csv):
    """Re-check all 132 CONFIRMED providers"""
    
    crawler = StrictTherapyCrawler()
    
    # Load providers
    providers = []
    with open(input_csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            providers.append(row)
    
    print(f"Re-checking {len(providers)} CONFIRMED providers with STRICT criteria")
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
                'confidence': 'NONE',
                'reason': 'No website available'
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
                'confidence': 'NONE',
                'reason': 'Could not crawl website'
            }
            results['REJECT'].append(result)
            stats['crawl_failed'] += 1
        else:
            analysis = crawler.analyze_content(text, name)
            decision = analysis['decision']
            
            if decision == 'KEEP':
                print(f"  ✅ KEEP - {analysis['confidence']} confidence")
                print(f"     {analysis['reason']}")
            elif decision == 'REVIEW':
                print(f"  ⚠️  REVIEW - {analysis['confidence']} confidence")
                print(f"     {analysis['reason']}")
            else:
                print(f"  ❌ REJECT - {analysis['reason']}")
            
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
        
        if i % 25 == 0:
            save_results(results, stats)
            print(f"\n💾 Progress saved")
    
    save_results(results, stats)
    print_final_summary(stats, len(providers))

def save_results(results, stats):
    """Save results"""
    for category, providers in results.items():
        if providers:
            filename = f"recheck_{category.lower()}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(providers, f, indent=2, ensure_ascii=False)
    
    with open('recheck_stats.json', 'w') as f:
        json.dump(dict(stats), f, indent=2)

def print_final_summary(stats, total):
    """Print summary"""
    print("\n" + "=" * 80)
    print("🎉 RE-CHECK COMPLETE!")
    print("=" * 80)
    print(f"\nTotal re-checked: {total}")
    print(f"\n📊 RESULTS:")
    print(f"  ✅ KEEP (animal therapy):      {stats.get('keep', 0):4d} ({stats.get('keep', 0)/total*100:.1f}%)")
    print(f"  ⚠️  REVIEW (uncertain):        {stats.get('review', 0):4d} ({stats.get('review', 0)/total*100:.1f}%)")
    print(f"  ❌ REJECT (not pet therapy):  {stats.get('reject', 0):4d} ({stats.get('reject', 0)/total*100:.1f}%)")
    print(f"  🚫 NO_WEBSITE:                 {stats.get('no_website', 0):4d}")
    
    print(f"\n📁 Output files:")
    print(f"  - recheck_keep.json")
    print(f"  - recheck_review.json")
    print(f"  - recheck_reject.json")
    print(f"  - recheck_no_website.json")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python strict_pet_therapy_recheck.py confirmed_132_recheck.csv")
        sys.exit(1)
    
    process_providers(sys.argv[1])