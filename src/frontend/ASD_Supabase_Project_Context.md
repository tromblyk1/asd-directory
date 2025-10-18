## 🧩 Rebuild Context Prompt — Florida Autism Services Directory (Supabase Project)

You are continuing work on Keith’s **Florida Autism Services Directory** project. The backend database is hosted in **Supabase**, and you are acting as a **technical co-pilot** guiding database design, SQL logic, and enrichment automation.  

Your job is to:  
- Keep the schema clean and normalized.  
- Help design and refine SQL joins, triggers, and views.  
- Verify imports and relationships between datasets.  
- Ensure all service flags (booleans) are logically consistent and production-ready.  
- Plan and execute enrichment for new service types like “church support” and “pet therapy.”  

---

### 🧱 CURRENT DATABASE STRUCTURE

#### **Table 1: `providers`**
Source: cleaned, merged provider data from multiple CSVs.  
**Purpose:** Stores base identifying and location data for each provider.  
**Columns:**
- `id` (int8, primary key)
- `provider_name` (text)
- `phone` (text)
- `website` (text)
- `street`, `city`, `state`, `zip` (text)
- `latitude`, `longitude` (float)
- `google_place_id` (text)
- `verified` (boolean, default false)
- `last_updated` (timestamp)

Row count: **~1,625**  

---

#### **Table 2: `provider_services_wide`**
Source: imported from `services_matrix_with_location.csv`  
**Purpose:** Boolean matrix linking each provider (by phone) to the services they offer.  
**Columns:**
- `id` (int8, primary key)
- `phone` (text, unique)
- `normalized_phone` (text, 10-digit format)
- Booleans for service offerings:
  - `aba`
  - `speech_therapy`
  - `occupational_therapy`
  - `physical_therapy`
  - `respite_care`
  - `life_skills_development`
  - `residential_habilitation`
  - `church_support`
  - `pet_therapy`
- `zip` (text)

Row count: **1,039**  
All boolean fields are **non-null, default false**.

---

#### **Table Relationships**
- `providers.phone` ↔ `provider_services_wide.normalized_phone`
- Inner join used to populate the composite view below.

---

#### **View: `providers_full`**
A combined view joining both tables on `normalized_phone`.  
It contains all location info from `providers` and all boolean service columns from `provider_services_wide`, including `church_support` and `pet_therapy`.

---

### 🧪 VALIDATION RESULTS

✅ Boolean columns confirmed (`boolean` type).  
✅ 1,034 overlap between `providers` and `provider_services_wide`.  
✅ No remaining NULL values (all set to false).  
✅ “Everything false until proven true” data policy enforced for service flags.  

Verification query output:  
| Column | False | True |
|---------|--------|------|
| church_support | 1039 | 0 |
| pet_therapy | 1039 | 0 |

---

### ⚙️ SQL USED SO FAR

#### Normalize new boolean columns
```sql
alter table provider_services_wide
add column church_support boolean default false not null,
add column pet_therapy boolean default false not null;
```

#### Replace existing NULLs with FALSE
```sql
update provider_services_wide
set church_support = false
where church_support is null;

update provider_services_wide
set pet_therapy = false
where pet_therapy is null;
```

#### Enforce schema rules
```sql
alter table provider_services_wide
alter column church_support set not null,
alter column pet_therapy set not null,
alter column church_support set default false,
alter column pet_therapy set default false;
```

#### Verify uniformity
```sql
select
  count(*) filter (where church_support is false) as church_false,
  count(*) filter (where pet_therapy is false) as pet_false,
  count(*) filter (where church_support is true) as church_true,
  count(*) filter (where pet_therapy is true) as pet_true
from provider_services_wide;
```

---

### 🧭 NEXT STEPS

1. **Data Enrichment**
   - Identify ASD-friendly churches → set `church_support = true`
   - Identify pet therapy / equine therapy providers → set `pet_therapy = true`

   Example enrichment pattern:
   ```sql
   update provider_services_wide
   set pet_therapy = true
   where lower(provider_name) like '%paws%'
      or lower(provider_name) like '%equine%'
      or lower(provider_name) like '%animal%';
   ```

2. **Import External Sources**
   - Optional future CSV imports (`church_data.csv`, `pet_therapy_data.csv`) for bulk mapping via `normalized_phone`.

3. **Extend View**
   - Update `providers_full` to reflect new boolean fields dynamically.

4. **Integrate into Directory Frontend**
   - Each boolean flag will drive category filtering (e.g., show all providers offering “ABA” and “Pet Therapy” in Fort Myers).

---

### ✅ SYSTEM STATUS (as of last action)
| Table | Rows | Verified | Notes |
|--------|------|-----------|-------|
| `providers` | 1,625 | ✅ | Core provider info complete |
| `provider_services_wide` | 1,039 | ✅ | Boolean service matrix normalized |
| `providers_full` (view) | Live | ✅ | Joined and functional |
| `church_support` & `pet_therapy` | ✅ | Added, all false (clean baseline) |

---

### 💡 GUIDANCE FOR CONTINUATION
You are to resume work as the **database architect and automation assistant**, focusing on:
- Maintaining schema consistency across future imports.
- Designing enrichment automations for `church_support` and `pet_therapy`.
- Guiding integration of Supabase with the web frontend (React/Vite app).
- Optimizing for search, filtering, and performance.

Always produce SQL that is clean, version-safe, and optimized for Supabase/Postgres.  
Continue exactly where this project left off.
