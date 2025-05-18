'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/components/auth-provider'
import { toast } from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface Plan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  downloads: number
}

const plans: Plan[] = [
  {
    id: 'price_basic',
    name: 'Basic',
    price: 9.99,
    interval: 'month',
    features: [
      '5 resume analyses per month',
      'Basic AI feedback',
      'PDF and DOCX downloads',
      'Email support'
    ],
    downloads: 5
  },
  {
    id: 'price_pro',
    name: 'Professional',
    price: 19.99,
    interval: 'month',
    features: [
      '20 resume analyses per month',
      'Advanced AI feedback',
      'PDF and DOCX downloads',
      'Priority email support',
      'Learning plan generation',
      'LinkedIn optimization'
    ],
    downloads: 20
  },
  {
    id: 'price_enterprise',
    name: 'Enterprise',
    price: 49.99,
    interval: 'month',
    features: [
      'Unlimited resume analyses',
      'Premium AI feedback',
      'PDF and DOCX downloads',
      '24/7 priority support',
      'Advanced learning plans',
      'LinkedIn optimization',
      'Custom branding',
      'API access'
    ],
    downloads: -1 // Unlimited
  }
]

export default function BillingPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [currentPlan, setCurrentPlan] = useState<Plan | null>(null)
  const [downloadsLeft, setDownloadsLeft] = useState(0)

  useEffect(() => {
    fetchSubscription()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/subscription')
      if (!response.ok) {
        throw new Error('Failed to fetch subscription')
      }
      const data = await response.json()
      setCurrentPlan(plans.find(p => p.id === data.price_id) || null)
      setDownloadsLeft(data.downloads_left)
    } catch (error) {
      console.error('Subscription error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price_id: priceId })
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      const { error } = await stripe.redirectToCheckout({ sessionId })
      if (error) {
        throw error
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Choose the perfect plan for your needs
          </p>
        </motion.div>

        {currentPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-6 bg-card rounded-lg border"
          >
            <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">{currentPlan.name}</p>
                <p className="text-muted-foreground">
                  ${currentPlan.price}/{currentPlan.interval}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Downloads Left</p>
                <p className="text-2xl font-bold">
                  {downloadsLeft === -1 ? 'Unlimited' : downloadsLeft}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-lg border ${
                currentPlan?.id === plan.id
                  ? 'bg-primary text-white'
                  : 'bg-card'
              }`}
            >
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading || currentPlan?.id === plan.id}
                className={`w-full p-3 rounded-lg font-medium ${
                  currentPlan?.id === plan.id
                    ? 'bg-white/20 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {currentPlan?.id === plan.id
                  ? 'Current Plan'
                  : loading
                  ? 'Loading...'
                  : 'Subscribe'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Developer Access</h2>
          <p className="text-muted-foreground mb-4">
            Have a developer code? Enter it below to activate special access.
          </p>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter developer code"
              className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => {
                // TODO: Implement developer code activation
                toast.error('Developer code activation not implemented')
              }}
              className="bg-secondary text-primary px-6 py-3 rounded-lg font-medium"
            >
              Activate
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 