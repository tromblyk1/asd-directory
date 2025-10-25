import pandas as pd
from supabase import create_client, Client
import re, os

# === CONFIG ===
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://twcofgyxiitfvoedftik.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3Y29mZ3l4aWl0ZnZvZWRmdGlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDE3MDI3NSwiZXhwIjoyMDc1NzQ2Mjc1fQ.TlT5PBCFIthkInEQnKNunUUTqLk4q8kDnv5Y1dT-uN0")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def normalize_phone(p):
    return re.sub(r"\D", "", str(p)) if isinstance(p, str) else None

# === LOAD DATA ===
crawl = pd.read_csv("aba_verification_final_20251024_060947.csv")
crawl["phone_norm"] = crawl.get("phone", "").apply(normalize_phone)
crawl["provider_name_norm"] = crawl.get("provider_name", "").str.lower().str.strip()

# === FETCH PROVIDERS ===
print("[info] Fetching provider data...")
prov = supabase.table("providers").select("id, provider_name, city, phone, aba, verified").execute()
prov = pd.DataFrame(prov.data)
prov["phone_norm"] = prov["phone"].apply(normalize_phone)
prov["provider_name_norm"] = prov["provider_name"].str.lower().str.strip()

# === MATCH ===
matches = pd.merge(
    prov,
    crawl,
    on="phone_norm",
    how="inner",
    suffixes=("_prov", "_crawl")
)

ids_to_update = matches["id"].unique().tolist()
print(f"[info] Matched {len(ids_to_update)} providers to ABA verification list.")

# === BULK UPDATE ===
if ids_to_update:
    batch_size = 500
    for i in range(0, len(ids_to_update), batch_size):
        batch = ids_to_update[i:i+batch_size]
        print(f"  → Updating batch {i//batch_size + 1}")
        supabase.table("providers").update(
            {"aba": True, "verified": True}
        ).in_("id", batch).execute()

print("[done] ABA updates complete.")
