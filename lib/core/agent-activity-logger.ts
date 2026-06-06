import { logAgentActivity } from './existon-logger';

export async function logSystemInitialization(): Promise<void> {
  await logAgentActivity('system', 'initialization', {
    event: 'System initialized',
    timestamp: new Date().toISOString(),
  });
}

export async function logExistonComputation(k: number, stateVector: number[]): Promise<void> {
  await logAgentActivity('system', 'existon_computed', {
    k,
    state_vector_length: stateVector.length,
    state_vector_sum: stateVector.reduce((a, b) => a + b, 0),
  });
}

export async function logExistonValidation(k: number, valid: boolean, details: Record<string, any>): Promise<void> {
  await logAgentActivity('system', 'existon_validated', {
    k,
    valid,
    ...details,
  });
}

export async function logExistonLogged(k: number, recordCount: number): Promise<void> {
  await logAgentActivity('system', 'existon_logged', {
    k,
    records: recordCount,
    timestamp: new Date().toISOString(),
  });
}

export async function logDriftDetection(k: number, driftDetails: Record<string, any>): Promise<void> {
  await logAgentActivity('system', 'drift_detected', {
    k,
    ...driftDetails,
    alert_level: 'critical',
  });
}

export async function logTierAccess(tier: string, action: string, details: Record<string, any>): Promise<void> {
  await logAgentActivity(`tier-${tier}`, action, details);
}

export async function logAgentQuery(agent: string, query: string, result: any): Promise<void> {
  await logAgentActivity(agent, 'query_executed', {
    query,
    result_type: typeof result,
    timestamp: new Date().toISOString(),
  });
}
