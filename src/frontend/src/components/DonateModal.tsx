import React, { useEffect, useRef } from 'react';
import { X, Heart, DollarSign } from 'lucide-react';

type DonateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const DonateModal: React.FC<DonateModalProps> = ({ isOpen, onClose }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
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
    <div
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:bg-slate-800"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between gap-3 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-teal-50 px-6 py-5 dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
              <Heart className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 id={titleId} className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              Support Our Mission
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 transition-colors hover:bg-white/60 dark:hover:bg-slate-700"
            aria-label="Close support modal"
          >
            <X className="h-6 w-6 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-6 space-y-6">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">
              <strong className="text-slate-900 dark:text-slate-100">
                Florida Autism Services is a free community resource.
              </strong>{' '}
              Your donations help us verify providers, maintain the site, expand our directory, and keep this resource accessible to all families navigating autism services in Florida.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
              <DollarSign className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span>Your Support Helps Us:</span>
            </h3>
            <ul className="space-y-3">
              {[
                'Verify and vet service providers for quality and legitimacy',
                'Maintain and improve the website infrastructure',
                'Expand the directory to reach more families',
                'Keep the site ad-free and accessible to everyone',
                'Develop new resources and educational content',
                'Provide timely updates on autism services and programs',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 rounded bg-teal-100 p-1 dark:bg-teal-900/30">
                    <Heart className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-xl bg-slate-50 p-6 dark:bg-slate-900/50">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Ways to Contribute</h3>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-amber-600 hover:to-amber-700 hover:shadow-lg"
                onClick={() =>
                  alert('PayPal integration coming soon! Thank you for your interest in supporting our mission.')
                }
              >
                Donate via PayPal
              </button>
              <button
                type="button"
                className="w-full rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:from-teal-600 hover:to-teal-700 hover:shadow-lg"
                onClick={() =>
                  alert('Stripe integration coming soon! Thank you for your interest in supporting our mission.')
                }
              >
                Donate via Credit Card
              </button>
            </div>
            <p className="pt-2 text-center text-xs text-slate-500 dark:text-slate-500">
              Secure payment processing • All donations support Florida families
            </p>
          </div>

          <div className="pt-4 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              Questions about donations?{' '}
              <button
                type="button"
                onClick={onClose}
                className="font-medium text-teal-600 underline-offset-2 transition hover:underline dark:text-teal-400"
              >
                Contact us
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
