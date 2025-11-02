import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

interface DonationData {
  amount: number;
  frequency: 'once' | 'monthly';
  email: string;
  name: string;
  businessName?: string;
  website?: string;
  donorType: 'individual' | 'business';
  isAnonymous: boolean;
  allowRecognition: boolean;
  donorTier: 'friend' | 'supporter' | 'advocate' | 'champion';
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data: DonationData = JSON.parse(event.body || '{}');

    if (!data.amount || data.amount < 5) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Amount must be at least $5' }) };
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) };
    }
    if (!data.isAnonymous && !data.name) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Name required unless anonymous' }) };
    }

    const sessionConfig: any = {
      payment_method_types: ['card'],
      customer_email: data.email,
      billing_address_collection: 'required',
      metadata: {
        donor_name: data.isAnonymous ? 'Anonymous' : data.name,
        business_name: data.businessName || '',
        website: data.website || '',
        donor_type: data.donorType,
        is_anonymous: String(data.isAnonymous),
        allow_recognition: String(data.allowRecognition),
        donor_tier: data.donorTier,
        frequency: data.frequency,
        amount_dollars: String(data.amount),
      },
      success_url: `${process.env.SITE_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SITE_URL}/donate?canceled=true`,
    };

    if (data.frequency === 'once') {
      sessionConfig.mode = 'payment';
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation to Florida Autism Services',
              description: 'Support for Florida autism service directory',
            },
            unit_amount: Math.round(data.amount * 100),
          },
          quantity: 1,
        },
      ];
    } else {
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Monthly Donation to Florida Autism Services',
              description: 'Recurring support for Florida autism service directory',
            },
            unit_amount: Math.round(data.amount * 100),
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, sessionId: session.id }),
    };
  } catch (error) {
    console.error('Donation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error instanceof Error ? error.message : 'An error occurred' }),
    };
  }
};
