# Florida Autism Services

A comprehensive, accessible directory platform connecting families to autism services across Florida.

## Features

### Core Functionality
- **Provider Directory**: Searchable database of verified autism service providers across Florida
- **Faith-Based Support**: Directory of churches and religious organizations with autism programs
- **Resource Hub**: Educational articles and guides for families
- **Contact & Submission Forms**: Allow users to contact the team or submit new providers
- **Accessibility Features**: Dark mode and low-sensory mode toggles

### Design Principles
- **Neurodiversity Symbol**: Gold/amber infinity symbol (♾️) representing neurodiversity and autism acceptance - preferred by the autistic community over puzzle pieces
- **Inclusive Design**: Bright yet calming color palette with soft teals, sky blues, and warm gold accents
- **Low-Sensory Options**: Optional reduction of animations and motion
- **Accessible**: Keyboard navigation, semantic markup, ARIA labels, screen reader support
- **SEO Optimized**: Meta tags, structured data, descriptive content

### Pages

1. **Homepage**
   - Hero section with mission statement
   - Quick search functionality
   - Featured service categories
   - "Why this matters" section

2. **Provider Search**
   - Filterable list view
   - Filter by county, service type, and setting
   - Provider cards with ratings and contact info
   - Expandable details with hover tooltips

3. **Churches/Faith-Based**
   - Directory of inclusive religious organizations
   - Filter by region, denomination, and programs
   - Features badges (sensory-friendly, quiet room, etc.)

4. **Resources**
   - Categorized educational articles
   - Featured resources section
   - Topics: therapy types, insurance, IEP, early intervention, parent support

5. **Contact**
   - Multi-purpose contact form
   - Message type selection
   - Success confirmation

6. **Submit Provider**
   - Comprehensive submission form
   - Service type and setting selection
   - Credential fields
   - Verification disclaimer

7. **About**
   - Mission and values
   - Vetting process explanation
   - Privacy and data protection information

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite

## Database Schema

### Tables

1. **providers**: Autism service provider listings
2. **churches**: Faith-based organizations with autism programs
3. **resources**: Educational articles and guides
4. **provider_submissions**: Pending provider submissions for review
5. **contact_messages**: Contact form submissions

All tables include Row Level Security (RLS) policies for data protection.

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (database is pre-configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`

3. (Optional) Populate sample data:
   - Use the Supabase SQL editor to run `sample-data.sql`

4. Start development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Accessibility Features

### Dark Mode
- Toggle in header
- Persistent preference (localStorage)
- Smooth transitions between modes

### Low Sensory Mode
- Disables animations and transitions
- Reduces motion and visual effects
- Toggle in header

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Proper focus management
- Skip links and ARIA labels

### Screen Reader Support
- Semantic HTML
- ARIA labels on all interactive elements
- Descriptive alt text

## SEO & Metadata

- Dynamic page titles and meta descriptions
- Open Graph tags for social sharing
- Twitter Card metadata
- Structured data (JSON-LD) for Organization and WebSite
- Keyword optimization for autism services in Florida

## Deployment

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

### Deployment to Hostinger

1. Build the project locally
2. Upload the contents of the `dist` folder to your Hostinger hosting
3. Configure your domain to point to the uploaded files
4. Ensure environment variables are set in your hosting environment

### Environment Variables

Required for production:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Color Palette

The design uses a bright yet calming, neurodivergent-friendly color scheme with the gold infinity symbol as the central visual element:

- **Primary**: Teal (#0d9488, #14b8a6) - calming and professional
- **Signature Gold**: Amber (#f59e0b, #eab308) - representing the infinity symbol and neurodiversity
- **Secondary**: Soft sky blue, green, rose - uplifting pastels
- **Accent**: Light pastels with good saturation (teal-100, sky-100, amber-100, violet-100)
- **Text**: Medium grey (#475569, #64748b) - comfortable reading without harsh contrast
- **Background**: Bright whites with soft blue/teal/gold gradient overlays
- **Surfaces**: White with subtle transparency, light pastel borders (blue-100)

All colors maintain WCAG contrast ratios while providing an uplifting, comfortable visual experience suitable for individuals with sensory sensitivities. The gold infinity symbol appears throughout as a unifying design element representing autism acceptance and neurodiversity.

## Contributing

To add new providers, churches, or resources:

1. Use the "Submit Provider" form on the website, or
2. Directly insert into the database (requires authentication)

All submissions are reviewed before publication.

## Support

For questions or issues:
- Email: floridaautismservices@gmail.com
- Use the Contact form on the website

## License

Copyright 2025 Florida Autism Services. All rights reserved.
