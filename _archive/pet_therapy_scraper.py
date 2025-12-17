"""
Pet Therapy Provider Registry Scraper + Credential Verification
Finds VERIFIED animal-assisted therapy providers for autism in Florida
"""

import requests
from bs4 import BeautifulSoup
import time
import json
import re
from datetime import datetime
from typing import List, Dict, Optional

# ============================================================================
# CONFIGURATION
# ============================================================================

GOOGLE_API_KEY = "AIzaSyDCZpKBCw4OL4ys8aDNt7IsYJKLKeWMLOE"
GOOGLE_CSE_ID = "504276c28f5f94428"  # ← Already configured with your CSE ID

OUTPUT_FILE = "verified_pet_therapy_providers.json"
MIN_SCORE = 10  # Minimum score to keep a provider

# ============================================================================
# VERIFICATION PATTERNS
# ============================================================================

VERIFICATION_PATTERNS = {
    'path_member': [
        r'PATH International',
        r'PATH Intl',
        r'Professional Association of Therapeutic Horsemanship',
        r'Premier Accredited',
        r'PATH Accredited Center'
    ],
    'adi_member': [
        r'ADI accredited',
        r'Assistance Dogs International',
        r'ADI member'
    ],
    'pet_partners': [
        r'Pet Partners registered',
        r'Pet Partners handler',
        r'therapy animal team'
    ],
    'eagala': [
        r'EAGALA',
        r'Equine Assisted Growth and Learning'
    ],
    'aha': [
        r'American Hippotherapy Association',
        r'AHA registered'
    ],
    'licensed_therapist': [
        r'LCSW',
        r'Licensed Clinical Social Worker',
        r'Physical Therapist',
        r'\bPT\b',
        r'Occupational Therapist',
        r'\bOT\b',
        r'Speech Therapist',
        r'\bST\b',
        r'Licensed Professional Counselor'
    ],
    'nonprofit': [
        r'501\(c\)\(3\)',
        r'nonprofit',
        r'non-profit',
        r'charitable organization'
    ],
    'autism_focus': [
        r'autism',
        r'ASD',
        r'autism spectrum',
        r'developmental disabilities',
        r'special needs'
    ],
    'therapeutic_services': [
        r'hippotherapy',
        r'therapeutic riding',
        r'equine-assisted therapy',
        r'animal-assisted therapy',
        r'service dog training',
        r'therapy dog',
        r'emotional support'
    ]
}

RED_FLAGS = [
    r'veterinary',
    r'vet clinic',
    r'animal hospital',
    r'grooming',
    r'boarding',
    r'pet supplies',
    r'obedience classes',
    r'puppy training',
    r'dog daycare',
    r'kennel'
]

# ============================================================================
# TARGETED SEARCH QUERIES
# ============================================================================

SEARCH_QUERIES = [
    # Therapeutic Riding
    '"PATH International" Florida "therapeutic riding" -veterinary',
    '"hippotherapy" Florida autism -vet',
    '"Premier Accredited" Florida horses -veterinary',
    
    # Service Dogs
    '"ADI accredited" Florida "service dogs" autism',
    '"autism service dog" Florida "nonprofit" -training -obedience',
    '"assistance dog" Florida "501(c)3"',
    
    # Therapy Animals
    '"Pet Partners" Florida "therapy dog" autism',
    '"animal-assisted therapy" Florida "licensed therapist"',
    '"therapy animal" Florida hospital school autism',
    
    # Equine Therapy (specific)
    '"EAGALA" Florida',
    '"equine-assisted psychotherapy" Florida',
    '"therapeutic riding center" Florida nonprofit'
]

# ============================================================================
# PROVIDER CLASS
# ============================================================================

class Provider:
    def __init__(self, name: str, website: str, source: str):
        self.name = name
        self.website = website
        self.source = source
        self.address = None
        self.city = None
        self.phone = None
        self.email = None
        self.credentials = []
        self.score = 0
        self.notes = []
        
    def to_dict(self):
        return {
            'name': self.name,
            'website': self.website,
            'source': self.source,
            'address': self.address,
            'city': self.city,
            'phone': self.phone,
            'email': self.email,
            'credentials': self.credentials,
            'score': self.score,
            'notes': self.notes
        }

# ============================================================================
# GOOGLE SEARCH
# ============================================================================

def google_search(query: str, num_results: int = 10) -> List[Dict]:
    """Perform Google Custom Search"""
    try:
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            'key': GOOGLE_API_KEY,
            'cx': GOOGLE_CSE_ID,
            'q': query,
            'num': num_results
        }
        
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        
        results = []
        data = response.json()
        
        if 'items' in data:
            for item in data['items']:
                results.append({
                    'title': item.get('title', ''),
                    'link': item.get('link', ''),
                    'snippet': item.get('snippet', '')
                })
        
        return results
        
    except Exception as e:
        print(f"  ⚠️ Search error: {e}")
        return []

def search_for_providers() -> List[Provider]:
    """Execute targeted credential-based searches"""
    print("\n🔍 Running targeted credential searches...")
    providers = []
    seen_websites = set()
    
    for i, query in enumerate(SEARCH_QUERIES, 1):
        print(f"\n  [{i}/{len(SEARCH_QUERIES)}] Searching: {query[:60]}...")
        results = google_search(query, num_results=10)
        
        for result in results:
            website = result['link']
            
            # Skip duplicates
            if website in seen_websites:
                continue
            
            # Extract likely provider name from title
            name = result['title'].split('|')[0].split('-')[0].strip()
            
            provider = Provider(name, website, f"Google: {query[:40]}...")
            providers.append(provider)
            seen_websites.add(website)
            
            print(f"    ✓ Found: {name}")
        
        # Rate limiting
        time.sleep(1.5)
    
    return providers

