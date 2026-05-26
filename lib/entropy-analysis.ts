/**
 * Information-Theoretic Analysis System
 * 
 * Measures entropy dissipation, mutual information, correlation length,
 * and information bottlenecks in the Existon 1.0 system.
 * 
 * Doctoral-level rigor for computational mechanics analysis.
 */

import { StateVector } from './existon';

/**
 * Shannon Entropy Calculator
 * 
 * H(X) = -Σ p(x) * log2(p(x))
 * 
 * Measures the average information content (uncertainty) in a state vector.
 * Higher entropy = more random/uncertain state
 * Lower entropy = more ordered/predictable state
 */
export function calculateShannonEntropy(stateVector: StateVector): number {
  if (!stateVector || stateVector.length === 0) return 0;

  // Count occurrences of each state value
  const stateCounts = new Map<number, number>();
  for (const state of stateVector) {
    stateCounts.set(state, (stateCounts.get(state) || 0) + 1);
  }

  // Calculate probability distribution
  const n = stateVector.length;
  let entropy = 0;

  for (const count of stateCounts.values()) {
    const probability = count / n;
    if (probability > 0) {
      entropy -= probability * Math.log2(probability);
    }
  }

  return entropy;
}

/**
 * Maximum Possible Entropy
 * 
 * For a 28-node system with states {-1, 0, +1}, max entropy is log2(3) ≈ 1.585 bits per node
 */
export function getMaximumEntropy(nodeCount: number = 28): number {
  return nodeCount * Math.log2(3); // 3 possible states per node
}

/**
 * Normalized Entropy (0 to 1)
 * 
 * Entropy / MaxEntropy gives a normalized measure where:
 * 0 = completely ordered (single state)
 * 1 = completely random (uniform distribution)
 */
export function getNormalizedEntropy(stateVector: StateVector): number {
  const entropy = calculateShannonEntropy(stateVector);
  const maxEntropy = getMaximumEntropy(stateVector.length);
  return maxEntropy > 0 ? entropy / maxEntropy : 0;
}

/**
 * Entropy Dissipation Rate
 * 
 * Measures how fast the system loses information (entropy) per step
 * dH/dt = (H_t - H_t+1) / Δt
 * 
 * Positive = system converging (losing entropy)
 * Negative = system diverging (gaining entropy)
 * Zero = system in equilibrium
 */
export function calculateEntropyDissipationRate(
  previousEntropy: number,
  currentEntropy: number,
  timeStepMs: number = 100
): number {
  return (previousEntropy - currentEntropy) / (timeStepMs / 1000);
}

/**
 * Mutual Information
 * 
 * I(X; Y) = H(X) + H(Y) - H(X, Y)
 * 
 * Measures how much information node X "knows" about node Y
 * Higher MI = stronger correlation between nodes
 * Zero MI = nodes are independent
 */
export function calculateMutualInformation(
  nodeX: number[],
  nodeY: number[]
): number {
  if (nodeX.length !== nodeY.length || nodeX.length === 0) return 0;

  const hX = calculateShannonEntropy(nodeX);
  const hY = calculateShannonEntropy(nodeY);
  const hXY = calculateJointEntropy(nodeX, nodeY);

  return hX + hY - hXY;
}

/**
 * Joint Entropy
 * 
 * H(X, Y) = -Σ p(x, y) * log2(p(x, y))
 * 
 * Entropy of the combined system
 */
export function calculateJointEntropy(
  nodeX: number[],
  nodeY: number[]
): number {
  if (nodeX.length !== nodeY.length || nodeX.length === 0) return 0;

  const jointCounts = new Map<string, number>();
  for (let i = 0; i < nodeX.length; i++) {
    const key = `${nodeX[i]},${nodeY[i]}`;
    jointCounts.set(key, (jointCounts.get(key) || 0) + 1);
  }

  const n = nodeX.length;
  let jointEntropy = 0;

  for (const count of jointCounts.values()) {
    const probability = count / n;
    if (probability > 0) {
      jointEntropy -= probability * Math.log2(probability);
    }
  }

  return jointEntropy;
}

