/**
 * Information Bottleneck Theory
 * 
 * Identifies critical nodes and patterns that determine system behavior
 * Based on the Information Bottleneck Method (Tishby et al.)
 */

import { StateVector } from './existon';

/**
 * Node Importance Score
 * 
 * Measures how critical a node is for predicting system behavior
 * Based on mutual information with system outcome
 */
export function calculateNodeImportance(
  nodeHistory: number[],
  systemOutcomeHistory: number[]
): number {
  if (
    nodeHistory.length !== systemOutcomeHistory.length ||
    nodeHistory.length === 0
  ) {
    return 0;
  }

  // Count state combinations
  const jointCounts = new Map<string, number>();
  const outcomeCounts = new Map<number, number>();

  for (let i = 0; i < nodeHistory.length; i++) {
    const key = `${nodeHistory[i]},${systemOutcomeHistory[i]}`;
    jointCounts.set(key, (jointCounts.get(key) || 0) + 1);
    outcomeCounts.set(
      systemOutcomeHistory[i],
      (outcomeCounts.get(systemOutcomeHistory[i]) || 0) + 1
    );
  }

  const n = nodeHistory.length;
  let mutualInfo = 0;

  // Calculate mutual information
  for (const [key, count] of jointCounts.entries()) {
    const outcome = parseInt(key.split(',')[1]);
    const pNodeOutcome = count / n;
    const pOutcome = (outcomeCounts.get(outcome) || 0) / n;

    if (pNodeOutcome > 0 && pOutcome > 0) {
      const pNodeGivenOutcome = pNodeOutcome / pOutcome;
      mutualInfo += pNodeOutcome * Math.log2(pNodeGivenOutcome);
    }
  }

  return Math.max(0, mutualInfo);
}

/**
 * Node Redundancy
 * 
 * Measures how much information a node provides that is already
 * provided by other nodes
 */
export function calculateNodeRedundancy(
  nodeHistory: number[],
  otherNodesHistory: number[][],
  systemOutcomeHistory: number[]
): number {
  if (nodeHistory.length === 0 || otherNodesHistory.length === 0) return 0;

  const nodeImportance = calculateNodeImportance(nodeHistory, systemOutcomeHistory);

  let totalOtherImportance = 0;
  for (const otherNode of otherNodesHistory) {
    totalOtherImportance += calculateNodeImportance(otherNode, systemOutcomeHistory);
  }

  const avgOtherImportance =
    otherNodesHistory.length > 0
      ? totalOtherImportance / otherNodesHistory.length
      : 0;

  // Redundancy = min(node_importance, avg_other_importance)
  return Math.min(nodeImportance, avgOtherImportance);
}

/**
 * Synergistic Information
 * 
 * Measures information that emerges from the combination of nodes
 * that is not present in any individual node
 */
export function calculateSynergisticInformation(
  nodeHistories: number[][],
  systemOutcomeHistory: number[]
): number {
  if (nodeHistories.length === 0 || nodeHistories[0].length === 0) return 0;

  const n = systemOutcomeHistory.length;

  // Joint information from all nodes
  let jointCounts = new Map<string, number>();
  let outcomeCounts = new Map<number, number>();

  for (let i = 0; i < n; i++) {
    const states = nodeHistories.map((nh) => nh[i]).join(',');
    const key = `${states},${systemOutcomeHistory[i]}`;
    jointCounts.set(key, (jointCounts.get(key) || 0) + 1);
    outcomeCounts.set(
      systemOutcomeHistory[i],
      (outcomeCounts.get(systemOutcomeHistory[i]) || 0) + 1
    );
  }

  let jointMI = 0;
  for (const [key, count] of jointCounts.entries()) {
    const parts = key.split(',');
    const outcome = parseInt(parts[parts.length - 1]);
    const pJointOutcome = count / n;
    const pOutcome = (outcomeCounts.get(outcome) || 0) / n;

    if (pJointOutcome > 0 && pOutcome > 0) {
      const pJointGivenOutcome = pJointOutcome / pOutcome;
      jointMI += pJointOutcome * Math.log2(pJointGivenOutcome);
    }
  }

  // Sum of individual information
  let sumIndividualMI = 0;
  for (const nodeHistory of nodeHistories) {
    sumIndividualMI += calculateNodeImportance(nodeHistory, systemOutcomeHistory);
  }

  // Synergy = Joint MI - Sum of individual MI
  return Math.max(0, jointMI - sumIndividualMI);
}

