// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Stripe Configuration
export const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
export const STRIPE_PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
export const STRIPE_ONE_TIME_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ONE_TIME_PRICE_ID;

// Feature Flags
export const ENABLE_PROMO_CODES = process.env.NEXT_PUBLIC_ENABLE_PROMO_CODES === 'true';

// Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
export const ONE_TIME_PURCHASE_CREDITS = 4;
export const PRO_FEATURES = [
  'Unlimited resume analyses',
  'Full access to AI feedback',
  'Learning recommendations',
  'Download enhanced resumes',
  'Priority support'
];
export const BASIC_FEATURES = [
  'Basic resume analysis',
  'Standard AI feedback',
  'Email support'
]; 