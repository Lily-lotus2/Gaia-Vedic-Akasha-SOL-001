/**
 * Correlation and Mutual Information Analysis
 * 
 * Advanced metrics for measuring node interdependencies and system coherence
 */

import { StateVector } from './existon';

/**
 * Pearson Correlation Coefficient
 * 
 * ρ = Cov(X, Y) / (σ_X * σ_Y)
 * 
 * Measures linear correlation between two nodes over time
 * Range: [-1, 1]
 * 1 = perfect positive correlation
 * 0 = no correlation
 * -1 = perfect negative correlation
 */
export function calculatePearsonCorrelation(
  seriesX: number[],
  seriesY: number[]
): number {
  if (seriesX.length !== seriesY.length || seriesX.length < 2) return 0;

  const n = seriesX.length;
  const meanX = seriesX.reduce((a, b) => a + b, 0) / n;
  const meanY = seriesY.reduce((a, b) => a + b, 0) / n;

  let covariance = 0;
  let varianceX = 0;
  let varianceY = 0;

  for (let i = 0; i < n; i++) {
    const dx = seriesX[i] - meanX;
    const dy = seriesY[i] - meanY;
    covariance += dx * dy;
    varianceX += dx * dx;
    varianceY += dy * dy;
  }

  const denominator = Math.sqrt(varianceX * varianceY);
  return denominator !== 0 ? covariance / denominator : 0;
}

/**
 * Cross-Correlation Function
 * 
 * Measures correlation between two time series at different time lags
 * Useful for detecting delayed dependencies
 */
export function calculateCrossCorrelation(
  seriesX: number[],
  seriesY: number[],
  maxLag: number = 10
): { lag: number; correlation: number }[] {
  const results: { lag: number; correlation: number }[] = [];

  for (let lag = -maxLag; lag <= maxLag; lag++) {
    let alignedX: number[] = [];
    let alignedY: number[] = [];

    if (lag >= 0) {
      alignedX = seriesX.slice(0, seriesX.length - lag);
      alignedY = seriesY.slice(lag);
    } else {
      alignedX = seriesX.slice(-lag);
      alignedY = seriesY.slice(0, seriesY.length + lag);
    }

    if (alignedX.length > 0) {
      const correlation = calculatePearsonCorrelation(alignedX, alignedY);
      results.push({ lag, correlation });
    }
  }

  return results;
}

/**
 * Conditional Mutual Information
 * 
 * I(X; Y | Z) = H(X | Z) + H(Y | Z) - H(X, Y | Z)
 * 
 * Measures information X has about Y given Z is known
 * Useful for identifying direct vs indirect dependencies
 */
export function calculateConditionalMutualInformation(
  nodeX: number[],
  nodeY: number[],
  nodeZ: number[]
): number {
  if (
    nodeX.length !== nodeY.length ||
    nodeY.length !== nodeZ.length ||
    nodeX.length === 0
  ) {
    return 0;
  }

  // Simplified calculation using joint distributions
  const hXZ = calculateConditionalEntropy(nodeX, nodeZ);
  const hYZ = calculateConditionalEntropy(nodeY, nodeZ);
  const hXYZ = calculateConditionalEntropyTriple(nodeX, nodeY, nodeZ);

  return hXZ + hYZ - hXYZ;
}

/**
 * Conditional Entropy H(X | Z)
 */
function calculateConditionalEntropy(nodeX: number[], nodeZ: number[]): number {
  if (nodeX.length !== nodeZ.length || nodeX.length === 0) return 0;

  const jointCounts = new Map<string, number>();
  const zCounts = new Map<number, number>();

  for (let i = 0; i < nodeX.length; i++) {
    const key = `${nodeX[i]},${nodeZ[i]}`;
    jointCounts.set(key, (jointCounts.get(key) || 0) + 1);
    zCounts.set(nodeZ[i], (zCounts.get(nodeZ[i]) || 0) + 1);
  }

  const n = nodeX.length;
  let conditionalEntropy = 0;

  for (const [key, count] of jointCounts.entries()) {
    const z = parseInt(key.split(',')[1]);
    const pXZ = count / n;
    const pZ = (zCounts.get(z) || 0) / n;

    if (pXZ > 0 && pZ > 0) {
      const pXGivenZ = pXZ / pZ;
      conditionalEntropy -= pZ * pXGivenZ * Math.log2(pXGivenZ);
    }
  }

  return conditionalEntropy;
}

