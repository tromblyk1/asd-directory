import React, { useEffect, useState } from 'react';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import ProvidersPage from './pages/ProvidersPage';
import ChurchesPage from './pages/ChurchesPage';
import Resources from './pages/Resources';
import { ContactPage } from './pages/ContactPage';
import { SubmitProviderPage } from './pages/SubmitProviderPage';
import { AboutPage } from './pages/AboutPage';
import { updateSEO, generateStructuredData } from './utils/seo';
import ABATherapy from './pages/resources/types-of-therapy/ABATherapy';
import MedicaidWaiver from '../../pages/resources/insurance-funding/MedicaidWaiver';

type Page =
  | 'home'
  | 'providers'
  | 'churches'
  | 'resources'
  | 'contact'
  | 'submit'
  | 'about'
  | 'resource'
  | 'article';

interface PageData {
  slug?: string;
  category?: string;
  query?: string;
  [key: string]: unknown;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [pageData, setPageData] = useState<PageData | null>(null);

  useEffect(() => {
    generateStructuredData('Organization');
    generateStructuredData('WebSite');
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        if (event.state.data) {
          setPageData(event.state.data);
        }
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    // Set initial state
    if (!window.history.state) {
      window.history.replaceState({ page: 'home' }, '', '/');
    }

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  switch (currentPage) {
    case 'home':
      updateSEO({
        title: 'Home',
        description:
          'Find trusted autism service providers, resources, and support across Florida. Comprehensive directory of verified ABA therapy, speech therapy, occupational therapy, and more.',
        keywords: [
          'Florida autism services',
          'autism support Florida',
          'ASD therapies Florida',
          'autism providers',
          'special needs services Florida',
        ],
        url: 'https://floridaautismservices.com',
        canonicalUrl: 'https://floridaautismservices.com',
      });
      break;
    case 'providers':
      updateSEO({
        title: 'Find Providers',
        description:
          'Search verified autism service providers across Florida. Filter by location, service type, and setting. Find ABA, speech, occupational therapy, and more.',
        keywords: [
          'autism providers Florida',
          'ABA therapy Florida',
          'speech therapy autism',
          'occupational therapy ASD',
          'autism specialists',
        ],
        url: 'https://floridaautismservices.com/providers',
        canonicalUrl: 'https://floridaautismservices.com/providers',
      });
      break;
    case 'churches':
      updateSEO({
        title: 'Faith-Based Support',
        description:
          'Find welcoming churches and faith-based organizations in Florida offering autism support programs, sensory-friendly services, and inclusive communities.',
        keywords: [
          'autism friendly churches Florida',
          'sensory-friendly church',
          'faith-based autism support',
          'special needs ministry',
        ],
        url: 'https://floridaautismservices.com/churches',
        canonicalUrl: 'https://floridaautismservices.com/churches',
      });
      break;
    case 'resources':
      updateSEO({
        title: 'Educational Resources',
        description:
          'Learn about autism therapies, insurance, education rights, and more. Comprehensive guides and articles for families navigating autism services in Florida.',
        keywords: [
          'autism resources Florida',
          'IEP Florida',
          'autism insurance coverage',
          'early intervention Florida',
          'autism education',
        ],
        url: 'https://floridaautismservices.com/resources',
        canonicalUrl: 'https://floridaautismservices.com/resources',
      });
      break;
    case 'article': {
      const slug = pageData?.slug || '';
      const articleTitles: { [key: string]: string } = {
        'understanding-aba-therapy-florida': 'Understanding ABA Therapy in Florida',
        'florida-medicaid-waiver-autism-guide': 'Florida Medicaid Waiver Guide',
        'iep-vs-504-plan-comparison': 'IEP vs 504 Plan Comparison',
        'speech-therapy-autism-expectations': 'Speech Therapy for Autism',
      };
      const articleTitle = articleTitles[slug] || 'Resource Article';
      
      updateSEO({
        title: articleTitle,
        description: 'In-depth resource article for Florida Autism Services families.',
        url: `https://floridaautismservices.com/resources/${slug}`,
        canonicalUrl: `https://floridaautismservices.com/resources/${slug}`,
      });
      break;
    }
    case 'contact':
      updateSEO({
        title: 'Contact Us',
        description: "Get in touch with Florida Autism Services. We're here to help you find the support and resources you need.",
        url: 'https://floridaautismservices.com/contact',
        canonicalUrl: 'https://floridaautismservices.com/contact',
      });
      break;
    case 'submit':
      updateSEO({
        title: 'Submit a Provider',
        description:
          'Help other families by adding a trusted autism service provider to our directory. All submissions are reviewed and verified.',
        url: 'https://floridaautismservices.com/submit',
        canonicalUrl: 'https://floridaautismservices.com/submit',
      });
      break;
    case 'about':
      updateSEO({
        title: 'About Us',
        description:
          'Learn about our mission to connect families with trusted autism services across Florida. Discover our vetting process and values.',
        url: 'https://floridaautismservices.com/about',
        canonicalUrl: 'https://floridaautismservices.com/about',
      });
      break;
  }
}, [currentPage, pageData]);

  const handleNavigate = (page: string, data?: unknown) => {
    setCurrentPage(page as Page);

    // Add to browser history
    const state = { page, data };
    const url = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(state, '', url);

    if (typeof data === 'string') {
      setSearchQuery(data);
      setPageData(null);
      return;
    }

    if (data && typeof data === 'object') {
      const typedData = data as PageData;
      setPageData(typedData);
      if (typedData.query && typeof typedData.query === 'string') {
        setSearchQuery(typedData.query);
      } else {
        setSearchQuery('');
      }
      return;
    }

    setSearchQuery('');
    setPageData(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'providers':
        return <ProvidersPage initialSearch={searchQuery} />;
      case 'churches':
        return <ChurchesPage />;
      case 'resources':
        return <Resources onNavigate={handleNavigate} />;
      case 'article': {
        const slug = pageData?.slug;

        switch (slug) {
          case 'understanding-aba-therapy-florida':
            return <ABATherapy onNavigate={handleNavigate} />;
          case 'florida-medicaid-waiver-autism-guide':
            return <MedicaidWaiver onNavigate={handleNavigate} />;
          case 'iep-vs-504-plan-comparison':
          case 'speech-therapy-autism-expectations':
            return (
              <div className="mx-auto max-w-4xl p-8">
                <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">Article Coming Soon</h1>
                <p className="mb-6 text-slate-600 dark:text-slate-300">
                  This article is currently being developed. Check back shortly for a full guide.
                </p>
                <button
                  type="button"
                  onClick={() => handleNavigate('resources')}
                  className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700"
                >
                  &larr; Back to Resources
                </button>
              </div>
            );
          default:
            return (
              <div className="mx-auto max-w-4xl p-8">
                <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-100">Article Not Found</h1>
                <p className="mb-6 text-slate-600 dark:text-slate-300">
                  The article you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <button
                  type="button"
                  onClick={() => handleNavigate('resources')}
                  className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white shadow transition hover:bg-green-700"
                >
                  &larr; Back to Resources
                </button>
              </div>
            );
        }
      }
      case 'contact':
        return <ContactPage />;
      case 'submit':
        return <SubmitProviderPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <AccessibilityProvider>
      <div className="flex min-h-screen flex-col">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="mx-auto w-full flex-1 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {renderPage()}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </AccessibilityProvider>
  );
}

export default App;
