# Florida Autism Services Directory

## Project Overview
Comprehensive web directory connecting Florida families with autism-friendly resources across all 67 counties. Built by a registered nurse and autism parent who experienced firsthand how difficult it is to find services.

**Live Site:** https://floridaautismservices.com

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui components
- **State:** TanStack Query v5 (React Query)
- **Database:** Supabase (PostgreSQL)
- **Maps:** react-leaflet (OpenStreetMap)
- **Routing:** react-router-dom v6
- **Hosting:** Hostinger (static files in public_html)

---

# CRITICAL RULES - READ BEFORE EVERY TASK

## 1. ONLY CHANGE WHAT IS ASKED
This is the most important rule. Do NOT:
- "Clean up" code that wasn't mentioned
- Add features that weren't requested
- Refactor things that are working
- Remove code you think is unused
- Change formatting or styling unless asked

If asked to add one thing, add ONLY that one thing. Touch nothing else.

## 2. Surgical Edits Preferred
- Make the minimum change necessary
- Don't rewrite entire files unless required
- If editing a function, edit only that function

## 3. Verify Before Acting
- Check which file you're editing is the correct one
- Confirm the current state of code before changing it
- If unsure, ASK rather than assume

---

# COMMUNICATION PREFERENCES

## Style
- **Direct and concise** - Skip lengthy explanations, get to the solution
- **No excessive postambles** - Don't explain what you just did at length
- **Results-focused** - Show the fix, not the theory behind it

## What NOT to do
- Don't explain what you're about to do - just do it
- Don't give verbose summaries after completing tasks
- Don't ask "would you like me to..." - if it's clearly needed, do it

## When to ASK
- When the request is ambiguous
- When multiple approaches exist and user preference matters
- When a change might have unintended side effects

---

# FILE STRUCTURE

**All source code is in `src/frontend/src/` (not the root `src/`)**

- Build commands run from: `src/frontend/`
- Build output: `src/frontend/dist/`

## Pages (`src/frontend/src/pages/`)

