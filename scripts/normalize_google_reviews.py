"""
normalize_google_reviews.py
----------------------------------------
Cleans, merges, and deduplicates Google review data
for the ASD Directory project.

Inputs:
- data/google_reviews.csv
- data/google_reviews_rows.csv

Output:
- data/google_reviews_canonical.csv
"""

import pandas as pd
from pathlib import Path

# Define paths
BASE = Path(__file__).resolve().parent.parent / "data"
INPUT_FILES = [
    BASE / "google_reviews.csv",
    BASE / "google_reviews_rows.csv"
]
OUTPUT_FILE = BASE / "google_reviews_canonical.csv"

# Load and merge available files
dfs = []
for f in INPUT_FILES:
    if f.exists():
        print(f"Loading {f.name} ...")
        df = pd.read_csv(f)
        dfs.append(df)
    else:
        print(f"⚠️ Skipped missing file: {f.name}")

if not dfs:
    raise FileNotFoundError("No google_reviews CSV files found in /data folder.")

merged = pd.concat(dfs, ignore_index=True)

# Normalize column names (lowercase, underscores)
merged.columns = [c.strip().lower().replace(" ", "_") for c in merged.columns]

# Drop duplicates by place_id + review_text if present
dedup_cols = [c for c in ["place_id", "review_text"] if c in merged.columns]
if dedup_cols:
    before = len(merged)
    merged.drop_duplicates(subset=dedup_cols, inplace=True)
    print(f"🧹 Removed {before - len(merged)} duplicate rows based on {dedup_cols}")

# Standardize numeric fields
if "rating" in merged.columns:
    merged["rating"] = pd.to_numeric(merged["rating"], errors="coerce")

if "review_count" in merged.columns:
    merged["review_count"] = pd.to_numeric(merged["review_count"], errors="coerce")

# Drop fully empty rows
merged.dropna(how="all", inplace=True)

# Save canonical dataset
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
merged.to_csv(OUTPUT_FILE, index=False)
print(f"✅ Canonical Google reviews saved to: {OUTPUT_FILE}")

# Summary report
summary = {
    "total_rows": len(merged),
    "unique_place_ids": merged["place_id"].nunique() if "place_id" in merged.columns else "N/A",
    "columns": list(merged.columns)
}
print("\n📊 Summary:")
for k, v in summary.items():
    print(f"  {k}: {v}")
