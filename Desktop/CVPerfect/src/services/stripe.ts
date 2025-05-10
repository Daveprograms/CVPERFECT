import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '../stores/authStore';

// Get the publishable key from Vite's environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PRICE_IDS = {
  MONTHLY_SUBSCRIPTION: import.meta.env.VITE_PRICE_MONTHLY_SUBSCRIPTION,
  ONE_TIME_PURCHASE: import.meta.env.VITE_PRICE_ONE_TIME_PURCHASE,
};

export const createCheckoutSession = async (
  priceId: string,
  mode: 'subscription' | 'payment'
) => {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('User must be logged in');

  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        mode,
        customerId: user.stripeCustomerId,
        userId: user.id,
      }),
    });

    const { sessionId } = await response.json();
    const stripe = await stripePromise;
    if (!stripe) throw new Error('Stripe failed to load');

    const { error } = await stripe.redirectToCheckout({ sessionId });
    if (error) throw error;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const createCustomerPortalSession = async () => {
  const user = useAuthStore.getState().user;
  if (!user?.stripeCustomerId) throw new Error('No Stripe customer ID found');

  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: user.stripeCustomerId,
      }),
    });

    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

export const checkSubscriptionStatus = async () => {
  const user = useAuthStore.getState().user;
  if (!user?.stripeCustomerId) return false;

  try {
    const response = await fetch(`/api/check-subscription-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId: user.stripeCustomerId,
      }),
    });

    const { isActive } = await response.json();
    return isActive;
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return false;
  }
}; 