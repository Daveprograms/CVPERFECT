# CVPerfect

CVPerfect is an AI-powered resume optimization platform that helps users create perfect resumes for their job applications.

## Project Structure

```
CVPerfect/
├── frontend/                # React project built with Vite
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # Entry point
│   ├── .env               # Frontend environment variables
│   └── vite.config.ts     # Vite configuration
│
├── backend/                # Express.js backend
│   ├── app/               # Application code
│   │   ├── routes/        # API routes
│   │   ├── models/        # Data models
│   │   └── index.ts       # Server entry point
│   ├── .env               # Backend environment variables
│   └── package.json       # Backend dependencies
│
├── README.md              # Project documentation
└── .gitignore            # Git ignore rules
```

## Features

- User authentication and authorization
- Resume upload and analysis
- AI-powered resume optimization
- Subscription-based access
- Dark/Light mode support
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Stripe account for payments

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_PRICE_MONTHLY_SUBSCRIPTION=your_monthly_subscription_price_id
   VITE_PRICE_ONE_TIME_PURCHASE=your_one_time_purchase_price_id
   VITE_API_URL=http://localhost:3001
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=3001
   CLIENT_URL=http://localhost:5173
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

To run both frontend and backend concurrently:

```bash
# From the root directory
npm run dev:all
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [Heroicons](https://heroicons.com/)
- [Headless UI](https://headlessui.dev/) 