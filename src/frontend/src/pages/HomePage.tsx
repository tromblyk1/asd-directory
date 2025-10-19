import React, { useState } from 'react';
import { Search, Users, Church, CheckCircle, Shield, Heart, Brain, MessageSquare, Activity, Home, HeartPulse, PawPrint } from 'lucide-react';
import { HoverBubble } from '../components/HoverBubble';
import { useAccessibility } from '../contexts/AccessibilityContext';

type HomePageProps = {
  onNavigate: (page: string, searchQuery?: string) => void;
};

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { lowSensoryMode } = useAccessibility();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('providers', searchQuery);
  };

  const categories = [
    {
      icon: Brain,
      title: 'ABA Therapy',
      description: 'Applied Behavior Analysis providers and services',
      color: 'bg-teal-100/70 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400',
      hoverInfo: 'Find licensed ABA therapists and behavioral intervention specialists',
      searchQuery: 'service=aba',
      page: 'providers' as const,
    },
    {
      icon: MessageSquare,
      title: 'Speech Therapy',
      description: 'Speech-language pathologists and communication support',
      color: 'bg-green-100/70 dark:bg-green-900/20 text-green-700 dark:text-green-400',
      hoverInfo: 'Speech and language therapy specialists for autism',
      searchQuery: 'service=speech',
      page: 'providers' as const,
    },
    {
      icon: Activity,
      title: 'Occupational Therapy',
      description: 'OT services for sensory and motor skill development',
      color: 'bg-rose-100/60 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400',
      hoverInfo: 'Occupational therapists specializing in autism support',
      searchQuery: 'service=ot',
      page: 'providers' as const,
    },
    {
      icon: HeartPulse,
      title: 'Physical Therapy',
      description: 'PT services for mobility, balance, and strength',
      color: 'bg-blue-100/70 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
      hoverInfo: 'Physical therapists experienced with sensory and motor needs',
      searchQuery: 'service=pt',
      page: 'providers' as const,
    },
    {
      icon: Church,
      title: 'Faith-Based Support',
      description: 'Autism-friendly churches and religious organizations',
      color: 'bg-sky-100/70 dark:bg-blue-900/20 text-sky-700 dark:text-blue-400',
      hoverInfo: 'Find welcoming faith communities with sensory-friendly services',
      searchQuery: '',
      page: 'churches' as const,
    },
    {
      icon: Heart,
      title: 'Respite Care',
      description: 'Temporary relief care for families and caregivers',
      color: 'bg-amber-100/70 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
      hoverInfo: 'Respite care services to support families',
      searchQuery: 'service=respite',
      page: 'providers' as const,
    },
    {
      icon: Home,
      title: 'Residential Supports',
      description: 'Group homes, supported living, and housing resources',
      color: 'bg-orange-100/70 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
      hoverInfo: 'Residential programs tailored for autistic children and adults',
      searchQuery: 'service=residential',
      page: 'providers' as const,
    },
    {
      icon: Users,
      title: 'Life Skills',
      description: 'Daily living and social skills development programs',
      color: 'bg-violet-100/60 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400',
      hoverInfo: 'Programs to build independence and social confidence',
      searchQuery: 'service=life_skills',
      page: 'providers' as const,
    },
    {
      icon: PawPrint,
      title: 'Pet Therapy',
      description: 'Animal-assisted therapy and emotional support programs',
      color: 'bg-lime-100/70 dark:bg-lime-900/20 text-lime-700 dark:text-lime-400',
      hoverInfo: 'Therapeutic programs featuring service animals and equine therapy',
      searchQuery: 'service=pet_therapy',
      page: 'providers' as const,
    },
  ];

  return (
    <div className="space-y-16">
      <section className="relative bg-gradient-to-br from-sky-100/40 via-teal-50/30 to-blue-100/40 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-16 overflow-hidden shadow-sm">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Background watermark logo */}
          <img
            src="/Ribbon_Rainbow-Infinite.png"
            alt=""
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-auto h-96 opacity-30 pointer-events-none"
          />
          
          {/* Content wrapper */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">
              Connecting Families to Autism Services Across Florida
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              A trusted directory of verified providers, resources, and support for individuals with autism and their families.
            </p>

            <form onSubmit={handleSearch} className="mt-8">
              <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by city, ZIP code, or service type..."
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-blue-200/50 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    aria-label="Search for providers"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Find Providers
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-12">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.title}
              onClick={() => onNavigate(category.page, category.searchQuery)}
              className={`group relative text-left p-6 rounded-2xl border border-blue-100 dark:border-slate-700 bg-white/80 dark:bg-slate-800 hover:border-teal-300 dark:hover:border-teal-600 hover:bg-white ${lowSensoryMode ? '' : 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1'
                }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${category.color}`}>
                  <category.icon className="w-6 h-6" />
                </div>
                <HoverBubble content={category.hoverInfo} position="left" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
                {category.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {category.description}
              </p>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-blue-50/30 to-teal-50/30 dark:bg-slate-800/50 rounded-3xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center mb-4">
          Why Florida Autism Services?
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
          We carefully vet and verify each provider to ensure families can trust the information they find.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-200/60 dark:bg-teal-900/30 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Verified Listings</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Every provider is reviewed and verified before being listed in our directory.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-200/60 dark:bg-green-900/30 rounded-2xl">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Family Reviews</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Read authentic reviews from families who have used these services.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-200/60 dark:bg-blue-900/30 rounded-2xl">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Always Free</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Our directory is completely free for families to use. No hidden fees or subscriptions.
            </p>
          </div>
        </div>
      </section>

      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Join thousands of families across Florida who have found the support they need through our directory.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onNavigate('providers')}
            className="px-8 py-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Browse Providers
          </button>
          <button
            onClick={() => onNavigate('resources')}
            className="px-8 py-4 bg-white hover:bg-blue-50/50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-100 font-semibold rounded-xl border border-blue-200 dark:border-slate-700 transition-all"
          >
            View Resources
          </button>
        </div>
      </section>
    </div>
  );
};
