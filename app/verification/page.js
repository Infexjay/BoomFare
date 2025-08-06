'use client'

import { loadStripe } from '@stripe/stripe-js'

// This should be in a .env file
const stripePromise = loadStripe("your-stripe-public-key");

const plans = [
  { name: 'Lifetime', price: '₦10,000', priceId: 'your-lifetime-price-id' },
  { name: 'Monthly', price: '₦2,000', priceId: 'your-monthly-price-id' },
]

export default function VerificationPage() {
  const handleCheckout = async (priceId) => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    })
    const { sessionId } = await res.json()
    const stripe = await stripePromise
    await stripe.redirectToCheckout({ sessionId })
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Get Verified</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((plan) => (
          <div key={plan.name} className="border border-secondary p-4 rounded-lg">
            <h2 className="text-xl font-bold">{plan.name}</h2>
            <p className="text-3xl font-bold my-4">{plan.price}</p>
            <button
              onClick={() => handleCheckout(plan.priceId)}
              className="w-full bg-primary text-primary-foreground p-2 rounded-lg"
            >
              Get Verified
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
