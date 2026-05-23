import { NextResponse } from 'next/server';
import { getSystemStateForAgent, verifySystemIntegrity } from '@/lib/agent-observer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agent = searchParams.get('agent') || 'unknown';

    const systemState = await getSystemStateForAgent(agent);
    const integrity = await verifySystemIntegrity();

    return NextResponse.json({
      agent,
      system_state: systemState,
      system_integrity: integrity,
      timestamp_ms: Date.now(),
      message: 'Complete system state visible to all agents',
    });
  } catch (error) {
    console.error('[SYSTEM STATE ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to retrieve system state', details: String(error) },
      { status: 500 }
    );
  }
}
