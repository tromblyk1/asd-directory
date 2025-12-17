"""
ASD DIRECTORY PROJECT & SUPABASE INVESTIGATION
===============================================
This script will:
1. Scan your local C:\Projects\ASD-Directory folder
2. Find which files contain Brain & Mind Institute
3. Connect to Supabase and check ALL tables for Brain & Mind
4. Identify which table your website actually uses
5. Generate a fix strategy

Run this from anywhere on your computer.
"""

import os
import pandas as pd
from pathlib import Path
import json

try:
    from supabase import create_client, Client
    SUPABASE_AVAILABLE = True
except ImportError:
    SUPABASE_AVAILABLE = False
    print("⚠️  Supabase library not installed. Install with: pip install supabase")

# Configuration
PROJECT_DIR = r"C:\Projects\ASD-Directory"
SEARCH_TERM = "Brain and Mind"

def scan_local_project():
    """Scan the local ASD Directory project for Brain & Mind Institute."""
    
    print("\n" + "="*70)
    print("PART 1: SCANNING LOCAL PROJECT")
    print("="*70 + "\n")
    
    if not Path(PROJECT_DIR).exists():
        print(f"❌ Project directory not found: {PROJECT_DIR}")
        print("\nPlease update PROJECT_DIR in the script to your actual path.")
        return None
    
    print(f"📁 Scanning: {PROJECT_DIR}\n")
    
    # Find all CSV and JSON files
    csv_files = list(Path(PROJECT_DIR).rglob("*.csv"))
    json_files = list(Path(PROJECT_DIR).rglob("*.json"))
    
    print(f"Found {len(csv_files)} CSV files and {len(json_files)} JSON files\n")
    
    matches = []
    
    # Search CSV files
    for csv_file in csv_files:
        try:
            df = pd.read_csv(csv_file, encoding='utf-8-sig', low_memory=False)
            
            # Search all columns for Brain & Mind
            mask = df.astype(str).apply(
                lambda col: col.str.contains(SEARCH_TERM, case=False, na=False)
            ).any(axis=1)
            
            if mask.any():
                matching_rows = df[mask]
                matches.append({
                    'file': str(csv_file),
                    'type': 'CSV',
                    'rows': len(matching_rows),
                    'data': matching_rows
                })
                
                print(f"✅ FOUND in: {csv_file.name}")
                print(f"   Location: {csv_file.parent}")
                print(f"   Rows: {len(matching_rows)}")
                
                # Check for ABA flag
                for idx, row in matching_rows.iterrows():
                    if 'Services_Offered' in row.index:
                        services = str(row['Services_Offered'])
                        if 'ABA' in services:
                            print(f"   ⚠️  HAS ABA FLAG: {services}")
                        else:
                            print(f"   ✓ No ABA flag: {services}")
                    elif 'ABA' in row.index:
                        if str(row['ABA']).upper() == 'TRUE':
                            print(f"   ⚠️  HAS ABA FLAG: TRUE")
                        else:
                            print(f"   ✓ No ABA flag")
                
                print()
        except Exception as e:
            pass
    
    # Search JSON files (for config files)
    for json_file in json_files[:50]:  # Limit to first 50 to avoid huge files
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                content = f.read()
                if SEARCH_TERM.lower() in content.lower():
                    print(f"✅ FOUND in: {json_file.name}")
                    print(f"   Location: {json_file.parent}\n")
                    matches.append({
                        'file': str(json_file),
                        'type': 'JSON',
                        'rows': 1,
                        'data': None
                    })
        except:
            pass
    
    if not matches:
        print("❌ Brain & Mind Institute NOT found in local project files")
    
    return matches

def check_supabase_tables():
    """Check ALL Supabase tables for Brain & Mind Institute."""
    
    print("\n" + "="*70)
    print("PART 2: CHECKING SUPABASE TABLES")
    print("="*70 + "\n")
    
    if not SUPABASE_AVAILABLE:
        print("❌ Cannot check Supabase - library not installed")
        return None
    
    # Get credentials
    supabase_url = input("Enter Supabase URL: ")
    supabase_key = input("Enter Supabase API Key (service_role): ")
    
    if not supabase_url or not supabase_key:
        print("❌ Missing credentials")
        return None
    
    try:
        supabase: Client = create_client(supabase_url, supabase_key)
        print("✓ Connected to Supabase\n")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return None
    
    # Tables to check (from your screenshot)
    tables_to_check = [
        "providers",
        "providers_full",
        "provider_services_wide",
        "provider_services_wide_deduped",
        "provider_services_wide_merged",
        "staging_google_providers"
    ]
    
    results = {}
    
    for table in tables_to_check:
        print(f"🔍 Checking table: {table}")
        
        try:
            # Get row count
            count_response = supabase.table(table).select("*", count="exact").limit(1).execute()
            total_rows = count_response.count
            
            print(f"   Total rows: {total_rows:,}")
            
            # Search for Brain & Mind (try different column names)
            search_columns = [
                "provider_name", "ProviderName", "Provider", "name",
                "Provider_Name", "business_name"
            ]
            
            found = False
            for col in search_columns:
                try:
                    response = supabase.table(table)\
                        .select("*")\
                        .ilike(col, "%Brain and Mind%")\
                        .execute()
                    
                    if response.data:
                        found = True
                        print(f"   ✅ FOUND Brain & Mind Institute!")
                        print(f"      Column: {col}")
                        print(f"      Matches: {len(response.data)}")
                        
                        # Check for ABA flag
                        for record in response.data:
                            services = record.get('Services_Offered') or record.get('service_type') or record.get('services')
                            if services and 'ABA' in str(services):
                                print(f"      ⚠️  HAS ABA FLAG: {services}")
                            else:
                                print(f"      ✓ No ABA flag")
                        
                        results[table] = response.data
                        break
                except:
                    continue
            
            if not found:
                print(f"   ❌ Brain & Mind NOT found")
            
            print()
            
        except Exception as e:
            print(f"   ⚠️  Error checking table: {e}\n")
    
    return results

