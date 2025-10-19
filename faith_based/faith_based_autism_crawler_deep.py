# faith_based_autism_crawler_deep.py
"""
Faith-Based ASD Resource Crawler (Florida only, 2 levels deep)
--------------------------------------------------------------
• Crawls public church directories (ChurchFinder, FaithStreet, ChurchAngel)
• Follows each church link and scans both main and ministry subpages
• Detects autism, special needs, inclusion, disability, etc.
• No Google API, no cost
• Resumable with checkpoint.json
• Safe randomized delays between requests

Dependencies:
  pip install requests beautifulsoup4 pandas tldextract
"""

import requests, time, random, json, os, re
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urljoin, urlparse

OUTPUT_CSV = "faith_based_autism_resources.csv"
CHECKPOINT_FILE = "checkpoint.json"

CHURCH_SITES = {
    "churchfinder": "https://www.churchfinder.com/churches/fl?page={}",
    "faithstreet": "https://www.faithstreet.com/locations/fl",
    "churchangel": "https://www.churchangel.com/churches/fl/page/{}/",
}

# Extensive autism/special-needs keyword net
KEYWORDS = [
    "autism", "autistic", "asperger", "asd", "neurodiverse", "neurodiversity",
    "special needs", "special-needs", "disability ministry", "inclusion ministry",
    "adaptive ministry", "buddy ministry", "access ministry", "hope ministry",
    "friendship ministry", "bridge ministry", "shine ministry", "abilities ministry",
    "joy ministry", "wonderfully made", "children with disabilities",
    "kids with disabilities", "family support", "parent support group",
    "caregiver support", "support for families", "sensory-friendly",
    "sensory friendly", "quiet room", "calm service", "inclusive service",
    "special needs sunday school", "special needs worship", "jill’s house",
    "access ministries", "ability tree", "special gathering", "friendship circle",
    "hope haven", "embrace grace", "abilities united", "behavioral support",
    "developmental delay", "disabilities program", "life skills", "day program",
    "respite", "adaptive recreation", "adhd", "down syndrome",
    "intellectual disability", "learning differences", "speech delay",
    "social skills group"
]

# Keywords that often appear in ministry subpage URLs
SUBPAGE_HINTS = [
    "minist", "serve", "outreach", "autism", "disab", "special", "inclusion",
    "abilities", "family", "kids", "youth"
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ASDDirectoryCrawler/2.0; +https://example.com)"
}

# -------------------------------------------------------------------
# SAFE HELPERS
# -------------------------------------------------------------------

def safe_pause(min_s=2.5, max_s=6.0, why=""):
    t = random.uniform(min_s, max_s)
    print(f" [pause] {why} ({t:.1f}s)")
    time.sleep(t)

def get_soup(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=25)
        if r.status_code != 200:
            print(f" [warn] {url} → {r.status_code}")
            return None
        return BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f" [error] {url}: {e}")
        return None

def keyword_hit(text):
    t = re.sub(r"[^a-z0-9\s-]", " ", text.lower())
    return any(k in t for k in KEYWORDS)

def load_checkpoint():
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r") as f:
            return json.load(f)
    return {"completed": [], "visited": []}

def save_checkpoint(cp):
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump(cp, f, indent=2)

# -------------------------------------------------------------------
# DIRECTORY PAGE CRAWLERS
# -------------------------------------------------------------------

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
        if name and link:
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
        out.append({
            "Name": name_el.get_text(strip=True),
            "URL": urljoin(url, link["href"]) if link else url,
            "Description": desc,
            "Source": "churchangel"
        })
    return out

# -------------------------------------------------------------------
# DETAIL PAGE SCANNING (2 levels deep)
# -------------------------------------------------------------------

def get_subpage_links(base_url, soup):
    links = []
    base = urlparse(base_url).netloc
    for a in soup.find_all("a", href=True):
        href = a["href"].lower()
        if any(h in href for h in SUBPAGE_HINTS):
            full = urljoin(base_url, href)
            if urlparse(full).netloc == base:
                links.append(full)
    return list(set(links))

def deep_scan(church):
    """Visit church URL and 1 layer of relevant subpages."""
    main_url = church["URL"]
    matches = []
    soup = get_soup(main_url)
    if not soup:
        return matches
    page_text = soup.get_text(" ", strip=True)
    if keyword_hit(page_text):
        matches.append({
            **church,
            "MatchPage": main_url,
            "MatchType": "main",
            "MatchSnippet": page_text[:500]
        })
    # follow subpages
    sublinks = get_subpage_links(main_url, soup)
    for sub in sublinks[:10]:
        sub_soup = get_soup(sub)
        if not sub_soup:
            continue
        sub_text = sub_soup.get_text(" ", strip=True)
        if keyword_hit(sub_text):
            matches.append({
                **church,
                "MatchPage": sub,
                "MatchType": "subpage",
                "MatchSnippet": sub_text[:500]
            })
        safe_pause(1.5, 3.5, "subpage")
    return matches

# -------------------------------------------------------------------
# MAIN
# -------------------------------------------------------------------

def main():
    checkpoint = load_checkpoint()
    results = []

    print("[start] Deep faith-based ASD crawler (2-level scan, no Google API)…")

    # Stage 1: collect all church listings
    listings = []

    # ChurchFinder (up to 50 pages)
    for page in range(1, 51):
        ident = f"churchfinder_{page}"
        if ident in checkpoint["completed"]:
            continue
        batch = crawl_churchfinder(page)
        listings.extend(batch)
        checkpoint["completed"].append(ident)
        save_checkpoint(checkpoint)
        print(f" [churchfinder] page {page}: {len(batch)} churches")
        safe_pause(3, 6, "churchfinder")

    # FaithStreet
    if "faithstreet" not in checkpoint["completed"]:
        batch = crawl_faithstreet()
        listings.extend(batch)
        checkpoint["completed"].append("faithstreet")
        save_checkpoint(checkpoint)
        print(f" [faithstreet]: {len(batch)} churches")
        safe_pause(3, 6, "faithstreet")

    # ChurchAngel (up to 40 pages)
    for page in range(1, 41):
        ident = f"churchangel_{page}"
        if ident in checkpoint["completed"]:
            continue
        batch = crawl_churchangel(page)
        listings.extend(batch)
        checkpoint["completed"].append(ident)
        save_checkpoint(checkpoint)
        print(f" [churchangel] page {page}: {len(batch)} churches")
        safe_pause(3, 6, "churchangel")

    # Stage 2: Deep scan each church
    print(f"\n[info] Total churches queued for deep scan: {len(listings)}")

    for i, church in enumerate(listings, start=1):
        url = church["URL"]
        if url in checkpoint["visited"]:
            continue
        print(f"\n[{i}/{len(listings)}] Scanning {url}")
        hits = deep_scan(church)
        if hits:
            print(f"  [match] Found {len(hits)} page(s) mentioning keywords.")
            results.extend(hits)
        else:
            print("  [none] No match keywords found.")
        checkpoint["visited"].append(url)
        save_checkpoint(checkpoint)
        safe_pause(3, 7, "between churches")

    # Save results
    if results:
        df = pd.DataFrame(results)
        df.drop_duplicates(subset=["MatchPage"], inplace=True)
        df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")
        print(f"\n[done] Saved {len(df)} matches → {OUTPUT_CSV}")
    else:
        print("[done] No matches found.")

if __name__ == "__main__":
    main()
