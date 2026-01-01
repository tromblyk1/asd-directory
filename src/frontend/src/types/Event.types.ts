export interface Event {
  id: string | number;
  title: string;
  slug: string;
  description?: string | null;
  category?: 'sensory_friendly' | 'support_group' | 'educational' | 'social' | 'fundraiser' | 'professional_development' | 'recreational' | 'other' | null;
  date: string;
  time?: string | null;
  location?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  organizer?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  website?: string | null;
  registration_url?: string | null;
  cost_info?: string | null;
  age_groups?: string[] | null;
  sensory_accommodations?: string | string[] | null;
  image_url?: string | null;
  featured?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
  
  // Verification fields
  verification_status?: 'verified' | 'unverified' | 'pending' | null;
  verification_source?: string | null;
  specific_accommodations_published?: boolean | null;
  accommodations_verified?: boolean | null;
  verification_notes?: string | null;
  verified_by?: string | null;
  verified_date?: string | null;
  
  // Registration fields
  registration_required?: string | null;
  registration_method?: string | null;
  registration_deadline?: string | null;
  registration_details?: string | null;
  
  // Additional EventCard fields
  event_type?: string | null;
  ceu_available?: boolean | null;
  recurring?: string | null;
  region?: string | null;
  cost?: string | null;

  // Location coordinates for map
  latitude?: number | null;
  longitude?: number | null;

  // Social media links
  facebook_url?: string | null;
  instagram_url?: string | null;
  twitter_url?: string | null;
  youtube_url?: string | null;
  linkedin_url?: string | null;
}