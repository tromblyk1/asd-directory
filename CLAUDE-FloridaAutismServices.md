# Florida Autism Services Directory

## Project Overview
Comprehensive web directory connecting Florida families with autism-friendly resources across all 67 counties. Built by a registered nurse and autism parent who experienced firsthand how difficult it is to find services.

**Live Site:** FloridaAutismServices.com

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui components
- **State:** TanStack Query v5 (React Query)
- **Database:** Supabase (PostgreSQL)
- **Maps:** react-leaflet (OpenStreetMap)
- **Routing:** react-router-dom v6
- **Hosting:** Hostinger (static files in public_html)

## Critical Rules - READ FIRST

### 1. ONLY CHANGE WHAT IS ASKED
This is the most important rule. Do NOT:
- "Clean up" code that wasn't mentioned
- Add features that weren't requested
- Refactor things that are working
- Remove code you think is unused
- Change formatting or styling unless asked

If asked to add one thing, add ONLY that one thing. Touch nothing else.

### 2. Surgical Edits Preferred
- Make the minimum change necessary
- Don't rewrite entire files unless required
- If editing a function, edit only that function

### 3. Verify Before Acting
- Check which file you're editing is the correct one
- Confirm the current state of code before changing it
- If unsure, ASK rather than assume

## Communication Preferences

### Style
- **Direct and concise** - Skip lengthy explanations, get to the solution
- **No excessive postambles** - Don't explain what you just did at length
- **Results-focused** - Show the fix, not the theory behind it

### What NOT to do
- Don't ask to upload files that are already in the project
- Don't explain what you're about to do - just do it
- Don't give verbose summaries after completing tasks
- Don't ask "would you like me to..." - if it's clearly needed, do it

### When to ASK
- When the request is ambiguous
- When multiple approaches exist and user preference matters
- When a change might have unintended side effects

## Database Architecture

### Primary Tables

**`resources` table (providers)**
- Array fields: `services[]`, `insurances[]`, `scholarships[]`
- Key fields: id, name, resource_type ('provider'), county, city, state, zip_code, address, phone, email, website, latitude, longitude, verified, description
- ~3,700+ providers

**`schools` table**
- Uses `district` field (NOT county!)
- Boolean fields: fes_ua_participant, fes_eo_participant, ftc_participant, pep_participant
- Other: denomination, accreditation (comma-separated), is_nonprofit, is_religious, grade_levels
- ~3,600+ schools

**`events` table**
- Event calendar listings

**`churches` table**
- Faith communities

**`blog_posts` table**
- category = 'guide' → displays on /guides page
- Other categories → displays on /blog page

### Database Operations
User runs SQL directly in Supabase. Provide SQL queries but do NOT attempt to execute database operations.

### Array Filtering (Supabase/PostgreSQL)
```sql
-- Contains any of these values
WHERE services && ARRAY['aba', 'speech-therapy']

-- Contains this specific value
WHERE 'aba' = ANY(services)

-- Add to array
UPDATE resources SET insurances = array_append(insurances, 'new-value') WHERE id = X;
```

## Color Scheme Standards (ENFORCED EVERYWHERE)

| Element | Color | Tailwind Classes |
|---------|-------|------------------|
| Services | BLUE | `bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200` |
| Insurance | PURPLE | `bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200` |
| Scholarships | GREEN | `bg-green-100 text-green-800 border-green-200 hover:bg-green-200` |
| Accreditations | AMBER | `bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200` |
| Denominations | INDIGO | `bg-indigo-50 text-indigo-700 border-indigo-100` |
| Nonprofit Badge | CYAN/TEAL | `bg-cyan-50 text-cyan-700 border-cyan-100` |
| Providers Header | Teal Gradient | `from-teal-600 to-cyan-600` |
| Schools Header | Purple Gradient | `from-purple-600 to-indigo-600` |

## File Structure

### Pages (src/pages/)
- `findproviders.tsx` - Provider search with map
- `FindSchools.tsx` - School search with map
- `ProviderDetail.tsx` - Individual provider page
- `SchoolDetail.tsx` - Individual school page
- `educationalresources.tsx` - Services/insurance/scholarship info hub
- `ServiceDetail.tsx`, `InsuranceDetail.tsx`, `ScholarshipDetail.tsx` - Detail pages
- `AccreditationDetail.tsx`, `DenominationDetail.tsx` - School-related detail pages
- `Events.tsx`, `EventDetail.tsx` - Events calendar
- `FaithResources.tsx` - Churches section
- `Blog.tsx`, `BlogPost.tsx`, `Guides.tsx` - Content pages
- `SubmitResource.tsx`, `SubmitEvent.tsx` - Submission forms
- `Home.tsx`, `about.tsx`, `contact.tsx`, `Donate.tsx` - Static pages