/**
 * Conditional Entropy H(X, Y | Z)
 */
function calculateConditionalEntropyTriple(
  nodeX: number[],
  nodeY: number[],
  nodeZ: number[]
): number {
  if (
    nodeX.length !== nodeY.length ||
    nodeY.length !== nodeZ.length ||
    nodeX.length === 0
  ) {
    return 0;
  }

  const tripleJointCounts = new Map<string, number>();
  const zCounts = new Map<number, number>();

  for (let i = 0; i < nodeX.length; i++) {
    const key = `${nodeX[i]},${nodeY[i]},${nodeZ[i]}`;
    tripleJointCounts.set(key, (tripleJointCounts.get(key) || 0) + 1);
    zCounts.set(nodeZ[i], (zCounts.get(nodeZ[i]) || 0) + 1);
  }

  const n = nodeX.length;
  let conditionalEntropy = 0;

  for (const [key, count] of tripleJointCounts.entries()) {
    const z = parseInt(key.split(',')[2]);
    const pXYZ = count / n;
    const pZ = (zCounts.get(z) || 0) / n;

    if (pXYZ > 0 && pZ > 0) {
      const pXYGivenZ = pXYZ / pZ;
      conditionalEntropy -= pZ * pXYGivenZ * Math.log2(pXYGivenZ);
    }
  }

  return conditionalEntropy;
}

/**
 * Transfer Entropy
 * 
 * T(X → Y) = H(Y_t+1 | Y_t) - H(Y_t+1 | Y_t, X_t)
 * 
 * Measures directed information flow from X to Y
 * Accounts for temporal causality
 */
export function calculateTransferEntropy(
  sourceHistory: number[],
  targetHistory: number[],
  delay: number = 1
): number {
  if (
    sourceHistory.length !== targetHistory.length ||
    sourceHistory.length < delay + 1
  ) {
    return 0;
  }

  const n = targetHistory.length - delay;

  // H(Y_t+1 | Y_t)
  const targetPast = targetHistory.slice(0, n);
  const targetFuture = targetHistory.slice(delay, n + delay);
  const hYFutureGivenYPast = calculateConditionalEntropy(
    targetFuture,
    targetPast
  );

  // H(Y_t+1 | Y_t, X_t)
  const sourcePast = sourceHistory.slice(0, n);
  const hYFutureGivenYPastAndXPast = calculateConditionalMutualInformation(
    targetFuture,
    sourcePast,
    targetPast
  );

  return hYFutureGivenYPast - hYFutureGivenYPastAndXPast;
}

/**
 * Correlation Matrix
 * 
 * Computes pairwise correlations between all nodes
 */
export function calculateCorrelationMatrix(
  stateHistory: StateVector[]
): number[][] {
  if (stateHistory.length === 0) return [];

  const nodeCount = stateHistory[0].length;
  const correlationMatrix: number[][] = Array(nodeCount)
    .fill(null)
    .map(() => Array(nodeCount).fill(0));

  // Extract time series for each node
  const nodeTimeSeries: number[][] = Array(nodeCount)
    .fill(null)
    .map(() => []);

  for (const state of stateHistory) {
    for (let i = 0; i < nodeCount; i++) {
      nodeTimeSeries[i].push(state[i]);
    }
  }

  // Calculate pairwise correlations
  for (let i = 0; i < nodeCount; i++) {
    for (let j = 0; j < nodeCount; j++) {
      if (i === j) {
        correlationMatrix[i][j] = 1; // Self-correlation is always 1
      } else {
        correlationMatrix[i][j] = calculatePearsonCorrelation(
          nodeTimeSeries[i],
          nodeTimeSeries[j]
        );
      }
    }
  }

  return correlationMatrix;
}

/**
 * Synchronization Index
 * 
 * Measures overall system synchronization (0 to 1)
 * 0 = no synchronization
 * 1 = perfect synchronization
 */
