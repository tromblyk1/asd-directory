# Sample Data Guide

This guide will help you populate your Florida Autism Services database with sample data for testing and demonstration.

## Quick Start

### Using Supabase SQL Editor

1. **Access Supabase**:
   - Log in to your Supabase account at https://supabase.com
   - Select your project

2. **Open SQL Editor**:
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run Sample Data**:
   - Open the `sample-data.sql` file from this project
   - Copy all the SQL code
   - Paste it into the SQL Editor
   - Click "Run" or press `Ctrl+Enter`

4. **Verify Data**:
   - Go to "Table Editor" in the left sidebar
   - Check the `providers`, `churches`, and `resources` tables
   - You should see the sample records

## Sample Data Included

### Providers (5 records)
- **Sunshine ABA Therapy Center** (Miami) - ABA therapy services
- **Tampa Speech & Language Center** (Tampa) - Speech therapy
- **Orlando Occupational Therapy** (Orlando) - Occupational therapy
- **Jacksonville Autism Support Services** (Jacksonville) - Diagnostic services
- **Gulf Coast Early Intervention** (Sarasota) - Early intervention

### Churches (4 records)
- **Grace Community Church** (Tampa) - Non-denominational
- **St. Michael Catholic Church** (Orlando) - Catholic
- **New Hope Baptist Church** (Jacksonville) - Baptist
- **Cornerstone Fellowship** (Fort Lauderdale) - Non-denominational

### Resources (5 articles)
- Understanding ABA Therapy
- Navigating Insurance in Florida
- IEP Essentials
- Early Intervention in Florida
- Self-Care for Autism Parents

## Adding Your Own Data

### Adding a Provider

```sql
INSERT INTO providers (
  name,
  description,
  address,
  city,
  county,
  zip_code,
  phone,
  email,
  website,
  service_types,
  settings,
  credentials,
  rating,
  review_count,
  is_verified
) VALUES (
  'Your Provider Name',
  'Detailed description of services...',
  '123 Main Street',
  'Your City',
  'Your County',
  '12345',
  '(123) 456-7890',
  'email@provider.com',
  'https://provider.com',
  ARRAY['ABA Therapy', 'Speech Therapy'],
  ARRAY['Clinic', 'In-Home'],
  'BCBA, State Licensed',
  4.5,
  10,
  true
);
```

### Adding a Church

```sql
INSERT INTO churches (
  name,
  description,
  address,
  city,
  county,
  zip_code,
  phone,
  email,
  website,
  denomination,
  programs,
  features,
  service_times,
  is_verified
) VALUES (
  'Your Church Name',
  'Description of programs...',
  '456 Church Street',
  'Your City',
  'Your County',
  '12345',
  '(123) 456-7890',
  'email@church.org',
  'https://church.org',
  'Non-denominational',
  ARRAY['Sensory-Friendly Service', 'Parent Support'],
  ARRAY['Quiet Room Available', 'Trained Volunteers'],
  'Sunday services: 9 AM, 11 AM',
  true
);
```

### Adding a Resource Article

```sql
INSERT INTO resources (
  title,
  slug,
  category,
  excerpt,
  content,
  author,
  tags,
  featured,
  published
) VALUES (
  'Your Article Title',
  'your-article-slug',
  'Types of Therapy',
  'Brief excerpt describing the article...',
  '# Full Article Content\n\nUse Markdown formatting here...',
  'Florida Autism Services',
  ARRAY['Tag1', 'Tag2', 'Tag3'],
  false,
  true
);
```

## Service Type Options

Common service types to use:
- ABA Therapy
- Speech Therapy
- Occupational Therapy
- Physical Therapy
- Behavioral Support
- Social Skills Groups
- Early Intervention
- Respite Care
- Case Management
- Diagnostic Services

## Service Setting Options

Common settings:
- Clinic
- In-Home
- Telehealth
- School-Based

## Church Program Options

Common programs:
- Sensory-Friendly Service
- Special Needs Ministry
- Social Skills Group
- Parent Support
- Sunday School Accommodation
- Respite Care

## Church Feature Options

Common features:
- Sensory-Friendly Worship
- Quiet Room Available
- Trained Volunteers
- Buddy Program
- Visual Schedules
- Visual Supports

## Resource Categories

Available categories:
- Types of Therapy
- Insurance & Funding
- Education & IEP
- Early Intervention
- Parent Support
- Legal Rights
- Daily Living
- Transition to Adulthood

## Important Notes

### Verification Status
- Set `is_verified = true` for providers/churches to make them visible
- Set `is_verified = false` for pending submissions

### Publication Status
- Set `published = true` for resources to make them visible
- Set `published = false` for draft articles

### Featured Content
- Set `featured = true` for resources to display in featured section
- Limit featured resources to 3-4 for best visual presentation

### Ratings
- Rating scale: 0.0 to 5.0
- Include realistic review counts
- These are display-only (no review system implemented yet)

## Clearing Sample Data

To remove all sample data and start fresh:

```sql
-- Delete all sample data
DELETE FROM providers WHERE is_verified = true;
DELETE FROM churches WHERE is_verified = true;
DELETE FROM resources WHERE published = true;
DELETE FROM provider_submissions;
DELETE FROM contact_messages;
```

**Warning**: This will delete ALL data from these tables. Use with caution!

## Bulk Import

For larger datasets:

1. **Prepare a CSV file** with your data
2. **Use Supabase Table Editor**:
   - Go to Table Editor
   - Select your table
   - Click "Import Data"
   - Upload your CSV
   - Map columns correctly
   - Import

## Testing the Website

After adding data:

1. Visit the homepage
2. Use the search function
3. Browse different categories
4. Filter by location and service type
5. Test the churches page
6. Read resource articles
7. Try submitting the contact form

## Data Quality Tips

### For Providers/Churches:
- Use real Florida cities and counties
- Include complete contact information
- Write clear, helpful descriptions
- List specific services/programs
- Verify credentials are realistic

### For Resources:
- Use descriptive, SEO-friendly titles
- Create URL-friendly slugs (lowercase, hyphens)
- Write comprehensive content
- Include practical, actionable information
- Tag appropriately for discoverability

## Need Help?

If you encounter issues:
- Check that your Supabase connection is working
- Verify RLS policies are correctly set
- Review the SQL error messages
- Ensure required fields are filled
- Check data types match schema

---

Happy data entry! Your Florida Autism Services directory will be ready to help families in no time.
