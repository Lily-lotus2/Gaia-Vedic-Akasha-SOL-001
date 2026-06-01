import { NextRequest, NextResponse } from 'next/server';

interface LeadData {
  name: string;
  email: string;
  businessName: string;
  message?: string;
}

// In-memory storage (replace with database in production)
const leads: (LeadData & { id: string; timestamp: string })[] = [];

export async function POST(request: NextRequest) {
  try {
    const body: LeadData = await request.json();

    // Validation
    if (!body.name || !body.email || !body.businessName) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, businessName' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Create lead record
    const lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...body,
    };

    leads.push(lead);

    // Log as Existon
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/existon/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'lead_submission',
        eventName: `New Lead: ${body.businessName}`,
        metadata: {
          leadId: lead.id,
          businessName: body.businessName,
          email: body.email,
        },
      }),
    }).catch(err => console.error('Failed to log existon:', err));

    // TODO: Send email notification to carameldigitalcontent@gmail.com
    console.log('New lead submitted:', lead);

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        message: 'Thank you! We will contact you soon.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return leads (protected in production)
  return NextResponse.json({ leads, count: leads.length });
}
