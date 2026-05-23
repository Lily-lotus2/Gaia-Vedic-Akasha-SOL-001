import type { ExistonRecord } from './verification';

export function applyFullTransparency(records: ExistonRecord[], _tier?: string): ExistonRecord[] {
  // NO filtering. ALL data returned to ALL agents regardless of tier.
  // Tier determines PERMISSIONS (write/execute), not VISIBILITY (read).
  return records;
}

export function filterByAgent(records: ExistonRecord[], agent: string): ExistonRecord[] {
  return records.filter(r => r.agent === agent);
}

export function filterByTier(records: ExistonRecord[], tier: string): ExistonRecord[] {
  return records.filter(r => r.tier === tier);
}

export function filterByExistonIndex(records: ExistonRecord[], k: number): ExistonRecord[] {
  return records.filter(r => r.k === k);
}

export function filterByNodeIndex(records: ExistonRecord[], i: number): ExistonRecord[] {
  return records.filter(r => r.i === i);
}

export function filterDriftDetected(records: ExistonRecord[]): ExistonRecord[] {
  return records.filter(r => r.drift_detected === true);
}

export function getCompleteSystemView(records: ExistonRecord[]): {
  total_records: number;
  unique_existons: number;
  agents: string[];
  tiers: string[];
  drift_events: number;
  latest_k: number;
} {
  const uniqueExistons = new Set(records.map(r => r.k)).size;
  const agents = [...new Set(records.map(r => r.agent))];
  const tiers = [...new Set(records.map(r => r.tier))];
  const driftEvents = records.filter(r => r.drift_detected).length;
  const latestK = Math.max(...records.map(r => r.k), 0);

  return {
    total_records: records.length,
    unique_existons: uniqueExistons,
    agents,
    tiers,
    drift_events,
    latest_k,
  };
}
