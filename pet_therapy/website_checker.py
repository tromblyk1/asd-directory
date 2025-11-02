"""
Website Content Checker for Pet Therapy Providers
Crawls provider websites to verify if they actually offer therapy services
Helps validate the 939 "NEEDS REVIEW" providers
"""

import json
import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import urljoin, urlparse

# Therapy-related keywords to search for on websites
THERAPY_KEYWORDS = [
    'animal assisted therapy', 'pet therapy', 'therapy animal',
    'hippotherapy', 'equine assisted', 'equine therapy',
    'therapeutic riding', 'adaptive riding', 'therapeutic horseback',
    'autism', 'special needs', 'disabilities', 'disability services',
    'emotional support animal', 'service animal training',
    'animal-assisted psychotherapy', 'equine-assisted learning',
    'canine-assisted therapy', 'facility dog', 'therapy dog program',
]

# Non-therapy keywords (indicates NOT a therapy provider)
NON_THERAPY_KEYWORDS = [
    'veterinary services', 'vet clinic', 'animal hospital',
    'grooming services', 'pet grooming', 'dog grooming',
    'boarding services', 'pet boarding', 'daycare',
    'obedience training', 'dog training classes',
    'riding lessons', 'horseback riding lessons', 'equestrian lessons',
]

def fetch_website_text(url, timeout=10):
    """Fetch and extract text from a website"""
    try:
        # Add headers to appear like a browser
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=timeout, allow_redirects=True)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(['script', 'style', 'nav', 'footer']):
            script.decompose()
        
        # Get text
        text = soup.get_text(separator=' ', strip=True)
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace
        
        return text.lower()
    
    except Exception as e:
        return None

def analyze_website_content(text):
    """Analyze website text for therapy-related content"""
    if not text:
        return {
            'is_therapy': None,
            'confidence': 'UNKNOWN',
            'therapy_mentions': 0,
            'non_therapy_mentions': 0,
            'matched_therapy_keywords': [],
            'matched_non_therapy_keywords': []
        }
    
    therapy_matches = []
    non_therapy_matches = []
    
    # Count therapy keyword mentions
    for keyword in THERAPY_KEYWORDS:
        if keyword in text:
            therapy_matches.append(keyword)
    
    # Count non-therapy keyword mentions
    for keyword in NON_THERAPY_KEYWORDS:
        if keyword in text:
            non_therapy_matches.append(keyword)
    
    therapy_count = len(therapy_matches)
    non_therapy_count = len(non_therapy_matches)
    
    # Determine if this is a therapy provider
    if therapy_count >= 3:
        is_therapy = True
        confidence = 'HIGH'
    elif therapy_count >= 1 and non_therapy_count == 0:
        is_therapy = True
        confidence = 'MEDIUM'
    elif non_therapy_count >= 2:
        is_therapy = False
        confidence = 'HIGH'
    elif non_therapy_count >= 1 and therapy_count == 0:
        is_therapy = False
        confidence = 'MEDIUM'
    else:
        is_therapy = None
        confidence = 'LOW'
    
    return {
        'is_therapy': is_therapy,
        'confidence': confidence,
        'therapy_mentions': therapy_count,
        'non_therapy_mentions': non_therapy_count,
        'matched_therapy_keywords': therapy_matches[:5],  # Top 5
        'matched_non_therapy_keywords': non_therapy_matches[:5]
    }

def process_providers_batch(providers, max_to_check=939):
    """Process a batch of providers and check their websites"""
    print(f"\nChecking websites for up to {max_to_check} providers...")
    print("=" * 70)
    
    results = []
    checked = 0
    
    for i, provider in enumerate(providers):
        if checked >= max_to_check:
            print(f"\nReached limit of {max_to_check} checks. Stopping.")
            break
        
        website = provider.get('website')
        if not website:
            # No website to check
            results.append({
                **provider,
                'website_checked': False,
                'website_analysis': None
            })
            continue
        
        checked += 1
        print(f"\n[{checked}/{min(max_to_check, len([p for p in providers if p.get('website')]))}] Checking: {provider['name']}")
        print(f"    URL: {website}")
        
        # Fetch and analyze website
        text = fetch_website_text(website)
        analysis = analyze_website_content(text)
        
        print(f"    Result: {'THERAPY' if analysis['is_therapy'] else 'NOT THERAPY' if analysis['is_therapy'] == False else 'UNCLEAR'} (Confidence: {analysis['confidence']})")
        if analysis['matched_therapy_keywords']:
            print(f"    Therapy keywords found: {', '.join(analysis['matched_therapy_keywords'][:3])}")
        
        results.append({
            **provider,
            'website_checked': True,
            'website_analysis': analysis
        })
        
        # Polite delay
        time.sleep(1)
    
    # Add unchecked providers to results
    for provider in providers[len(results):]:
        results.append({
            **provider,
            'website_checked': False,
            'website_analysis': None
        })
    
    return results