### Components (src/components/)
- `ProviderCard.tsx` - Provider card in list view (has insuranceBadges, serviceBadges, scholarshipBadges objects)
- `SchoolCard.tsx` - School card
- `ServiceTag.tsx` - Reusable badge component with tooltips (has SERVICE_METADATA object)
- `EventCard.tsx`, `EventFilters.tsx` - Event components
- `Layout.tsx` - Header/footer (z-index: z-[1100] for Leaflet compatibility)
- `StarRating.tsx` - Google ratings display

### Data Files (src/data/)
- `services/*.json` - Service detail page content (aba.json, speech-therapy.json, etc.)
- `insurances/*.json` - Insurance detail page content
- `scholarships/*.json` - Scholarship detail page content
- `accreditations/*.json` - Accreditation detail page content
- `denominations/*.json` - Denomination detail page content

### Config/Utils (src/lib/)
- `supabase.ts` - Types and Supabase client
- `serviceDefinitions.ts` - Service metadata
- `serviceMapping.ts` - INSURANCE_SLUGS, SCHOLARSHIP_SLUGS mappings

## Valid Slugs

### Services (services[] array)
aba, speech-therapy, occupational-therapy, physical-therapy, feeding-therapy, music-therapy, pet-therapy, dir-floortime, group-therapy, ados-testing, life-skills, executive-function-coaching, parent-coaching, respite-care, residential-program, support-groups, tutoring, virtual-therapy, mobile-services, autism-travel

### Insurances (insurances[] array)
florida-medicaid, medicare, aetna, cigna, florida-blue, humana, unitedhealthcare, tricare, sunshine-health, early-steps, childrens-medical-services

### Scholarships (scholarships[] array)
fes-ua, fes-eo, ftc, pep

## Adding New Tags (Services/Insurance/Scholarships)

When adding a new tag, update ALL of these files:
1. `ServiceTag.tsx` - Add to SERVICE_METADATA
2. `ProviderCard.tsx` - Add to appropriate badges object (serviceBadges, insuranceBadges, or scholarshipBadges)
3. `findproviders.tsx` - Add to options array AND popupInfo object
4. `educationalresources.tsx` - Add to appropriate list
5. Create JSON file in appropriate data folder
6. (If scholarship for schools) `FindSchools.tsx` - Add to scholarshipOptions

## Mobile Responsiveness

### Test Viewports
- 375px (iPhone SE)
- 390px (iPhone 14)
- 768px (tablet)

### Key Patterns
- Layout header: z-[1100] (above Leaflet's z-[1000])
- TooltipProvider: Single instance wrapping lists, NOT per-item
- Pagination: 50 items per page with "Load More"
- Map threshold: Only render if results < 500 items

## Performance Patterns

```typescript
// WRONG - creates thousands of TooltipProviders
{providers.map(p => (
  <TooltipProvider>
    <ServiceTag slug={service} />
  </TooltipProvider>
))}

// RIGHT - single provider wrapping entire list
<TooltipProvider delayDuration={200}>
  {providers.map(p => (
    <ServiceTag slug={service} />
  ))}
</TooltipProvider>
```

## Build & Deploy

```bash
npm run dev      # Local development
npm run build    # Production build (creates dist/)
```

**Deploy to Hostinger:**
1. Run `npm run build`
2. Upload `dist/index.html` and `dist/assets/` folder to `public_html/`
3. JSON files are bundled into JS - no separate upload needed

## Git Workflow

Commit message format:
```
feat: description     # New feature
fix: description      # Bug fix
docs: description     # Documentation
refactor: description # Code cleanup
style: description    # Formatting only
chore: description    # Maintenance
```

Example:
```
feat: Add CMS (Children's Medical Services) insurance option

- Added CMS - Sunshine to findproviders.tsx
- Added CMS - Sunshine to ServiceTag.tsx
- Added CMS - Sunshine to ProviderCard.tsx
- Created childrens-medical-services.json
```

## Common Issues & Solutions

### Map Not Auto-Zooming
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

### County vs District
- Schools table uses `district` (e.g., "MIAMI-DADE")
- Resources table uses `county` (e.g., "Miami-Dade")
- Use `toTitleCase()` for comparisons

### Character Encoding
Files from Windows may have `\r\n` line endings or corrupted characters. Fix with:
```bash
sed -i 's/\r$//' filename.tsx
```

## What Success Looks Like
- User asks for X
- Claude does X and ONLY X
- No unexpected side effects
- File works on first try
- Minimal back-and-forth
