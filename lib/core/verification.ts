import crypto from 'crypto';

export type StateVector = number[];

export interface ExistonRecord {
  k: number;
  i: number;
  state: number;
  hash: string;
  node_hash: string;
  agent: string;
  tier: string;
  timestamp_ms: number;
  verified: boolean;
  neighborhood_sum: number;
  transition_rule_applied: string;
  previous_state: number | null;
  coherence_score: number;
  drift_detected: boolean;
  verification_chain: string;
}

export function computeNodeHash(state: number): string {
  return crypto.createHash('sha256').update(String(state)).digest('hex');
}

export function computeStateVectorHash(stateVector: StateVector): string {
  const combined = stateVector.map(s => computeNodeHash(s)).join('');
  return crypto.createHash('sha256').update(combined).digest('hex');
}

export function computeVerificationChainHash(previousChainHash: string, currentStateHash: string): string {
  const combined = previousChainHash + currentStateHash;
  return crypto.createHash('sha256').update(combined).digest('hex');
}

export function verifyExistonRecord(record: ExistonRecord, previousChainHash: string): boolean {
  // Verify node hash matches state
  const expectedNodeHash = computeNodeHash(record.state);
  if (record.hash !== expectedNodeHash) {
    console.error(`Hash mismatch for node ${record.i} at Existon ${record.k}`);
    return false;
  }

  // Verify verification chain
  const expectedChainHash = computeVerificationChainHash(previousChainHash, record.node_hash);
  if (record.verification_chain !== 'genesis' && record.verification_chain !== expectedChainHash) {
    console.error(`Verification chain mismatch at Existon ${record.k}`);
    return false;
  }

  return true;
}

export function createGenesisRecord(stateVector: StateVector): ExistonRecord[] {
  const records: ExistonRecord[] = [];
  const nodeHash = computeStateVectorHash(stateVector);

  for (let i = 0; i < stateVector.length; i++) {
    records.push({
      k: 0,
      i,
      state: stateVector[i],
      hash: computeNodeHash(stateVector[i]),
      node_hash: nodeHash,
      agent: 'system',
      tier: 'unrestricted',
      timestamp_ms: Date.now(),
      verified: true,
      neighborhood_sum: 0,
      transition_rule_applied: 'initial',
      previous_state: null,
      coherence_score: 1.0,
      drift_detected: false,
      verification_chain: 'genesis',
    });
  }

  return records;
}
