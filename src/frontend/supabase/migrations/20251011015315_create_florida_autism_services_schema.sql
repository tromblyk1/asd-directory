/*
  # Florida Autism Services Database Schema

  ## Overview
  Creates the complete database structure for the Florida Autism Services directory platform,
  including providers, churches, educational resources, submissions, and contact forms.

  ## New Tables

  ### 1. `providers`
  Stores autism service provider information across Florida
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Provider/organization name
  - `description` (text) - Detailed description of services
  - `address` (text) - Physical address
  - `city` (text) - City location
  - `county` (text) - County location
  - `zip_code` (text) - ZIP code
  - `latitude` (numeric) - Map coordinate
  - `longitude` (numeric) - Map coordinate
  - `phone` (text) - Contact phone
  - `email` (text) - Contact email
  - `website` (text) - Provider website URL
  - `service_types` (text[]) - Array of service types (ABA, Speech, OT, etc.)
  - `settings` (text[]) - Service settings (clinic, in-home, telehealth)
  - `credentials` (text) - Professional credentials
  - `rating` (numeric) - Average rating (0-5)
  - `review_count` (integer) - Number of reviews
  - `is_verified` (boolean) - Verification status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `churches`
  Stores faith-based organizations offering autism support
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Church/organization name
  - `description` (text) - Programs and services description
  - `address` (text) - Physical address
  - `city` (text) - City location
  - `county` (text) - County location
  - `zip_code` (text) - ZIP code
  - `latitude` (numeric) - Map coordinate
  - `longitude` (numeric) - Map coordinate
  - `phone` (text) - Contact phone
  - `email` (text) - Contact email
  - `website` (text) - Church website URL
  - `denomination` (text) - Religious denomination
  - `programs` (text[]) - Array of autism programs offered
  - `features` (text[]) - Special features (sensory-friendly, quiet room, etc.)
  - `service_times` (text) - Service schedule information
  - `is_verified` (boolean) - Verification status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `resources`
  Educational articles and resource content
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Article title
  - `slug` (text, unique) - URL-friendly identifier
  - `category` (text) - Resource category
  - `excerpt` (text) - Brief summary
  - `content` (text) - Full article content (markdown)
  - `author` (text) - Content author
  - `tags` (text[]) - Array of topic tags
  - `featured` (boolean) - Featured status
  - `published` (boolean) - Publication status
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. `provider_submissions`
  Pending provider submissions for review
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Provider name
  - `description` (text) - Service description
  - `address` (text) - Physical address
  - `city` (text) - City location
  - `county` (text) - County location
  - `zip_code` (text) - ZIP code
  - `phone` (text) - Contact phone
  - `email` (text) - Contact email
  - `website` (text) - Provider website
  - `service_types` (text[]) - Requested service types
  - `settings` (text[]) - Service settings
  - `credentials` (text) - Professional credentials
  - `status` (text) - Review status (pending, approved, rejected)
  - `notes` (text) - Admin review notes
  - `created_at` (timestamptz) - Submission timestamp

  ### 5. `contact_messages`
  Contact form submissions and feedback
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `type` (text) - Message type (general, feedback, update)
  - `status` (text) - Processing status (new, read, resolved)
  - `created_at` (timestamptz) - Submission timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for verified providers, churches, and published resources
  - Authenticated admin access for submissions and messages
  - Submissions open to public for form filling

  ## Indexes
  - Location-based searches (city, county, zip_code)
  - Service type filtering
  - Full-text search on names and descriptions
*/

-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  county text NOT NULL,
  zip_code text NOT NULL,
  latitude numeric,
  longitude numeric,
  phone text,
  email text,
  website text,
  service_types text[] DEFAULT '{}',
  settings text[] DEFAULT '{}',
  credentials text,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create churches table
CREATE TABLE IF NOT EXISTS churches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  county text NOT NULL,
  zip_code text NOT NULL,
  latitude numeric,
  longitude numeric,
  phone text,
  email text,
  website text,
  denomination text,
  programs text[] DEFAULT '{}',
  features text[] DEFAULT '{}',
  service_times text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text DEFAULT 'Florida Autism Services',
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create provider_submissions table
CREATE TABLE IF NOT EXISTS provider_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  city text NOT NULL,
  county text,
  zip_code text NOT NULL,
  phone text,
  email text NOT NULL,
  website text,
  service_types text[] DEFAULT '{}',
  settings text[] DEFAULT '{}',
  credentials text,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  type text DEFAULT 'general',
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(city);
CREATE INDEX IF NOT EXISTS idx_providers_county ON providers(county);
CREATE INDEX IF NOT EXISTS idx_providers_zip ON providers(zip_code);
CREATE INDEX IF NOT EXISTS idx_providers_verified ON providers(is_verified);
CREATE INDEX IF NOT EXISTS idx_providers_service_types ON providers USING gin(service_types);

CREATE INDEX IF NOT EXISTS idx_churches_city ON churches(city);
CREATE INDEX IF NOT EXISTS idx_churches_county ON churches(county);
CREATE INDEX IF NOT EXISTS idx_churches_zip ON churches(zip_code);
CREATE INDEX IF NOT EXISTS idx_churches_verified ON churches(is_verified);

CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_published ON resources(published);

CREATE INDEX IF NOT EXISTS idx_submissions_status ON provider_submissions(status);
CREATE INDEX IF NOT EXISTS idx_messages_status ON contact_messages(status);

-- Enable Row Level Security
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for providers (public read for verified)
CREATE POLICY "Public can view verified providers"
  ON providers FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Authenticated users can manage providers"
  ON providers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for churches (public read for verified)
CREATE POLICY "Public can view verified churches"
  ON churches FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Authenticated users can manage churches"
  ON churches FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for resources (public read for published)
CREATE POLICY "Public can view published resources"
  ON resources FOR SELECT
  USING (published = true);

CREATE POLICY "Authenticated users can manage resources"
  ON resources FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for provider_submissions (public can insert, admin can view/manage)
CREATE POLICY "Anyone can submit providers"
  ON provider_submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON provider_submissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update submissions"
  ON provider_submissions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for contact_messages (public can insert, admin can view)
CREATE POLICY "Anyone can send contact messages"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update message status"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);