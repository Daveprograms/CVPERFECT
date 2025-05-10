// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// File Upload Configuration
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

// Subscription Features
export const BASIC_FEATURES = [
  '5 resume analyses per month',
  'Basic AI feedback',
  'Standard support',
  'Valid for 30 days',
];

export const PRO_FEATURES = [
  'Unlimited resume analyses',
  'Advanced AI feedback',
  'Priority support',
  'Learning recommendations',
  'Download enhanced resumes',
];

// Navigation
export const DASHBOARD_NAVIGATION = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: 'HomeIcon',
  },
  {
    name: 'Billing',
    href: '/dashboard/billing',
    icon: 'CreditCardIcon',
  },
  {
    name: 'History',
    href: '/dashboard/history',
    icon: 'ClockIcon',
  },
];

// Toast Messages
export const TOAST_MESSAGES = {
  UPLOAD_SUCCESS: 'Resume uploaded successfully!',
  UPLOAD_ERROR: 'Failed to upload resume. Please try again.',
  ANALYSIS_STARTED: 'Analysis started! This may take a few minutes.',
  ANALYSIS_ERROR: 'Failed to analyze resume. Please try again.',
  PAYMENT_SUCCESS: 'Payment successful! Thank you for your purchase.',
  PAYMENT_ERROR: 'Payment failed. Please try again.',
  AUTH_ERROR: 'Authentication failed. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Error Messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size exceeds 5MB limit',
  INVALID_FILE_TYPE: 'Only PDF and Word documents are allowed',
  UNAUTHORIZED: 'Please sign in to continue',
  SERVER_ERROR: 'Something went wrong. Please try again later',
  NETWORK_ERROR: 'Network error. Please check your connection',
}; 