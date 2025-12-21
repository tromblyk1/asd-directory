#!/usr/bin/env python3
"""
Florida Special Needs Church Finder
Searches multiple sources for churches with autism/special needs programs
"""

import requests
from bs4 import BeautifulSoup
import csv
import time
import re
from urllib.parse import quote_plus

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

results = []

def search_bing(query, num_results=20):
    """Search Bing and return URLs"""
    search_url = f"https://www.bing.com/search?q={quote_plus(query)}&count={num_results}"
    print(f"  Searching: {query[:60]}...")
    
    try:
        response = requests.get(search_url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        urls = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.startswith('http') and 'bing.com' not in href and 'microsoft.com' not in href:
                urls.append(href)
        
        return list(set(urls))[:num_results]
    except Exception as e:
        print(f"    Error: {e}")
        return []

def check_page_for_church(url):
    """Visit URL and extract church info if it has special needs program"""
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        text = soup.get_text().lower()
        
        # Must be in Florida
        if 'florida' not in text and ', fl' not in text:
            return None
        
        # Must be a church
        church_words = ['church', 'ministry', 'worship', 'congregation', 'parish', 'cathedral']
        if not any(word in text for word in church_words):
            return None
        
        # Must have special needs program
        sn_words = ['special needs', 'disability', 'autism', 'sensory friendly', 'sensory room',
                    'buddy break', 'respite', 'inclusion', 'exceptional', 'different abilities',
                    'access ministry', 'adaptive', 'all abilities', 'night to shine']
        if not any(word in text for word in sn_words):
            return None
        
        # Get title
        title = soup.find('title')
        name = title.get_text().strip()[:100] if title else url
        
        # Try to find Florida address
        fl_match = re.search(r'(\d+[^,\n]+),?\s*([^,\n]+),?\s*FL\s*(\d{5})?', soup.get_text(), re.IGNORECASE)
        address = fl_match.group(0).strip() if fl_match else ''
        
        # Try to find phone
        phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', soup.get_text())
        phone = phone_match.group(0) if phone_match else ''
        
        # Try to find email
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', soup.get_text())
        email = email_match.group(0) if email_match else ''
        
        return {
            'name': name,
            'url': url,
            'address': address,
            'phone': phone,
            'email': email
        }
        
    except Exception as e:
        return None

def main():
    print("=" * 60)
    print("FLORIDA SPECIAL NEEDS CHURCH FINDER")
    print("=" * 60)
    
    # Specific program searches that work well
    searches = [
        # Night to Shine hosts
        '"Night to Shine" Florida church 2026',
        '"Night to Shine" host church Florida',
        
        # Champions Club (North Point model)
        '"Champions Club" Florida church special needs',
        
        # Specific ministry names
        '"access ministry" Florida church disability',
        '"SOAR ministry" Florida church',
        '"embrace ministry" Florida church special needs',
        
        # Sensory friendly
        '"sensory friendly" church Florida',
        '"sensory room" church Florida',
        '"sensory worship" Florida',
        
        # Catholic
        '"sensory mass" Florida Catholic',
        'autism mass Florida Catholic parish',
        'disability ministry Catholic Florida',
        
        # Baptist
        'special needs ministry Baptist church Florida',
        'disability ministry Florida Baptist',
        
        # Methodist
        'special needs ministry Methodist Florida',
        
        # Respite programs
        '"respite night" church Florida',
        '"parents night out" special needs Florida church',
        
        # General but specific
        'autism friendly church Jacksonville FL',
        'autism friendly church Tampa FL',
        'autism friendly church Miami FL',
        'special needs ministry Orlando church',
        'special needs ministry Fort Lauderdale church',
        'disability ministry Pensacola church',
    ]
    
    seen_urls = set()
    
    for query in searches:
        urls = search_bing(query, 15)
        time.sleep(2)  # Rate limiting
        
        for url in urls:
            if url in seen_urls:
                continue
            seen_urls.add(url)
            
            info = check_page_for_church(url)
            if info:
                # Check if we already have this church
                if not any(r['url'] == info['url'] for r in results):
                    results.append(info)
                    print(f"    ✓ Found: {info['name'][:50]}")
            
            time.sleep(0.5)
    
    # Save results
    print("\n" + "=" * 60)
    print(f"COMPLETE - Found {len(results)} churches")
    print("=" * 60)
    
    if results:
        with open('florida_sn_churches_new.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['name', 'url', 'address', 'phone', 'email'])
            writer.writeheader()
            writer.writerows(results)
        print(f"\nSaved to: florida_sn_churches_new.csv")
        
        print("\n--- RESULTS ---")
        for r in results:
            print(f"\n{r['name']}")
            print(f"  URL: {r['url']}")
            if r['address']:
                print(f"  Address: {r['address']}")
            if r['phone']:
                print(f"  Phone: {r['phone']}")

if __name__ == "__main__":
    main()
