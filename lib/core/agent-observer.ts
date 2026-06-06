import { getAllExistonLogs, getSystemState } from './existon-logger';
import { applyFullTransparency, getCompleteSystemView, filterDriftDetected } from './full-transparency-filter';
import type { ExistonRecord } from './verification';

export async function getAgentVisibility(agent: string): Promise<{
  agent: string;
  can_see: string;
  total_records: number;
  latest_existon: number;
}> {
  const allRecords = await getAllExistonLogs();
  const visibleRecords = applyFullTransparency(allRecords, agent);

  return {
    agent,
    can_see: 'ALL system data, real-time',
    total_records: visibleRecords.length,
    latest_existon: Math.max(...visibleRecords.map(r => r.k), 0),
  };
}

export async function getSystemStateForAgent(_agent: string): Promise<any> {
  // All agents see the same complete system state
  const allRecords = await getAllExistonLogs();
  const systemView = getCompleteSystemView(allRecords);
  const state = await getSystemState();

  return {
    ...systemView,
    ...state,
    timestamp: new Date().toISOString(),
  };
}

export async function getDriftDetectionAlerts(): Promise<ExistonRecord[]> {
  const allRecords = await getAllExistonLogs();
  return filterDriftDetected(allRecords);
}

export async function getExistonHistory(limit: number = 100): Promise<ExistonRecord[]> {
  const allRecords = await getAllExistonLogs();
  return allRecords.slice(-limit * 28); // 28 records per Existon
}

export async function verifySystemIntegrity(): Promise<{
  status: 'healthy' | 'degraded' | 'critical';
  drift_detected: boolean;
  total_records: number;
  verification_status: string;
}> {
  const allRecords = await getAllExistonLogs();
  const driftRecords = filterDriftDetected(allRecords);

  return {
    status: driftRecords.length > 0 ? 'critical' : 'healthy',
    drift_detected: driftRecords.length > 0,
    total_records: allRecords.length,
    verification_status: allRecords.every(r => r.verified) ? 'all_verified' : 'some_unverified',
  };
}
