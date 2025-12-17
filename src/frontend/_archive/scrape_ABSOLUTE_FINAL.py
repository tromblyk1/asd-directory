#!/usr/bin/env python3
import csv
import time
import requests
from datetime import datetime

GOOGLE_API_KEY = "AIzaSyBp1WnXxVsF2h9jFYABtZXD9fA14vU-js4"

def build_search_query(resource):
    parts = []
    if resource.get('name') and resource['name'] != 'null':
        parts.append(resource['name'])
    if resource.get('address1') and resource['address1'] != 'null':
        parts.append(resource['address1'])
    if resource.get('city') and resource['city'] != 'null':
        parts.append(resource['city'])
    if resource.get('state') and resource['state'] != 'null':
        parts.append(resource['state'])
    if resource.get('zip_code') and resource['zip_code'] != 'null':
        parts.append(resource['zip_code'])
    return ', '.join(parts)

def scrape_google_maps(resource):
    try:
        query = build_search_query(resource)
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        params = {'query': query, 'key': GOOGLE_API_KEY}
        response = requests.get(url, params=params, timeout=10)
        data = response.json()
        
        if data.get('status') == 'OK' and data.get('results'):
            place = data['results'][0]
            place_id = place.get('place_id')
            details_url = "https://maps.googleapis.com/maps/api/place/details/json"
            details_params = {
                'place_id': place_id,
                'fields': 'name,rating,user_ratings_total,formatted_phone_number,website',
                'key': GOOGLE_API_KEY
            }
            details_response = requests.get(details_url, params=details_params, timeout=10)
            details_data = details_response.json()
            
            if details_data.get('status') == 'OK':
                result = details_data.get('result', {})
                return {
                    'status': 'success',
                    'place_id': place_id,
                    'name': result.get('name'),
                    'rating': result.get('rating'),
                    'user_ratings_total': result.get('user_ratings_total'),
                    'website': result.get('website'),
                    'phone': result.get('formatted_phone_number')
                }
        
        return {
            'status': 'not_found',
            'place_id': None,
            'name': resource.get('name'),
            'rating': None,
            'user_ratings_total': None,
            'website': None,
            'phone': None
        }
    except Exception as e:
        return {
            'status': 'error',
            'error': str(e),
            'place_id': None,
            'name': resource.get('name'),
            'rating': None,
            'user_ratings_total': None,
            'website': None,
            'phone': None
        }

def main():
    input_file = 'Supabase Snippet Resources Missing Google Place ID.csv'
    
    resources = []
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            resources = [row for row in reader]
    except FileNotFoundError:
        print(f"❌ Error: File '{input_file}' not found!")
        return
    
    if len(resources) == 0:
        print("❌ Error: CSV file is empty!")
        return
    
    print(f"📥 Loaded {len(resources)} resources")
    print(f"🏁 THIS IS THE ABSOLUTE FINAL SCRAPE!")
    print(f"⏱️  Estimated time: {len(resources) * 1.1 / 60:.1f} minutes")
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    output_file = f'scrape_results_ABSOLUTE_FINAL_{timestamp}.csv'
    
    print(f"\n🚀 Starting FINAL scrape...")
    print("=" * 60)
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=['id', 'name', 'status', 'place_id', 'rating', 'user_ratings_total', 'website', 'phone', 'error'])
        writer.writeheader()
        
        success_count = 0
        failed_count = 0
        
        for i, resource in enumerate(resources, 1):
            print(f"[{i}/{len(resources)}]", end=' ', flush=True)
            
            result = scrape_google_maps(resource)
            
            writer.writerow({
                'id': resource['id'],
                'name': resource.get('name'),
                'status': result['status'],
                'place_id': result.get('place_id'),
                'rating': result.get('rating'),
                'user_ratings_total': result.get('user_ratings_total'),
                'website': result.get('website'),
                'phone': result.get('phone'),
                'error': result.get('error', '')
            })
            csvfile.flush()
            
            if result['status'] == 'success':
                success_count += 1
                print("✅")
            else:
                failed_count += 1
                print("❌")
            
            if i % 50 == 0:
                elapsed = i * 1.1 / 60
                remaining = (len(resources) - i) * 1.1 / 60
                print(f"  ⏱️  {elapsed:.1f}m elapsed, ~{remaining:.1f}m remaining")
            
            time.sleep(1.1)
    
    print("\n" + "=" * 60)
    print(f"🎉 ABSOLUTE FINAL SCRAPE COMPLETE!")
    print(f"   Success: {success_count}")
    print(f"   Failed: {failed_count}")
    print(f"   Success rate: {success_count/len(resources)*100:.1f}%")
    print(f"\n📄 Results: {output_file}")
    print(f"\n💰 Total API calls: {len(resources) * 2}")
    print(f"💰 Estimated cost: ${len(resources) * 2 * 0.017:.2f}")
    print(f"\n🏁 THIS WAS THE LAST GOOGLE MAPS SCRAPE EVER!")

if __name__ == '__main__':
    main()
