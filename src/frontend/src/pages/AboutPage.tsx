import React, { useState } from 'react';
import { Infinity, Target, Shield, Users, CheckCircle, Eye, Heart } from 'lucide-react';
import { DonateModal } from '../components/DonateModal';

export const AboutPage: React.FC = () => {
  const [donateModalOpen, setDonateModalOpen] = useState(false);

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-br from-sky-100/40 via-teal-50/30 to-amber-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-12 text-center">
        <Infinity className="w-20 h-20 text-amber-500 dark:text-amber-400 mx-auto mb-6" strokeWidth={2.5} />
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
          Our Mission
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          To connect families across Florida with trusted, verified autism services and support,
          making it easier to find the care and resources they need.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">
          What We Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-2xl mb-4">
              <Target className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Curate Quality Listings
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              We carefully review and verify every provider, church, and resource before adding them
              to our directory to ensure families can trust the information.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-4">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Build Community
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              We create connections between families, providers, and support organizations to foster
              a stronger autism community across Florida.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Provide Education
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              We share valuable resources, articles, and guides to help families navigate autism
              services, understand their rights, and make informed decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">
          Our Vetting Process
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
          Every listing goes through a thorough review process to maintain the quality and
          trustworthiness of our directory.
        </p>

        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
              <span className="text-teal-600 dark:text-teal-400 font-bold">1</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Initial Submission Review
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We review all submitted information for completeness and accuracy, checking business
                details, contact information, and service descriptions.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
              <span className="text-teal-600 dark:text-teal-400 font-bold">2</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Credential Verification
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We verify professional credentials, licenses, and certifications to ensure providers
                meet Florida state requirements and industry standards.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
              <span className="text-teal-600 dark:text-teal-400 font-bold">3</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Contact Verification
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We reach out to providers directly to confirm their listing information, current
                services, and availability.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
              <span className="text-teal-600 dark:text-teal-400 font-bold">4</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Publication & Ongoing Updates
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Once verified, listings are published. We regularly update information and encourage
                families to report changes or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start space-x-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Trust & Transparency
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We believe families deserve accurate, trustworthy information. We're transparent about
                our vetting process and always prioritize data integrity.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Accessibility for All
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our platform is designed to be accessible, with features like dark mode and low-sensory
                options to accommodate different needs and preferences.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Community-Driven
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                We welcome input from families, providers, and community members to continually improve
                and expand our directory.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
            <CheckCircle className="w-6 h-6 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Always Free
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Our directory is and always will be completely free for families to use. We never charge
                for access to provider information or resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-teal-50 to-green-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-8 text-center">
        <Eye className="w-12 h-12 text-teal-600 dark:text-teal-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Our Vision
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
          We envision a Florida where every family affected by autism can easily find the services,
          support, and community they need to thrive. By building the most comprehensive and trusted
          directory of autism resources, we're working to make that vision a reality.
        </p>
      </section>

      <section className="text-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Privacy & Data Protection
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-6">
          We take your privacy seriously. We do not sell or share user data with third parties.
          All information submitted through our forms is used solely to improve our directory and
          communicate with submitters when necessary.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-500">
          For more information, please review our Privacy Policy and Terms of Service.
        </p>
      </section>

      <section className="bg-gradient-to-br from-amber-50 via-teal-50/30 to-sky-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-8 md:p-12 border-2 border-amber-200/50 dark:border-amber-800/30">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
            <Heart className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">
            Support the Cause
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-800 dark:text-slate-100">Florida Autism Services is a free community resource.</strong>
            {' '}Donations help us verify providers, maintain the site, expand our directory, and keep this valuable resource accessible to all families navigating autism services in Florida.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4">
              <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Verify Providers</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Professional credential checks</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4">
              <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Expand Access</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Reach more families statewide</p>
            </div>
            <div className="bg-white/70 dark:bg-slate-800/70 rounded-xl p-4">
              <CheckCircle className="w-8 h-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Stay Free</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Always accessible to all</p>
            </div>
          </div>
          <button
            onClick={() => setDonateModalOpen(true)}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Heart className="w-5 h-5" />
            <span>Make a Donation</span>
          </button>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Every contribution, big or small, makes a difference
          </p>
        </div>
      </section>

      <DonateModal isOpen={donateModalOpen} onClose={() => setDonateModalOpen(false)} />
    </div>
  );
};
