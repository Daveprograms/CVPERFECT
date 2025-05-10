# CVPerfect Frontend

This is the frontend application for CVPerfect, built with React, Vite, and TypeScript.

## Environment Setup

Create a `.env` file in the frontend directory with the following variables:

```env
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_PRICE_MONTHLY_SUBSCRIPTION=your_monthly_subscription_price_id
VITE_PRICE_ONE_TIME_PURCHASE=your_one_time_purchase_price_id
VITE_API_URL=http://localhost:3001
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:5173.

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Preview Production Build

To preview the production build locally:

```bash
npm run preview
``` 