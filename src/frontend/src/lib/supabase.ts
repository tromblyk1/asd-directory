import { createClient } from '@supabase/supabase-js';

export interface Provider {
  id?: string;
  provider_id?: string | number | null;
  provider_name?: string | null;
  google_place_id?: string | null;
  verified?: boolean | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  street?: string | null;
  address1?: string | null;
  address2?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  scraped_website?: string | null;
  service_type?: string | null;
  service_types?: string[] | null;
  accepts_medicaid?: string | null;
  accepts_medicare?: string | null;
  accepts_florida_blue?: string | null;
  accepts_unitedhealthcare?: string | null;
  accepts_aetna?: string | null;
  accepts_cigna?: string | null;
  accepts_tricare?: string | null;
  accepts_humana?: string | null;
  accepts_florida_healthcare_plans?: string | null;
  aba?: boolean | null;
  speech?: boolean | null;
  ot?: boolean | null;
  pt?: boolean | null;
  speech_therapy?: boolean | null;
  occupational_therapy?: boolean | null;
  physical_therapy?: boolean | null;
  respite_care?: boolean | null;
  life_skills?: boolean | null;
  life_skills_development?: boolean | null;
  residential?: boolean | null;
  residential_habilitation?: boolean | null;
  church_support?: boolean | null;
  pet_therapy?: boolean | null;
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