/**
 * Information Bottleneck Compression
 * 
 * Identifies the minimal sufficient statistics for predicting system outcome
 * Returns nodes that are most informative
 */
export function identifyInformationBottleneck(
  stateHistory: StateVector[],
  systemOutcomeHistory: number[],
  compressionRatio: number = 0.5
): {
  bottleneckNodes: number[];
  totalInformation: number;
  compressedInformation: number;
  compressionEfficiency: number;
} {
  if (stateHistory.length === 0 || stateHistory[0].length === 0) {
    return {
      bottleneckNodes: [],
      totalInformation: 0,
      compressedInformation: 0,
      compressionEfficiency: 0,
    };
  }

  const nodeCount = stateHistory[0].length;
  const nodeImportances: { nodeIndex: number; importance: number }[] = [];

  // Extract node histories
  const nodeHistories: number[][] = Array(nodeCount)
    .fill(null)
    .map(() => []);

  for (const state of stateHistory) {
    for (let i = 0; i < nodeCount; i++) {
      nodeHistories[i].push(state[i]);
    }
  }

  // Calculate importance for each node
  for (let i = 0; i < nodeCount; i++) {
    const importance = calculateNodeImportance(nodeHistories[i], systemOutcomeHistory);
    nodeImportances.push({ nodeIndex: i, importance });
  }

  // Sort by importance (descending)
  nodeImportances.sort((a, b) => b.importance - a.importance);

  // Select top nodes based on compression ratio
  const selectedCount = Math.ceil(nodeCount * compressionRatio);
  const bottleneckNodes = nodeImportances
    .slice(0, selectedCount)
    .map((n) => n.nodeIndex);

  // Calculate information metrics
  const totalInformation = nodeImportances.reduce((sum, n) => sum + n.importance, 0);
  const compressedInformation = nodeImportances
    .slice(0, selectedCount)
    .reduce((sum, n) => sum + n.importance, 0);

  const compressionEfficiency =
    totalInformation > 0 ? compressedInformation / totalInformation : 0;

  return {
    bottleneckNodes,
    totalInformation,
    compressedInformation,
    compressionEfficiency,
  };
}

/**
 * Attractor Basin Analysis
 * 
 * Identifies states that lead to the same attractor
 */
export function analyzeAttractorBasins(
  stateHistory: StateVector[]
): {
  attractors: StateVector[];
  basinSizes: number[];
  basinDepths: number[];
} {
  if (stateHistory.length === 0) {
    return { attractors: [], basinSizes: [], basinDepths: [] };
  }

  const attractors: StateVector[] = [];
  const basinSizes: number[] = [];
  const basinDepths: number[] = [];

  // Simple attractor detection: find states that repeat
  const stateMap = new Map<string, number>();
  const stateToAttractor = new Map<string, number>();

  for (let i = 0; i < stateHistory.length; i++) {
    const stateStr = JSON.stringify(stateHistory[i]);
    const count = (stateMap.get(stateStr) || 0) + 1;
    stateMap.set(stateStr, count);

    // If state appears multiple times, it's likely an attractor
    if (count > 1 && !stateToAttractor.has(stateStr)) {
      const attractorIndex = attractors.length;
      attractors.push(stateHistory[i]);
      stateToAttractor.set(stateStr, attractorIndex);
      basinSizes.push(0);
      basinDepths.push(0);
    }

    if (stateToAttractor.has(stateStr)) {
      const attractorIndex = stateToAttractor.get(stateStr)!;
      basinSizes[attractorIndex]++;
    }
  }

  // Calculate basin depths (distance to attractor)
  for (let i = 0; i < stateHistory.length; i++) {
    const stateStr = JSON.stringify(stateHistory[i]);
    if (stateToAttractor.has(stateStr)) {
      const attractorIndex = stateToAttractor.get(stateStr)!;
      // Find first occurrence of this attractor
      for (let j = i; j < stateHistory.length; j++) {
        const nextStateStr = JSON.stringify(stateHistory[j]);
        if (stateToAttractor.get(nextStateStr) === attractorIndex) {
          basinDepths[attractorIndex] = Math.max(
            basinDepths[attractorIndex],
            j - i
          );
          break;
        }
      }
    }
  }

  return { attractors, basinSizes, basinDepths };
}

