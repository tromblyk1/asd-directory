"""
sanitize_google_reviews_for_supabase.py
---------------------------------------
Cleans the canonical Google Reviews CSV to ensure all columns
are compatible with Supabase import (no invalid timestamps or numerics).
"""

import pandas as pd
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent / "data"
INPUT = BASE / "google_reviews_canonical.csv"
OUTPUT = BASE / "google_reviews_canonical_supabase.csv"

print(f"🔍 Loading {INPUT} ...")
df = pd.read_csv(INPUT, dtype=str)  # force everything to string first

# Remove hidden characters and whitespace
df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

# Coerce numerics
if "reviewer_rating" in df.columns:
    df["reviewer_rating"] = pd.to_numeric(df["reviewer_rating"], errors="coerce")

# Coerce timestamps
for col in ["review_time", "fetched_at", "created_at"]:
    if col in df.columns:
        df[col] = pd.to_datetime(df[col], errors="coerce").astype("datetime64[ns]")

# Drop columns not in the table (just in case)
allowed_cols = [
    "provider_name", "provider_phone", "google_place_id",
    "reviewer_name", "reviewer_rating", "review_text",
    "review_time", "relative_time", "profile_photo",
    "fetched_at", "created_at", "review_text_search"
]
df = df[[c for c in df.columns if c in allowed_cols]]

# Drop completely empty rows
df.dropna(how="all", inplace=True)

print(f"✅ Saving clean file to: {OUTPUT}")
df.to_csv(OUTPUT, index=False)
print(f"Rows: {len(df)}, Columns: {list(df.columns)}")
