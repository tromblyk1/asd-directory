import os
import csv
import requests
import time
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')
API_KEY = os.getenv('VITE_GOOGLE_MAPS_API_KEY')

if not API_KEY:
    print("ERROR: VITE_GOOGLE_MAPS_API_KEY not found in .env.local")
    exit(1)

# Google Places API endpoints
TEXT_SEARCH_URL = "https://maps.googleapis.com/maps/api/place/textsearch/json"
DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json"

# Configuration
BATCH_SIZE = 500
RATE_LIMIT_DELAY = 0.15  # Seconds between requests (400 requests/min max)
BATCH_DELAY = 5  # Seconds between batches

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
                'user_ratings_total': result.get('user_ratings_total'),
                'types': ','.join(result.get('types', [])),
                'status': 'success'
            }
        elif data['status'] == 'ZERO_RESULTS':
            return {'status': 'not_found'}
        elif data['status'] == 'OVER_QUERY_LIMIT':
            return {'status': 'quota_exceeded'}
        else:
            return {'status': f"error_{data['status']}"}
            
    except Exception as e:
        return {'status': 'exception', 'error': str(e)}

def get_place_details(place_id):
    """Get detailed info using Place Details API"""
    params = {
        'place_id': place_id,
        'fields': 'name,formatted_address,formatted_phone_number,website,opening_hours,rating,user_ratings_total,business_status,types',
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
                'business_status': result.get('business_status'),
                'status': 'success'
            }
        else:
            return {'status': f"error_{data['status']}"}
            
    except Exception as e:
        return {'status': 'exception', 'error': str(e)}

def process_batch(resources, batch_num):
    """Process a batch of resources"""
    results = []
    found = 0
    not_found = 0
    errors = 0
    
    print(f"\n{'='*80}")
    print(f"📦 BATCH {batch_num}: Processing {len(resources)} resources")
    print(f"{'='*80}\n")
    
    for idx, resource in enumerate(resources, 1):
        resource_id = resource['id']
        name = resource['name']
        address = resource.get('address', '')
        city = resource.get('city', '')
        state = resource.get('state', 'FL')
        
        print(f"[{idx}/{len(resources)}] {name}")
        
        # Search for place_id
        place_info = find_place_id(name, address, city, state)
        
        if place_info['status'] == 'success':
            print(f"  ✅ Found: {place_info['place_id']}")
            found += 1
            
            # Get additional details
            details = get_place_details(place_info['place_id'])
            place_info.update(details)
            
        elif place_info['status'] == 'not_found':
            print(f"  ❌ Not found")
            not_found += 1
        elif place_info['status'] == 'quota_exceeded':
            print(f"  ⚠️ QUOTA EXCEEDED - Stopping batch")
            errors += 1
            break
        else:
            print(f"  ⚠️ Error: {place_info['status']}")
            errors += 1
        
        # Add to results
        result = {
            'id': resource_id,
            'name': name,
            'place_id': place_info.get('place_id', ''),
            'rating': place_info.get('rating', ''),
            'user_ratings_total': place_info.get('user_ratings_total', ''),
            'website': place_info.get('website', ''),
            'phone': place_info.get('phone', ''),
            'types': place_info.get('types', ''),
            'status': place_info['status']
        }
        results.append(result)
        
        # Rate limiting
        time.sleep(RATE_LIMIT_DELAY)
    
    return results, found, not_found, errors

def main():
    # Check for input file
    input_file = 'resources_to_scrape.csv'
    if not os.path.exists(input_file):
        print(f"ERROR: {input_file} not found")
        print("Please export resources from Supabase and save as resources_to_scrape.csv")
        exit(1)
    
    # Read input CSV
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        all_resources = list(reader)
    
    # Create output filename with timestamp
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = f'scrape_results_{timestamp}.csv'
    
    print("🚀 GOOGLE MAPS BATCH SCRAPER")
    print(f"📁 Total resources: {len(all_resources)}")
    print(f"📦 Batch size: {BATCH_SIZE}")
    print(f"💾 Output file: {output_file}")
    print(f"⏱️ Estimated time: ~{len(all_resources) * RATE_LIMIT_DELAY / 60:.1f} minutes\n")
    
    input("Press Enter to start scraping...")
    
    # Process in batches
    all_results = []
    total_found = 0
    total_not_found = 0
    total_errors = 0
    
    for batch_num in range(1, (len(all_resources) // BATCH_SIZE) + 2):
        start_idx = (batch_num - 1) * BATCH_SIZE
        end_idx = start_idx + BATCH_SIZE
        batch = all_resources[start_idx:end_idx]
        
        if not batch:
            break
        
        # Process this batch
        batch_results, found, not_found, errors = process_batch(batch, batch_num)
        all_results.extend(batch_results)
        
        total_found += found
        total_not_found += not_found
        total_errors += errors
        
        # Save results after each batch
        with open(output_file, 'w', newline='', encoding='utf-8') as f:
            fieldnames = ['id', 'name', 'place_id', 'rating', 'user_ratings_total', 'website', 'phone', 'types', 'status']
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_results)
        
        # Print batch summary
        print(f"\n📊 Batch {batch_num} Summary:")
        print(f"  ✅ Found: {found}")
        print(f"  ❌ Not found: {not_found}")
        print(f"  ⚠️ Errors: {errors}")
        print(f"\n💾 Batch saved to: {output_file}")
        print(f"📊 Running Total: {total_found} found, {total_not_found} not found, {total_errors} errors")
        
        # Check if there are more batches
        if end_idx < len(all_resources):
            print(f"\n⏸️ Pausing {BATCH_DELAY} seconds before next batch...")
            time.sleep(BATCH_DELAY)
            
            cont = input("\nContinue to batch " + str(batch_num + 1) + "? (y/n): ")
            if cont.lower() != 'y':
                print("\n🛑 Stopping at user request")
                break
        else:
            print("\n✅ All batches completed!")
    
    print(f"\n{'='*80}")
    print(f"🎉 SCRAPING COMPLETE")
    print(f"{'='*80}")
    print(f"📊 Final Results:")
    print(f"  Total processed: {len(all_results)}")
    print(f"  ✅ Found: {total_found}")
    print(f"  ❌ Not found: {total_not_found}")
    print(f"  ⚠️ Errors: {total_errors}")
    print(f"  Success rate: {total_found/len(all_results)*100:.1f}%")
    print(f"\n💾 Results saved to: {output_file}")

if __name__ == "__main__":
    main()