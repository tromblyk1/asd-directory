# faith_based_autism_crawler_playwright.py
"""
Faith-Based ASD Resource Crawler (Florida, Playwright version)
--------------------------------------------------------------
- Uses Playwright headless Chromium to render JS-heavy pages.
- Crawls ChurchFinder, FaithStreet, and ChurchAngel listings.
- Follows each church link + 1 level of subpages.
- Searches for autism/special-needs/disability ministry keywords.
- Resumable via checkpoint.json.

Dependencies:
  pip install playwright pandas beautifulsoup4 tldextract
  playwright install
"""

import asyncio, json, os, random, re, time
import pandas as pd
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from playwright.async_api import async_playwright

OUTPUT_CSV = "faith_based_autism_resources.csv"
CHECKPOINT_FILE = "checkpoint.json"

CHURCH_SITES = {
    "churchfinder": "https://www.churchfinder.com/churches/fl?page={}",
    "faithstreet": "https://www.faithstreet.com/locations/fl",
    "churchangel": "https://www.churchangel.com/churches/fl/"
}

KEYWORDS = [
    "autism", "autistic", "asperger", "asd", "neurodiverse", "neurodiversity",
    "special needs", "special-needs", "disability ministry", "inclusion ministry",
    "adaptive ministry", "buddy ministry", "access ministry", "hope ministry",
    "friendship ministry", "bridge ministry", "shine ministry", "abilities ministry",
    "joy ministry", "wonderfully made", "children with disabilities",
    "kids with disabilities", "family support", "parent support group",
    "caregiver support", "support for families", "sensory-friendly",
    "sensory friendly", "quiet room", "calm service", "inclusive service",
    "special needs sunday school", "special needs worship", "ability tree",
    "friendship circle", "hope haven", "embrace grace", "disabilities program",
    "adaptive recreation", "adhd", "down syndrome", "intellectual disability",
    "learning differences", "speech delay", "social skills group"
]

SUBPAGE_HINTS = [
    "minist", "serve", "outreach", "autism", "disab", "special", "inclusion",
    "abilities", "family", "kids", "youth"
]

# -------------------------------------------
# Utility helpers
# -------------------------------------------

def keyword_hit(text):
    t = re.sub(r"[^a-z0-9\s-]", " ", text.lower())
    return any(k in t for k in KEYWORDS)

def safe_pause(min_s=2.5, max_s=6.0, why=""):
    t = random.uniform(min_s, max_s)
    print(f" [pause] {why} ({t:.1f}s)")
    time.sleep(t)

def load_checkpoint():
    if os.path.exists(CHECKPOINT_FILE):
        with open(CHECKPOINT_FILE, "r") as f:
            return json.load(f)
    return {"completed": [], "visited": []}

def save_checkpoint(cp):
    with open(CHECKPOINT_FILE, "w") as f:
        json.dump(cp, f, indent=2)

# -------------------------------------------
# Core async crawl logic
# -------------------------------------------

async def fetch_html(page, url, wait_selector=None):
    try:
        await page.goto(url, timeout=60000)
        if wait_selector:
            try:
                await page.wait_for_selector(wait_selector, timeout=15000)
            except Exception:
                pass
        html = await page.content()
        return html
    except Exception as e:
        print(f" [warn] failed to load {url}: {e}")
        return ""

