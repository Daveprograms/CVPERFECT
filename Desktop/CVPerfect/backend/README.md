# CVPerfect Backend

This is the backend server for CVPerfect, built with Express.js and TypeScript.

## Environment Setup

Create a `.env` file in the backend directory with the following variables:

```env
PORT=3001
CLIENT_URL=http://localhost:5173
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
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

The server will be available at http://localhost:3001.

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Running in Production

To start the production server:

```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/signin` - Sign in to an existing account

### Stripe Integration
- `POST /api/create-checkout-session` - Create a Stripe checkout session
- `POST /api/create-portal-session` - Create a Stripe customer portal session
- `POST /api/check-subscription-status` - Check a user's subscription status
- `POST /api/webhook` - Handle Stripe webhook events 