def main():
    print("=" * 70)
    print("WEBSITE CONTENT CHECKER FOR PET THERAPY PROVIDERS")
    print("=" * 70)
    
    # Load the "needs review" providers
    try:
        with open('pet_therapy_NEEDS_REVIEW.json', 'r') as f:
            providers = json.load(f)
    except FileNotFoundError:
        print("Error: pet_therapy_NEEDS_REVIEW.json not found!")
        print("Make sure this file is in the same folder as the script.")
        return
    
    print(f"Loaded {len(providers)} providers that need review")
    
    # Count how many have websites
    with_websites = [p for p in providers if p.get('website')]
    print(f"Providers with websites: {len(with_websites)}")
    print(f"Providers without websites: {len(providers) - len(with_websites)}")
    
    # Ask user how many to check
    print("\n" + "=" * 70)
    print("WEBSITE CHECKING OPTIONS:")
    print("=" * 70)
    print("1. Check sample of 50 websites (quick test)")
    print("2. Check sample of 200 websites (moderate)")
    print("3. Check all websites (may take a long time)")
    print("=" * 70)
    
    # Default to checking 100 for demonstration
    max_check = 939
    print(f"\nWill check up to {max_check} websites...\n")
    
    # Process providers
    results = process_providers_batch(with_websites, max_to_check=max_check)
    
    # Analyze results
    therapy_confirmed = [r for r in results if r.get('website_checked') and r.get('website_analysis', {}).get('is_therapy') == True]
    not_therapy = [r for r in results if r.get('website_checked') and r.get('website_analysis', {}).get('is_therapy') == False]
    unclear = [r for r in results if r.get('website_checked') and r.get('website_analysis', {}).get('is_therapy') is None]
    not_checked = [r for r in results if not r.get('website_checked')]
    
    print("\n" + "=" * 70)
    print("WEBSITE VERIFICATION RESULTS:")
    print("=" * 70)
    print(f"Confirmed THERAPY providers:  {len(therapy_confirmed):>4}")
    print(f"Confirmed NOT therapy:        {len(not_therapy):>4}")
    print(f"Still unclear:                {len(unclear):>4}")
    print(f"Not checked (no website):     {len(not_checked):>4}")
    print(f"Total:                        {len(results):>4}")
    
    # Save results
    print("\nSaving results...")
    
    with open('pet_therapy_WEBSITE_VERIFIED.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    # Create separate files for each category
    with open('pet_therapy_CONFIRMED_BY_WEBSITE.json', 'w') as f:
        clean = [{k: v for k, v in p.items() if k not in ['website_checked', 'website_analysis', 'analysis_score', 'confidence', 'decision', 'category', 'subcategory', 'reasons']} 
                 for p in therapy_confirmed]
        json.dump(clean, f, indent=2)
    
    with open('pet_therapy_REJECTED_BY_WEBSITE.json', 'w') as f:
        json.dump(not_therapy, f, indent=2)
    
    print("\n" + "=" * 70)
    print("FILES CREATED:")
    print("=" * 70)
    print("✓ pet_therapy_WEBSITE_VERIFIED.json    - All results with analysis")
    print("✓ pet_therapy_CONFIRMED_BY_WEBSITE.json - Therapy providers confirmed")
    print("✓ pet_therapy_REJECTED_BY_WEBSITE.json  - Non-therapy confirmed")
    
    # Show samples
    if therapy_confirmed:
        print("\n" + "=" * 70)
        print("SAMPLE CONFIRMED THERAPY PROVIDERS:")
        print("=" * 70)
        for p in therapy_confirmed[:10]:
            print(f"\n{p['name']}")
            print(f"  Website: {p.get('website')}")
            keywords = p.get('website_analysis', {}).get('matched_therapy_keywords', [])
            if keywords:
                print(f"  Keywords found: {', '.join(keywords[:3])}")
    
    if not_therapy:
        print("\n" + "=" * 70)
        print("SAMPLE REJECTED (NOT THERAPY):")
        print("=" * 70)
        for p in not_therapy[:10]:
            print(f"\n{p['name']}")
            print(f"  Website: {p.get('website')}")
            keywords = p.get('website_analysis', {}).get('matched_non_therapy_keywords', [])
            if keywords:
                print(f"  Non-therapy keywords: {', '.join(keywords[:3])}")

if __name__ == '__main__':
    main()
