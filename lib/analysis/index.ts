/**
 * Information-Theoretic Analysis Module
 * 
 * Unified interface for analyzing system state:
 * - Entropy analysis
 * - Correlation networks
 * - Information bottleneck
 */

export * from './entropy-analysis';
export * from './correlation-analysis';
export * from './information-bottleneck';

/**
 * Run complete analysis suite on state vector
 */
export async function runFullAnalysis(stateVector: number[]) {
  const { calculateShannonEntropy, getNormalizedEntropy, calculateComplexityMetric } = await import('./entropy-analysis');
  const { calculatePearsonCorrelation, calculateNetworkDensity } = await import('./correlation-analysis');
  const { identifyInformationBottleneck, calculatePredictability } = await import('./information-bottleneck');

  return {
    entropy: {
      shannon: calculateShannonEntropy(stateVector),
      normalized: getNormalizedEntropy(stateVector),
      complexity: calculateComplexityMetric(stateVector),
    },
    correlation: {
      pearson: calculatePearsonCorrelation(stateVector, stateVector),
      networkDensity: calculateNetworkDensity(stateVector),
    },
    bottleneck: {
      identified: identifyInformationBottleneck(stateVector),
      predictability: calculatePredictability(stateVector),
    },
  };
}
