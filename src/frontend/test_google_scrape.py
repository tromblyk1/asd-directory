import os
import csv
import requests
import time
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')
API_KEY = os.getenv('VITE_GOOGLE_MAPS_API_KEY')

# Google Places API endpoints
TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"

def find_place_id(name, address, city, state):
    """Search for place_id using Text Search API"""
    query = f"{name}, {address}, {city}, {state}"
    
    params = {
        'query': query,
        'key': API_KEY
    }
    
    try:
        response = requests.get(TEXT_SEARCH_URL, params=params)
        data = response.json()
        
        if data['status'] == 'OK' and len(data['results']) > 0:
            result = data['results'][0]
            return {
                'place_id': result['place_id'],
                'formatted_address': result.get('formatted_address'),
                'rating': result.get('rating'),
                'user_ratings_total': result.get('user_ratings_total')
            }
        else:
            print(f"  ❌ Not found: {data['status']}")
            return None
            
    except Exception as e:
        print(f"  ⚠️ Error: {e}")
        return None

def get_place_details(place_id):
    """Get detailed info using Place Details API"""
    params = {
        'place_id': place_id,
        'fields': 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,business_status,types,editorial_summary',
        'key': API_KEY
    }
    
    try:
        response = requests.get(DETAILS_URL, params=params)
        data = response.json()
        
        if data['status'] == 'OK':
            result = data['result']
            return {
                'website': result.get('website'),
                'phone': result.get('formatted_phone_number'),
                'hours': result.get('opening_hours', {}).get('weekday_text'),
                'types': result.get('types', []),
                'summary': result.get('editorial_summary', {}).get('overview'),
                'business_status': result.get('business_status')
            }
        else:
            print(f"  ❌ Details failed: {data['status']}")
            return None
            
    except Exception as e:
        print(f"  ⚠️ Error: {e}")
        return None

def process_test_resources():
    """Process the 10 test resources"""
    
    # Read CSV
    with open('test_resources.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        resources = list(reader)
    
    print(f"\n🔍 Testing Google Places API with {len(resources)} resources\n")
    print("=" * 80)
    
    results = []
    
    for i, resource in enumerate(resources, 1):
        print(f"\n[{i}/{len(resources)}] {resource['name']}")
        print(f"  Address: {resource['address1']}, {resource['city']}, {resource['state']}")
        
        # Step 1: Find place_id
        place_info = find_place_id(
            resource['name'],
            resource['address1'],
            resource['city'],
            resource['state']
        )
        
        if place_info:
            print(f"  ✅ Found place_id: {place_info['place_id']}")
            print(f"  📍 Address: {place_info['formatted_address']}")
            if place_info.get('rating'):
                print(f"  ⭐ Rating: {place_info['rating']} ({place_info.get('user_ratings_total', 0)} reviews)")
            
            # Step 2: Get detailed info
            time.sleep(0.1)  # Rate limiting
            details = get_place_details(place_info['place_id'])
            
            if details:
                if details.get('website'):
                    print(f"  🌐 Website: {details['website']}")
                if details.get('phone'):
                    print(f"  📞 Phone: {details['phone']}")
                if details.get('types'):
                    print(f"  🏷️ Types: {', '.join(details['types'][:5])}")
                if details.get('summary'):
                    print(f"  📝 Summary: {details['summary'][:100]}...")
            
            results.append({
                'id': resource['id'],
                'name': resource['name'],
                'place_id': place_info['place_id'],
                'rating': place_info.get('rating'),
                'reviews': place_info.get('user_ratings_total'),
                'website': details.get('website') if details else None,
                'types': details.get('types') if details else None
            })
        
        time.sleep(0.2)  # Rate limiting between requests
    
    print("\n" + "=" * 80)
    print(f"\n✅ Successfully found: {len(results)}/{len(resources)}")
    print(f"❌ Not found: {len(resources) - len(results)}")
    
    # Save results
    if results:
        with open('test_results.csv', 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=['id', 'name', 'place_id', 'rating', 'reviews', 'website', 'types'])
            writer.writeheader()
            writer.writerows(results)
        print(f"\n💾 Results saved to: test_results.csv")
    
    return results

if __name__ == "__main__":
    if not API_KEY:
        print("❌ Error: VITE_GOOGLE_MAPS_API_KEY not found in .env.local")
        exit(1)
    
    process_test_resources()