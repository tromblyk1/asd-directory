import React, { useEffect, useRef } from 'react';
import { X, Heart, DollarSign, Edit3 } from 'lucide-react';

type DonateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const STRIPE_LINKS = {
  oneTime: {
    10: 'https://donate.stripe.com/aFa9AMbSBbOF12o6UC3VC07',
    25: 'https://donate.stripe.com/3cI9AMcWF9Gx9yUgvc3VC0a',
    50: 'https://donate.stripe.com/00w00c09T1a15iE6UC3VC09',
    100: 'https://donate.stripe.com/aFaeV62i1cSJ7qMgvc3VC08',
    250: 'https://donate.stripe.com/cNi6oAbSB4md26s0we3VC06',
    custom: 'https://donate.stripe.com/aFaeV68Gp2e5fXidj03VC05',
  },
  monthly: {
    10: 'https://donate.stripe.com/00w9AM9Kt2e5fXibaS3VC01',
    25: 'https://donate.stripe.com/6oU00c9Kt05X5iE92K3VC04',
    50: 'https://donate.stripe.com/3cIfZa6yh1a18uQ0we3VC03',
    100: 'https://donate.stripe.com/14A00c1dX7yp9yUgvc3VC02',
    custom: 'https://donate.stripe.com/fZu6oA6yh5qh8uQceW3VC00',
  },
};

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const titleId = 'donate-modal-title';

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/50 p-4" onClick={onClose} role="presentation">
      <div ref={dialogRef} className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-slate-800" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} onClick={(event) => event.stopPropagation()}>
        <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-teal-50 px-4 py-4 sm:px-6 sm:py-5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
              <Heart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 id={titleId} className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Support Our Mission</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 transition-colors hover:bg-white/60 dark:hover:bg-slate-700" aria-label="Close support modal">
            <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">Florida Autism Services is a free community resource.</strong> Your donations help us verify providers, maintain the site, expand our directory, and keep this resource accessible to all families navigating autism services in Florida.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
              <DollarSign className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span>Your Support Helps Us:</span>
            </h3>
            <ul className="space-y-3">
              {['Verify and vet service providers for quality and legitimacy', 'Maintain and improve the website infrastructure', 'Expand the directory to reach more families', 'Keep the site ad-free and accessible to everyone', 'Develop new resources and educational content', 'Provide timely updates on autism services and programs'].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 rounded bg-teal-100 p-1 dark:bg-teal-900/30">
                    <Heart className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-xl bg-slate-50 p-4 sm:p-6 dark:bg-slate-900/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">One-Time Donation</h3>
            <div className="grid grid-cols-2 gap-3">
              <a href={STRIPE_LINKS.oneTime[10]} target="_blank" rel="noopener noreferrer" className="block rounded-lg border-2 border-teal-500 bg-white px-4 py-3 text-center font-semibold text-teal-700 transition-all hover:bg-teal-50 hover:shadow-md dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-teal-900/30">$10</a>
              <a href={STRIPE_LINKS.oneTime[25]} target="_blank" rel="noopener noreferrer" className="block rounded-lg border-2 border-teal-500 bg-white px-4 py-3 text-center font-semibold text-teal-700 transition-all hover:bg-teal-50 hover:shadow-md dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-teal-900/30">$25</a>
              <a href={STRIPE_LINKS.oneTime[50]} target="_blank" rel="noopener noreferrer" className="block rounded-lg border-2 border-teal-500 bg-white px-4 py-3 text-center font-semibold text-teal-700 transition-all hover:bg-teal-50 hover:shadow-md dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-teal-900/30">$50</a>
              <a href={STRIPE_LINKS.oneTime[100]} target="_blank" rel="noopener noreferrer" className="block rounded-lg border-2 border-teal-500 bg-white px-4 py-3 text-center font-semibold text-teal-700 transition-all hover:bg-teal-50 hover:shadow-md dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-teal-900/30">$100</a>
              <a href={STRIPE_LINKS.oneTime[250]} target="_blank" rel="noopener noreferrer" className="block rounded-lg border-2 border-teal-500 bg-white px-4 py-3 text-center font-semibold text-teal-700 transition-all hover:bg-teal-50 hover:shadow-md dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-teal-900/30">$250</a>
            </div>
            <a href={STRIPE_LINKS.oneTime.custom} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-teal-400 bg-white px-4 py-3 text-center font-semibold text-teal-700 transition-all hover:bg-teal-50 hover:border-solid hover:shadow-md dark:bg-slate-800 dark:text-teal-300 dark:hover:bg-teal-900/30">
              <Edit3 className="h-4 w-4" />
              <span>Custom Amount</span>
            </a>
          </div>

          <div className="space-y-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6 dark:from-slate-900/50 dark:to-slate-900/50">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Become a Monthly Supporter</h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Recurring donations help us plan ahead and provide consistent support to families</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a href={STRIPE_LINKS.monthly[10]} target="_blank" rel="noopener noreferrer" className="block rounded-lg border-2 border-amber-500 bg-white px-3 py-3 text-center font-semibold text-amber-700 transition-all hover:bg-amber-50 hover:shadow-md dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-amber-900/30">
                <div className="text-lg">$10</div>
                <div className="text-xs font-normal">per month</div>
              </a>
              <a href={STRIPE_LINKS.monthly[25]} target="_blank" rel="noopener noreferrer" className="block rounded-lg border-2 border-amber-500 bg-white px-3 py-3 text-center font-semibold text-amber-700 transition-all hover:bg-amber-50 hover:shadow-md dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-amber-900/30">
                <div className="text-lg">$25</div>
                <div className="text-xs font-normal">per month</div>
              </a>
              <a href={STRIPE_LINKS.monthly[50]} target="_blank" rel="noopener noreferrer" className="block rounded-lg border-2 border-amber-500 bg-white px-3 py-3 text-center font-semibold text-amber-700 transition-all hover:bg-amber-50 hover:shadow-md dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-amber-900/30">
                <div className="text-lg">$50</div>
                <div className="text-xs font-normal">per month</div>
              </a>
              <a href={STRIPE_LINKS.monthly[100]} target="_blank" rel="noopener noreferrer" className="block rounded-lg border-2 border-amber-500 bg-white px-3 py-3 text-center font-semibold text-amber-700 transition-all hover:bg-amber-50 hover:shadow-md dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-amber-900/30">
                <div className="text-lg">$100</div>
                <div className="text-xs font-normal">per month</div>
              </a>
            </div>
            <a href={STRIPE_LINKS.monthly.custom} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full rounded-lg border-2 border-dashed border-amber-400 bg-white px-4 py-3 text-center font-semibold text-amber-700 transition-all hover:bg-amber-50 hover:border-solid hover:shadow-md dark:bg-slate-800 dark:text-amber-300 dark:hover:bg-amber-900/30">
              <Edit3 className="h-4 w-4" />
              <span>Custom Monthly Amount</span>
            </a>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-500">ðŸ”’ Secure payment processing powered by Stripe â€¢ All donations support Florida families</p>

          <div className="pt-4 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-500">Questions about donations? <button type="button" onClick={onClose} className="font-medium text-teal-600 underline-offset-2 transition hover:underline dark:text-teal-400">Contact us</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};