/**
 * Correlation Length
 * 
 * Measures the average distance over which nodes are correlated.
 * Calculated as the average mutual information decay with distance.
 * 
 * ξ = -1 / ln(⟨I(d)⟩)
 * 
 * where I(d) is mutual information at distance d
 */
export function calculateCorrelationLength(stateVector: StateVector): number {
  if (stateVector.length < 2) return 0;

  const miByDistance: number[] = [];

  // Calculate MI for each distance
  for (let distance = 1; distance < stateVector.length; distance++) {
    let totalMI = 0;
    let count = 0;

    for (let i = 0; i < stateVector.length - distance; i++) {
      const mi = calculateMutualInformation(
        [stateVector[i]],
        [stateVector[i + distance]]
      );
      totalMI += mi;
      count++;
    }

    miByDistance.push(totalMI / count);
  }

  // Calculate correlation length from MI decay
  let sumLogMI = 0;
  let validPoints = 0;

  for (let i = 0; i < miByDistance.length; i++) {
    if (miByDistance[i] > 0) {
      sumLogMI += Math.log(miByDistance[i]);
      validPoints++;
    }
  }

  if (validPoints === 0) return 0;

  const decayRate = -sumLogMI / validPoints;
  return decayRate > 0 ? 1 / decayRate : 0;
}

/**
 * Information Bottleneck Detection
 * 
 * Identifies nodes that act as "decision points" or "information gateways"
 * by measuring their mutual information with all other nodes.
 * 
 * High bottleneck score = node strongly influences system state
 */
export function detectInformationBottlenecks(
  stateVector: StateVector,
  threshold: number = 0.5
): { nodeIndex: number; bottleneckScore: number }[] {
  const bottlenecks: { nodeIndex: number; bottleneckScore: number }[] = [];

  for (let i = 0; i < stateVector.length; i++) {
    let totalMI = 0;
    let count = 0;

    // Calculate MI between node i and all other nodes
    for (let j = 0; j < stateVector.length; j++) {
      if (i !== j) {
        const mi = calculateMutualInformation([stateVector[i]], [stateVector[j]]);
        totalMI += mi;
        count++;
      }
    }

    const averageMI = count > 0 ? totalMI / count : 0;
    const normalizedScore = Math.min(1, averageMI / Math.log2(3)); // Normalize by max MI

    if (normalizedScore >= threshold) {
      bottlenecks.push({
        nodeIndex: i,
        bottleneckScore: normalizedScore,
      });
    }
  }

  // Sort by bottleneck score (descending)
  return bottlenecks.sort((a, b) => b.bottleneckScore - a.bottleneckScore);
}

/**
 * Complexity Metric
 * 
 * Combines entropy and mutual information to measure system complexity.
 * 
 * C = H(X) * (1 - normalized_correlation)
 * 
 * Distinguishes between:
 * - Random states (high H, low correlation)
 * - Chaotic states (high H, high correlation)
 * - Ordered states (low H, high correlation)
 */
export function calculateComplexityMetric(stateVector: StateVector): number {
  const entropy = calculateShannonEntropy(stateVector);
  const normalizedEntropy = getNormalizedEntropy(stateVector);
  const correlationLength = calculateCorrelationLength(stateVector);
  const maxCorrelation = stateVector.length / 2; // Theoretical maximum

  const normalizedCorrelation = Math.min(1, correlationLength / maxCorrelation);
  const complexity = normalizedEntropy * normalizedCorrelation;

  return complexity;
}

/**
 * State Classification
 * 
 * Classifies system state based on entropy and complexity:
 * - "random": High entropy, low correlation
 * - "chaotic": High entropy, high correlation
 * - "ordered": Low entropy, high correlation
 * - "frozen": Low entropy, low correlation
 */
export function classifySystemState(stateVector: StateVector): string {
  const normalizedEntropy = getNormalizedEntropy(stateVector);
  const correlationLength = calculateCorrelationLength(stateVector);
  const maxCorrelation = stateVector.length / 2;
  const normalizedCorrelation = Math.min(1, correlationLength / maxCorrelation);

  const entropyThreshold = 0.5;
  const correlationThreshold = 0.5;

  if (normalizedEntropy > entropyThreshold) {
    if (normalizedCorrelation > correlationThreshold) {
      return 'chaotic';
    } else {
      return 'random';
    }
  } else {
    if (normalizedCorrelation > correlationThreshold) {
      return 'ordered';
    } else {
      return 'frozen';
    }
  }
}

