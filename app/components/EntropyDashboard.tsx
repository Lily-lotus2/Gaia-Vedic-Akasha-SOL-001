/**
 * Entropy Visualization Dashboard
 * 
 * Real-time visualization of entropy dynamics, dissipation rates,
 * and system state classification
 */

'use client';

import React, { useState, useEffect } from 'react';

interface EntropyMetrics {
  state_entropy: number;
  normalized_entropy: number;
  entropy_dissipation_rate: number;
  entropy_trend: 'increasing' | 'decreasing' | 'stable';
  correlation_length: number;
  complexity_metric: number;
  system_state_classification: string;
}

interface EntropyDashboardProps {
  stateVector?: number[];
  refreshInterval?: number;
}

export function EntropyDashboard({
  stateVector,
  refreshInterval = 1000,
}: EntropyDashboardProps) {
  const [metrics, setMetrics] = useState<EntropyMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!stateVector) return;

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analysis/entropy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stateVector,
            agent: 'dashboard',
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch entropy metrics');

        const data = await response.json();
        if (data.success && data.analysis) {
          const metrics = data.analysis.entropy_metrics;
          setMetrics({
            state_entropy: metrics.state_entropy,
            normalized_entropy: metrics.normalized_entropy,
            entropy_dissipation_rate: metrics.entropy_dissipation_rate,
            entropy_trend: metrics.entropy_trend,
            correlation_length: metrics.correlation_length,
            complexity_metric: metrics.complexity_metric,
            system_state_classification: metrics.system_state_classification,
          });

          setHistory((prev) => [...prev.slice(-99), metrics.state_entropy]);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [stateVector, refreshInterval]);

  if (!metrics) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg border border-cyan-500">
        <div className="text-center">
          {loading ? (
            <p className="text-cyan-400">Loading entropy analysis...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </div>
      </div>
    );
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'ordered':
        return 'text-green-400';
      case 'chaotic':
        return 'text-yellow-400';
      case 'random':
        return 'text-orange-400';
      case 'frozen':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'decreasing':
        return '↓';
      case 'increasing':
        return '↑';
      default:
        return '→';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg border border-cyan-500 p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">
          Information-Theoretic Analysis
        </h2>

        {/* System State Classification */}
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">System State</div>
          <div
            className={`text-3xl font-bold uppercase ${getStateColor(
              metrics.system_state_classification
            )}`}
          >
            {metrics.system_state_classification}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.system_state_classification === 'ordered' &&
              'System converged to stable attractor'}
            {metrics.system_state_classification === 'chaotic' &&
              'System exhibits complex dynamics with high correlation'}
            {metrics.system_state_classification === 'random' &&
              'System in random state with low correlation'}
            {metrics.system_state_classification === 'frozen' &&
              'System in dead state with minimal dynamics'}
          </div>
        </div>
      </div>

      {/* Entropy Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* State Entropy */}
        <div className="bg-gray-900 rounded-lg border border-cyan-500 p-4">
          <div className="text-xs text-gray-400 mb-2">State Entropy</div>
          <div className="text-2xl font-bold text-cyan-400">
            {metrics.state_entropy.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-2">bits</div>
          <div className="mt-3 h-1 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-cyan-500"
              style={{
                width: `${(metrics.normalized_entropy * 100).toFixed(0)}%`,
              }}
            />
          </div>
        </div>

        {/* Normalized Entropy */}
        <div className="bg-gray-900 rounded-lg border border-magenta-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Normalized Entropy</div>
          <div className="text-2xl font-bold text-magenta-400">
            {(metrics.normalized_entropy * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-2">of maximum</div>
          <div className="mt-3 h-1 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-magenta-500"
              style={{
                width: `${(metrics.normalized_entropy * 100).toFixed(0)}%`,
              }}
            />
          </div>
        </div>

        {/* Entropy Dissipation Rate */}
        <div className="bg-gray-900 rounded-lg border border-aquamarine-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Dissipation Rate</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-aquamarine-400">
              {metrics.entropy_dissipation_rate.toFixed(4)}
            </div>
            <div className="text-xl text-aquamarine-400">
              {getTrendIcon(metrics.entropy_trend)}
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">bits/second</div>
        </div>

        {/* Correlation Length */}
        <div className="bg-gray-900 rounded-lg border border-blue-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Correlation Length</div>
          <div className="text-2xl font-bold text-blue-400">
            {metrics.correlation_length.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-2">nodes</div>
        </div>

        {/* Complexity Metric */}
        <div className="bg-gray-900 rounded-lg border border-yellow-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Complexity Metric</div>
          <div className="text-2xl font-bold text-yellow-400">
            {metrics.complexity_metric.toFixed(3)}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.complexity_metric < 0.3 && 'Low complexity'}
            {metrics.complexity_metric >= 0.3 &&
              metrics.complexity_metric < 0.6 &&
              'Moderate complexity'}
            {metrics.complexity_metric >= 0.6 && 'High complexity'}
          </div>
        </div>

        {/* Entropy Trend */}
        <div className="bg-gray-900 rounded-lg border border-green-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Entropy Trend</div>
          <div className="text-2xl font-bold text-green-400 uppercase">
            {metrics.entropy_trend}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.entropy_trend === 'decreasing' &&
              'System converging to attractor'}
            {metrics.entropy_trend === 'increasing' &&
              'System diverging from attractor'}
            {metrics.entropy_trend === 'stable' && 'System in equilibrium'}
          </div>
        </div>
      </div>

      {/* Entropy History Chart */}
      {history.length > 1 && (
        <div className="bg-gray-900 rounded-lg border border-cyan-500 p-6">
          <h3 className="text-lg font-bold text-cyan-400 mb-4">
            Entropy Evolution
          </h3>
          <div className="h-32 flex items-end gap-0.5">
            {history.map((value, idx) => {
              const maxEntropy = 44.4; // 28 * log2(3)
              const height = (value / maxEntropy) * 100;
              return (
                <div
                  key={idx}
                  className="flex-1 bg-cyan-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
                  style={{ height: `${height}%`, minHeight: '2px' }}
                  title={`Entropy: ${value.toFixed(2)} bits`}
                />
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0 bits</span>
            <span>{history.length} samples</span>
            <span>44.4 bits (max)</span>
          </div>
        </div>
      )}

      {/* Information Bottlenecks */}
      {metrics && (
        <div className="bg-gray-900 rounded-lg border border-magenta-500 p-6">
          <h3 className="text-lg font-bold text-magenta-400 mb-4">
            Information Bottlenecks
          </h3>
          <p className="text-sm text-gray-400">
            Critical nodes identified through mutual information analysis.
            Post state vector to /api/analysis/entropy to update.
          </p>
        </div>
      )}

      {/* Status */}
      <div className="text-xs text-gray-500 text-center">
        Last updated: {new Date().toLocaleTimeString()}
        {loading && ' (updating...)'}
      </div>
    </div>
  );
}
