// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// File Upload Configuration
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Subscription Features
export const BASIC_FEATURES = [
  '5 resume analyses per month',
  'Basic feedback on resume content',
  'Keyword matching with job descriptions',
  'PDF and Word document support',
  'Email support',
];

export const PRO_FEATURES = [
  'Unlimited resume analyses',
  'Detailed feedback and suggestions',
  'AI-powered content improvements',
  'Keyword optimization',
  'ATS compatibility check',
  'Priority email support',
  'Custom resume templates',
  'Export to multiple formats',
];

// Stripe Price IDs
export const STRIPE_PRO_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro_monthly';
export const STRIPE_ONE_TIME_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_ONE_TIME_PRICE_ID || 'price_one_time';

// Navigation
export const DASHBOARD_NAVIGATION = [
  { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' },
  { name: 'Billing', href: '/dashboard/billing', icon: 'CreditCardIcon' },
  { name: 'History', href: '/dashboard/history', icon: 'ClockIcon' },
];

// Toast Messages
export const TOAST_MESSAGES = {
  UPLOAD_SUCCESS: 'Resume uploaded successfully',
  UPLOAD_ERROR: 'Failed to upload resume',
  ANALYSIS_STARTED: 'Analysis started',
  ANALYSIS_ERROR: 'Failed to analyze resume',
  PAYMENT_SUCCESS: 'Payment processed successfully',
  PAYMENT_ERROR: 'Payment failed',
  LOGIN_SUCCESS: 'Logged in successfully',
  LOGIN_ERROR: 'Failed to log in',
  SIGNUP_SUCCESS: 'Account created successfully',
  SIGNUP_ERROR: 'Failed to create account',
  LOGOUT_SUCCESS: 'Logged out successfully',
  LOGOUT_ERROR: 'Failed to log out',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
  INVALID_FILE_TYPE: 'Only PDF and Word documents are allowed',
  REQUIRED_FIELDS: 'Please fill in all required fields',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_CREDENTIALS: 'Invalid email or password',
  UNAUTHORIZED: 'Please log in to continue',
  SERVER_ERROR: 'An error occurred on the server',
} as const; 