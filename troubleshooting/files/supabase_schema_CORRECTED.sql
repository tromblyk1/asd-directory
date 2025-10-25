-- ============================================================================
-- FLORIDA AUTISM SERVICES DIRECTORY - CORRECTED DATABASE SCHEMA
-- ============================================================================
-- Version: 2.0 (Corrected)
-- Date: October 24, 2025
-- 
-- CHANGES FROM v1.0:
-- - Simplified column names (no _therapy suffix inconsistency)
-- - Creates base columns that may not exist yet
-- - Shortened long names (autism_travel, molina)
-- - Added comprehensive verification
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PART 1: CREATE BASE SERVICE COLUMNS (if they don't exist yet)
-- ----------------------------------------------------------------------------

-- Core therapy services
ALTER TABLE providers ADD COLUMN IF NOT EXISTS aba TEXT DEFAULT 'UNKNOWN' CHECK (aba IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS speech TEXT DEFAULT 'UNKNOWN' CHECK (speech IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS ot TEXT DEFAULT 'UNKNOWN' CHECK (ot IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS pt TEXT DEFAULT 'UNKNOWN' CHECK (pt IN ('TRUE', 'FALSE', 'UNKNOWN'));

-- Support services  
ALTER TABLE providers ADD COLUMN IF NOT EXISTS respite_care TEXT DEFAULT 'UNKNOWN' CHECK (respite_care IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS life_skills TEXT DEFAULT 'UNKNOWN' CHECK (life_skills IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS residential TEXT DEFAULT 'UNKNOWN' CHECK (residential IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS church_support TEXT DEFAULT 'UNKNOWN' CHECK (church_support IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS pet_therapy TEXT DEFAULT 'UNKNOWN' CHECK (pet_therapy IN ('TRUE', 'FALSE', 'UNKNOWN'));

-- ----------------------------------------------------------------------------
-- PART 2: ADD NEW THERAPY SERVICES
-- ----------------------------------------------------------------------------

ALTER TABLE providers ADD COLUMN IF NOT EXISTS aac_speech TEXT DEFAULT 'UNKNOWN' CHECK (aac_speech IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS dir_floortime TEXT DEFAULT 'UNKNOWN' CHECK (dir_floortime IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS executive_function TEXT DEFAULT 'UNKNOWN' CHECK (executive_function IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS feeding TEXT DEFAULT 'UNKNOWN' CHECK (feeding IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS group_therapy TEXT DEFAULT 'UNKNOWN' CHECK (group_therapy IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS inpp TEXT DEFAULT 'UNKNOWN' CHECK (inpp IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS music_therapy TEXT DEFAULT 'UNKNOWN' CHECK (music_therapy IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS parent_coaching TEXT DEFAULT 'UNKNOWN' CHECK (parent_coaching IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS telehealth TEXT DEFAULT 'UNKNOWN' CHECK (telehealth IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS virtual_therapy TEXT DEFAULT 'UNKNOWN' CHECK (virtual_therapy IN ('TRUE', 'FALSE', 'UNKNOWN'));

-- ----------------------------------------------------------------------------
-- PART 3: ADD TESTING SERVICES
-- ----------------------------------------------------------------------------

ALTER TABLE providers ADD COLUMN IF NOT EXISTS ados_testing TEXT DEFAULT 'UNKNOWN' CHECK (ados_testing IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS pharmacogenetic_testing TEXT DEFAULT 'UNKNOWN' CHECK (pharmacogenetic_testing IN ('TRUE', 'FALSE', 'UNKNOWN'));

-- ----------------------------------------------------------------------------
-- PART 4: ADD SUPPORT SERVICES
-- ----------------------------------------------------------------------------

ALTER TABLE providers ADD COLUMN IF NOT EXISTS autism_travel TEXT DEFAULT 'UNKNOWN' CHECK (autism_travel IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS mobile_services TEXT DEFAULT 'UNKNOWN' CHECK (mobile_services IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS support_groups TEXT DEFAULT 'UNKNOWN' CHECK (support_groups IN ('TRUE', 'FALSE', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS tutoring TEXT DEFAULT 'UNKNOWN' CHECK (tutoring IN ('TRUE', 'FALSE', 'UNKNOWN'));

-- ----------------------------------------------------------------------------
-- PART 5: ADD NEW INSURANCE COLUMNS
-- ----------------------------------------------------------------------------

ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_sunshine_health TEXT DEFAULT 'UNKNOWN' CHECK (accepts_sunshine_health IN ('YES', 'NO', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_wellcare TEXT DEFAULT 'UNKNOWN' CHECK (accepts_wellcare IN ('YES', 'NO', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_molina TEXT DEFAULT 'UNKNOWN' CHECK (accepts_molina IN ('YES', 'NO', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_florida_kidcare TEXT DEFAULT 'UNKNOWN' CHECK (accepts_florida_kidcare IN ('YES', 'NO', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_private_pay_only TEXT DEFAULT 'UNKNOWN' CHECK (accepts_private_pay_only IN ('YES', 'NO', 'UNKNOWN'));

-- ----------------------------------------------------------------------------
-- PART 6: ADD SCHOLARSHIP COLUMNS
-- ----------------------------------------------------------------------------

ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_fes_ua TEXT DEFAULT 'UNKNOWN' CHECK (accepts_fes_ua IN ('YES', 'NO', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_fes_eo TEXT DEFAULT 'UNKNOWN' CHECK (accepts_fes_eo IN ('YES', 'NO', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_ftc TEXT DEFAULT 'UNKNOWN' CHECK (accepts_ftc IN ('YES', 'NO', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_pep TEXT DEFAULT 'UNKNOWN' CHECK (accepts_pep IN ('YES', 'NO', 'UNKNOWN'));
ALTER TABLE providers ADD COLUMN IF NOT EXISTS accepts_hope_scholarship TEXT DEFAULT 'UNKNOWN' CHECK (accepts_hope_scholarship IN ('YES', 'NO', 'UNKNOWN'));

-- ----------------------------------------------------------------------------
-- PART 7: ADD COLUMN COMMENTS (Documentation)
-- ----------------------------------------------------------------------------

COMMENT ON COLUMN providers.aac_speech IS 'AAC (Augmentative & Alternative Communication) Speech Therapy';
COMMENT ON COLUMN providers.dir_floortime IS 'DIR FloorTime (Developmental, Individual-difference, Relationship-based) Therapy';
COMMENT ON COLUMN providers.executive_function IS 'Executive Function Coaching';
COMMENT ON COLUMN providers.feeding IS 'Feeding Therapy';
COMMENT ON COLUMN providers.group_therapy IS 'Group Therapy Sessions';
COMMENT ON COLUMN providers.inpp IS 'INPP (Institute for Neuro-Physiological Psychology) Therapy';
COMMENT ON COLUMN providers.music_therapy IS 'Music Therapy';
COMMENT ON COLUMN providers.parent_coaching IS 'Parent Coaching and Training';
COMMENT ON COLUMN providers.telehealth IS 'Telehealth/Remote Services';
COMMENT ON COLUMN providers.virtual_therapy IS 'Virtual Therapy Sessions';
COMMENT ON COLUMN providers.ados_testing IS 'ADOS (Autism Diagnostic Observation Schedule) Testing';
COMMENT ON COLUMN providers.pharmacogenetic_testing IS 'Pharmacogenetic Testing for Medication Management';
COMMENT ON COLUMN providers.autism_travel IS 'Certified Autism Travel Services';
COMMENT ON COLUMN providers.mobile_services IS 'Mobile Services - Provider Comes to Client';
COMMENT ON COLUMN providers.support_groups IS 'Support Groups for Individuals or Families';
COMMENT ON COLUMN providers.tutoring IS 'Academic Tutoring Services';

COMMENT ON COLUMN providers.accepts_sunshine_health IS 'Sunshine Health (Medicaid Managed Care)';
COMMENT ON COLUMN providers.accepts_wellcare IS 'WellCare (Medicaid Managed Care)';
COMMENT ON COLUMN providers.accepts_molina IS 'Molina Healthcare';
COMMENT ON COLUMN providers.accepts_florida_kidcare IS 'Florida KidCare (State Childrens Health Insurance)';
COMMENT ON COLUMN providers.accepts_private_pay_only IS 'Private Pay Only - No Insurance Accepted';

COMMENT ON COLUMN providers.accepts_fes_ua IS 'Family Empowerment Scholarship for Students with Unique Abilities (formerly Gardiner)';
COMMENT ON COLUMN providers.accepts_fes_eo IS 'Family Empowerment Scholarship for Educational Options';
COMMENT ON COLUMN providers.accepts_ftc IS 'Florida Tax Credit Scholarship';
COMMENT ON COLUMN providers.accepts_pep IS 'Personalized Education Program (PEP) Scholarship';
COMMENT ON COLUMN providers.accepts_hope_scholarship IS 'Hope Scholarship';

-- ----------------------------------------------------------------------------
-- PART 8: VERIFICATION QUERIES
-- ----------------------------------------------------------------------------

-- Check that all service columns were created
SELECT 
  'Service Columns' as category,
  column_name,
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name = 'providers' 
  AND column_name IN (
    'aba', 'speech', 'ot', 'pt', 'feeding', 'telehealth', 
    'aac_speech', 'dir_floortime', 'executive_function',
    'group_therapy', 'inpp', 'music_therapy', 'parent_coaching',
    'virtual_therapy', 'ados_testing', 'pharmacogenetic_testing',
    'autism_travel', 'mobile_services', 'support_groups', 'tutoring',
    'respite_care', 'life_skills', 'residential', 'church_support', 'pet_therapy'
  )
ORDER BY column_name;

-- Check that all insurance columns were created
SELECT 
  'Insurance Columns' as category,
  column_name,
  data_type,
  column_default
FROM information_schema.columns 
WHERE table_name = 'providers' 
  AND column_name LIKE 'accepts_%'
ORDER BY column_name;

-- Count total columns added
SELECT 
  COUNT(*) as total_new_columns
FROM information_schema.columns 
WHERE table_name = 'providers' 
  AND (
    column_name IN (
      'aac_speech', 'dir_floortime', 'executive_function', 'feeding',
      'group_therapy', 'inpp', 'music_therapy', 'parent_coaching',
      'telehealth', 'virtual_therapy', 'ados_testing', 'pharmacogenetic_testing',
      'autism_travel', 'mobile_services', 'support_groups', 'tutoring'
    )
    OR column_name IN (
      'accepts_sunshine_health', 'accepts_wellcare', 'accepts_molina',
      'accepts_florida_kidcare', 'accepts_private_pay_only',
      'accepts_fes_ua', 'accepts_fes_eo', 'accepts_ftc',
      'accepts_pep', 'accepts_hope_scholarship'
    )
  );

-- Expected result: 26 new columns

-- Check sample provider data
SELECT 
  provider_name,
  aba,
  speech,
  feeding,
  telehealth,
  accepts_sunshine_health,
  accepts_fes_ua
FROM providers
LIMIT 5;

-- ----------------------------------------------------------------------------
-- NOTES FOR CLEANUP (DO LATER!)
-- ----------------------------------------------------------------------------

/*
After everything works and you've tested thoroughly:

1. You can optionally remove the old service_type columns:

ALTER TABLE providers DROP COLUMN IF EXISTS service_type;
ALTER TABLE providers DROP COLUMN IF EXISTS service_types;

2. BUT WAIT at least a week and make sure:
   - Your website displays correctly
   - All filters work
   - You've backed up any data you need
   - Your code no longer references those columns

3. You can also add indexes for performance:

CREATE INDEX idx_providers_aba ON providers(aba) WHERE aba = 'TRUE';
CREATE INDEX idx_providers_speech ON providers(speech) WHERE speech = 'TRUE';
CREATE INDEX idx_providers_medicaid ON providers(accepts_medicaid) WHERE accepts_medicaid = 'YES';

DO NOT DO THESE STEPS YET!
*/
