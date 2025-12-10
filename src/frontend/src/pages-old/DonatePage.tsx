import React, { useState } from 'react';
import { DonationImpactSection } from '../components/DonationImpactSection';
import { HallOfSupportersSection } from '../components/HallOfSupportersSection';
import {
  Heart,
  Shield,
  Lock,
  Check,
  Star,
  Award,
  Trophy,
  Building,
  User,
  Mail,
  Globe,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const DonatePage: React.FC = () => {
  // Amount selection state
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<'once' | 'monthly' | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Donor information state
  const [donorType, setDonorType] = useState<'individual' | 'business'>('individual');
  const [businessName, setBusinessName] = useState('');
  const [donorName, setDonorName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [allowRecognition, setAllowRecognition] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // UI state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Tier counts (will be fetched from API in Stage 15)
  const [tierCounts] = useState({
    friend: 0,
    supporter: 0,
    advocate: 0,
    champion: 0,
  });

  // Calculate donor tier based on amount
  const getDonorTier = (amount: number): 'friend' | 'supporter' | 'advocate' | 'champion' => {
    if (amount >= 250) return 'champion';
    if (amount >= 100) return 'advocate';
    if (amount >= 50) return 'supporter';
    return 'friend';
  };

  // Get tier info for display
  const getTierInfo = (tier: string) => {
    const tierData = {
      friend: {
        name: 'Friend',
        icon: Heart,
        color: 'blue',
        benefits: ['Name listed on website', 'Thank you email', 'Quarterly newsletter'],
      },
      supporter: {
        name: 'Supporter',
        icon: Star,
        color: 'teal',
        benefits: ['All Friend benefits', 'Name + website link', 'Digital supporter badge', 'Quarterly impact reports'],
      },
      advocate: {
        name: 'Advocate',
        icon: Award,
        color: 'orange',
        benefits: ['All Supporter benefits', 'Featured on homepage rotation', 'Annual recognition event invitation', 'Direct impact updates'],
      },
      champion: {
        name: 'Champion',
        icon: Trophy,
        color: 'purple',
        benefits: ['All Advocate benefits', 'Permanent plaque recognition', 'Exclusive impact briefings', 'Direct contact with leadership', 'Featured in annual report'],
      },
    };
    return tierData[tier as keyof typeof tierData];
  };

  // Handle amount selection
  const handleAmountSelect = (amount: number, frequency: 'once' | 'monthly') => {
    setSelectedAmount(amount);
    setSelectedFrequency(frequency);
    setShowCustomInput(false);
    setCustomAmount('');
    setErrors([]);
  };

  // Handle custom amount
  const handleCustomAmount = () => {
    setShowCustomInput(true);
    setSelectedAmount(null);
    setSelectedFrequency(null);
    setErrors([]);
  };

  // Handle custom amount input
  const handleCustomAmountChange = (value: string, frequency: 'once' | 'monthly') => {
    setCustomAmount(value);
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount >= 5) {
      setSelectedAmount(amount);
      setSelectedFrequency(frequency);
    } else {
      setSelectedAmount(null);
    }
  };

  // Handle anonymous checkbox
  const handleAnonymousChange = (checked: boolean) => {
    setIsAnonymous(checked);
    if (checked) {
      setAllowRecognition(false);
    }
  };

  // Validation
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const validationErrors: string[] = [];

    // Amount validation
    if (!selectedAmount || selectedAmount < 5) {
      validationErrors.push('Please select a donation amount of at least $5');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      validationErrors.push('Email address is required');
    } else if (!emailRegex.test(email)) {
      validationErrors.push('Please enter a valid email address');
    }

    // Name validation (required unless anonymous)
    if (!isAnonymous && !donorName.trim()) {
      validationErrors.push('Please enter your name or select "Make my donation anonymous"');
    }

    // Business name validation
    if (donorType === 'business' && !isAnonymous && !businessName.trim()) {
      validationErrors.push('Business name is required for business donations');
    }

    // Website validation (if provided)
    if (website.trim()) {
      const urlRegex = /^https?:\/\/.+/;
      if (!urlRegex.test(website)) {
        validationErrors.push('Please enter a valid website URL (e.g., https://example.com)');
      }
    }

    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    };
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateForm();
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    setLoading(true);

    // Prepare data
    const donationData = {
      amount: selectedAmount!,
      frequency: selectedFrequency!,
      email,
      name: isAnonymous ? 'Anonymous' : donorName,
      businessName: donorType === 'business' ? businessName : undefined,
      website: selectedAmount! >= 50 ? website : undefined,
      donorType,
      isAnonymous,
      allowRecognition: !isAnonymous && allowRecognition,
      donorTier: getDonorTier(selectedAmount!),
    };

    try {
      // Call API endpoint (Stage 10)
      const response = await fetch('/.netlify/functions/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create donation session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Donation error:', error);
      setErrors([error instanceof Error ? error.message : 'An error occurred. Please try again.']);
      setLoading(false);
    }
  };

  // FAQ data
  const faqs = [
    {
      question: 'Is my donation secure?',
      answer: 'Absolutely! All donations are processed through Stripe, one of the world\'s most trusted payment processors. We use 256-bit SSL encryption, and your card information never touches our servers. Stripe is PCI DSS Level 1 certified—the highest security standard in the payment industry—and is used by companies like Amazon, Google, and millions of businesses worldwide. We\'ve had zero security incidents since our founding.',
    },
    {
      question: 'Do you store my credit card information?',
      answer: 'No, never. When you make a donation, you\'re redirected to Stripe\'s secure checkout page. Your card information is entered directly on Stripe\'s platform, not ours. We never see, store, or have access to your credit card details. This is by design—it\'s the safest way to process payments.',
    },
    {
      question: 'Is my donation tax-deductible?',
      answer: 'Florida Autism Services is currently operating as an informational resource and is not a registered 501(c)(3) nonprofit organization at this time. Donations are not tax-deductible. We appreciate any support to help maintain and expand this free directory for families.',
    },
    {
      question: 'How are donations used?',
      answer: '100% of donations go directly to maintaining and improving our directory services. This includes: verifying and vetting service providers, maintaining website infrastructure, expanding our directory\'s reach, keeping the site ad-free for families, developing educational content, and providing timely updates. We\'re committed to transparency—you can see our annual reports and financial statements on our About page.',
    },
    {
      question: 'Can I cancel my monthly donation?',
      answer: 'Yes, absolutely. You can cancel your monthly donation at any time by emailing us at floridaautismservices@gmail.com or by managing your subscription through the link in your monthly receipt email. There are no cancellation fees or penalties.',
    },
    {
      question: 'What are the donor recognition tiers?',
      answer: 'We have four tiers: Friend ($10-49), Supporter ($50-99), Advocate ($100-249), and Champion ($250+). Each tier includes different benefits like website listing, links to your business, event invitations, and impact updates. Recognition is completely optional—you can donate anonymously at any tier.',
    },
    {
      question: 'Can I donate anonymously?',
      answer: 'Yes! When making your donation, simply check the "Make my donation anonymous" box. Anonymous donors still receive tax receipts via email, but your name won\'t appear in our public donor recognition. Your privacy is important to us.',
    },
    {
      question: 'Can I donate as a business?',
      answer: 'Absolutely! When making your donation, select "Business/Organization" and enter your business name. Businesses that donate $50+ can include their website link in our donor recognition. This is a great way to show your company\'s commitment to supporting neurodivergent families in Florida while gaining positive exposure.',
    },
  ];

  // Get current tier preview
  const currentTier = selectedAmount ? getDonorTier(selectedAmount) : null;
  const tierInfo = currentTier ? getTierInfo(currentTier) : null;

  return (
    <div className="space-y-16">
      {/* STAGE 1: Hero Section */}
      <section className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 p-8 md:p-16 shadow-sm">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100">
            Support Families Finding Hope
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Your donation helps us maintain Florida's most trusted autism services directory—completely free for families who need it most
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>3,600+ Verified Providers</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>50,000+ Monthly Searches</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>100% Free for Families</span>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 1: Security Banner */}
      <section className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-700 rounded-2xl p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <Lock className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-3">
                🔒 100% Secure Donations
              </h2>
              <p className="text-green-700 dark:text-green-400 mb-4">
                Your payment information is encrypted and processed securely through Stripe, the same trusted payment processor used by Amazon, Google, and millions of businesses worldwide. We never see or store your credit card details.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>Stripe Verified Partner</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>256-bit SSL Encryption</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <Check className="w-4 h-4 flex-shrink-0" />
                  <span>Bank-Level Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 2: Donor Recognition Tiers */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Join Our Community of Supporters
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
            Donors who give permission are recognized in our Hall of Supporters
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500 italic">
            Recognition is completely optional—you can donate anonymously at any time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Friend Tier */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500 dark:border-blue-700 rounded-xl p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-200 dark:bg-blue-900/30 rounded-2xl mb-4">
                <Heart className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">Friend</h3>
              <p className="text-lg text-blue-600 dark:text-blue-400 mb-4">$10 - $49</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                <li>• Name listed on website</li>
                <li>• Thank you email</li>
                <li>• Quarterly newsletter</li>
              </ul>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                Join {tierCounts.friend} Friends
              </p>
            </div>
          </div>

          {/* Supporter Tier */}
          <div className="bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-500 dark:border-teal-700 rounded-xl p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-200 dark:bg-teal-900/30 rounded-2xl mb-4">
                <Star className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-bold text-teal-800 dark:text-teal-300 mb-2">Supporter</h3>
              <p className="text-lg text-teal-600 dark:text-teal-400 mb-4">$50 - $99</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                <li>• All Friend benefits</li>
                <li>• Name + website link</li>
                <li>• Digital supporter badge</li>
                <li>• Quarterly impact reports</li>
              </ul>
              <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
                Join {tierCounts.supporter} Supporters
              </p>
            </div>
          </div>

          {/* Advocate Tier */}
          <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500 dark:border-orange-700 rounded-xl p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-200 dark:bg-orange-900/30 rounded-2xl mb-4">
                <Award className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-orange-800 dark:text-orange-300 mb-2">Advocate</h3>
              <p className="text-lg text-orange-600 dark:text-orange-400 mb-4">$100 - $249</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                <li>• All Supporter benefits</li>
                <li>• Featured on homepage</li>
                <li>• Event invitations</li>
                <li>• Direct impact updates</li>
              </ul>
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                Join {tierCounts.advocate} Advocates
              </p>
            </div>
          </div>

          {/* Champion Tier */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 dark:border-purple-700 rounded-xl p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-200 dark:bg-purple-900/30 rounded-2xl mb-4">
                <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-purple-800 dark:text-purple-300 mb-2">Champion</h3>
              <p className="text-lg text-purple-600 dark:text-purple-400 mb-4">$250+</p>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                <li>• All Advocate benefits</li>
                <li>• Permanent plaque</li>
                <li>• Exclusive briefings</li>
                <li>• Direct leadership contact</li>
                <li>• Featured in annual report</li>
              </ul>
              <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                Join {tierCounts.champion} Champions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE 3-6: Donation Form */}
      <section className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Make Your Donation
          </h2>
          <div className="mb-6">
            <p className="text-slate-600 dark:text-slate-400 mb-3">Your support helps us:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                Verify and vet service providers
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                Maintain website infrastructure
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                Expand directory reach statewide
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                Keep the site 100% ad-free
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                Develop educational resources
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                Provide timely updates
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* One-Time Donation */}
            <div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">
                One-Time Donation
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
                {[10, 25, 50, 100, 250].map((amount) => (
                  <button
                    key={`once-${amount}`}
                    type="button"
                    onClick={() => handleAmountSelect(amount, 'once')}
                    className={`py-3 px-4 rounded-lg font-semibold text-lg transition-all ${selectedAmount === amount && selectedFrequency === 'once'
                      ? 'bg-teal-700 text-white ring-4 ring-teal-300 dark:ring-teal-600'
                      : 'bg-teal-500 text-white hover:bg-teal-600'
                      }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCustomAmount}
                className="w-full py-3 px-4 rounded-lg border-2 border-dashed border-teal-500 dark:border-teal-400 text-teal-700 dark:text-teal-400 font-semibold hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all"
              >
                Custom Amount
              </button>
              {showCustomInput && (
                <div className="mt-3">
                  <input
                    type="number"
                    min="5"
                    step="1"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value, 'once')}
                    placeholder="Enter amount ($5 minimum)"
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              )}
            </div>

            {/* Monthly Donation */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  Become a Monthly Supporter
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Recurring donations help us plan ahead and provide consistent support to families
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[10, 25, 50, 100].map((amount) => (
                  <button
                    key={`monthly-${amount}`}
                    type="button"
                    onClick={() => handleAmountSelect(amount, 'monthly')}
                    className={`py-3 px-4 rounded-lg font-semibold transition-all ${selectedAmount === amount && selectedFrequency === 'monthly'
                      ? 'bg-amber-500 text-white'
                      : 'bg-white dark:bg-slate-800 border-2 border-amber-500 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                      }`}
                  >
                    <div className="text-lg">${amount}</div>
                    <div className="text-xs font-normal">per month</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Preview */}
            {tierInfo && (
              <div className={`bg-${tierInfo.color}-50 dark:bg-${tierInfo.color}-900/20 border-2 border-${tierInfo.color}-300 dark:border-${tierInfo.color}-700 rounded-lg p-4`}>
                <div className="flex items-center gap-3">
                  <tierInfo.icon className={`w-6 h-6 text-${tierInfo.color}-600 dark:text-${tierInfo.color}-400`} />
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      This donation qualifies for <span className={`text-${tierInfo.color}-700 dark:text-${tierInfo.color}-400`}>{tierInfo.name}</span> recognition
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Includes: {tierInfo.benefits.slice(0, 3).join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 4: Donor Information Fields */}
            <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
                Your Information
              </h3>

              {/* Donor Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Donate as:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="individual"
                      checked={donorType === 'individual'}
                      onChange={(e) => setDonorType(e.target.value as 'individual')}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">Individual</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value="business"
                      checked={donorType === 'business'}
                      onChange={(e) => setDonorType(e.target.value as 'business')}
                      className="w-4 h-4 text-teal-600 focus:ring-teal-500"
                    />
                    <Building className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">Business/Organization</span>
                  </label>
                </div>
              </div>

              {/* Business Name (conditional) */}
              {donorType === 'business' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Business/Organization Name {!isAnonymous && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter business name"
                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    This name will appear in our donor recognition
                  </p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Your Name {!isAnonymous && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isAnonymous}
                  className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400"
                />
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  Required for tax receipt
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  For tax receipt and donation confirmation
                </p>
              </div>

              {/* Website (conditional) */}
              {selectedAmount && selectedAmount >= 50 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Website URL (Optional)
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourbusiness.com"
                      className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                    For Supporter tier and above, we'll link to your website
                  </p>
                </div>
              )}

              {/* Recognition Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allowRecognition}
                    onChange={(e) => setAllowRecognition(e.target.checked)}
                    disabled={isAnonymous}
                    className="mt-1 w-4 h-4 text-teal-600 focus:ring-teal-500 rounded disabled:opacity-50"
                  />
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      I'd like to be recognized as a supporter
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      We'll list your name (or business name) in our Hall of Supporters based on your tier
                    </p>
                  </div>
                </label>
              </div>

              {/* Anonymous Checkbox */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => handleAnonymousChange(e.target.checked)}
                    className="mt-1 w-4 h-4 text-slate-600 focus:ring-slate-500 rounded"
                  />
                  <div>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Make my donation anonymous
                    </span>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      Anonymous donors will not appear in our public recognition, but will still receive tax receipts via email
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* STAGE 5: Security Reassurance */}
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Secure payment processing powered by Stripe</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>Your card information never touches our servers</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <Check className="w-5 h-5 flex-shrink-0" />
                  <span>All transactions encrypted and PCI compliant</span>
                </div>
              </div>
              <p className="text-center text-xs text-slate-500 dark:text-slate-500 mt-3">
                Powered by Stripe
              </p>
            </div>

            {/* Error Display */}
            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-700 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                  Please fix the following errors:
                </h4>
                <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* STAGE 6: Submit Button */}
            <button
              type="submit"
              disabled={loading || !selectedAmount}
              className="w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : selectedAmount ? (
                <>
                  Proceed to Secure Checkout →
                </>
              ) : (
                'Select Amount to Continue'
              )}
            </button>
          </form>
        </div>
      </section>

      {/* STAGE 7: FAQ Section */}
      <section className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-3">
            Donation FAQs
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Common questions about donating
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden ${openFaqIndex === index ? 'bg-teal-50 dark:bg-teal-900/20' : 'bg-white dark:bg-slate-800'
                }`}
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <span className="font-medium text-slate-800 dark:text-slate-100 pr-4">
                  {faq.question}
                </span>
                {openFaqIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                )}
              </button>
              {openFaqIndex === index && (
                <div className="px-4 pb-4 border-t border-slate-200 dark:border-slate-700 pt-3">
                  <p className="text-slate-600 dark:text-slate-400">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <DonationImpactSection />

      <HallOfSupportersSection />

    </div>
  );
};
