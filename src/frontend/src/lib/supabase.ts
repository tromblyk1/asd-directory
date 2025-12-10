import { createClient } from '@supabase/supabase-js';

export interface Provider {
  id?: string;
  provider_id?: string | number | null;
  provider_name?: string | null;  // Database column name
  name?: string | null;           // Alternative field name
  google_place_id?: string | null;
  verified?: boolean | null;
  street?: string | null;         // Added for search functionality
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  scraped_website?: string | null;
  service_type?: string | null;
  service_types?: string[] | null;
  resource_type?: string | null;
  accepts_medicaid?: boolean | string | null;
  accepts_medicare?: boolean | string | null;
  accepts_florida_blue?: boolean | string | null;
  accepts_unitedhealthcare?: boolean | string | null;
  accepts_aetna?: boolean | string | null;
  accepts_cigna?: boolean | string | null;
  accepts_tricare?: boolean | string | null;
  accepts_humana?: boolean | string | null;
  accepts_florida_healthcare_plans?: boolean | string | null;
  accepts_wellcare?: boolean | string | null;
  accepts_molina?: boolean | string | null;
  accepts_sunshine_health?: boolean | string | null;
  accepts_florida_kidcare?: boolean | string | null;
  accepts_pep?: boolean | string | null;
  accepts_fes_ua?: boolean | string | null;
  accepts_fes_eo?: boolean | string | null;
  accepts_ftc?: boolean | string | null;
  accepts_hope_scholarship?: boolean | string | null;
  aba?: boolean | null;
  speech?: boolean | null;
  ot?: boolean | null;
  pt?: boolean | null;
  feeding?: boolean | null;
  speech_therapy?: boolean | null;
  occupational_therapy?: boolean | null;
  physical_therapy?: boolean | null;
  respite_care?: boolean | null;
  life_skills?: boolean | null;
  life_skills_development?: boolean | null;
  residential?: boolean | null;
  residential_habilitation?: boolean | null;
  support_groups?: boolean | null;
  church_support?: boolean | null;
  pet_therapy?: boolean | null;
  virtual_therapy?: boolean | null;
  ados_testing?: boolean | null;
  pharmacogenetic_testing?: boolean | null;
  autism_travel?: boolean | null;
  mobile_services?: boolean | null;
  executive_function_coaching?: boolean | null;
  parent_coaching?: boolean | null;
  tutoring?: boolean | null;
  group_therapy?: boolean | null;
  music_therapy?: boolean | null;
  dir_floortime?: boolean | null;
  inpp?: boolean | null;
  aac_speech?: boolean | null;
}

export interface Church {
  id?: string;
  name?: string | null;
  city?: string | null;
  county?: string | null;
  denomination?: string | null;
  description?: string | null;
  programs?: string[] | null;
  features?: string[] | null;
  service_times?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

export interface Resource {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  slug: string;
  tags: string[];
  featured: boolean;
  published?: boolean;
  created_at?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in your environment.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);