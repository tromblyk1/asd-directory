import React from "react";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Florida Autism Services Directory</title>
        <meta name="description" content="Privacy policy for Florida Autism Services Directory. Learn how we collect, use, and protect your information." />
        <link rel="canonical" href="https://floridaautismservices.com/privacy-policy" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-10 sm:py-14 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold">Privacy Policy</h1>
            <p className="mt-2 text-teal-100 text-sm">Last updated: March 2026</p>
          </div>
        </header>

        {/* Content */}
        <main className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-10 space-y-8 text-gray-700 leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Information We Collect</h2>
              <p>
                When you use the Florida Autism Services Directory, we collect anonymous directory usage data such as pages visited and search queries to help us improve the site. If you voluntarily submit a provider listing, we collect the information you provide in that form, including business name, address, services offered, and contact details. We also collect information you share through our contact form and any details you provide when signing up for our newsletter.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Your Information</h2>
              <p>
                We use the information we collect to operate and improve the directory, ensuring families can find accurate and up-to-date autism service providers across Florida. We use contact form submissions to respond to your inquiries. If you subscribe to the FLASpoint newsletter, we use your email address to send you periodic updates about new resources, events, and directory features. You can opt out of the newsletter at any time by clicking the unsubscribe link included in every email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Information Sharing</h2>
              <p>
                We do not sell your personal information to third parties. Provider listings, including business name, address, phone number, website, and services offered, are publicly visible by design — the core purpose of this directory is to help families discover and connect with autism service providers. We will not share your personal contact information beyond what is necessary to operate the directory and respond to your requests.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies & Analytics</h2>
              <p>
                We use Google Analytics to collect anonymous usage statistics, such as the number of visitors, most-viewed pages, and general geographic regions of our audience. This data helps us understand how the directory is used so we can prioritize improvements. Google Analytics may use cookies to distinguish unique users. No personally identifiable information is collected through analytics.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
              <p>
                If you have questions about this privacy policy or how your information is handled, please reach out to us at{" "}
                <a
                  href="mailto:contact@floridaautismservices.com"
                  className="text-teal-600 hover:text-teal-700 underline"
                >
                  contact@floridaautismservices.com
                </a>.
              </p>
            </section>

          </div>
        </main>
      </div>
    </>
  );
}
