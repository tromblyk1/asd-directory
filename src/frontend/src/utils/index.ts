// Utility functions for the application

export function createPageUrl(pageName: string): string {
  const routes: Record<string, string> = {
    Home: '/',
    Directory: '/directory',
    Map: '/map',
    FaithResources: '/faith',
    ResourceDetail: '/resource',
    Events: '/events',
    Blog: '/blog',
    BlogPost: '/blog',
    SubmitResource: '/submit',
    Donate: '/donate',
    About: '/about',
    Contact: '/contact',
    FindProviders: '/providers',
    EducationalResources: '/education',
    ServiceDetail: '/education/services',
    InsuranceDetail: '/education/insurances',
    ScholarshipDetail: '/education/scholarships',
  };

  return routes[pageName] || '/';
}

// Format phone numbers
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Convert slug to title case
export function slugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Convert title to slug
export function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}