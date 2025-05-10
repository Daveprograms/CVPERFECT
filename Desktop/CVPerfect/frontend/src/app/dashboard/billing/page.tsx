'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '@/stores/authStore';
import { PRO_FEATURES, BASIC_FEATURES, STRIPE_PRO_PRICE_ID, STRIPE_ONE_TIME_PRICE_ID } from '@/lib/config';
import toast from 'react-hot-toast';

const tiers = [
  {
    name: 'Basic',
    id: 'basic',
    price: '4.99',
    description: 'Perfect for occasional resume updates.',
    features: BASIC_FEATURES,
    buttonText: 'Coming Soon',
    buttonVariant: 'outline',
  },
  {
    name: 'Pro',
    id: 'pro',
    price: '19.99',
    description: 'Best for job seekers and career changers.',
    features: PRO_FEATURES,
    buttonText: 'Coming Soon',
    buttonVariant: 'solid',
  },
];

export default function Billing() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    toast.info('Payment features coming soon!');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Payment features coming soon! For now, enjoy our free trial.
        </p>
      </div>

      <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto">
        {tiers.map((tier) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-lg border ${
              tier.id === 'pro'
                ? 'border-blue-500 shadow-lg dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-700'
            } bg-white dark:bg-gray-800`}
          >
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {tier.name}
              </h3>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{tier.description}</p>
              <p className="mt-8">
                <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                  ${tier.price}
                </span>
                <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                  {tier.id === 'pro' ? '/month' : ' one-time'}
                </span>
              </p>
              <button
                onClick={() => handleSubscribe(tier.id)}
                disabled={true}
                className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.buttonVariant === 'solid'
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-white text-gray-400 ring-1 ring-inset ring-gray-300 cursor-not-allowed dark:bg-gray-700'
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-8">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white tracking-wide uppercase">
                What's included
              </h4>
              <ul role="list" className="mt-6 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <CheckIcon className="h-5 w-5 flex-shrink-0 text-green-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      {user && (
        <div className="mt-12 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Current Plan Status
          </h3>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center">
              <CreditCardIcon className="h-5 w-5 text-gray-400" />
              <dt className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Subscription Status
              </dt>
              <dd className="ml-auto text-sm font-medium text-gray-900 dark:text-white">
                Free Trial
              </dd>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-gray-400" />
              <dt className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Remaining Credits
              </dt>
              <dd className="ml-auto text-sm font-medium text-gray-900 dark:text-white">
                Unlimited (Trial)
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
} 