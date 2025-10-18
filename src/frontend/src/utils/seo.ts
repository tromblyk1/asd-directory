export const updateSEO = (config: {
  title?: string;
  description?: string;
  keywords?: string[];
  type?: string;
  url?: string;
}) => {
  const baseTitle = 'Florida Autism Services';
  const title = config.title ? `${config.title} | ${baseTitle}` : baseTitle;
  const description = config.description || 'Connecting families to autism services across Florida. Find verified providers, resources, and support for individuals with autism and their families.';
  const keywords = config.keywords || ['Florida autism services', 'autism support Florida', 'ASD therapies', 'autism providers', 'special needs services'];

  document.title = title;

  const setMetaTag = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`);

    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }

    element.setAttribute('content', content);
  };

  setMetaTag('description', description);
  setMetaTag('keywords', keywords.join(', '));

  setMetaTag('og:title', title, true);
  setMetaTag('og:description', description, true);
  setMetaTag('og:type', config.type || 'website', true);
  setMetaTag('og:url', config.url || 'https://floridaautismservices.com', true);

  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);
};

export const generateStructuredData = (type: 'Organization' | 'WebSite' | 'LocalBusiness', data?: any) => {
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  if (type === 'Organization') {
    Object.assign(structuredData, {
      name: 'Florida Autism Services',
      description: 'Connecting families to autism services across Florida',
      url: 'https://floridaautismservices.com',
      logo: 'https://floridaautismservices.com/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-123-4567',
        contactType: 'Customer Service',
        email: 'info@floridaautismservices.com',
        areaServed: 'US-FL',
      },
    });
  } else if (type === 'WebSite') {
    Object.assign(structuredData, {
      name: 'Florida Autism Services',
      url: 'https://floridaautismservices.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://floridaautismservices.com/providers?search={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
  } else if (type === 'LocalBusiness' && data) {
    Object.assign(structuredData, data);
  }

  let scriptElement = document.querySelector('script[type="application/ld+json"]');

  if (!scriptElement) {
    scriptElement = document.createElement('script');
    scriptElement.setAttribute('type', 'application/ld+json');
    document.head.appendChild(scriptElement);
  }

  scriptElement.textContent = JSON.stringify(structuredData);
};
