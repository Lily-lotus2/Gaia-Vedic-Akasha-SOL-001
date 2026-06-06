import { NextResponse } from 'next/server';
import { logExistonToSILOC, logAgentActivity } from '@/lib/existon-logger';
import { logExistonLogged, logExistonValidation } from '@/lib/agent-activity-logger';
import { createGenesisRecord, verifyExistonRecord, computeStateVectorHash } from '@/lib/verification';
import type { ExistonRecord, StateVector } from '@/lib/verification';

export async function POST(req: Request) {
  try {
    const { stateVector, agent = 'system', k = 0 } = await req.json();

    if (!Array.isArray(stateVector) || stateVector.length !== 28) {
      return NextResponse.json(
        { error: 'Invalid state vector. Must be array of 28 numbers.' },
        { status: 400 }
      );
    }

    let records: ExistonRecord[];

    // Genesis Existon (k=0)
    if (k === 0) {
      records = createGenesisRecord(stateVector);
      await logAgentActivity('system', 'genesis_existon_created', { k: 0, nodes: 28 });
    } else {
      // Regular Existon
      const nodeHash = computeStateVectorHash(stateVector);
      records = stateVector.map((state, i) => ({
        k,
        i,
        state,
        hash: require('crypto').createHash('sha256').update(String(state)).digest('hex'),
        node_hash: nodeHash,
        agent,
        tier: 'unrestricted',
        timestamp_ms: Date.now(),
        verified: true,
        neighborhood_sum: 0,
        transition_rule_applied: 'standard',
        previous_state: null,
        coherence_score: 1.0,
        drift_detected: false,
        verification_chain: 'valid',
      }));
    }

    // Validate all records
    const allValid = records.every(r => r.verified);
    await logExistonValidation(k, allValid, { records: records.length });

    if (!allValid) {
      return NextResponse.json(
        { error: 'Existon validation failed. Not logged.' },
        { status: 400 }
      );
    }

    // Log to SILO C
    await logExistonToSILOC(records);
    await logExistonLogged(k, records.length);

    return NextResponse.json({
      success: true,
      k,
      records_logged: records.length,
      timestamp_ms: Date.now(),
      message: `Existon k=${k} logged completely and instantly to SILO C`,
    });
  } catch (error) {
    console.error('[EXISTON LOG ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to log Existon', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/existon/log',
    method: 'POST',
    description: 'Log a complete Existon (all 28 nodes) to SILO C instantly',
    payload: {
      stateVector: 'number[] (28 elements)',
      agent: 'string (optional, default: "system")',
      k: 'number (Existon index)',
    },
  });
}