/**
 * Predictability Index
 * 
 * Measures how predictable the system is based on current state
 * Higher = more predictable
 */
export function calculatePredictability(
  stateHistory: StateVector[],
  lookAhead: number = 1
): number {
  if (stateHistory.length < lookAhead + 1) return 0;

  let correctPredictions = 0;
  let totalPredictions = 0;

  for (let i = 0; i < stateHistory.length - lookAhead; i++) {
    const currentState = JSON.stringify(stateHistory[i]);
    const futureState = JSON.stringify(stateHistory[i + lookAhead]);

    // Count how many times this state transition occurs
    let transitionCount = 0;
    let totalOccurrences = 0;

    for (let j = 0; j < stateHistory.length - lookAhead; j++) {
      if (JSON.stringify(stateHistory[j]) === currentState) {
        totalOccurrences++;
        if (JSON.stringify(stateHistory[j + lookAhead]) === futureState) {
          transitionCount++;
        }
      }
    }

    if (totalOccurrences > 0) {
      const transitionProbability = transitionCount / totalOccurrences;
      if (transitionProbability > 0.5) {
        correctPredictions++;
      }
      totalPredictions++;
    }
  }

  return totalPredictions > 0 ? correctPredictions / totalPredictions : 0;
}

/**
 * Information Bottleneck Report
 */
export interface InformationBottleneckReport {
  timestamp_ms: number;
  bottleneck_nodes: number[];
  total_information: number;
  compressed_information: number;
  compression_efficiency: number;
  synergistic_information: number;
  attractors_count: number;
  predictability_index: number;
  average_basin_size: number;
}

/**
 * Generate Comprehensive Information Bottleneck Report
 */
export function generateInformationBottleneckReport(
  stateHistory: StateVector[],
  systemOutcomeHistory: number[]
): InformationBottleneckReport {
  const bottleneck = identifyInformationBottleneck(stateHistory, systemOutcomeHistory);

  // Extract node histories for synergy calculation
  const nodeCount = stateHistory[0]?.length || 0;
  const nodeHistories: number[][] = Array(nodeCount)
    .fill(null)
    .map(() => []);

  for (const state of stateHistory) {
    for (let i = 0; i < nodeCount; i++) {
      nodeHistories[i].push(state[i]);
    }
  }

  const synergy = calculateSynergisticInformation(nodeHistories, systemOutcomeHistory);
  const basins = analyzeAttractorBasins(stateHistory);
  const predictability = calculatePredictability(stateHistory);

  const avgBasinSize =
    basins.basinSizes.length > 0
      ? basins.basinSizes.reduce((a, b) => a + b, 0) / basins.basinSizes.length
      : 0;

  return {
    timestamp_ms: Date.now(),
    bottleneck_nodes: bottleneck.bottleneckNodes,
    total_information: bottleneck.totalInformation,
    compressed_information: bottleneck.compressedInformation,
    compression_efficiency: bottleneck.compressionEfficiency,
    synergistic_information: synergy,
    attractors_count: basins.attractors.length,
    predictability_index: predictability,
    average_basin_size: avgBasinSize,
  };
}
