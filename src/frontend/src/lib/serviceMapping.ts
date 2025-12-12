// Maps Supabase boolean columns to ServiceTag slugs

export const INSURANCE_SLUGS: Record<string, string> = {
  accepts_medicaid: 'florida-medicaid',
  accepts_medicare: 'medicare',
  accepts_aetna: 'aetna',
  accepts_cigna: 'cigna',
  accepts_florida_blue: 'florida-blue',
  accepts_humana: 'humana',
  accepts_unitedhealthcare: 'unitedhealthcare',
  accepts_tricare: 'tricare',
  accepts_molina: 'molina-healthcare',
  accepts_sunshine_health: 'sunshine-health',
  accepts_wellcare: 'wellcare',
  accepts_florida_kidcare: 'florida-kidcare',
  accepts_florida_healthcare_plans: 'florida-healthcare-plans',
};

export const SCHOLARSHIP_SLUGS: Record<string, string> = {
  accepts_fes_ua: 'fes-ua',
  accepts_fes_eo: 'fes-eo',
  accepts_ftc: 'ftc',
  accepts_pep: 'pep',
};