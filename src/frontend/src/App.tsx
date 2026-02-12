import { Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';

// Import Base44 pages
import Home from './pages/Home';
import FaithResources from './pages/FaithResources';
import ResourceDetail from './pages/ResourceDetail';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SubmitResource from './pages/SubmitResource';
import Donate from './pages/Donate';
import Guides from './pages/Guides';
import SubmitEvent from './pages/SubmitEvent';

// Import new pages
import About from './pages/about';
import Contact from './pages/contact';
import FindProviders from './pages/findproviders';
import FindSchools from './pages/FindSchools';
import SchoolDetail from './pages/SchoolDetail';
import ProviderDetail from './pages/ProviderDetail';
import EducationalResources from './pages/educationalresources';
import ServiceDetail from './pages/ServiceDetail';
import InsuranceDetail from './pages/InsuranceDetail';
import ScholarshipDetail from './pages/ScholarshipDetail';
import ResourceCategory from './pages/ResourceCategory';
import DenominationDetail from './pages/DenominationDetail';
import SchoolTypeDetail from './pages/SchoolTypeDetail';
import AccreditationDetail from './pages/AccreditationDetail';
import ChurchDetail from './pages/ChurchDetail';
import FeaturedListings from './pages/FeaturedListings';
import FeaturedSelectPT from './pages/FeaturedSelectPT';
import FindDaycares from './pages/FindDaycares';
import DaycareDetail from './pages/DaycareDetail';
import SubmitDaycare from './pages/SubmitDaycare';
import DaycareResourceDetail from './pages/DaycareResourceDetail';

function App() {
  return (
    <Layout>
      <Routes>
        {/* Base44 Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/faith" element={<FaithResources />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:slug" element={<EventDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/submit" element={<SubmitResource />} />
        <Route path="/submit-event" element={<SubmitEvent />} />
        <Route path="/submit-daycare" element={<SubmitDaycare />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guides/:id" element={<BlogPost />} />

        {/* New Routes */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/providers" element={<FindProviders />} />
        <Route path="/providers/:slug" element={<ProviderDetail />} />
        <Route path="/schools" element={<FindSchools />} />
        <Route path="/schools/:slug" element={<SchoolDetail />} />
        <Route path="/find-daycares" element={<FindDaycares />} />
        <Route path="/daycare/:slug" element={<DaycareDetail />} />
        <Route path="/churches/:slug" element={<ChurchDetail />} />
        <Route path="/featured" element={<FeaturedListings />} />
        <Route path="/featured/select-physical-therapy" element={<FeaturedSelectPT />} />

        {/* Educational Resources Routes */}
        <Route path="/resources" element={<EducationalResources />} />
        <Route path="/resources/:category" element={<ResourceCategory />} />
        <Route path="/resources/services/:slug" element={<ServiceDetail />} />
        <Route path="/resources/insurances/:slug" element={<InsuranceDetail />} />
        <Route path="/resources/scholarships/:slug" element={<ScholarshipDetail />} />
        <Route path="/resources/denominations/:slug" element={<DenominationDetail />} />
        <Route path="/resources/school-types/:slug" element={<SchoolTypeDetail />} />
        <Route path="/resources/accreditations/:slug" element={<AccreditationDetail />} />
        <Route path="/resources/daycares/:slug" element={<DaycareResourceDetail />} />
      </Routes>
    </Layout>
  );
}

export default App;