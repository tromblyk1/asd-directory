# faith_based_autism_crawler.py
"""
Faith-Based ASD Resource Crawler (Florida only)
------------------------------------------------
- Crawls free public church directories (no APIs)
- Looks for autism/special-needs/disability ministries
- Writes matches to CSV
- Resumable via checkpoint.json

Dependencies:
  pip install requests beautifulsoup4 pandas tldextract
"""

import requests, time, random, json, csv, os, re
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urljoin

# -----------------------------------
# CONFIGURATION
# -----------------------------------

OUTPUT_CSV = "faith_based_autism_resources.csv"
CHECKPOINT_FILE = "checkpoint.json"

CHURCH_SITES = {
    "churchfinder": "https://www.churchfinder.com/churches/fl?page={}",
    "faithstreet": "https://www.faithstreet.com/locations/fl",
    "churchangel": "https://www.churchangel.com/churches/fl/page/{}/",
}

KEYWORDS = [
    "autism", "special needs", "neurodiverse",
    "disability ministry", "inclusion ministry",
    "adaptive", "sensory friendly", "autistic", "aspi"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ASDDirectoryCrawler/1.0; +https://example.com)"
}

# -----------------------------------
# HELPERS
# -----------------------------------

def safe_pause(min_s=2.5, max_s=6.0, why=""):
    t = random.uniform(min_s, max_s)
    print(f" [pause] {why} ({t:.1f}s)")
    time.sleep(t)

def load_checkpoint():
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r") as f:
            return json.load(f)
    return {"completed": []}

def save_checkpoint(checkpoint):
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump(checkpoint, f, indent=2)

def get_soup(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        if r.status_code != 200:
            print(f" [warn] {url} returned {r.status_code}")
            return None
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f" [error] {url}: {e}")
        return None

def keyword_hit(text):
    t = text.lower()
    return any(k in t for k in KEYWORDS)

def extract_links(soup, base_url):
    links = []
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if re.search(r"/church(es)?/", href) or "church" in href:
            full = urljoin(base_url, href)
            links.append(full)
    return list(set(links))

# -----------------------------------
# SCRAPE FUNCTIONS
# -----------------------------------

def crawl_churchfinder(page=1):
    url = CHURCH_SITES["churchfinder"].format(page)
    soup = get_soup(url)
    if not soup:
        return []
    cards = soup.select(".church-item, .cf-church-item")
    out = []
    for c in cards:
        name = c.find("h2")
        link = c.find("a", href=True)
        desc = c.get_text(" ", strip=True)
        if not name or not link:
            continue
        if keyword_hit(desc):
            out.append({
                "Name": name.get_text(strip=True),
                "URL": urljoin(url, link["href"]),
                "Description": desc,
                "Source": "churchfinder"
            })
    return out

def crawl_faithstreet():
    url = CHURCH_SITES["faithstreet"]
    soup = get_soup(url)
    if not soup:
        return []
    out = []
    for a in soup.select("a[href*='/churches/']"):
        full = urljoin(url, a["href"])
        text = a.get_text(" ", strip=True)
        if keyword_hit(text):
            out.append({"Name": text, "URL": full, "Description": text, "Source": "faithstreet"})
    return out

def crawl_churchangel(page=1):
    url = CHURCH_SITES["churchangel"].format(page)
    soup = get_soup(url)
    if not soup:
        return []
    out = []
    blocks = soup.select(".listing, .church-item")
    for b in blocks:
        name_el = b.find(["h3", "h2", "a"])
        if not name_el:
            continue
        link = name_el.find("a", href=True)
        desc = b.get_text(" ", strip=True)
        if keyword_hit(desc):
            out.append({
                "Name": name_el.get_text(strip=True),
                "URL": urljoin(url, link["href"]) if link else url,
                "Description": desc,
                "Source": "churchangel"
            })
    return out

# -----------------------------------
# MAIN
# -----------------------------------

def main():
    checkpoint = load_checkpoint()
    results = []

    print("[start] Faith-based ASD crawler running…")

    # ChurchFinder pagination: first ~50 pages max
    for page in range(1, 51):
        ident = f"churchfinder_{page}"
        if ident in checkpoint["completed"]:
            continue
        batch = crawl_churchfinder(page)
        print(f" [churchfinder] page {page}: {len(batch)} matches")
        results.extend(batch)
        checkpoint["completed"].append(ident)
        save_checkpoint(checkpoint)
        safe_pause(3, 6, "churchfinder throttle")

    # FaithStreet single page (they paginate internally by JS)
    ident = "faithstreet"
    if ident not in checkpoint["completed"]:
        batch = crawl_faithstreet()
        print(f" [faithstreet]: {len(batch)} matches")
        results.extend(batch)
        checkpoint["completed"].append(ident)
        save_checkpoint(checkpoint)
        safe_pause(3, 6, "faithstreet pause")

    # ChurchAngel pagination
    for page in range(1, 41):
        ident = f"churchangel_{page}"
        if ident in checkpoint["completed"]:
            continue
        batch = crawl_churchangel(page)
        print(f" [churchangel] page {page}: {len(batch)} matches")
        results.extend(batch)
        checkpoint["completed"].append(ident)
        save_checkpoint(checkpoint)
        safe_pause(3, 6, "churchangel throttle")

    # Save results
    if results:
        df = pd.DataFrame(results)
        df.drop_duplicates(subset=["URL"], inplace=True)
        df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")
        print(f"\n[done] Saved {len(df)} total matches → {OUTPUT_CSV}")
    else:
        print("[done] No matches found.")

if __name__ == "__main__":
    main()