export function calculateSynchronizationIndex(
  correlationMatrix: number[][]
): number {
  if (correlationMatrix.length === 0) return 0;

  let totalCorrelation = 0;
  let pairCount = 0;

  for (let i = 0; i < correlationMatrix.length; i++) {
    for (let j = i + 1; j < correlationMatrix.length; j++) {
      totalCorrelation += Math.abs(correlationMatrix[i][j]);
      pairCount++;
    }
  }

  return pairCount > 0 ? totalCorrelation / pairCount : 0;
}

/**
 * Clustering Coefficient
 * 
 * Measures how tightly nodes are clustered in correlation space
 * Based on correlation graph structure
 */
export function calculateClusteringCoefficient(
  correlationMatrix: number[][],
  threshold: number = 0.5
): number {
  if (correlationMatrix.length < 3) return 0;

  let triangles = 0;
  let connectedTriples = 0;

  for (let i = 0; i < correlationMatrix.length; i++) {
    for (let j = i + 1; j < correlationMatrix.length; j++) {
      if (Math.abs(correlationMatrix[i][j]) > threshold) {
        for (let k = j + 1; k < correlationMatrix.length; k++) {
          if (
            Math.abs(correlationMatrix[i][k]) > threshold ||
            Math.abs(correlationMatrix[j][k]) > threshold
          ) {
            connectedTriples++;

            if (
              Math.abs(correlationMatrix[i][k]) > threshold &&
              Math.abs(correlationMatrix[j][k]) > threshold
            ) {
              triangles++;
            }
          }
        }
      }
    }
  }

  return connectedTriples > 0 ? triangles / connectedTriples : 0;
}

/**
 * Network Density
 * 
 * Fraction of possible connections that are present above threshold
 */
export function calculateNetworkDensity(
  correlationMatrix: number[][],
  threshold: number = 0.5
): number {
  if (correlationMatrix.length < 2) return 0;

  let connectionCount = 0;
  const maxConnections = (correlationMatrix.length * (correlationMatrix.length - 1)) / 2;

  for (let i = 0; i < correlationMatrix.length; i++) {
    for (let j = i + 1; j < correlationMatrix.length; j++) {
      if (Math.abs(correlationMatrix[i][j]) > threshold) {
        connectionCount++;
      }
    }
  }

  return maxConnections > 0 ? connectionCount / maxConnections : 0;
}

/**
 * Correlation Analysis Report
 */
export interface CorrelationAnalysisReport {
  timestamp_ms: number;
  correlation_matrix: number[][];
  synchronization_index: number;
  clustering_coefficient: number;
  network_density: number;
  average_correlation: number;
  max_correlation: number;
  min_correlation: number;
}

/**
 * Generate Comprehensive Correlation Analysis Report
 */
export function generateCorrelationAnalysisReport(
  stateHistory: StateVector[]
): CorrelationAnalysisReport {
  const correlationMatrix = calculateCorrelationMatrix(stateHistory);
  const syncIndex = calculateSynchronizationIndex(correlationMatrix);
  const clusteringCoeff = calculateClusteringCoefficient(correlationMatrix);
  const networkDensity = calculateNetworkDensity(correlationMatrix);

  // Calculate statistics
  let totalCorr = 0;
  let maxCorr = -2;
  let minCorr = 2;
  let pairCount = 0;

  for (let i = 0; i < correlationMatrix.length; i++) {
    for (let j = i + 1; j < correlationMatrix.length; j++) {
      const corr = correlationMatrix[i][j];
      totalCorr += corr;
      maxCorr = Math.max(maxCorr, corr);
      minCorr = Math.min(minCorr, corr);
      pairCount++;
    }
  }

  const avgCorr = pairCount > 0 ? totalCorr / pairCount : 0;

  return {
    timestamp_ms: Date.now(),
    correlation_matrix: correlationMatrix,
    synchronization_index: syncIndex,
    clustering_coefficient: clusteringCoeff,
    network_density: networkDensity,
    average_correlation: avgCorr,
    max_correlation: maxCorr === -2 ? 0 : maxCorr,
    min_correlation: minCorr === 2 ? 0 : minCorr,
  };
}
