#!/usr/bin/env python3
"""
Find addresses for Florida special needs ministry churches
from Ability Ministry directory listings.
"""

import requests
from bs4 import BeautifulSoup
import re
import csv
import time

# Churches to look up - from Ability Ministry directory
CHURCHES = [
    {
        "name": "Alpha Omega Church",
        "city": "Miami",
        "phone": "305-273-1263",
        "website": None,  # Not listed
        "programs": "Champions Club"
    },
    {
        "name": "Bridgeway Church",
        "city": "Wesley Chapel",
        "phone": "813-907-1313",
        "website": "https://www.bridgeway.tv/",
        "programs": "Buddy System, Respite Nights"
    },
    {
        "name": "Calvario City Church",
        "city": "Orlando",
        "phone": "407-351-4151",
        "website": "http://elcalvariobuddybreak.org",
        "programs": "Buddy Break, Respite Nights"
    },
    {
        "name": "Calvary Baptist Church",
        "city": "Melbourne",
        "phone": "321-549-7119",
        "website": "http://www.calvarybaptistmelbourne.org/",
        "programs": "Buddy Break, Respite Nights"
    },
    {
        "name": "Calvary Chapel Fort Lauderdale",
        "city": "Fort Lauderdale",
        "phone": "954-556-4407",
        "website": "https://www.calvaryftl.org/Ministry/Detail/KingsKids",
        "programs": "Youth Classes (Kings Kids)"
    },
    {
        "name": "Casa Sobre La Roca",
        "city": "Orlando",
        "phone": "407-535-3510",
        "website": "http://casaroca.org/orlando/",
        "programs": "Buddy Break, Respite Nights (Spanish-speaking)"
    },
    {
        "name": "Christ Fellowship Church",
        "city": "Palm Beach Gardens",
        "phone": "561-799-7600",
        "website": "http://gochristfellowship.com/support/special-needs/",
        "programs": "Adult Classes, Youth Classes, Buddy System, ASL Interpretation, Respite Nights"
    },
    {
        "name": "Christ Presbyterian Church",
        "city": "Ormond Beach",
        "phone": "386-677-4076",
        "website": "http://cpcob.org/?page_id=1044",
        "programs": "Buddy Break, Respite Nights"
    },
    {
        "name": "City Church",
        "city": "Sanford",
        "phone": "407-321-9600",
        "website": "http://citychurchfl.org",
        "programs": "Buddy Break, Respite Nights"
    },
    {
        "name": "Community Life Church",
        "city": "Gulf Breeze",
        "phone": "850-916-1660",
        "website": "https://www.clc.life/",
        "programs": "Adult Classes, Prom"
    },
    {
        "name": "CrossLife Church",
        "city": "Oviedo",
        "phone": "407-365-3484",
        "website": "http://crosslifechurch.com",
        "programs": "Buddy Break, Respite Nights"
    },
    {
        "name": "Deermeadows Baptist Church",
        "city": "Jacksonville",
        "phone": "904-302-9766",
        "website": "http://deermeadows.org",
        "programs": "Buddy Break, Respite Nights"
    },
    {
        "name": "Edgewater United Methodist Church",
        "city": "Port Charlotte",
        "phone": "941-625-3039",
        "website": "http://www.edgewaterchurch.com",
        "programs": "Buddy Break, Respite Nights"
    },
    {
        "name": "First Baptist Church Windermere",
        "city": "Windermere",
        "phone": "407-579-0489",
        "website": "http://www.FBCWindermere.com",
        "programs": "Buddy Break, Respite Nights"
    },
    {
        "name": "First Presbyterian Church of Eustis",
        "city": "Eustis",
        "phone": "352-357-2833",
        "website": "http://www.fpceustis.com",
        "programs": "Buddy Break, Respite Nights"
    },
    {
        "name": "Iglesia Cristiana de Adoracion A.D.",
        "city": "Orlando",
        "phone": "407-658-8506",
        "website": "http://www.icaorl.org/",
        "programs": "Buddy Break, Respite Nights (Spanish-speaking)"
    },
    {
        "name": "Iglesia de Dios Camino Verdad y Vida",
        "city": "Orlando",
        "phone": "407-610-0599",
        "website": "http://iglesiadedioscaminoverdadyvida.com/",
        "programs": "Buddy Break, Respite Nights (Spanish-speaking)"
    },
]

# Common address patterns
ADDRESS_PATTERNS = [
    # Full address with zip
    r'(\d{1,5}\s+[\w\s\.]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct|Parkway|Pkwy|Highway|Hwy)\.?[\w\s,]*FL\s*\d{5})',
    # Address with city, state
    r'(\d{1,5}\s+[\w\s\.]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct|Parkway|Pkwy|Highway|Hwy)\.?[,\s]+[\w\s]+,?\s*FL)',
    # Just street address
    r'(\d{1,5}\s+[\w\s\.]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Circle|Cir|Court|Ct|Parkway|Pkwy|Highway|Hwy)\.?)',
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}


