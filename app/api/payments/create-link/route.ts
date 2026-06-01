import { NextRequest, NextResponse } from 'next/server';

interface PaymentRequest {
  type: 'upfront' | 'monthly';
  amount: number;
  businessName: string;
  email: string;
  tier?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequest = await request.json();

    if (!body.amount || !body.businessName || !body.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate payment links
    const googlePayLink = generateGooglePayLink(body);
    const wiseLink = generateWiseLink(body);

    return NextResponse.json({
      success: true,
      paymentLinks: {
        googlePay: googlePayLink,
        wise: wiseLink,
      },
      message: 'Payment links generated. Customer can choose their preferred payment method.',
    });
  } catch (error) {
    console.error('Payment link generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate payment links' },
      { status: 500 }
    );
  }
}

function generateGooglePayLink(data: PaymentRequest): string {
  // Google Pay link format for direct payment
  const amount = (data.amount * 100).toFixed(0); // Convert to cents
  const description = `${data.type === 'upfront' ? 'Website Setup' : `Monthly ${data.tier || 'Hosting'}`} - ${data.businessName}`;
  
  // This would integrate with Google Pay API in production
  // For now, return a placeholder that would redirect to payment processor
  return `https://pay.google.com/gp/v/save/${Buffer.from(JSON.stringify({
    amount,
    currency: 'ZAR',
    description,
    email: data.email,
  })).toString('base64')}`;
}

function generateWiseLink(data: PaymentRequest): string {
  // Wise payment link - using their API in production
  const amount = data.amount;
  const description = `${data.type === 'upfront' ? 'Website Setup' : `Monthly ${data.tier || 'Hosting'}`} - ${data.businessName}`;
  
  // This would integrate with Wise API in production
  // For now, return a placeholder
  return `https://wise.com/pay?amount=${amount}&currency=ZAR&email=${encodeURIComponent(data.email)}&description=${encodeURIComponent(description)}&recipient=carameldigitalcontent@gmail.com`;
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/payments/create-link',
    method: 'POST',
    description: 'Generate payment links for Google Pay and Wise',
    payload: {
      type: 'upfront | monthly',
      amount: 'number (in ZAR)',
      businessName: 'string',
      email: 'string',
      tier: 'string (optional)',
    },
  });
}