| File | Purpose |
|------|---------|
| `findproviders.tsx` | Provider search with map - has serviceOptions, insuranceOptions, scholarshipOptions, servicePopupInfo, insurancePopupInfo |
| `FindSchools.tsx` | School search with map - has scholarshipOptions, accreditation filters, denomination filters |
| `ProviderDetail.tsx` | Individual provider detail page |
| `SchoolDetail.tsx` | Individual school detail page |
| `educationalresources.tsx` | Hub page - has servicesList, insurancesList, scholarshipsList, accreditationsList |
| `ServiceDetail.tsx` | Service info page (reads from services/*.json) |
| `InsuranceDetail.tsx` | Insurance info page (reads from insurances/*.json) |
| `ScholarshipDetail.tsx` | Scholarship info page (reads from scholarships/*.json) |
| `AccreditationDetail.tsx` | Accreditation info page (reads from accreditations/*.json) |
| `DenominationDetail.tsx` | Denomination info page (reads from denominations/*.json) |
| `SchoolTypeDetail.tsx` | School type info page (reads from school-types/*.json) |
| `ResourceCategory.tsx` | Category listing page (`/resources/{category}`) |
| `ResourceDetail.tsx` | Faith community detail page (uses base44Client) |
| `Events.tsx` | Events calendar listing |
| `EventDetail.tsx` | Individual event detail page |
| `FaithResources.tsx` | Faith communities section |
| `Blog.tsx` | Blog listing |
| `BlogPost.tsx` | Individual blog post |
| `Guides.tsx` | Guides listing (category='guide' from blog_posts) |
| `SubmitResource.tsx` | Provider submission form |
| `SubmitEvent.tsx` | Event submission form |
| `Home.tsx` | Homepage |
| `about.tsx` | About page |
| `contact.tsx` | Contact page |
| `Donate.tsx` | Donation page |

## Components (`src/frontend/src/components/`)

| File | Purpose |
|------|---------|
| `ServiceTag.tsx` | **CRITICAL** - Badge component with SERVICE_METADATA for ALL tags (services, insurances, scholarships) - defines colors and tooltips |
| `ProviderCard.tsx` | **CRITICAL** - Provider list card - has serviceBadges, insuranceBadges, scholarshipBadges objects with tooltips and links |
| `SchoolCard.tsx` | School list card - displays scholarships, accreditations, denominations |
| `ChurchCard.tsx` | Church/faith community list card |
| `EventCard.tsx` | Event list card |
| `EventFilters.tsx` | Event filtering UI |
| `EventVerificationBadge.tsx` | Event verification badge |
| `StarRating.tsx` | Google ratings display |
| `DonateModal.tsx` | Donation modal |
| `DonationImpactSection.tsx` | Donate page section |
| `HallOfSupportersSection.tsx` | Donate page section |
| `HoverBubble.tsx` | Tooltip component |
| `ScrollToTop.tsx` | Scroll utility |
| `ui/` | shadcn/ui base components |

## Layouts (`src/frontend/src/layouts/`)

| File | Purpose |
|------|---------|
| `Layout.tsx` | Header/footer wrapper (z-index: z-[1100] for Leaflet compatibility) |

## Data Files (`src/frontend/src/data/resources/`)

| Folder | Purpose |
|--------|---------|
| `services/*.json` | Service detail page content |
| `insurances/*.json` | Insurance detail page content |
| `scholarships/*.json` | Scholarship detail page content |
| `accreditations/*.json` | Accreditation detail page content |
| `denominations/*.json` | Denomination detail page content |
| `school-types/*.json` | School type detail page content |

## Lib/Utils (`src/frontend/src/lib/`)

| File | Purpose |
|------|---------|
| `supabase.ts` | Supabase client and TypeScript types |
| `serviceDefinitions.ts` | Service metadata |
| `serviceMapping.ts` | Slug mappings (INSURANCE_SLUGS, SCHOLARSHIP_SLUGS, etc.) |
| `loadResource.ts` | JSON loading utility for detail pages |
| `utils.ts` | General utilities |

## API (`src/frontend/src/api/`)

| File | Purpose |
|------|---------|
| `base44Client.ts` | Supabase wrapper - used by ResourceDetail.tsx and others |

## Other Folders

| Folder | Purpose |
|--------|---------|
| `assets/` | Static images |
| `contexts/` | React contexts |
| `hooks/` | Custom React hooks |
| `types/` | TypeScript type definitions |
| `utils/` | Additional utilities |

---

# DATABASE ARCHITECTURE

## Primary Tables

### `resources` table (providers)
- **Array fields:** `services[]`, `insurances[]`, `scholarships[]`
- **Key fields:** id, name, resource_type ('provider'), county, city, state, zip_code, address, phone, email, website, latitude, longitude, verified, description
- ~3,700+ providers

### `schools` table
- **Uses `district` field (NOT county!)**
- **Boolean fields:** fes_ua_participant, fes_eo_participant, ftc_participant, pep_participant
- **Other:** denomination, accreditation (comma-separated), is_nonprofit, is_religious, grade_levels
- ~3,600+ schools

### `events` table
- Event calendar listings

### `churches` table
- Faith communities

### `blog_posts` table
- category = 'guide' → displays on /guides page
- Other categories → displays on /blog page

## Database Operations
**User runs SQL directly in Supabase. Provide SQL queries but do NOT attempt to execute database operations.**

## Array Filtering (Supabase/PostgreSQL)
```sql
-- Contains any of these values
WHERE services && ARRAY['aba', 'speech-therapy']

-- Contains this specific value
WHERE 'aba' = ANY(services)

-- Add to array
UPDATE resources SET insurances = array_append(insurances, 'new-value') WHERE id = X;

-- Remove from array
UPDATE resources SET insurances = array_remove(insurances, 'old-value') WHERE id = X;
```

---

# COLOR SCHEME STANDARDS

**These colors MUST be consistent across ALL components:**

| Element | Color | Tailwind Classes |
|---------|-------|------------------|
| **Services** | BLUE | `bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200` |
| **Insurance** | PURPLE | `bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200` |
| **Scholarships** | GREEN | `bg-green-100 text-green-800 border-green-200 hover:bg-green-200` |
| **Accreditations** | AMBER | `bg-amber-50 text-amber-700 border-amber-200` |
| **Denominations** | INDIGO | `bg-indigo-50 text-indigo-700 border-indigo-100` |
| **Nonprofit Badge** | CYAN/TEAL | `bg-cyan-50 text-cyan-700 border-cyan-100` |
| **Providers Header** | Teal Gradient | `from-teal-600 to-cyan-600` |
| **Schools Header** | Purple Gradient | `from-purple-600 to-indigo-600` |

---

# TASK CHECKLISTS

## Adding a new INSURANCE

Update ALL of these files:

1. **`ServiceTag.tsx`** - Add to SERVICE_METADATA with purple styling:
   ```typescript
   'new-insurance': {
     name: 'Display Name',
     description: 'Tooltip description',
     color: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
     type: 'insurance',
   },
   ```

2. **`ProviderCard.tsx`** - Add to insuranceBadges object:
   ```typescript
   'new-insurance': { label: 'Display Name', tooltip: 'Tooltip text', link: '/resources/insurances/new-insurance' },
   ```

3. **`findproviders.tsx`** - Add to BOTH:
   - `insuranceOptions` array: `{ value: 'new-insurance', label: 'Display Name' }`
   - `insurancePopupInfo` object: `'new-insurance': { label: 'Short', description: 'Full description', slug: 'new-insurance' }`

4. **`educationalresources.tsx`** - Add to insurancesList:
   ```typescript
   { slug: 'new-insurance', name: 'Display Name', description: 'Short description' },
   ```

5. **`serviceMapping.ts`** - Add to INSURANCE_SLUGS if used for mapping

6. **Create JSON file:** `src/frontend/src/data/resources/insurances/new-insurance.json`

---

## Adding a new SERVICE

Update ALL of these files:

1. **`ServiceTag.tsx`** - Add to SERVICE_METADATA with blue styling:
   ```typescript
   'new-service': {
     name: 'Display Name',
     description: 'Tooltip description',
     color: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
     type: 'service',
   },
   ```

2. **`ProviderCard.tsx`** - Add to serviceBadges object:
   ```typescript
   'new-service': { label: 'Display Name', tooltip: 'Tooltip text', link: '/resources/services/new-service' },
   ```

3. **`findproviders.tsx`** - Add to BOTH:
   - `serviceOptions` array: `{ value: 'new-service', label: 'Display Name' }`
   - `servicePopupInfo` object: `'new-service': { label: 'Short', description: 'Full description', slug: 'new-service' }`

4. **`educationalresources.tsx`** - Add to servicesList:
   ```typescript
   { slug: 'new-service', name: 'Display Name', description: 'Short description' },
   ```

5. **`serviceDefinitions.ts`** - Add metadata if used

6. **`serviceMapping.ts`** - Add mapping if needed

7. **Create JSON file:** `src/frontend/src/data/resources/services/new-service.json`

---

## Adding a new SCHOLARSHIP

Update ALL of these files:

1. **`ServiceTag.tsx`** - Add to SERVICE_METADATA with green styling:
   ```typescript
   'new-scholarship': {
     name: 'Display Name',
     description: 'Tooltip description',
     color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
     type: 'scholarship',
   },
   ```

2. **`ProviderCard.tsx`** - Add to scholarshipBadges object:
   ```typescript
   'new-scholarship': { label: 'Display Name', tooltip: 'Tooltip text', link: '/resources/scholarships/new-scholarship' },
   ```

3. **`SchoolCard.tsx`** - Check if scholarship display needs update

4. **`findproviders.tsx`** - Add to scholarshipOptions array:
   ```typescript
   { value: 'new-scholarship', label: 'Display Name', tooltip: 'Tooltip text' },
   ```

5. **`FindSchools.tsx`** - Add to scholarshipOptions array:
   ```typescript
   { value: 'new-scholarship', label: 'Display Name', tooltip: 'Tooltip text' },
   ```

6. **`educationalresources.tsx`** - Add to scholarshipsList:
   ```typescript
   { slug: 'new-scholarship', name: 'Display Name', description: 'Short description' },
   ```

7. **`serviceMapping.ts`** - Add to SCHOLARSHIP_SLUGS if used

8. **Create JSON file:** `src/frontend/src/data/resources/scholarships/new-scholarship.json`

---

## Adding a new ACCREDITATION

1. **`FindSchools.tsx`** - Add to accreditation filter options if filtered
2. **`SchoolCard.tsx`** - Check if display needs update
3. **`educationalresources.tsx`** - Add to accreditationsList if listed
4. **Create JSON file:** `src/frontend/src/data/resources/accreditations/new-accreditation.json`

---

## Adding a new DENOMINATION

1. **`FindSchools.tsx`** - Add to denomination filter options if filtered
2. **`SchoolCard.tsx`** - Check if display needs update  
3. **`educationalresources.tsx`** - Add to list if listed there
4. **Create JSON file:** `src/frontend/src/data/resources/denominations/new-denomination.json`

---

## Adding a new SCHOOL TYPE

1. **`FindSchools.tsx`** - Add to school type filter options if filtered
2. **Create JSON file:** `src/frontend/src/data/resources/school-types/new-type.json`

---

# VALID SLUGS

## Services (services[] array)
aba, speech-therapy, occupational-therapy, physical-therapy, feeding-therapy, music-therapy, pet-therapy, dir-floortime, group-therapy, ados-testing, life-skills, executive-function-coaching, parent-coaching, respite-care, residential-program, support-groups, tutoring, virtual-therapy, mobile-services, autism-travel

## Insurances (insurances[] array)
florida-medicaid, medicare, aetna, cigna, florida-blue, humana, unitedhealthcare, tricare, sunshine-health, early-steps, childrens-medical-services

## Scholarships (scholarships[] array)
fes-ua, fes-eo, ftc, pep

---

# BUILD & DEPLOY

```bash
cd src/frontend
npm run dev      # Local development
npm run build    # Production build (creates dist/)
```

**Deploy to Hostinger:**
1. Run `npm run build` from `src/frontend/`
2. Delete contents of `public_html/assets/` on Hostinger
3. Upload `dist/assets/` folder contents to `public_html/assets/`
4. Overwrite `public_html/index.html` with `dist/index.html`

---

# GIT WORKFLOW

Commit message format:
```
feat: description     # New feature
fix: description      # Bug fix  
docs: description     # Documentation
refactor: description # Code cleanup
style: description    # Formatting only
chore: description    # Maintenance
```

---

# COMMON ISSUES & SOLUTIONS

## Map Not Auto-Zooming
MapContainer only reads center/zoom on mount. Use MapCenterUpdater component:
```typescript
const MapCenterUpdater = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (map && center) map.flyTo(center, zoom, { duration: 1 });
  }, [map, center, zoom]);
  return null;
};
```

## County vs District
- Schools table uses `district` (e.g., "MIAMI-DADE")
- Resources table uses `county` (e.g., "Miami-Dade")
- Use `toTitleCase()` for comparisons

## TooltipProvider Performance
```typescript
// WRONG - creates thousands of providers
{items.map(item => (
  <TooltipProvider><ServiceTag /></TooltipProvider>
))}

// RIGHT - single provider wrapping entire list
<TooltipProvider delayDuration={200}>
  {items.map(item => <ServiceTag />)}
</TooltipProvider>
```

---

# WHAT SUCCESS LOOKS LIKE

1. User asks for X
2. Claude does X and ONLY X
3. No unexpected changes anywhere
4. Code works on first try
5. Minimal back-and-forth needed
