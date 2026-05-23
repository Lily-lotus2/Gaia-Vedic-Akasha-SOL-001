import { NextResponse } from 'next/server';
import { getDriftDetectionAlerts, verifySystemIntegrity } from '@/lib/agent-observer';

export async function GET(req: Request) {
  try {
    const driftAlerts = await getDriftDetectionAlerts();
    const integrity = await verifySystemIntegrity();

    return NextResponse.json({
      drift_alerts: driftAlerts,
      total_drift_events: driftAlerts.length,
      system_integrity: integrity,
      timestamp_ms: Date.now(),
      message: driftAlerts.length > 0 ? 'DRIFT DETECTED - CRITICAL ALERT' : 'System coherent',
    });
  } catch (error) {
    console.error('[DRIFT DETECTION ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to retrieve drift detection data', details: String(error) },
      { status: 500 }
    );
  }
}
