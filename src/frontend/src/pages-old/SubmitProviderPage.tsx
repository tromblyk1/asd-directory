import React, { useState } from 'react';
import { Building2, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const SubmitProviderPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    county: '',
    zip_code: '',
    phone: '',
    email: '',
    website: '',
    service_types: [] as string[],
    settings: [] as string[],
    credentials: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const serviceTypes = [
    'ABA Therapy',
    'Speech Therapy',
    'Occupational Therapy',
    'Physical Therapy',
    'Behavioral Support',
    'Social Skills Groups',
    'Early Intervention',
    'Respite Care',
    'Case Management',
    'Diagnostic Services',
  ];

  const settings = ['Clinic', 'In-Home', 'Telehealth', 'School-Based'];

  const handleServiceTypeToggle = (service: string) => {
    setFormData({
      ...formData,
      service_types: formData.service_types.includes(service)
        ? formData.service_types.filter((s) => s !== service)
        : [...formData.service_types, service],
    });
  };

  const handleSettingToggle = (setting: string) => {
    setFormData({
      ...formData,
      settings: formData.settings.includes(setting)
        ? formData.settings.filter((s) => s !== setting)
        : [...formData.settings, setting],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (formData.service_types.length === 0) {
      setError('Please select at least one service type');
      setSubmitting(false);
      return;
    }

    if (formData.settings.length === 0) {
      setError('Please select at least one service setting');
      setSubmitting(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('provider_submissions')
        .insert([{ ...formData, status: 'pending' }]);

      if (error) throw error;

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting provider:', err);
      setError('Failed to submit provider. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/40 rounded-full mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Submission Received!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Thank you for submitting a provider to our directory.
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            All submissions are reviewed before publication to ensure accuracy and quality.
            We'll contact you if we need additional information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-2xl mb-4">
          <Building2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Submit a Provider
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Know a great autism service provider? Help other families by adding them to our directory.
          All submissions are reviewed before publication.
        </p>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-900 dark:text-blue-300">
          <strong>Verification Process:</strong> We review all submissions to verify credentials, services,
          and contact information before adding providers to our directory. This helps maintain trust and quality.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Basic Information
          </h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Provider/Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
                placeholder="Describe the services offered..."
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label htmlFor="county" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                County
              </label>
              <input
                type="text"
                id="county"
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label htmlFor="zip_code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="zip_code"
                required
                value={formData.zip_code}
                onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="website" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Website
              </label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                placeholder="https://"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Service Types <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Select all that apply
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceTypes.map((service) => (
              <label
                key={service}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.service_types.includes(service)}
                  onChange={() => handleServiceTypeToggle(service)}
                  className="w-4 h-4 text-teal-600 border-slate-300 dark:border-slate-600 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{service}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Service Settings <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Where are services provided?
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {settings.map((setting) => (
              <label
                key={setting}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.settings.includes(setting)}
                  onChange={() => handleSettingToggle(setting)}
                  className="w-4 h-4 text-teal-600 border-slate-300 dark:border-slate-600 rounded focus:ring-teal-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{setting}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="credentials" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Credentials & Certifications
          </label>
          <textarea
            id="credentials"
            value={formData.credentials}
            onChange={(e) => setFormData({ ...formData, credentials: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:border-teal-500 dark:focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
            placeholder="e.g., BCBA, SLP, OTR/L, State License Numbers..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-6 py-4 bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg transition-colors"
        >
          {submitting ? (
            <span className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              <span>Submitting...</span>
            </span>
          ) : (
            'Submit Provider'
          )}
        </button>
      </form>
    </div>
  );
};
