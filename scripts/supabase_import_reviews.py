"""
Supabase Google Reviews Importer
Handles large CSV imports with chunking and error recovery
"""

import pandas as pd
import requests
import time
from datetime import datetime
import json
import os
from tqdm import tqdm

# ====== CONFIGURATION ======
SUPABASE_URL = "https://twcofvgxitfvoedftik.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y29mZ3l4aWl0ZnZvZWRmdGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzAyNzUsImV4cCI6MjA3NTc0NjI3NX0.pkxp6DBSgQykenv2UZIILZhUY9P6xp-lBNs6Z8NNmdI"
CSV_PATH = r"C:\Projects\ASD-Directory\data\google_reviews_canonical_supabase.csv"
TABLE_NAME = "google_reviews_canonical"
BATCH_SIZE = 500  # Insert 500 rows at a time
RATE_LIMIT_DELAY = 0.5  # Seconds between batches

# ====== SETUP ======
headers = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"  # Don't return inserted data (faster)
}

def clean_dataframe(df):
    """Prepare DataFrame for Supabase insertion"""
    # Drop the auto-generated 'id' column if it exists
    if 'id' in df.columns:
        df = df.drop('id', axis=1)
    
    # Convert timestamps to ISO format strings
    timestamp_cols = ['review_time', 'fetched_at', 'created_at']
    for col in timestamp_cols:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors='coerce').dt.strftime('%Y-%m-%dT%H:%M:%S')
    
    # Replace NaN with None for JSON serialization - MORE AGGRESSIVE
    df = df.replace({pd.NA: None, pd.NaT: None})
    df = df.where(pd.notnull(df), None)
    
    # Specifically handle numeric columns that might have NaN
    numeric_cols = df.select_dtypes(include=['float64', 'int64']).columns
    for col in numeric_cols:
        df[col] = df[col].apply(lambda x: None if pd.isna(x) else x)
    
    return df

def insert_batch(batch_data, batch_num, total_batches):
    """Insert a single batch with retry logic"""
    url = f"{SUPABASE_URL}/rest/v1/{TABLE_NAME}"
    
    for attempt in range(3):  # 3 retry attempts
        try:
            response = requests.post(url, headers=headers, json=batch_data, timeout=30)
            
            if response.status_code in [200, 201]:
                return True, None
            elif response.status_code == 409:
                # Conflict - might be duplicate, continue anyway
                return True, "Duplicate entries skipped"
            else:
                error_msg = f"Status {response.status_code}: {response.text}"
                if attempt < 2:
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                return False, error_msg
                
        except requests.exceptions.RequestException as e:
            if attempt < 2:
                time.sleep(2 ** attempt)
                continue
            return False, str(e)
    
    return False, "Max retries exceeded"

def main():
    print(f"🔄 Starting import from: {CSV_PATH}")
    print(f"📊 Target table: {TABLE_NAME}")
    print(f"🏢 Supabase URL: {SUPABASE_URL}\n")
    
    # Step 1: Load CSV
    print("📖 Loading CSV file...")
    try:
        df = pd.read_csv(CSV_PATH)
        total_rows = len(df)
        print(f"✅ Loaded {total_rows:,} rows\n")
    except Exception as e:
        print(f"❌ Error loading CSV: {e}")
        return
    
    # Step 2: Clean data
    print("🧹 Cleaning data...")
    df = clean_dataframe(df)
    print(f"✅ Data cleaned\n")
    
    # Step 3: Batch insert
    print(f"🚀 Starting batch insert ({BATCH_SIZE} rows per batch)...\n")
    
    total_batches = (total_rows + BATCH_SIZE - 1) // BATCH_SIZE
    successful_batches = 0
    failed_batches = []
    
    with tqdm(total=total_rows, desc="Importing", unit="rows") as pbar:
        for i in range(0, total_rows, BATCH_SIZE):
            batch = df.iloc[i:i + BATCH_SIZE]
            batch_data = batch.to_dict('records')
            batch_num = i // BATCH_SIZE + 1
            
            success, error = insert_batch(batch_data, batch_num, total_batches)
            
            if success:
                successful_batches += 1
                pbar.update(len(batch))
            else:
                failed_batches.append({
                    'batch_num': batch_num,
                    'start_row': i,
                    'end_row': i + len(batch),
                    'error': error
                })
                pbar.write(f"⚠️  Batch {batch_num} failed: {error}")
            
            # Rate limiting
            if batch_num < total_batches:
                time.sleep(RATE_LIMIT_DELAY)
    
    # Step 4: Report results
    print(f"\n{'='*60}")
    print(f"✅ Import Complete!")
    print(f"{'='*60}")
    print(f"Total rows: {total_rows:,}")
    print(f"Successful batches: {successful_batches}/{total_batches}")
    print(f"Failed batches: {len(failed_batches)}")
    
    if failed_batches:
        print(f"\n⚠️  Failed Batches:")
        for fb in failed_batches:
            print(f"  Batch {fb['batch_num']} (rows {fb['start_row']}-{fb['end_row']}): {fb['error']}")
        
        # Save failed batch info
        with open('failed_batches.json', 'w') as f:
            json.dump(failed_batches, f, indent=2)
        print(f"\n💾 Failed batch details saved to: failed_batches.json")
    else:
        print(f"🎉 All batches imported successfully!")
    
    print(f"\n🔍 Verify in Supabase: {SUPABASE_URL}/project/twcofvgxitfvoedftik/editor/{TABLE_NAME}")

if __name__ == "__main__":
    main()