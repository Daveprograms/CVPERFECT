import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { loadStripe } from '@stripe/stripe-js';
import { createCheckoutSession } from '../../services/stripe';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const plans = [
  {
    name: 'Pro Subscription',
    price: '$30',
    period: 'per month',
    description: 'Unlimited resume enhancements with AI-powered feedback',
    features: [
      'Unlimited resume analyses',
      'Full access to AI feedback',
      'Learning recommendations',
      'Download enhanced resumes',
      'Priority support'
    ],
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    mode: 'subscription'
  },
  {
    name: 'One-Time Purchase',
    price: '$5',
    period: 'one-time',
    description: 'Get 4 resume enhancements with basic feedback',
    features: [
      '4 resume analyses',
      'Basic AI feedback',
      'Standard support',
      'Valid for 30 days'
    ],
    priceId: import.meta.env.VITE_STRIPE_ONE_TIME_PRICE_ID,
    mode: 'payment'
  }
];

export default function Billing() {
  const { user, updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleSubscribe = async (priceId: string, mode: 'subscription' | 'payment') => {
    if (!user) return;

    setIsLoading(priceId);
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      const session = await createCheckoutSession({
        priceId,
        mode,
        customerId: user.stripeCustomerId,
        userId: user.id
      });

      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const handlePromoCode = async () => {
    if (!promoCode.trim()) return;

    setIsApplyingPromo(true);
    try {
      const success = await useAuthStore.getState().applyPromoCode(promoCode);
      if (success) {
        toast.success('Promo code applied successfully!');
        setPromoCode('');
      } else {
        toast.error('Invalid promo code');
      }
    } catch (error) {
      console.error('Promo code error:', error);
      toast.error('Failed to apply promo code');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Choose Your Plan
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Select the plan that best fits your needs
        </p>
      </div>

      {/* Promo Code Section */}
      <div className="max-w-md mx-auto mb-12">
        <div className="flex gap-4">
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handlePromoCode}
            disabled={isApplyingPromo || !promoCode.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isApplyingPromo ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>

      {/* Current Plan Status */}
      {user && (
        <div className="max-w-md mx-auto mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Current Plan Status
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Plan: {user.type === 'pro' ? 'Pro Subscription' : user.type === 'one-time' ? 'One-Time Purchase' : 'Free'}
            </p>
            {user.type === 'one-time' && (
              <p className="text-gray-600 dark:text-gray-300">
                Remaining Credits: {user.remainingCredits}
              </p>
            )}
            {user.type === 'pro' && (
              <p className="text-gray-600 dark:text-gray-300">
                Status: {user.subscriptionStatus}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {plan.price}
                </span>
                <span className="ml-1 text-xl text-gray-500 dark:text-gray-400">
                  {plan.period}
                </span>
              </div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                {plan.description}
              </p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="ml-3 text-gray-600 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.priceId, plan.mode as 'subscription' | 'payment')}
                disabled={isLoading === plan.priceId}
                className="mt-8 w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading === plan.priceId ? (
                  <>
                    <SparklesIcon className="animate-spin -ml-1 mr-3 h-5 w-5" />
                    Processing...
                  </>
                ) : (
                  `Get Started with ${plan.name}`
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 