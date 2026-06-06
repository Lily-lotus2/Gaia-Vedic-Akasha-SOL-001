import { getAllExistonLogs, getSystemState } from './existon-logger';
import type { ExistonRecord } from './verification';

let lastSyncTimestamp = 0;
let cachedExistons: ExistonRecord[] = [];

export async function syncFromSILOC(): Promise<void> {
  const now = Date.now();
  
  // Sync every 100ms
  if (now - lastSyncTimestamp < 100) {
    return;
  }

  lastSyncTimestamp = now;
  cachedExistons = await getAllExistonLogs();
  
  console.log(`[SILO-C SYNC] Synced ${cachedExistons.length} records at ${new Date().toISOString()}`);
}

export async function getLatestExiston(): Promise<ExistonRecord[] | null> {
  await syncFromSILOC();
  
  if (cachedExistons.length === 0) {
    return null;
  }

  const maxK = Math.max(...cachedExistons.map(r => r.k));
  return cachedExistons.filter(r => r.k === maxK);
}

export async function getExistonByIndex(k: number): Promise<ExistonRecord[] | null> {
  await syncFromSILOC();
  
  const records = cachedExistons.filter(r => r.k === k);
  return records.length > 0 ? records : null;
}

export async function getSystemStateFromSILOC(): Promise<{ current_k: number; total_existons: number; last_timestamp_ms: number }> {
  return await getSystemState();
}

export async function getAllExistonsFromSILOC(): Promise<ExistonRecord[]> {
  await syncFromSILOC();
  return cachedExistons;
}

export async function getExistonRange(startK: number, endK: number): Promise<ExistonRecord[]> {
  await syncFromSILOC();
  return cachedExistons.filter(r => r.k >= startK && r.k <= endK);
}
