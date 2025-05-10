import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { createCheckoutSession, createCustomerPortalSession, PRICE_IDS } from '../../services/stripe';
import {
  CheckCircleIcon,
  CreditCardIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export default function Billing() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setLoading('subscription');
      await createCheckoutSession(PRICE_IDS.MONTHLY_SUBSCRIPTION, 'subscription');
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleOneTimePurchase = async () => {
    try {
      setLoading('one-time');
      await createCheckoutSession(PRICE_IDS.ONE_TIME_PURCHASE, 'payment');
    } catch (error) {
      console.error('Error purchasing:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setLoading('manage');
      await createCustomerPortalSession();
    } catch (error) {
      console.error('Error managing subscription:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Select the plan that best fits your needs
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {/* Monthly Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pro Subscription
            </h3>
            {user?.isProUser && (
              <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-200">
                <CheckCircleIcon className="mr-1 h-4 w-4" />
                Active
              </span>
            )}
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Get unlimited access to all features
          </p>
          <p className="mt-8">
            <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              $30
            </span>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400">
              /month
            </span>
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Unlimited resume checks
              </span>
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Priority support
              </span>
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Advanced AI analysis
              </span>
            </li>
          </ul>
          {user?.isProUser ? (
            <button
              onClick={handleManageSubscription}
              disabled={loading === 'manage'}
              className="mt-8 w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'manage' ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                'Manage Subscription'
              )}
            </button>
          ) : (
            <button
              onClick={handleSubscribe}
              disabled={loading === 'subscription'}
              className="mt-8 w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === 'subscription' ? (
                <ArrowPathIcon className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                'Subscribe Now'
              )}
            </button>
          )}
        </motion.div>

        {/* One-time Purchase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              One-time Purchase
            </h3>
            {user?.remainingCredits > 0 && (
              <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-200">
                {user.remainingCredits} credit{user.remainingCredits !== 1 ? 's' : ''} left
              </span>
            )}
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Perfect for trying out our service
          </p>
          <p className="mt-8">
            <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              $5
            </span>
            <span className="text-base font-medium text-gray-500 dark:text-gray-400">
              one-time
            </span>
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                One resume optimization
              </span>
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Basic AI analysis
              </span>
            </li>
            <li className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Email support
              </span>
            </li>
          </ul>
          <button
            onClick={handleOneTimePurchase}
            disabled={loading === 'one-time' || user?.remainingCredits > 0}
            className="mt-8 w-full rounded-md bg-primary-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === 'one-time' ? (
              <ArrowPathIcon className="h-5 w-5 animate-spin mx-auto" />
            ) : user?.remainingCredits > 0 ? (
              'Credit Available'
            ) : (
              'Purchase Now'
            )}
          </button>
        </motion.div>
      </div>

      {/* Current Plan Status */}
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
                {user.isProUser ? 'Pro Plan Active' : 'No Active Subscription'}
              </dd>
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-gray-400" />
              <dt className="ml-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                Remaining Credits
              </dt>
              <dd className="ml-auto text-sm font-medium text-gray-900 dark:text-white">
                {user.remainingCredits}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
} 