def find_website_data_source():
    """Try to identify which file/table the website uses."""
    
    print("\n" + "="*70)
    print("PART 3: IDENTIFYING WEBSITE DATA SOURCE")
    print("="*70 + "\n")
    
    # Look for common web framework files
    web_files = [
        "pages/**/*.js",
        "pages/**/*.jsx", 
        "pages/**/*.ts",
        "pages/**/*.tsx",
        "app/**/*.js",
        "app/**/*.jsx",
        "src/**/*.js",
        "src/**/*.jsx",
        "components/**/*.js",
        "lib/**/*.js",
        "utils/**/*.js",
    ]
    
    supabase_queries = []
    
    for pattern in web_files:
        files = list(Path(PROJECT_DIR).glob(pattern))
        
        for file in files:
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Look for Supabase queries
                    if 'supabase' in content.lower():
                        # Find table references
                        import re
                        table_refs = re.findall(r'\.from\([\'"](\w+)[\'"]\)', content)
                        table_refs += re.findall(r'table\([\'"](\w+)[\'"]\)', content)
                        
                        if table_refs:
                            supabase_queries.append({
                                'file': str(file.relative_to(PROJECT_DIR)),
                                'tables': list(set(table_refs))
                            })
            except:
                pass
    
    if supabase_queries:
        print("📊 Found Supabase queries in your code:\n")
        
        table_usage = {}
        for query in supabase_queries:
            print(f"📄 {query['file']}")
            for table in query['tables']:
                print(f"   → Uses table: {table}")
                table_usage[table] = table_usage.get(table, 0) + 1
            print()
        
        print("\n📈 Most frequently used tables:")
        for table, count in sorted(table_usage.items(), key=lambda x: x[1], reverse=True):
            print(f"   {table}: {count} references")
        
        return table_usage
    else:
        print("⚠️  Could not find Supabase queries in code")
        print("   Your website might be using:")
        print("   • A different backend")
        print("   • Static JSON files")
        print("   • A different database")
    
    return None

def generate_fix_strategy(local_matches, supabase_results, table_usage):
    """Generate a fix strategy based on findings."""
    
    print("\n" + "="*70)
    print("FIX STRATEGY")
    print("="*70 + "\n")
    
    if supabase_results:
        print("🎯 SUPABASE STRATEGY:")
        print("-"*70)
        
        for table, data in supabase_results.items():
            print(f"\nTable: {table}")
            print(f"  • Contains Brain & Mind Institute: YES")
            print(f"  • Needs fixing: YES")
            print(f"  • Action: Run UPDATE query to remove ABA flag")
            
            if table_usage and table in table_usage:
                print(f"  • Used by website: YES ({table_usage[table]} references)")
                print(f"  • Priority: HIGH ⚠️")
            else:
                print(f"  • Used by website: UNKNOWN")
                print(f"  • Priority: MEDIUM")
    
    if local_matches:
        print("\n\n📁 LOCAL FILES STRATEGY:")
        print("-"*70)
        
        for match in local_matches:
            print(f"\nFile: {Path(match['file']).name}")
            print(f"  • Location: {match['file']}")
            print(f"  • Contains Brain & Mind: YES")
            print(f"  • Needs fixing: YES")
            print(f"  • Action: Run Python fix script")
    
    print("\n\n" + "="*70)
    print("RECOMMENDED NEXT STEPS:")
    print("="*70)
    print("\n1. If Brain & Mind found in Supabase:")
    print("   → Use SQL UPDATE to remove ABA flag")
    print("   → Focus on tables with HIGH priority")
    print("\n2. If Brain & Mind found in local files:")
    print("   → Run fix_and_upload.py on those files")
    print("   → Then sync to Supabase")
    print("\n3. If website uses specific table:")
    print("   → Prioritize fixing that table first")
    print("   → Test website immediately after")
    print("\n4. Create backup before ANY changes!")
    print("="*70 + "\n")

def main():
    print("\n" + "="*70)
    print("ASD DIRECTORY DATA SOURCE INVESTIGATION")
    print("="*70)
    print("\nThis will:")
    print("  1. Scan C:\\Projects\\ASD-Directory for Brain & Mind")
    print("  2. Check ALL Supabase tables")
    print("  3. Identify which data source your website uses")
    print("  4. Generate a fix strategy")
    print("="*70 + "\n")
    
    # Part 1: Scan local project
    local_matches = scan_local_project()
    
    # Part 2: Check Supabase
    supabase_results = check_supabase_tables()
    
    # Part 3: Find website data source
    table_usage = find_website_data_source()
    
    # Part 4: Generate fix strategy
    generate_fix_strategy(local_matches, supabase_results, table_usage)
    
    print("\n✅ Investigation complete!")
    print("\nNext: Run the appropriate fix script based on the strategy above.")

if __name__ == "__main__":
    main()