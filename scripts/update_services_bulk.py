# update_services_bulk.py
import argparse, os, re
from datetime import datetime
import pandas as pd
from supabase import create_client, Client

# ---- CONFIG (env first; fall back to literals if you really want) ----
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://twcofgyxiitfvoedftik.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y29mZ3l4aWl0ZnZvZWRmdGlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDE3MDI3NSwiZXhwIjoyMDc1NzQ2Mjc1fQ.TlT5PBCFIthkInEQnKNunUUTqLk4q8kDnv5Y1dT-uN0")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Map crawler service names -> providers table boolean columns
SERVICE_MAP = {
    "Behavior Analysis": "aba",
    "Speech Therapy & Assessment": "speech",
    "Occupational Therapy & Assessment": "ot",
    "Physical Therapy & Assessment": "pt",
    "Life Skills Development 3 (ADT)": "life_skills",
    "Respite": "respite_care",
    "Residential Habilitation Behavior Focus": "residential",
    "Residential Habilitation Intensive Behavioral": "residential",
    "Residential Habilitation Standard": "residential",
    "Support Coordination": "support_groups",
    "Transportation": "mobile_services",
    # Add more mappings as you standardize your crawls
}

def normalize_phone(p):
    if p is None: return None
    if not isinstance(p, str): p = str(p)
    d = re.sub(r"\D", "", p)
    return d or None

def pick_col(df, candidates):
    for c in candidates:
        if c in df.columns: return c
    return None

def main():
    ap = argparse.ArgumentParser(description="Bulk-verify service flags in Supabase providers.")
    ap.add_argument("--file", required=True, help="Path to crawl CSV")
    ap.add_argument("--service", default=None,
                    help="Service label to apply when CSV lacks a 'service' column (e.g., 'Behavior Analysis').")
    args = ap.parse_args()

    # ---- Load CSV
    df = pd.read_csv(args.file)

    # Tolerant column detection
    name_col = pick_col(df, ["provider_name", "name", "Provider", "provider"])
    city_col = pick_col(df, ["city", "City", "CITY"])
    phone_col = pick_col(df, ["phone", "Phone", "PHONE"])

    if not phone_col and not (name_col and city_col):
        raise SystemExit("CSV must have a phone column OR both provider_name and city columns.")

    # Service column handling (ABA-only files won’t have one)
    if "service" in df.columns:
        service_series = df["service"].astype(str).str.strip()
    elif args.service:
        service_series = pd.Series([args.service] * len(df))
    else:
        raise SystemExit("CSV has no 'service' column and no --service provided. Supply --service 'Behavior Analysis' for ABA-only files.")

    # Normalize fields
    df["_phone_norm"] = df[phone_col].map(normalize_phone) if phone_col else None
    df["_name_norm"]  = df[name_col].astype(str).str.strip().str.lower() if name_col else None
    df["_city_norm"]  = df[city_col].astype(str).str.strip().str.lower() if city_col else None
    df["_service"]    = service_series

    # Filter to services we can map
    df = df[df["_service"].isin(SERVICE_MAP.keys())].copy()
    if df.empty:
        print("[info] No rows with known services after mapping. Nothing to do.")
        return

    print("[info] Fetching providers from Supabase…")
    # Pull minimal columns plus all possible target flags
    target_flags = sorted(set(SERVICE_MAP.values()))
    select_cols = ["id", "provider_name", "city", "phone", "verified"] + target_flags
    sel = ",".join(select_cols)
    providers_rs = supabase.table("providers").select(sel).execute()
    providers = pd.DataFrame(providers_rs.data)

    if providers.empty:
        print("[warn] No providers returned from Supabase. Check credentials / table.")
        return

    providers["_phone_norm"] = providers["phone"].map(normalize_phone)
    providers["_name_norm"]  = providers["provider_name"].astype(str).str.strip().str.lower()
    providers["_city_norm"]  = providers["city"].astype(str).str.strip().str.lower()

    # Build updates: id -> set(columns_to_true)
    to_apply = {}

    # Prefer phone match; fallback to name+city
    for _, r in df.iterrows():
        svc = r["_service"]
        col = SERVICE_MAP.get(svc)
        if not col:
            continue

        match = pd.DataFrame()
        if phone_col and r["_phone_norm"]:
            match = providers[providers["_phone_norm"] == r["_phone_norm"]]

        if match.empty and name_col and city_col:
            match = providers[
                (providers["_name_norm"] == r["_name_norm"]) &
                (providers["_city_norm"] == r["_city_norm"])
            ]

        if match.empty:
            continue

        prov_id = int(match.iloc[0]["id"])
        to_apply.setdefault(prov_id, set()).add(col)

    if not to_apply:
        print("[info] No matches to update.")
        return

    print(f"[info] Providers to update: {len(to_apply)}")

    # Execute updates per provider (each may need a different set of columns)
    updated = 0
    for prov_id, cols in to_apply.items():
        update_payload = {c: True for c in cols}
        update_payload["verified"] = True
        # Write; if some columns don't exist, PostgREST will error — so guard:
        try:
            supabase.table("providers").update(update_payload).eq("id", prov_id).execute()
            updated += 1
            if updated % 200 == 0:
                print(f"  → {updated} updated…")
        except Exception as e:
            print(f"[warn] id={prov_id} update skipped ({e})")

    print(f"[done] Updated {updated} providers.")

if __name__ == "__main__":
    main()