async def scrape_listings(playwright):
    browser = await playwright.chromium.launch(headless=True)
    context = await browser.new_context()
    page = await context.new_page()

    all_listings = []

    # --- ChurchFinder ---
    for i in range(1, 51):
        url = CHURCH_SITES["churchfinder"].format(i)
        html = await fetch_html(page, url, ".church-item")
        soup = BeautifulSoup(html, "html.parser")
        cards = soup.select(".church-item, .cf-church-item")
        if not cards:
            print(f" [churchfinder] page {i}: no results")
            continue
        for c in cards:
            name_el = c.find("h2")
            link = c.find("a", href=True)
            desc = c.get_text(" ", strip=True)
            if name_el and link:
                all_listings.append({
                    "Name": name_el.get_text(strip=True),
                    "URL": urljoin(url, link["href"]),
                    "Description": desc,
                    "Source": "churchfinder"
                })
        print(f" [churchfinder] page {i}: {len(cards)} listings")
        safe_pause(3, 6, "churchfinder")

    # --- FaithStreet ---
    url = CHURCH_SITES["faithstreet"]
    html = await fetch_html(page, url, "a[href*='/churches/']")
    soup = BeautifulSoup(html, "html.parser")
    links = soup.select("a[href*='/churches/']")
    for a in links:
        full = urljoin(url, a["href"])
        text = a.get_text(" ", strip=True)
        if "/churches/" in full:
            all_listings.append({
                "Name": text,
                "URL": full,
                "Description": text,
                "Source": "faithstreet"
            })
    print(f" [faithstreet] {len(links)} listings")

    # --- ChurchAngel ---
    url = CHURCH_SITES["churchangel"]
    html = await fetch_html(page, url, ".listing")
    soup = BeautifulSoup(html, "html.parser")
    blocks = soup.select(".listing, .church-item")
    for b in blocks:
        name_el = b.find(["h3", "h2", "a"])
        if not name_el:
            continue
        link = name_el.find("a", href=True)
        desc = b.get_text(" ", strip=True)
        all_listings.append({
            "Name": name_el.get_text(strip=True),
            "URL": urljoin(url, link["href"]) if link else url,
            "Description": desc,
            "Source": "churchangel"
        })
    print(f" [churchangel] {len(blocks)} listings")

    await context.close()
    await browser.close()
    return all_listings

async def deep_scan(playwright, listings, checkpoint):
    results = []
    browser = await playwright.chromium.launch(headless=True)
    context = await browser.new_context()
    page = await context.new_page()

    for i, church in enumerate(listings, start=1):
        url = church["URL"]
        if url in checkpoint["visited"]:
            continue
        print(f"\n[{i}/{len(listings)}] Scanning {url}")

        # main page
        html = await fetch_html(page, url)
        if not html:
            continue
        soup = BeautifulSoup(html, "html.parser")
        text = soup.get_text(" ", strip=True)
        if keyword_hit(text):
            snippet = text[:500]
            results.append({**church, "MatchPage": url, "MatchType": "main", "MatchSnippet": snippet})
            print("  [match] main page")

        # subpages
        sublinks = []
        for a in soup.find_all("a", href=True):
            href = a["href"].lower()
            if any(h in href for h in SUBPAGE_HINTS):
                full = urljoin(url, href)
                if urlparse(full).netloc == urlparse(url).netloc:
                    sublinks.append(full)
        sublinks = list(set(sublinks))[:10]

        for sub in sublinks:
            html_sub = await fetch_html(page, sub)
            soup_sub = BeautifulSoup(html_sub, "html.parser")
            text_sub = soup_sub.get_text(" ", strip=True)
            if keyword_hit(text_sub):
                snippet = text_sub[:500]
                results.append({**church, "MatchPage": sub, "MatchType": "subpage", "MatchSnippet": snippet})
                print(f"  [match] {sub}")
            safe_pause(2, 4, "subpage")

        checkpoint["visited"].append(url)
        save_checkpoint(checkpoint)
        safe_pause(3, 6, "between churches")

    await context.close()
    await browser.close()
    return results

async def main():
    checkpoint = load_checkpoint()
    results = []

    async with async_playwright() as p:
        listings = await scrape_listings(p)
        print(f"[info] Found {len(listings)} total church listings.")
        results = await deep_scan(p, listings, checkpoint)

    if results:
        df = pd.DataFrame(results)
        df.drop_duplicates(subset=["MatchPage"], inplace=True)
        df.to_csv(OUTPUT_CSV, index=False, encoding="utf-8")
        print(f"\n[done] Saved {len(df)} matches → {OUTPUT_CSV}")
    else:
        print("[done] No matches found.")

if __name__ == "__main__":
    asyncio.run(main())
