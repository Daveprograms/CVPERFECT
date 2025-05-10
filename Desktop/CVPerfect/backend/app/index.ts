import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Middleware
app.use(cors());
app.use(express.json());

// Create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  const { priceId, mode, customerId, userId } = req.body;

  try {
    // If customer doesn't exist, create a new one
    let customer = customerId;
    if (!customer) {
      const newCustomer = await stripe.customers.create({
        metadata: {
          userId,
        },
      });
      customer = newCustomer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode,
      success_url: `${process.env.CLIENT_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Error creating checkout session' });
  }
});

// Create a customer portal session
app.post('/api/create-portal-session', async (req, res) => {
  const { customerId } = req.body;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.CLIENT_URL}/dashboard/billing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Error creating portal session' });
  }
});

// Check subscription status
app.post('/api/check-subscription-status', async (req, res) => {
  const { customerId } = req.body;

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    const isActive = subscriptions.data.length > 0;
    res.json({ isActive });
  } catch (error) {
    console.error('Error checking subscription status:', error);
    res.status(500).json({ error: 'Error checking subscription status' });
  }
});

// Webhook handler for Stripe events
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).send('Webhook signature missing');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const userId = session.metadata?.userId;

        if (session.mode === 'subscription') {
          // Update user's subscription status in your database
          // This is where you would update your user's isProUser status
          console.log(`User ${userId} subscribed with customer ${customerId}`);
        } else {
          // Handle one-time payment
          // This is where you would increment the user's credits
          console.log(`User ${userId} purchased credits with customer ${customerId}`);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        // Update user's subscription status in your database
        console.log(`Subscription ended for customer ${customerId}`);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send('Webhook error');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 