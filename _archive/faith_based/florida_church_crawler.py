"""
Comprehensive Web Crawler for ASD-Friendly Faith-Based Entities in Florida
Configured to run from: C:\Projects\ASD-Directory\faith_based
Uses multiple search engines and exhaustive keyword combinations
"""

import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
from urllib.parse import quote_plus, urljoin
from datetime import datetime
import re
import json
import os
from pathlib import Path

class FloridaChurchCrawler:
    def __init__(self):
        # Set up directory structure
        self.base_dir = Path(r"C:\Projects\ASD-Directory\faith_based")
        self.results_dir = self.base_dir / "results"
        self.progress_dir = self.base_dir / "progress"
        self.logs_dir = self.base_dir / "logs"
        
        # Create directories if they don't exist
        self.results_dir.mkdir(parents=True, exist_ok=True)
        self.progress_dir.mkdir(parents=True, exist_ok=True)
        self.logs_dir.mkdir(parents=True, exist_ok=True)
        
        self.results = []
        self.visited_urls = set()
        self.session = requests.Session()
        
        # Rotate through realistic user agents
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
        ]
        
        self.update_headers()
        
        # Rate limiting configuration
        self.request_count = 0
        self.last_request_time = time.time()
        self.min_delay = 3
        self.max_delay = 8
        self.requests_per_minute = 10
        self.cooldown_after = 50
        self.long_cooldown = 60
        
        # Initialize log file
        self.log_file = self.logs_dir / f"crawl_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        self.log(f"Crawler initialized at {datetime.now()}")
        self.log(f"Base directory: {self.base_dir}")
    
    def log(self, message):
        """Write to log file and print to console"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        with open(self.log_file, 'a', encoding='utf-8') as f:
            f.write(log_message + '\n')
    
    def update_headers(self):
        """Rotate user agent and update headers to appear more human"""
        self.session.headers.update({
            'User-Agent': random.choice(self.user_agents),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
        })
    
    def smart_delay(self):
        """Implement intelligent rate limiting with randomization"""
        self.request_count += 1
        
        if self.request_count % self.cooldown_after == 0:
            self.log(f"⏸️  Taking extended cooldown ({self.long_cooldown}s) after {self.request_count} requests...")
            time.sleep(self.long_cooldown)
            self.update_headers()
            return
        
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        
        if time_since_last < self.min_delay:
            extra_delay = self.min_delay - time_since_last
            base_delay = random.uniform(self.min_delay, self.max_delay)
            total_delay = base_delay + extra_delay
        else:
            total_delay = random.uniform(self.min_delay, self.max_delay)
        
        if random.random() < 0.1:
            total_delay += random.uniform(5, 15)
            self.log(f"   💤 Random extended pause: {total_delay:.1f}s")
        
        time.sleep(total_delay)
        self.last_request_time = time.time()
        
        if self.request_count % 10 == 0:
            self.update_headers()
        
    def generate_search_queries(self):
        """Generate exhaustive combinations of search terms"""
        
        locations = [
            "Florida", "Miami", "Tampa", "Orlando", "Jacksonville", "St Petersburg",
            "Hialeah", "Tallahassee", "Fort Lauderdale", "Port St Lucie", "Cape Coral",
            "Pembroke Pines", "Hollywood", "Miramar", "Gainesville", "Coral Springs",
            "Miami Gardens", "Clearwater", "Palm Bay", "Pompano Beach", "West Palm Beach",
            "Lakeland", "Davie", "Miami Beach", "Plantation", "Sunrise", "Boca Raton",
            "Deltona", "Largo", "Deerfield Beach", "Palm Coast", "Melbourne", "Boynton Beach",
            "Lauderhill", "Weston", "Fort Myers", "Kissimmee", "Homestead", "Tamarac",
            "Delray Beach", "Daytona Beach", "North Miami", "Wellington", "North Port",
            "Jupiter", "Ocala", "Port Orange", "Margate", "Coconut Creek", "Sanford",
            "Sarasota", "Pensacola", "Bradenton", "Palm Beach Gardens", "Pinellas Park",
            "Coral Gables", "Doral", "Bonita Springs", "Apopka", "Titusville", "Naples",
            "Fort Pierce", "Oakland Park", "North Miami Beach", "Altamonte Springs",
            "St Cloud", "Greenacres", "Ormond Beach", "Ocoee", "Hallandale Beach",
            "Winter Garden", "Aventura", "Clermont", "Panama City", "Riverview"
        ]
        
        entities = [
            "church", "churches", "parish", "congregation", "chapel", "ministry",
            "catholic church", "baptist church", "methodist church", "lutheran church",
            "presbyterian church", "episcopal church", "pentecostal church",
            "non-denominational church", "evangelical church", "assemblies of god",
            "church of christ", "seventh-day adventist", "nazarene church",
            "wesleyan church", "reformed church", "orthodox church", "synagogue",
            "temple", "mosque", "christian church", "protestant church", "megachurch",
            "community church", "bible church", "worship center", "faith community"
        ]
        
        accommodations = [
            "autism friendly", "autism", "autistic", "ASD", "autism spectrum",
            "sensory friendly", "sensory sensitive", "sensory room", "quiet room",
            "special needs", "neurodivergent", "neurodiverse", "disability accommodations",
            "inclusive", "accessibility", "adaptive", "modified service",
            "low sensory", "calm environment", "noise reducing", "sensory processing",
            "SPD", "ADHD friendly", "developmental disabilities", "cognitive disabilities",
            "buddy program", "peer support", "one-on-one support", "respite care",
            "visual schedule", "social story", "communication devices", "AAC",
            "wheelchair accessible", "mobility accommodations", "assistive technology",
            "therapeutic support", "behavioral support", "calm space", "break room",
            "headphones available", "fidget toys", "weighted blankets", "dimmed lights",
            "flexible seating", "early service", "separate room", "quiet worship",
            "streaming service", "online worship", "alternative format",
            "individualized support", "trained staff", "autism trained",
            "sensory integration", "overstimulation", "stimming friendly"
        ]
        
        descriptors = [
            "ministry for", "program for", "services for", "supports",
            "welcoming", "accepting", "inclusive of", "accommodating",
            "specialized", "adapted", "modified", "tailored to"
        ]
        
        queries = []
        
        for loc in locations:
            for entity in entities:
                for acc in accommodations:
                    queries.append(f"{entity} {acc} {loc}")
                    queries.append(f"{acc} {entity} {loc}")
                    queries.append(f"{loc} {entity} {acc}")
        
        for loc in locations[:20]:
            for desc in descriptors:
                for acc in accommodations[:15]:
                    for entity in entities[:10]:
                        queries.append(f"{loc} {entity} {desc} {acc}")
        
        programs = [
            "buddy ministry", "special needs ministry", "sensory worship",
            "autism sunday school", "adaptive worship", "inclusion ministry",
            "disability ministry", "accessible worship", "calm service"
        ]
        
        for loc in locations[:30]:
            for prog in programs:
                queries.append(f"{prog} {loc} Florida")
                queries.append(f"{loc} {prog}")
        
        questions = [
            "which churches have autism programs in",
            "churches with sensory rooms in",
            "autism friendly worship in",
            "where can I find special needs church in",
            "best churches for autism in",
            "sensory friendly services in"
        ]
        
        for loc in locations[:25]:
            for q in questions:
                queries.append(f"{q} {loc} Florida")
        
        return list(set(queries))
    
    def search_duckduckgo(self, query, retry_count=0):
        """Search using DuckDuckGo HTML with retry logic"""
        max_retries = 3
        results = []
        
        try:
            self.smart_delay()
            
            url = f"https://html.duckduckgo.com/html/?q={quote_plus(query)}"
            response = self.session.get(url, timeout=15)
            
            if response.status_code == 429:
                self.log(f"   ⚠️  Rate limited by DuckDuckGo. Waiting 60s...")
                time.sleep(60)
                if retry_count < max_retries:
                    return self.search_duckduckgo(query, retry_count + 1)
                return results
            
            if response.status_code == 403:
                self.log(f"   🚫 Access forbidden. Rotating headers and retrying...")
                self.update_headers()
                time.sleep(30)
                if retry_count < max_retries:
                    return self.search_duckduckgo(query, retry_count + 1)
                return results
            
            if response.status_code != 200:
                self.log(f"   ❌ Unexpected status code: {response.status_code}")
                return results
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for result in soup.find_all('div', class_='result'):
                title_elem = result.find('a', class_='result__a')
                snippet_elem = result.find('a', class_='result__snippet')
                
                if title_elem:
                    results.append({
                        'title': title_elem.get_text(strip=True),
                        'url': title_elem.get('href', ''),
                        'snippet': snippet_elem.get_text(strip=True) if snippet_elem else '',
                        'source': 'DuckDuckGo'
                    })
            
        except requests.exceptions.Timeout:
            self.log(f"   ⏱️  Timeout error. Retrying...")
            if retry_count < max_retries:
                time.sleep(10)
                return self.search_duckduckgo(query, retry_count + 1)
        except requests.exceptions.ConnectionError:
            self.log(f"   🔌 Connection error. Waiting before retry...")
            if retry_count < max_retries:
                time.sleep(30)
                return self.search_duckduckgo(query, retry_count + 1)
        except Exception as e:
            self.log(f"   ❌ DuckDuckGo error: {str(e)[:100]}")
        
        return results
    
    def search_bing(self, query, retry_count=0):
        """Search using Bing with enhanced anti-blocking measures"""
        max_retries = 3
        results = []
        
        try:
            self.smart_delay()
            
            url = f"https://www.bing.com/search?q={quote_plus(query)}"
            response = self.session.get(url, timeout=15)
            
            if response.status_code == 429 or 'captcha' in response.text.lower():
                self.log(f"   ⚠️  Bing rate limit or CAPTCHA detected. Extended cooldown...")
                time.sleep(120)
                self.update_headers()
                if retry_count < max_retries:
                    return self.search_bing(query, retry_count + 1)
                return results
            
            if response.status_code == 403:
                self.log(f"   🚫 Bing access forbidden. Switching strategy...")
                time.sleep(60)
                self.update_headers()
                if retry_count < max_retries:
                    return self.search_bing(query, retry_count + 1)
                return results
            
            if response.status_code != 200:
                self.log(f"   ❌ Bing status code: {response.status_code}")
                return results
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            for result in soup.find_all('li', class_='b_algo'):
                title_elem = result.find('h2')
                link_elem = result.find('a')
                snippet_elem = result.find('p')
                
                if title_elem and link_elem:
                    results.append({
                        'title': title_elem.get_text(strip=True),
                        'url': link_elem.get('href', ''),
                        'snippet': snippet_elem.get_text(strip=True) if snippet_elem else '',
                        'source': 'Bing'
                    })
            
        except requests.exceptions.Timeout:
            self.log(f"   ⏱️  Timeout. Retrying with longer timeout...")
            if retry_count < max_retries:
                time.sleep(15)
                return self.search_bing(query, retry_count + 1)
        except requests.exceptions.ConnectionError:
            self.log(f"   🔌 Connection lost. Waiting before retry...")
            if retry_count < max_retries:
                time.sleep(30)
                return self.search_bing(query, retry_count + 1)
        except Exception as e:
            self.log(f"   ❌ Bing error: {str(e)[:100]}")
        
        return results
    
    def extract_contact_info(self, soup, url):
        """Extract contact information from webpage"""
        contact_info = {
            'email': None,
            'phone': None,
            'address': None
        }
        
        text = soup.get_text()
        
        emails = re.findall(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
        if emails:
            contact_info['email'] = emails[0]
        
        phones = re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text)
        if phones:
            contact_info['phone'] = phones[0]
        
        fl_pattern = r'\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr|Lane|Ln|Way|Court|Ct|Circle|Cir)[,\s]+[\w\s]+,\s*FL\s*\d{5}'
        addresses = re.findall(fl_pattern, text, re.IGNORECASE)
        if addresses:
            contact_info['address'] = addresses[0]
        
        return contact_info
    
    def scrape_page(self, url, retry_count=0):
        """Scrape individual page with anti-blocking measures"""
        max_retries = 2
        
        if url in self.visited_urls:
            return None
        
        self.visited_urls.add(url)
        
        try:
            self.smart_delay()
            
            response = self.session.get(url, timeout=15, allow_redirects=True)
            
            if response.status_code == 403 or response.status_code == 429:
                self.log(f"   🚫 Blocked on {url[:50]}... Skipping.")
                return None
            
            if response.status_code != 200:
                return None
            
            if 'captcha' in response.text.lower() or 'robot' in response.text.lower():
                self.log(f"   🤖 CAPTCHA detected. Skipping this page.")
                return None
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            text_content = soup.get_text(separator=' ', strip=True).lower()
            
            accommodation_keywords = [
                'autism', 'sensory', 'special needs', 'neurodivergent',
                'quiet room', 'sensory room', 'adaptive', 'inclusive',
                'disability', 'accommodation', 'accessible'
            ]
            
            found_keywords = [kw for kw in accommodation_keywords if kw in text_content]
            
            if not found_keywords:
                return None
            
            contact_info = self.extract_contact_info(soup, url)
            
            programs = []
            if 'sensory room' in text_content or 'quiet room' in text_content:
                programs.append('Sensory Room')
            if 'buddy' in text_content and ('ministry' in text_content or 'program' in text_content):
                programs.append('Buddy Program')
            if 'special needs ministry' in text_content:
                programs.append('Special Needs Ministry')
            
            return {
                'url': url,
                'contact_info': contact_info,
                'found_keywords': found_keywords,
                'programs': programs,
                'text_sample': text_content[:500]
            }
            
        except requests.exceptions.Timeout:
            self.log(f"   ⏱️  Page timeout: {url[:50]}")
            return None
        except requests.exceptions.TooManyRedirects:
            self.log(f"   🔄 Too many redirects: {url[:50]}")
            return None
        except requests.exceptions.SSLError:
            self.log(f"   🔒 SSL error: {url[:50]}")
            return None
        except Exception as e:
            self.log(f"   ❌ Scrape error ({url[:50]}...): {str(e)[:80]}")
            return None
    
    def run_exhaustive_crawl(self, max_queries=500):
        """Run the complete crawling process with enhanced safety"""
        self.log("=" * 80)
        self.log("STARTING EXHAUSTIVE CRAWL")
        self.log("=" * 80)
        
        self.log("Generating search queries...")
        queries = self.generate_search_queries()
        self.log(f"Generated {len(queries)} unique search queries")
        
        queries_to_run = queries[:max_queries]
        self.log(f"Running first {len(queries_to_run)} queries...\n")
        
        all_search_results = []
        consecutive_failures = 0
        max_consecutive_failures = 5
        
        for i, query in enumerate(queries_to_run):
            self.log(f"\n[{i+1}/{len(queries_to_run)}] Query: {query[:70]}...")
            
            search_engine_choice = i % 3
            
            if search_engine_choice == 0:
                self.log("   🔍 Using DuckDuckGo")
                results = self.search_duckduckgo(query)
            elif search_engine_choice == 1:
                self.log("   🔍 Using Bing")
                results = self.search_bing(query)
            else:
                self.log("   ⏭️  Skipping (pattern variation)")
                time.sleep(random.uniform(2, 5))
                continue
            
            if not results:
                consecutive_failures += 1
                self.log(f"   ⚠️  No results ({consecutive_failures} consecutive failures)")
                
                if consecutive_failures >= max_consecutive_failures:
                    self.log(f"\n   🛑 Too many consecutive failures. Taking extended break...")
                    time.sleep(180)
                    self.update_headers()
                    consecutive_failures = 0
            else:
                consecutive_failures = 0
                self.log(f"   ✅ Found {len(results)} results")
                
                for result in results:
                    result['search_query'] = query
                    result['search_timestamp'] = datetime.now().isoformat()
                    all_search_results.append(result)
            
            if (i + 1) % 50 == 0:
                self.save_progress(all_search_results, f"search_progress_{i+1}")
                self.log(f"\n   💾 Progress saved. Total results so far: {len(all_search_results)}")
            
            if (i + 1) % 100 == 0:
                self.log(f"\n   ☕ Extended break after 100 queries (120s)...")
                time.sleep(120)
                self.update_headers()
        
        self.log(f"\n{'='*80}")
        self.log(f"SEARCH PHASE COMPLETE")
        self.log(f"Total search results collected: {len(all_search_results)}")
        self.log(f"{'='*80}\n")
        
        unique_urls = {}
        for result in all_search_results:
            url = result['url']
            if url not in unique_urls:
                unique_urls[url] = result
        
        self.log(f"Unique URLs found: {len(unique_urls)}")
        
        self.save_progress(all_search_results, "all_search_results")
        
        self.log(f"\n{'='*80}")
        self.log("DEEP SCRAPING PHASE")
        self.log(f"{'='*80}\n")
        
        detailed_results = []
        scrape_limit = min(300, len(unique_urls))
        
        for i, (url, search_result) in enumerate(list(unique_urls.items())[:scrape_limit]):
            self.log(f"[{i+1}/{scrape_limit}] Scraping: {url[:60]}...")
            
            page_data = self.scrape_page(url)
            if page_data:
                combined = {**search_result, **page_data}
                detailed_results.append(combined)
                self.log(f"   ✅ Extracted data (Keywords: {len(page_data['found_keywords'])})")
            else:
                self.log(f"   ⊘  No relevant content or blocked")
            
            if (i + 1) % 25 == 0:
                self.log(f"\n   ⏸️  Checkpoint break (30s)...")
                time.sleep(30)
                self.update_headers()
        
        self.results = detailed_results
        self.log(f"\n{'='*80}")
        self.log(f"Final detailed results: {len(detailed_results)}")
        self.log(f"{'='*80}\n")
        
        return detailed_results
    
    def save_progress(self, data, filename_suffix=""):
        """Save intermediate results to progress directory"""
        df = pd.DataFrame(data)
        filename = self.progress_dir / f"florida_churches_{filename_suffix}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        df.to_csv(filename, index=False, encoding='utf-8-sig')
        self.log(f"Progress saved to {filename}")
    
    def save_final_results(self):
        """Save final curated results to results directory"""
        if not self.results:
            self.log("No results to save")
            return
        
        df = pd.DataFrame(self.results)
        
        df['email'] = df['contact_info'].apply(lambda x: x.get('email') if isinstance(x, dict) else None)
        df['phone'] = df['contact_info'].apply(lambda x: x.get('phone') if isinstance(x, dict) else None)
        df['address'] = df['contact_info'].apply(lambda x: x.get('address') if isinstance(x, dict) else None)
        
        df['accommodation_keywords'] = df['found_keywords'].apply(lambda x: ', '.join(x) if isinstance(x, list) else '')
        df['programs_offered'] = df['programs'].apply(lambda x: ', '.join(x) if isinstance(x, list) else '')
        
        final_columns = [
            'title', 'url', 'snippet', 'email', 'phone', 'address',
            'accommodation_keywords', 'programs_offered', 'search_query',
            'source', 'search_timestamp'
        ]
        
        df_final = df[final_columns]
        
        filename = self.results_dir / f"florida_asd_friendly_churches_FINAL_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        df_final.to_csv(filename, index=False, encoding='utf-8-sig')
        self.log(f"\nFinal results saved to {filename}")
        self.log(f"Total records: {len(df_final)}")
        
        return df_final


if __name__ == "__main__":
    print("=" * 80)
    print("FLORIDA ASD-FRIENDLY CHURCHES - EXHAUSTIVE WEB CRAWLER")
    print("Running from: C:\\Projects\\ASD-Directory\\faith_based")
    print("=" * 80)
    print("\nThis crawler will:")
    print("- Generate 1000+ unique search queries")
    print("- Search multiple engines (DuckDuckGo, Bing)")
    print("- Cover all major Florida cities")
    print("- Use exhaustive accommodation terminology")
    print("- Deep scrape relevant pages")
    print("- Extract contact information")
    print("\nOutput directories:")
    print("- Results: C:\\Projects\\ASD-Directory\\faith_based\\results")
    print("- Progress: C:\\Projects\\ASD-Directory\\faith_based\\progress")
    print("- Logs: C:\\Projects\\ASD-Directory\\faith_based\\logs")
    print("\n" + "=" * 80 + "\n")
    
    crawler = FloridaChurchCrawler()
    
    results = crawler.run_exhaustive_crawl(max_queries=500)
    
    final_df = crawler.save_final_results()
    
    print("\n" + "=" * 80)
    print("CRAWL COMPLETE!")
    print("=" * 80)
    print(f"\nCheck your results in:")
    print(f"  {crawler.results_dir}")