def extract_address_from_text(text):
    """Try to extract an address from text using regex patterns."""
    for pattern in ADDRESS_PATTERNS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        if matches:
            # Return the longest match (most complete address)
            return max(matches, key=len).strip()
    return None


def extract_address_from_schema(soup):
    """Try to extract address from schema.org structured data."""
    # Look for JSON-LD
    scripts = soup.find_all('script', type='application/ld+json')
    for script in scripts:
        try:
            import json
            data = json.loads(script.string)
            if isinstance(data, list):
                data = data[0]
            if 'address' in data:
                addr = data['address']
                if isinstance(addr, dict):
                    parts = []
                    if addr.get('streetAddress'):
                        parts.append(addr['streetAddress'])
                    if addr.get('addressLocality'):
                        parts.append(addr['addressLocality'])
                    if addr.get('addressRegion'):
                        parts.append(addr['addressRegion'])
                    if addr.get('postalCode'):
                        parts.append(addr['postalCode'])
                    if parts:
                        return ', '.join(parts)
        except:
            pass
    return None


def extract_address_from_meta(soup):
    """Try to extract address from meta tags or common elements."""
    # Look for address element
    addr_elem = soup.find('address')
    if addr_elem:
        text = addr_elem.get_text(separator=' ', strip=True)
        if text and len(text) > 10:
            return text
    
    # Look for elements with address-related classes/ids
    for selector in ['[class*="address"]', '[id*="address"]', '[class*="location"]', '[itemprop="address"]']:
        elem = soup.select_one(selector)
        if elem:
            text = elem.get_text(separator=' ', strip=True)
            if text and len(text) > 10:
                return text
    
    return None


def fetch_and_extract_address(url):
    """Fetch a URL and try to extract an address."""
    if not url:
        return None, "No URL provided"
    
    try:
        # Try main page first
        response = requests.get(url, headers=HEADERS, timeout=15, allow_redirects=True)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try structured data first
        address = extract_address_from_schema(soup)
        if address:
            return address, "schema.org"
        
        # Try meta/address elements
        address = extract_address_from_meta(soup)
        if address:
            return address, "HTML element"
        
        # Try regex on full page text
        page_text = soup.get_text(separator=' ')
        address = extract_address_from_text(page_text)
        if address:
            return address, "regex"
        
        # Try to find and fetch contact page
        contact_links = soup.find_all('a', href=True)
        for link in contact_links:
            href = link.get('href', '').lower()
            text = link.get_text().lower()
            if 'contact' in href or 'contact' in text or 'location' in href or 'about' in href:
                contact_url = link['href']
                if not contact_url.startswith('http'):
                    from urllib.parse import urljoin
                    contact_url = urljoin(url, contact_url)
                
                try:
                    resp2 = requests.get(contact_url, headers=HEADERS, timeout=10)
                    soup2 = BeautifulSoup(resp2.text, 'html.parser')
                    
                    address = extract_address_from_schema(soup2)
                    if address:
                        return address, "contact page schema"
                    
                    address = extract_address_from_meta(soup2)
                    if address:
                        return address, "contact page element"
                    
                    page_text = soup2.get_text(separator=' ')
                    address = extract_address_from_text(page_text)
                    if address:
                        return address, "contact page regex"
                except:
                    pass
                break
        
        return None, "Not found"
        
    except requests.exceptions.RequestException as e:
        return None, f"Request error: {str(e)[:50]}"
    except Exception as e:
        return None, f"Error: {str(e)[:50]}"


def main():
    print("=" * 70)
    print("FLORIDA SPECIAL NEEDS CHURCH ADDRESS FINDER")
    print("=" * 70)
    print(f"\nProcessing {len(CHURCHES)} churches...\n")
    
    results = []
    
    for i, church in enumerate(CHURCHES, 1):
        print(f"[{i}/{len(CHURCHES)}] {church['name']} ({church['city']})...")
        
        address, source = fetch_and_extract_address(church.get('website'))
        
        if address:
            print(f"    ✓ Found: {address[:60]}... ({source})")
        else:
            print(f"    ✗ {source}")
        
        results.append({
            'name': church['name'],
            'city': church['city'],
            'state': 'FL',
            'phone': church['phone'],
            'website': church.get('website', ''),
            'programs': church['programs'],
            'address_found': address or '',
            'source': source
        })
        
        time.sleep(1)  # Be polite
    
    # Save results
    output_file = 'florida_churches_with_addresses.csv'
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['name', 'city', 'state', 'phone', 'website', 'programs', 'address_found', 'source'])
        writer.writeheader()
        writer.writerows(results)
    
    print(f"\n{'=' * 70}")
    print(f"COMPLETE - Results saved to {output_file}")
    print(f"{'=' * 70}")
    
    # Summary
    found = sum(1 for r in results if r['address_found'])
    print(f"\nAddresses found: {found}/{len(results)}")
    print(f"Missing: {len(results) - found}")
    
    if len(results) - found > 0:
        print("\nChurches needing manual lookup:")
        for r in results:
            if not r['address_found']:
                print(f"  - {r['name']} ({r['city']}) - {r['phone']}")


if __name__ == '__main__':
    main()
