/**
 * Comprehensive Analysis Dashboard
 * 
 * Integrates all information-theoretic analysis components:
 * - Entropy dynamics
 * - Correlation networks
 * - Information bottlenecks
 * - AI reasoning
 */

'use client';

import React, { useState, useEffect } from 'react';
import { EntropyDashboard } from '@/app/components/EntropyDashboard';
import { CorrelationNetwork } from '@/app/components/CorrelationNetwork';
import { BottleneckAnalysis } from '@/app/components/BottleneckAnalysis';
import { AIReasoningPanel } from '@/app/components/AIReasoningPanel';

export default function DashboardPage() {
  const [stateVector, setStateVector] = useState<number[]>([]);
  const [systemOutcome, setSystemOutcome] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<
    'entropy' | 'correlation' | 'bottleneck' | 'ai'
  >('entropy');
  const [analysisData, setAnalysisData] = useState<any>(null);

  // Generate random state vector for demo
  useEffect(() => {
    const generateState = () => {
      const newState = Array(28)
        .fill(0)
        .map(() => Math.floor(Math.random() * 3) - 1);
      setStateVector(newState);
      setSystemOutcome(Math.floor(Math.random() * 2));
    };

    generateState();
    const interval = setInterval(generateState, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch current analysis
  useEffect(() => {
    if (stateVector.length === 0) return;

    const fetchAnalysis = async () => {
      try {
        const response = await fetch('/api/analysis/entropy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stateVector }),
        });

        if (response.ok) {
          const data = await response.json();
          setAnalysisData(data.analysis);
        }
      } catch (err) {
        console.error('Failed to fetch analysis:', err);
      }
    };

    fetchAnalysis();
  }, [stateVector]);

  const tabs = [
    { id: 'entropy', label: 'Entropy Analysis', icon: '📊' },
    { id: 'correlation', label: 'Network Correlation', icon: '🔗' },
    { id: 'bottleneck', label: 'Bottleneck Analysis', icon: '🎯' },
    { id: 'ai', label: 'AI Reasoning', icon: '🤖' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black">
      {/* Header */}
      <div className="border-b border-cyan-500/30 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">
            Existon 1.0 Analysis Dashboard
          </h1>
          <p className="text-gray-400">
            Real-time information-theoretic analysis with AI reasoning
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 bg-gray-900/30 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-cyan-400 text-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* System Status */}
        <div className="mb-8 p-6 bg-gray-900 rounded-lg border border-gray-700">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-400 mb-1">State Vector Size</div>
              <div className="text-2xl font-bold text-cyan-400">{stateVector.length}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">System Outcome</div>
              <div className="text-2xl font-bold text-green-400">{systemOutcome}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Status</div>
              <div className="text-2xl font-bold text-yellow-400">Active</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 mb-1">Last Update</div>
              <div className="text-sm text-gray-300">{new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'entropy' && (
            <EntropyDashboard stateVector={stateVector} refreshInterval={1000} />
          )}

          {activeTab === 'correlation' && (
            <CorrelationNetwork stateVector={stateVector} refreshInterval={2000} />
          )}

          {activeTab === 'bottleneck' && (
            <BottleneckAnalysis
              stateVector={stateVector}
              systemOutcome={systemOutcome}
              refreshInterval={3000}
            />
          )}

          {activeTab === 'ai' && <AIReasoningPanel analysis={analysisData} />}
        </div>

        {/* Documentation Links */}
        <div className="mt-12 p-6 bg-gray-900/50 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold text-gray-300 mb-4">Documentation</h3>
          <div className="grid grid-cols-2 gap-4">
            <a
              href="/docs/information-theory"
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              → Information-Theoretic Analysis Guide
            </a>
            <a
              href="/docs/render-deployment"
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              → Render Deployment Guide
            </a>
            <a
              href="https://github.com/Lily-lotus2/Gaia-Vedic-Akasha-SOL-001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              → GitHub Repository
            </a>
            <a
              href="/docs/api-reference"
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              → API Reference
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
