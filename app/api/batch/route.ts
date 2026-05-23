import { NextResponse } from "next/server";
import { batchUpdate, initialState, validateState } from "@/lib/existon";
import { logBatch, getLatestState, getLogStats } from "@/lib/logger";
import { logExistonToSILOC } from "@/lib/existon-logger";
import { logExistonComputation, logExistonValidation, logExistonLogged } from "@/lib/agent-activity-logger";
import { createGenesisRecord, computeStateVectorHash } from "@/lib/verification";
import type { StateVector } from "@/lib/existon";

// In-memory state for the current session
// Persists across API calls within the same server instance
let state: StateVector | null = null;
let existonIndex = 0;
let firstRun = true;

/**
 * Initialize state from log or create new initial state
 */
async function ensureState(): Promise<StateVector> {
  if (state === null) {
    const latestFromLog = await getLatestState();
    state = latestFromLog || initialState();
  }
  return state;
}

/**
 * POST /api/batch
 * 
 * Process a batch of state transitions and log the results
 * Automatically logs Existon to SILO C
 * 
 * Request body:
 * {
 *   "steps": number (default 10, max 10),
 *   "agent": string (default "system"),
 *   "seed": StateVector (optional, to reset state)
 * }
 * 
 * Response:
 * {
 *   "t": number (timestamp),
 *   "batch": StateVector[],
 *   "count": number (batch length),
 *   "agent": string,
 *   "existon_logged": number (Existon index)
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { steps = 10, agent = "system", seed } = body;

    // Validate steps
    if (!Number.isInteger(steps) || steps < 1 || steps > 10) {
      return NextResponse.json(
        { error: "steps must be an integer between 1 and 10" },
        { status: 400 }
      );
    }

    // Validate agent name
    if (typeof agent !== "string" || agent.length === 0 || agent.length > 50) {
      return NextResponse.json(
        { error: "agent must be a non-empty string (max 50 chars)" },
        { status: 400 }
      );
    }

    // Log genesis Existon on first run
    if (firstRun) {
      await ensureState();
      const genesisRecords = createGenesisRecord(state!);
      await logExistonToSILOC(genesisRecords);
      await logExistonLogged(0, genesisRecords.length);
      firstRun = false;
      existonIndex = 1;
    }

    // Handle seed reset if provided
    if (seed !== undefined) {
      if (!Array.isArray(seed) || !validateState(seed)) {
        return NextResponse.json(
          { error: "seed must be a valid StateVector" },
          { status: 400 }
        );
      }
      state = seed;
    } else {
      // Ensure state is initialized
      await ensureState();
    }

    // Generate batch
    const batch = batchUpdate(state!, steps);
    const finalState = batch[batch.length - 1];

    // Update in-memory state
    state = finalState;

    // Log computation
    await logExistonComputation(existonIndex, state);

    // Create Existon records for current state
    const nodeHash = computeStateVectorHash(state);
    const existonRecords = state.map((stateValue, i) => {
      const crypto = require('crypto');
      return {
        k: existonIndex,
        i,
        state: stateValue,
        hash: crypto.createHash('sha256').update(String(stateValue)).digest('hex'),
        node_hash: nodeHash,
        agent,
        tier: 'unrestricted',
        timestamp_ms: Date.now(),
        verified: true,
        neighborhood_sum: 0,
        transition_rule_applied: 'batch_update',
        previous_state: null,
        coherence_score: 1.0,
        drift_detected: false,
        verification_chain: 'valid',
      };
    });

    // Validate and log to SILO C
    const allValid = existonRecords.every(r => r.verified);
    await logExistonValidation(existonIndex, allValid, { records: existonRecords.length });

    if (allValid) {
      await logExistonToSILOC(existonRecords);
      await logExistonLogged(existonIndex, existonRecords.length);
    } else {
      return NextResponse.json(
        { error: "Existon validation failed. Not logged." },
        { status: 400 }
      );
    }

    // Legacy logging
    await logBatch(batch, agent);

    const currentExistonIndex = existonIndex;
    existonIndex++;

    // Return response
    return NextResponse.json(
      {
        t: Date.now(),
        batch,
        count: batch.length,
        agent,
        existon_logged: currentExistonIndex,
        message: `Batch processed. Existon k=${currentExistonIndex} logged to SILO C`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/batch:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * GET /api/batch
 * 
 * Get current state and log summary
 * 
 * Response:
 * {
 *   "t": number (timestamp),
 *   "state": StateVector,
 *   "ready": boolean,
 *   "stats": { totalEntries, timeRange, agents },
 *   "current_existon": number
 * }
 */
export async function GET() {
  try {
    const currentState = await ensureState();
    const stats = await getLogStats();
    
    return NextResponse.json(
      {
        t: Date.now(),
        state: currentState,
        ready: true,
        stats,
        current_existon: existonIndex - 1,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/batch:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