# ============================================================================
# WEBSITE VERIFICATION
# ============================================================================

def fetch_website_content(url: str) -> Optional[str]:
    """Fetch website HTML content"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        response.raise_for_status()
        return response.text.lower()  # Lowercase for easier pattern matching
        
    except Exception as e:
        print(f"    ⚠️ Failed to fetch {url}: {e}")
        return None

def score_provider(provider: Provider, content: str) -> int:
    """Score provider based on credential patterns"""
    score = 0
    
    # Check for credential patterns
    for category, patterns in VERIFICATION_PATTERNS.items():
        category_matched = False
        for pattern in patterns:
            if re.search(pattern, content, re.IGNORECASE):
                if not category_matched:  # Only count each category once
                    if category == 'path_member':
                        score += 10
                        provider.credentials.append('PATH International')
                        provider.notes.append('PATH member/accredited')
                    elif category == 'adi_member':
                        score += 10
                        provider.credentials.append('ADI')
                        provider.notes.append('ADI accredited')
                    elif category == 'pet_partners':
                        score += 5
                        provider.credentials.append('Pet Partners')
                    elif category == 'eagala':
                        score += 8
                        provider.credentials.append('EAGALA')
                    elif category == 'aha':
                        score += 5
                        provider.credentials.append('AHA')
                    elif category == 'licensed_therapist':
                        score += 5
                        provider.notes.append('Licensed therapist')
                    elif category == 'nonprofit':
                        score += 3
                        provider.notes.append('Nonprofit (501c3)')
                    elif category == 'autism_focus':
                        score += 3
                        provider.notes.append('Autism/disabilities focus')
                    elif category == 'therapeutic_services':
                        score += 2
                    
                    category_matched = True
                    break
    
    # Check for red flags
    for flag in RED_FLAGS:
        if re.search(flag, content, re.IGNORECASE):
            score -= 10
            provider.notes.append(f'RED FLAG: {flag}')
    
    # Check for .org domain (good sign)
    if '.org' in provider.website:
        score += 2
        provider.notes.append('.org domain')
    
    provider.score = score
    return score

def verify_provider(provider: Provider) -> bool:
    """Fetch website and verify credentials"""
    print(f"\n  Verifying: {provider.name}")
    print(f"    URL: {provider.website}")
    
    content = fetch_website_content(provider.website)
    if not content:
        provider.score = 0
        provider.notes.append('Website inaccessible')
        return False
    
    score = score_provider(provider, content)
    
    print(f"    Score: {score}")
    if provider.credentials:
        print(f"    Credentials: {', '.join(provider.credentials)}")
    if provider.notes:
        for note in provider.notes:
            print(f"      • {note}")
    
    return score >= MIN_SCORE

# ============================================================================
# MAIN EXECUTION
# ============================================================================

def main():
    print("=" * 70)
    print("PET THERAPY PROVIDER REGISTRY SCRAPER + VERIFICATION")
    print("=" * 70)
    
    all_providers = []
    
    # Targeted Searches
    print("\n" + "=" * 70)
    print("STEP 1: TARGETED CREDENTIAL-BASED SEARCHES")
    print("=" * 70)
    
    search_providers = search_for_providers()
    all_providers.extend(search_providers)
    
    print(f"\n✓ Total providers to verify: {len(all_providers)}")
    
    # Verify Each Provider
    print("\n" + "=" * 70)
    print("STEP 2: WEBSITE VERIFICATION & CREDENTIAL SCORING")
    print("=" * 70)
    
    verified_providers = []
    
    for i, provider in enumerate(all_providers, 1):
        print(f"\n[{i}/{len(all_providers)}]", end=" ")
        
        if verify_provider(provider):
            verified_providers.append(provider)
            print(f"    ✓ VERIFIED (score: {provider.score})")
        else:
            print(f"    ✗ REJECTED (score: {provider.score})")
        
        # Rate limiting
        time.sleep(1.1)
    
    # Save Results
    print("\n" + "=" * 70)
    print("RESULTS")
    print("=" * 70)
    
    print(f"\n✓ Verified providers: {len(verified_providers)}")
    print(f"✗ Rejected providers: {len(all_providers) - len(verified_providers)}")
    
    # Save to JSON
    output_data = {
        'timestamp': datetime.now().isoformat(),
        'total_checked': len(all_providers),
        'verified_count': len(verified_providers),
        'min_score_required': MIN_SCORE,
        'providers': [p.to_dict() for p in verified_providers]
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Saved to: {OUTPUT_FILE}")
    
    # Print summary
    if verified_providers:
        print("\n" + "=" * 70)
        print("VERIFIED PROVIDERS SUMMARY")
        print("=" * 70)
        
        for provider in sorted(verified_providers, key=lambda p: p.score, reverse=True):
            print(f"\n{provider.name} (Score: {provider.score})")
            print(f"  URL: {provider.website}")
            if provider.credentials:
                print(f"  Credentials: {', '.join(provider.credentials)}")

if __name__ == "__main__":
    # Check for API credentials
    if GOOGLE_API_KEY == "AIzaSyDCZpKBCw4OL4ys8aDNt7IsYJKLKeWMLOE":
        print("\n⚠️ ERROR: You need to paste your Google API key!")
        print("\nOpen pet_therapy_scraper.py and replace:")
        print('  GOOGLE_API_KEY = "AIzaSyDCZpKBCw4OL4ys8aDNt7IsYJKLKeWMLOE"')
        print("\nWith your actual API key from Google Cloud Console.")
        exit(1)
    
    main()