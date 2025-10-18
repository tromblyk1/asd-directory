import React, { useState, useEffect } from 'react';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import ProvidersPage from './pages/ProvidersPage';
import ChurchesPage from './pages/ChurchesPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ContactPage } from './pages/ContactPage';
import { SubmitProviderPage } from './pages/SubmitProviderPage';
import { AboutPage } from './pages/AboutPage';
import { updateSEO, generateStructuredData } from './utils/seo';

type Page = 'home' | 'providers' | 'churches' | 'resources' | 'contact' | 'submit' | 'about' | 'resource';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    generateStructuredData('Organization');
    generateStructuredData('WebSite');
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (currentPage) {
      case 'home':
        updateSEO({
          title: 'Home',
          description: 'Find trusted autism service providers, resources, and support across Florida. Comprehensive directory of verified ABA therapy, speech therapy, occupational therapy, and more.',
          keywords: ['Florida autism services', 'autism support Florida', 'ASD therapies Florida', 'autism providers', 'special needs services Florida'],
        });
        break;
      case 'providers':
        updateSEO({
          title: 'Find Providers',
          description: 'Search verified autism service providers across Florida. Filter by location, service type, and setting. Find ABA, speech, occupational therapy, and more.',
          keywords: ['autism providers Florida', 'ABA therapy Florida', 'speech therapy autism', 'occupational therapy ASD', 'autism specialists'],
        });
        break;
      case 'churches':
        updateSEO({
          title: 'Faith-Based Support',
          description: 'Find welcoming churches and faith-based organizations in Florida offering autism support programs, sensory-friendly services, and inclusive communities.',
          keywords: ['autism friendly churches Florida', 'sensory-friendly church', 'faith-based autism support', 'special needs ministry'],
        });
        break;
      case 'resources':
        updateSEO({
          title: 'Educational Resources',
          description: 'Learn about autism therapies, insurance, education rights, and more. Comprehensive guides and articles for families navigating autism services in Florida.',
          keywords: ['autism resources Florida', 'IEP Florida', 'autism insurance coverage', 'early intervention Florida', 'autism education'],
        });
        break;
      case 'contact':
        updateSEO({
          title: 'Contact Us',
          description: 'Get in touch with Florida Autism Services. We\'re here to help you find the support and resources you need.',
        });
        break;
      case 'submit':
        updateSEO({
          title: 'Submit a Provider',
          description: 'Help other families by adding a trusted autism service provider to our directory. All submissions are reviewed and verified.',
        });
        break;
      case 'about':
        updateSEO({
          title: 'About Us',
          description: 'Learn about our mission to connect families with trusted autism services across Florida. Discover our vetting process and values.',
        });
        break;
    }
  }, [currentPage]);

  const handleNavigate = (page: string, query?: string) => {
    setCurrentPage(page as Page);
    if (query) {
      setSearchQuery(query);
    } else {
      setSearchQuery('');
    }
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
        return <ResourcesPage onNavigate={handleNavigate} />;
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
      <div className="min-h-screen flex flex-col">
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPage()}
        </main>
        <Footer onNavigate={handleNavigate} />
      </div>
    </AccessibilityProvider>
  );
}

export default App;
