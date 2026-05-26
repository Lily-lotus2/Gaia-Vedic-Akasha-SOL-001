/**
 * Information Bottleneck Visualization
 * 
 * Displays critical nodes, compression efficiency,
 * and synergistic information
 */

'use client';

import React, { useState, useEffect } from 'react';

interface BottleneckMetrics {
  bottleneck_nodes: number[];
  total_information: number;
  compressed_information: number;
  compression_efficiency: number;
  synergistic_information: number;
  attractors_count: number;
  predictability_index: number;
  average_basin_size: number;
}

interface BottleneckAnalysisProps {
  stateVector?: number[];
  systemOutcome?: number;
  refreshInterval?: number;
}

export function BottleneckAnalysis({
  stateVector,
  systemOutcome,
  refreshInterval = 3000,
}: BottleneckAnalysisProps) {
  const [metrics, setMetrics] = useState<BottleneckMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!stateVector || systemOutcome === undefined) return;

    const checkStatus = async () => {
      try {
        const response = await fetch('/api/analysis/bottleneck?action=status');
        const data = await response.json();
        setReady(data.ready_for_analysis);
      } catch (err) {
        console.error('Status check failed:', err);
      }
    };

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analysis/bottleneck', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stateVector,
            systemOutcome,
            agent: 'dashboard',
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch bottleneck metrics');

        const data = await response.json();
        if (data.success && data.analysis) {
          const analysis = data.analysis;
          setMetrics({
            bottleneck_nodes: analysis.bottleneck_identification.bottleneck_nodes,
            total_information: analysis.information_metrics.total_information,
            compressed_information: analysis.information_metrics.compressed_information,
            compression_efficiency: analysis.information_metrics.compression_efficiency,
            synergistic_information: analysis.information_metrics.synergistic_information,
            attractors_count: analysis.attractor_analysis.attractors_count,
            predictability_index: analysis.attractor_analysis.predictability_index,
            average_basin_size: analysis.attractor_analysis.average_basin_size,
          });
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    const statusInterval = setInterval(checkStatus, refreshInterval * 2);

    if (ready) {
      fetchMetrics();
      const metricsInterval = setInterval(fetchMetrics, refreshInterval);
      return () => {
        clearInterval(statusInterval);
        clearInterval(metricsInterval);
      };
    }

    return () => clearInterval(statusInterval);
  }, [stateVector, systemOutcome, refreshInterval, ready]);

  if (!ready) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg border border-magenta-500">
        <div className="text-center">
          <p className="text-magenta-400">
            Collecting samples for bottleneck analysis...
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Need at least 10 samples to begin analysis
          </p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg border border-magenta-500">
        <div className="text-center">
          {loading ? (
            <p className="text-magenta-400">Analyzing bottlenecks...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg border border-magenta-500 p-6">
        <h2 className="text-2xl font-bold text-magenta-400 mb-4">
          Information Bottleneck Analysis
        </h2>
        <p className="text-sm text-gray-400">
          Identifies critical nodes that determine system behavior and measures
          information compression efficiency
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Compression Efficiency */}
        <div className="bg-gray-900 rounded-lg border border-green-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Compression Efficiency</div>
          <div className="text-2xl font-bold text-green-400">
            {(metrics.compression_efficiency * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.compression_efficiency > 0.8
              ? 'Highly compressible'
              : metrics.compression_efficiency > 0.5
                ? 'Moderately compressible'
                : 'Low compressibility'}
          </div>
          <div className="mt-3 h-1 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${(metrics.compression_efficiency * 100).toFixed(0)}%`,
              }}
            />
          </div>
        </div>

        {/* Synergistic Information */}
        <div className="bg-gray-900 rounded-lg border border-yellow-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Synergistic Info</div>
          <div className="text-2xl font-bold text-yellow-400">
            {metrics.synergistic_information.toFixed(3)}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.synergistic_information > 0.5
              ? 'High collective effects'
              : metrics.synergistic_information > 0.2
                ? 'Moderate collective effects'
                : 'Low collective effects'}
          </div>
        </div>

        {/* Predictability */}
        <div className="bg-gray-900 rounded-lg border border-blue-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Predictability</div>
          <div className="text-2xl font-bold text-blue-400">
            {(metrics.predictability_index * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.predictability_index > 0.7
              ? 'Highly predictable'
              : metrics.predictability_index > 0.4
                ? 'Moderately predictable'
                : 'Weakly predictable'}
          </div>
          <div className="mt-3 h-1 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${(metrics.predictability_index * 100).toFixed(0)}%`,
              }}
            />
          </div>
        </div>

        {/* Attractor Count */}
        <div className="bg-gray-900 rounded-lg border border-cyan-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Attractors</div>
          <div className="text-2xl font-bold text-cyan-400">
            {metrics.attractors_count}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.attractors_count > 5
              ? 'Multiple attractors'
              : metrics.attractors_count > 1
                ? 'Few attractors'
                : 'Single attractor'}
          </div>
        </div>
      </div>

      {/* Information Metrics */}
      <div className="bg-gray-900 rounded-lg border border-cyan-500 p-6">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">
          Information Metrics
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Total Information</span>
              <span className="text-sm font-bold text-cyan-400">
                {metrics.total_information.toFixed(3)} bits
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div
                className="h-full bg-cyan-500"
                style={{
                  width: `${Math.min(100, (metrics.total_information / 10) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Compressed Information</span>
              <span className="text-sm font-bold text-green-400">
                {metrics.compressed_information.toFixed(3)} bits
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{
                  width: `${Math.min(100, (metrics.compressed_information / 10) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">Synergistic Information</span>
              <span className="text-sm font-bold text-yellow-400">
                {metrics.synergistic_information.toFixed(3)} bits
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{
                  width: `${Math.min(100, (metrics.synergistic_information / 5) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Critical Nodes */}
      <div className="bg-gray-900 rounded-lg border border-magenta-500 p-6">
        <h3 className="text-lg font-bold text-magenta-400 mb-4">
          Critical Bottleneck Nodes
        </h3>

        {metrics.bottleneck_nodes.length > 0 ? (
          <div className="space-y-2">
            {metrics.bottleneck_nodes.map((nodeIndex, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-gray-800 rounded border border-gray-700"
              >
                <span className="text-sm font-mono text-magenta-400">
                  Node {nodeIndex}
                </span>
                <span className="text-xs text-gray-500">
                  Rank #{idx + 1} of {metrics.bottleneck_nodes.length}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No critical bottleneck nodes identified</p>
        )}
      </div>

      {/* Attractor Basin Analysis */}
      <div className="bg-gray-900 rounded-lg border border-blue-500 p-6">
        <h3 className="text-lg font-bold text-blue-400 mb-4">
          Attractor Basin Analysis
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-2">Average Basin Size</div>
            <div className="text-xl font-bold text-blue-400">
              {metrics.average_basin_size.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 mt-1">states per attractor</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-2">Total Attractors</div>
            <div className="text-xl font-bold text-blue-400">
              {metrics.attractors_count}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {metrics.attractors_count === 1
                ? 'Single fixed point'
                : 'Multiple attractors'}
            </div>
          </div>
        </div>
      </div>

      {/* Interpretation */}
      <div className="bg-gray-900 rounded-lg border border-green-500 p-6">
        <h3 className="text-lg font-bold text-green-400 mb-4">
          Interpretation
        </h3>
        <div className="space-y-3 text-sm text-gray-400">
          <div>
            <span className="text-green-400 font-semibold">Compression:</span>{' '}
            {metrics.compression_efficiency > 0.8
              ? 'System behavior is determined by a small set of critical nodes. High model reduction potential.'
              : metrics.compression_efficiency > 0.5
                ? 'System shows moderate compression. Some redundancy in node information.'
                : 'System requires most nodes for prediction. Low compression potential.'}
          </div>
          <div>
            <span className="text-green-400 font-semibold">Synergy:</span>{' '}
            {metrics.synergistic_information > 0.5
              ? 'Strong collective effects. Node interactions are critical for system behavior.'
              : metrics.synergistic_information > 0.2
                ? 'Moderate collective effects. Some emergent properties from node combinations.'
                : 'Weak collective effects. Individual nodes largely determine behavior.'}
          </div>
          <div>
            <span className="text-green-400 font-semibold">Predictability:</span>{' '}
            {metrics.predictability_index > 0.7
              ? 'System is highly predictable. Future states can be reliably forecasted.'
              : metrics.predictability_index > 0.4
                ? 'System shows moderate predictability. Some uncertainty in forecasts.'
                : 'System is weakly predictable. Forecasts have high uncertainty.'}
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="text-xs text-gray-500 text-center">
        Last updated: {new Date().toLocaleTimeString()}
        {loading && ' (updating...)'}
      </div>
    </div>
  );
}
