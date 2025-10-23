import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { amount, isRecurring } = JSON.parse(event.body || '{}');

    if (!amount || amount < 100) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' }),
      };
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      mode: isRecurring ? 'subscription' : 'payment',
      success_url: `${process.env.URL || 'https://floridaautismservices.com'}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'https://floridaautismservices.com'}`,
      line_items: [
        isRecurring
          ? {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Monthly Donation to Florida Autism Services',
                  description: 'Support families navigating autism services in Florida',
                },
                unit_amount: amount,
                recurring: {
                  interval: 'month',
                },
              },
              quantity: 1,
            }
          : {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'Donation to Florida Autism Services',
                  description: 'Support families navigating autism services in Florida',
                },
                unit_amount: amount,
              },
              quantity: 1,
            },
      ],
    };

    const session = await stripe.checkout.sessions.create(params);

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Stripe error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
};