/**
 * Information-Theoretic Report
 * 
 * Comprehensive analysis combining all metrics
 */
export interface InformationTheoreticReport {
  timestamp_ms: number;
  state_entropy: number;
  normalized_entropy: number;
  maximum_entropy: number;
  entropy_dissipation_rate: number;
  correlation_length: number;
  complexity_metric: number;
  system_state_classification: string;
  information_bottlenecks: { nodeIndex: number; bottleneckScore: number }[];
  average_mutual_information: number;
}

/**
 * Generate Comprehensive Information-Theoretic Report
 */
export function generateInformationTheoreticReport(
  currentStateVector: StateVector,
  previousStateVector?: StateVector,
  timeStepMs: number = 100
): InformationTheoreticReport {
  const currentEntropy = calculateShannonEntropy(currentStateVector);
  const previousEntropy = previousStateVector
    ? calculateShannonEntropy(previousStateVector)
    : currentEntropy;

  // Calculate average MI across all node pairs
  let totalMI = 0;
  let pairCount = 0;
  for (let i = 0; i < currentStateVector.length; i++) {
    for (let j = i + 1; j < currentStateVector.length; j++) {
      totalMI += calculateMutualInformation(
        [currentStateVector[i]],
        [currentStateVector[j]]
      );
      pairCount++;
    }
  }
  const averageMI = pairCount > 0 ? totalMI / pairCount : 0;

  return {
    timestamp_ms: Date.now(),
    state_entropy: currentEntropy,
    normalized_entropy: getNormalizedEntropy(currentStateVector),
    maximum_entropy: getMaximumEntropy(currentStateVector.length),
    entropy_dissipation_rate: calculateEntropyDissipationRate(
      previousEntropy,
      currentEntropy,
      timeStepMs
    ),
    correlation_length: calculateCorrelationLength(currentStateVector),
    complexity_metric: calculateComplexityMetric(currentStateVector),
    system_state_classification: classifySystemState(currentStateVector),
    information_bottlenecks: detectInformationBottlenecks(currentStateVector),
    average_mutual_information: averageMI,
  };
}

/**
 * Entropy History Tracker
 * 
 * Tracks entropy evolution over time for convergence analysis
 */
export class EntropyHistoryTracker {
  private history: {
    timestamp_ms: number;
    entropy: number;
    normalizedEntropy: number;
  }[] = [];

  private maxHistorySize = 1000; // Keep last 1000 entries

  addEntry(stateVector: StateVector): void {
    const entropy = calculateShannonEntropy(stateVector);
    const normalizedEntropy = getNormalizedEntropy(stateVector);

    this.history.push({
      timestamp_ms: Date.now(),
      entropy,
      normalizedEntropy,
    });

    // Trim history if too large
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
  }

  getHistory(): {
    timestamp_ms: number;
    entropy: number;
    normalizedEntropy: number;
  }[] {
    return [...this.history];
  }

  getAverageEntropy(): number {
    if (this.history.length === 0) return 0;
    const sum = this.history.reduce((acc, entry) => acc + entry.entropy, 0);
    return sum / this.history.length;
  }

  getEntropyTrend(): 'decreasing' | 'increasing' | 'stable' {
    if (this.history.length < 2) return 'stable';

    const recent = this.history.slice(-10);
    const older = this.history.slice(-20, -10);

    if (recent.length === 0 || older.length === 0) return 'stable';

    const recentAvg =
      recent.reduce((acc, e) => acc + e.entropy, 0) / recent.length;
    const olderAvg = older.reduce((acc, e) => acc + e.entropy, 0) / older.length;

    const threshold = 0.01; // 1% change threshold
    if (recentAvg < olderAvg * (1 - threshold)) return 'decreasing';
    if (recentAvg > olderAvg * (1 + threshold)) return 'increasing';
    return 'stable';
  }

  clear(): void {
    this.history = [];
  }
}
