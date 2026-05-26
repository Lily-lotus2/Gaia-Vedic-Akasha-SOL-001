/**
 * Correlation Network Visualization
 * 
 * Displays node correlation matrix, network structure,
 * and synchronization metrics
 */

'use client';

import React, { useState, useEffect } from 'react';

interface CorrelationMetrics {
  synchronization_index: number;
  clustering_coefficient: number;
  network_density: number;
  average_correlation: number;
  max_correlation: number;
  min_correlation: number;
}

interface CorrelationNetworkProps {
  stateVector?: number[];
  refreshInterval?: number;
}

export function CorrelationNetwork({
  stateVector,
  refreshInterval = 2000,
}: CorrelationNetworkProps) {
  const [metrics, setMetrics] = useState<CorrelationMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!stateVector) return;

    const checkStatus = async () => {
      try {
        const response = await fetch('/api/analysis/correlation?action=status');
        const data = await response.json();
        setReady(data.ready_for_analysis);
      } catch (err) {
        console.error('Status check failed:', err);
      }
    };

    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/analysis/correlation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stateVector,
            agent: 'dashboard',
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch correlation metrics');

        const data = await response.json();
        if (data.success && data.analysis) {
          const analysis = data.analysis;
          setMetrics({
            synchronization_index: analysis.network_metrics.synchronization_index,
            clustering_coefficient: analysis.network_metrics.clustering_coefficient,
            network_density: analysis.network_metrics.network_density,
            average_correlation: analysis.correlation_statistics.average_correlation,
            max_correlation: analysis.correlation_statistics.max_correlation,
            min_correlation: analysis.correlation_statistics.min_correlation,
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
  }, [stateVector, refreshInterval, ready]);

  if (!ready) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg border border-aquamarine-500">
        <div className="text-center">
          <p className="text-aquamarine-400">
            Collecting state history for correlation analysis...
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Need at least 2 states to begin analysis
          </p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg border border-aquamarine-500">
        <div className="text-center">
          {loading ? (
            <p className="text-aquamarine-400">Analyzing correlations...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : (
            <p className="text-gray-400">No data available</p>
          )}
        </div>
      </div>
    );
  }

  const getCorrelationColor = (value: number) => {
    if (value > 0.7) return 'bg-green-500';
    if (value > 0.4) return 'bg-yellow-500';
    if (value > 0) return 'bg-orange-500';
    if (value > -0.4) return 'bg-blue-500';
    return 'bg-purple-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg border border-aquamarine-500 p-6">
        <h2 className="text-2xl font-bold text-aquamarine-400 mb-4">
          Network Correlation Analysis
        </h2>
        <p className="text-sm text-gray-400">
          Measures node interdependencies, network structure, and system
          synchronization
        </p>
      </div>

      {/* Network Metrics Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Synchronization Index */}
        <div className="bg-gray-900 rounded-lg border border-green-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Synchronization</div>
          <div className="text-2xl font-bold text-green-400">
            {(metrics.synchronization_index * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.synchronization_index > 0.7 && 'High sync'}
            {metrics.synchronization_index > 0.4 &&
              metrics.synchronization_index <= 0.7 &&
              'Moderate sync'}
            {metrics.synchronization_index <= 0.4 && 'Low sync'}
          </div>
          <div className="mt-3 h-1 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{
                width: `${(metrics.synchronization_index * 100).toFixed(0)}%`,
              }}
            />
          </div>
        </div>

        {/* Clustering Coefficient */}
        <div className="bg-gray-900 rounded-lg border border-blue-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Clustering</div>
          <div className="text-2xl font-bold text-blue-400">
            {(metrics.clustering_coefficient * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.clustering_coefficient > 0.6 && 'Highly clustered'}
            {metrics.clustering_coefficient > 0.3 &&
              metrics.clustering_coefficient <= 0.6 &&
              'Moderately clustered'}
            {metrics.clustering_coefficient <= 0.3 && 'Loosely clustered'}
          </div>
          <div className="mt-3 h-1 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{
                width: `${(metrics.clustering_coefficient * 100).toFixed(0)}%`,
              }}
            />
          </div>
        </div>

        {/* Network Density */}
        <div className="bg-gray-900 rounded-lg border border-yellow-500 p-4">
          <div className="text-xs text-gray-400 mb-2">Network Density</div>
          <div className="text-2xl font-bold text-yellow-400">
            {(metrics.network_density * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {metrics.network_density > 0.6 && 'Dense network'}
            {metrics.network_density > 0.3 &&
              metrics.network_density <= 0.6 &&
              'Moderate density'}
            {metrics.network_density <= 0.3 && 'Sparse network'}
          </div>
          <div className="mt-3 h-1 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-yellow-500"
              style={{
                width: `${(metrics.network_density * 100).toFixed(0)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Correlation Statistics */}
      <div className="bg-gray-900 rounded-lg border border-cyan-500 p-6">
        <h3 className="text-lg font-bold text-cyan-400 mb-4">
          Correlation Statistics
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-400 mb-2">Average</div>
            <div className="text-xl font-bold text-cyan-400">
              {metrics.average_correlation.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-2">Maximum</div>
            <div className="text-xl font-bold text-green-400">
              {metrics.max_correlation.toFixed(3)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-2">Minimum</div>
            <div className="text-xl font-bold text-red-400">
              {metrics.min_correlation.toFixed(3)}
            </div>
          </div>
        </div>

        {/* Correlation Scale */}
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <div className="text-xs text-gray-400 mb-3">Correlation Scale</div>
          <div className="flex gap-2 items-center">
            <div className="flex-1 h-6 rounded flex overflow-hidden">
              <div className="flex-1 bg-purple-500" title="-1.0 (Perfect negative)" />
              <div className="flex-1 bg-blue-500" title="-0.5" />
              <div className="flex-1 bg-gray-600" title="0.0 (No correlation)" />
              <div className="flex-1 bg-orange-500" title="0.5" />
              <div className="flex-1 bg-green-500" title="1.0 (Perfect positive)" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>-1.0</span>
            <span>0.0</span>
            <span>1.0</span>
          </div>
        </div>
      </div>

      {/* Network Interpretation */}
      <div className="bg-gray-900 rounded-lg border border-magenta-500 p-6">
        <h3 className="text-lg font-bold text-magenta-400 mb-4">
          Network Interpretation
        </h3>
        <div className="space-y-3 text-sm text-gray-400">
          <div>
            <span className="text-magenta-400 font-semibold">Synchronization:</span>{' '}
            {metrics.synchronization_index > 0.7
              ? 'Nodes are highly synchronized. Strong collective behavior.'
              : metrics.synchronization_index > 0.4
                ? 'Nodes show moderate synchronization. Mixed dynamics.'
                : 'Nodes are weakly synchronized. Independent behavior.'}
          </div>
          <div>
            <span className="text-magenta-400 font-semibold">Clustering:</span>{' '}
            {metrics.clustering_coefficient > 0.6
              ? 'Network is highly clustered. Strong local structure.'
              : metrics.clustering_coefficient > 0.3
                ? 'Network shows moderate clustering. Some local structure.'
                : 'Network is loosely clustered. Weak local structure.'}
          </div>
          <div>
            <span className="text-magenta-400 font-semibold">Density:</span>{' '}
            {metrics.network_density > 0.6
              ? 'Network is dense. Many strong connections between nodes.'
              : metrics.network_density > 0.3
                ? 'Network has moderate density. Selective connections.'
                : 'Network is sparse. Few strong connections.'}
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
