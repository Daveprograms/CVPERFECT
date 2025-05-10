import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '../stores/authStore';
import { API_URL } from '../config';

// Get the publishable key from Vite's environment variables
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PRICE_IDS = {
  MONTHLY_SUBSCRIPTION: import.meta.env.VITE_PRICE_MONTHLY_SUBSCRIPTION,
  ONE_TIME_PURCHASE: import.meta.env.VITE_PRICE_ONE_TIME_PURCHASE,
};

interface CreateCheckoutSessionParams {
  priceId: string;
  mode: 'subscription' | 'payment';
  customerId?: string;
  userId: string;
}

export const createCheckoutSession = async ({
  priceId,
  mode,
  customerId,
  userId,
}: CreateCheckoutSessionParams) => {
  const response = await fetch(`${API_URL}/api/stripe/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      mode,
      customerId,
      userId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return response.json();
};

export const createCustomerPortalSession = async (customerId: string) => {
  const response = await fetch(`${API_URL}/api/stripe/create-portal-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ customerId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create portal session');
  }

  return response.json();
};

export const validatePromoCode = async (code: string) => {
  const response = await fetch(`${API_URL}/api/stripe/validate-promo-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to validate promo code');
  }

  return response.json();
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