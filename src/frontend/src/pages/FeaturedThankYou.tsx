import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function FeaturedThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center p-6">
      <Helmet>
        <title>Payment Received | Florida Autism Services Directory</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl p-6 sm:p-8 lg:p-12 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Payment received — welcome aboard!
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-6">
          Your featured listing is being activated. We'll set everything up and email you
          a confirmation within 1 business day, along with a request for any photos or
          details you'd like showcased.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Questions? Email us at{" "}
          <a href="mailto:contact@floridaautismservices.com" className="text-teal-600 underline hover:text-teal-700">
            contact@floridaautismservices.com
          </a>
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 transition-colors shadow-md"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
