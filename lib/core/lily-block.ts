/**
 * LilyBlock - Immutable Blockchain Structure for Existon Logging
 * 
 * Implements SILO C (Google Drive append-only log) with:
 * - Chronon field theory (discrete time ticks)
 * - 28-node state vector
 * - Master coupling parameters
 * - Sexagesimal encoding
 * - Verification chain
 */

import { hashLilyBlockSexagesimal } from './sexagesimal';

export interface WaveHexagram {
  /** Existon index (chronon tick) */
  k: number;
  
  /** Node index (0-27) */
  i: number;
  
  /** Node state: -1 (down), 0 (neutral), +1 (up) */
  state: -1 | 0 | 1;
  
  /** Phase in degrees (0-360) */
  phase: number;
  
  /** Frequency in Hz */
  frequency: number;
  
  /** Sexagesimal encoding of state */
  stateSex: string;
}

export interface LilyBlock {
  /** Block index in blockchain */
  blockIndex: number;
  
  /** Existon index (chronon tick) */
  k: number;
  
  /** Chronon tick timestamp (ms since epoch) */
  chrononTick: number;
  
  /** Complete 28-node state vector */
  stateVector: number[];
  
  /** All 28 wave hexagrams */
  hexagrams: WaveHexagram[];
  
  /** Collapse intensity (0-1, Diósi-Penrose) */
  collapseIntensity: number;
  
  /** Master coupling parameter (0-1) */
  masterCoupling: number;
  
  /** Golden mean scaling factor */
  goldenMeanScale: number;
  
  /** Previous block hash (for chain verification) */
  previousHash: string;
  
  /** This block's hash (sexagesimal encoded) */
  hash: string;
  
  /** Verification status */
  verified: boolean;
  
  /** Agent that created this block */
  agent: string;
  
  /** Tier of access (unrestricted for all) */
  tier: 'unrestricted';
  
  /** Timestamp (ISO 8601) */
  timestamp: string;
  
  /** Metadata */
  metadata?: Record<string, any>;
}

/**
 * Create a new LilyBlock from state vector
 */
export function createLilyBlock(
  blockIndex: number,
  k: number,
  stateVector: number[],
  previousHash: string,
  agent: string = 'system',
  masterCoupling: number = 0.5,
  metadata?: Record<string, any>
): LilyBlock {
  if (stateVector.length !== 28) {
    throw new Error('State vector must have exactly 28 nodes');
  }
  
  const chrononTick = Date.now();
  const goldenMean = (1 + Math.sqrt(5)) / 2;
  const collapseIntensity = 1 / (1 + Math.exp(-masterCoupling * 10)); // Sigmoid
  
  // Create hexagrams for each node
  const hexagrams: WaveHexagram[] = stateVector.map((state, i) => {
    const phase = (i * 360 / 28 + k * 13) % 360; // Fibonacci-like phase shift
    const frequency = 528 * Math.pow(2, state); // 528 Hz base + state offset
    
    return {
      k,
      i,
      state: state as -1 | 0 | 1,
      phase,
      frequency,
      stateSex: state === -1 ? '0' : state === 0 ? '1' : '2',
    };
  });
  
  // Compute hash
  const hash = hashLilyBlockSexagesimal(k, stateVector, chrononTick, masterCoupling);
  
  return {
    blockIndex,
    k,
    chrononTick,
    stateVector,
    hexagrams,
    collapseIntensity,
    masterCoupling,
    goldenMeanScale: goldenMean,
    previousHash,
    hash,
    verified: true,
    agent,
    tier: 'unrestricted',
    timestamp: new Date(chrononTick).toISOString(),
    metadata,
  };
}

/**
 * Verify a LilyBlock's integrity
 */
export function verifyLilyBlock(block: LilyBlock, previousHash: string): boolean {
  // Check state vector length
  if (block.stateVector.length !== 28) return false;
  
  // Check hexagrams count
  if (block.hexagrams.length !== 28) return false;
  
  // Check previous hash chain
  if (block.previousHash !== previousHash) return false;
  
  // Verify hash computation
  const computedHash = hashLilyBlockSexagesimal(
    block.k,
    block.stateVector,
    block.chrononTick,
    block.masterCoupling
  );
  
  if (block.hash !== computedHash) return false;
  
  // Verify hexagrams match state vector
  for (let i = 0; i < 28; i++) {
    if (block.hexagrams[i].state !== block.stateVector[i]) return false;
  }
  
  return true;
}

/**
 * Serialize LilyBlock for storage (JSON)
 */
export function serializeLilyBlock(block: LilyBlock): string {
  return JSON.stringify(block, null, 2);
}

/**
 * Deserialize LilyBlock from storage
 */
export function deserializeLilyBlock(json: string): LilyBlock {
  return JSON.parse(json) as LilyBlock;
}

/**
 * Create genesis block (k=0)
 */
export function createGenesisLilyBlock(agent: string = 'system'): LilyBlock {
  const genesisState = Array(28).fill(0); // All neutral
  return createLilyBlock(
    0,
    0,
    genesisState,
    '0000', // Genesis has no previous hash
    agent,
    0.5, // Default master coupling
    { genesis: true, description: 'Genesis block - universe breathes for the first time' }
  );
}

export default {
  createLilyBlock,
  verifyLilyBlock,
  serializeLilyBlock,
  deserializeLilyBlock,
  createGenesisLilyBlock,
};
