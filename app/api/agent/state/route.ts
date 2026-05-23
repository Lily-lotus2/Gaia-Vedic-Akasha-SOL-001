import { NextResponse } from 'next/server';
import { getAgentVisibility, getExistonHistory } from '@/lib/agent-observer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const agent = searchParams.get('agent') || 'unknown';
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const visibility = await getAgentVisibility(agent);
    const history = await getExistonHistory(limit);

    return NextResponse.json({
      agent_visibility: visibility,
      existon_history: history,
      history_limit: limit,
      timestamp_ms: Date.now(),
      message: `Agent ${agent} can see all system data in real-time`,
    });
  } catch (error) {
    console.error('[AGENT STATE ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to retrieve agent state', details: String(error) },
      { status: 500 }
    );
  }
}
