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
    priceId: STRIPE_ONE_TIME_PRICE_ID,
    price: '4.99',
    description: 'Perfect for occasional resume updates.',
    features: BASIC_FEATURES,
    buttonText: 'Buy Credits',
    buttonVariant: 'outline',
  },
  {
    name: 'Pro',
    id: 'pro',
    priceId: STRIPE_PRO_PRICE_ID,
    price: '19.99',
    description: 'Best for job seekers and career changers.',
    features: PRO_FEATURES,
    buttonText: 'Subscribe',
    buttonVariant: 'solid',
  },
];

export default function Billing() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string, tierId: string) => {
    setIsLoading(tierId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          tierId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Billing & Subscription
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Choose the plan that best fits your needs.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {tiers.map((tier) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-lg bg-white dark:bg-gray-800 shadow ${
              user?.isPro && tier.id === 'pro' ? 'ring-2 ring-blue-500' : ''
            }`}
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
                onClick={() => handleSubscribe(tier.priceId, tier.id)}
                disabled={isLoading === tier.id || (user?.isPro && tier.id === 'pro')}
                className={`mt-8 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.buttonVariant === 'solid'
                    ? 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600'
                    : 'bg-white text-blue-600 ring-1 ring-inset ring-blue-600 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600'
                } disabled:opacity-50`}
              >
                {isLoading === tier.id
                  ? 'Processing...'
                  : user?.isPro && tier.id === 'pro'
                  ? 'Current Plan'
                  : tier.buttonText}
              </button>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-8">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">What's included</h4>
              <ul role="list" className="mt-6 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex space-x-3">
                    <CheckIcon
                      className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 