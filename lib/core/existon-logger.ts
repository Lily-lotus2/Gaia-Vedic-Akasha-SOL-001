import { promises as fs } from 'fs';
import path from 'path';
import type { ExistonRecord } from './verification';

const SILO_C_FOLDER_ID = '1ALbLmSO8WIWpb5wOpA7saUo7_dnyN_x2';
const EXISTON_COMPLETE_FOLDER_ID = '1_MiAb0688aPqr_ITMTCgxcrYU8fRiRAK';
const VERIFICATION_CHAIN_FOLDER_ID = '1N1mjMMGIYRdBjSs0wr7CGmBiEObCqDkB';
const AGENT_ACTIVITY_FOLDER_ID = '1X66icerAcdOTuJa2q_rjn0V5sIkHqKFI';

const LOCAL_LOG_PATH = path.join(process.cwd(), 'data', 'existon-log.jsonl');
const LOCAL_VERIFICATION_PATH = path.join(process.cwd(), 'data', 'verification-chain.jsonl');
const LOCAL_AGENT_ACTIVITY_PATH = path.join(process.cwd(), 'data', 'agent-activity.jsonl');

export async function logExistonToSILOC(records: ExistonRecord[]): Promise<void> {
  // Ensure data directory exists
  await fs.mkdir(path.dirname(LOCAL_LOG_PATH), { recursive: true });

  // Log to local file (immediate, synchronous)
  const logLines = records.map(r => JSON.stringify(r)).join('\n') + '\n';
  await fs.appendFile(LOCAL_LOG_PATH, logLines);

  // Log verification chain
  const verificationLines = records
    .map(r => JSON.stringify({
      k: r.k,
      i: r.i,
      hash: r.hash,
      node_hash: r.node_hash,
      verification_chain: r.verification_chain,
      timestamp_ms: r.timestamp_ms,
    }))
    .join('\n') + '\n';
  await fs.appendFile(LOCAL_VERIFICATION_PATH, verificationLines);

  console.log(`[EXISTON LOG] Logged ${records.length} records for Existon k=${records[0]?.k}`);
}

export async function logAgentActivity(agent: string, action: string, details: Record<string, any>): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_AGENT_ACTIVITY_PATH), { recursive: true });

  const activityRecord = {
    agent,
    action,
    timestamp_ms: Date.now(),
    details,
  };

  const logLine = JSON.stringify(activityRecord) + '\n';
  await fs.appendFile(LOCAL_AGENT_ACTIVITY_PATH, logLine);

  console.log(`[AGENT ACTIVITY] ${agent}: ${action}`);
}

export async function getExistonLog(k: number): Promise<ExistonRecord[]> {
  try {
    const content = await fs.readFile(LOCAL_LOG_PATH, 'utf-8');
    const records = content
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line) as ExistonRecord)
      .filter(record => record.k === k);
    return records;
  } catch {
    return [];
  }
}

export async function getAllExistonLogs(): Promise<ExistonRecord[]> {
  try {
    const content = await fs.readFile(LOCAL_LOG_PATH, 'utf-8');
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line) as ExistonRecord);
  } catch {
    return [];
  }
}

export async function getSystemState(): Promise<{ current_k: number; total_existons: number; last_timestamp_ms: number }> {
  const logs = await getAllExistonLogs();
  if (logs.length === 0) {
    return { current_k: 0, total_existons: 0, last_timestamp_ms: 0 };
  }

  const maxK = Math.max(...logs.map(r => r.k));
  const lastRecord = logs.filter(r => r.k === maxK).pop();

  return {
    current_k: maxK,
    total_existons: logs.length / 28, // 28 nodes per Existon
    last_timestamp_ms: lastRecord?.timestamp_ms || 0,
  };
}
