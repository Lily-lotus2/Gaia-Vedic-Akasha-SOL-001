/**
 * AI Reasoning Panel
 * 
 * Integrates Ollama-based AI reasoning with information-theoretic analysis
 * Supports Deepseek-R1, Qwen2.5, Gemma 2
 */

'use client';

import React, { useState } from 'react';

interface AnalysisData {
  entropy_metrics: Record<string, number>;
  correlation_metrics: Record<string, number>;
  complexity_metrics: Record<string, string | number>;
  bottleneck_analysis: Record<string, unknown>;
}

interface AIReasoningPanelProps {
  analysis?: AnalysisData;
}

type ModelType = 'deepseek-r1' | 'qwen2.5' | 'gemma2';

export function AIReasoningPanel({ analysis }: AIReasoningPanelProps) {
  const [selectedModel, setSelectedModel] = useState<ModelType>('qwen2.5');
  const [reasoning, setReasoning] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ollama_status, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>(
    'checking'
  );

  // Check Ollama status on mount
  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/ai/reasoning?action=status');
        const data = await response.json();
        setOllamaStatus(data.ollama_status === 'online' ? 'online' : 'offline');
      } catch (err) {
        setOllamaStatus('offline');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const handleGetInsights = async () => {
    if (!analysis) {
      setError('No analysis data available');
      return;
    }

    setLoading(true);
    setError(null);
    setReasoning('');

    try {
      const response = await fetch('/api/ai/reasoning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysis,
          model: selectedModel,
          prompt:
            'Provide doctoral-level insights on this information-theoretic analysis. Focus on: 1) System state classification and convergence behavior, 2) Information bottlenecks and critical nodes, 3) Predictability and attractor structure, 4) Synergistic effects and collective dynamics.',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setReasoning(data.reasoning.ai_interpretation);
      } else {
        setError(data.error || 'Failed to generate reasoning');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400';
      case 'offline':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500/20';
      case 'offline':
        return 'bg-red-500/20';
      default:
        return 'bg-yellow-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900 rounded-lg border border-purple-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-400">AI Reasoning Engine</h2>
          <div className={`px-3 py-1 rounded text-xs font-semibold ${getStatusBg(ollama_status)}`}>
            <span className={getStatusColor(ollama_status)}>
              {ollama_status === 'online'
                ? '● Online'
                : ollama_status === 'offline'
                  ? '● Offline'
                  : '● Checking...'}
            </span>
          </div>
        </div>
        <p className="text-sm text-gray-400">
          Ollama-powered reasoning with Deepseek-R1, Qwen2.5, and Gemma 2 models
        </p>
      </div>

      {/* Model Selection */}
      <div className="bg-gray-900 rounded-lg border border-purple-500 p-6">
        <h3 className="text-lg font-bold text-purple-400 mb-4">Model Selection</h3>

        <div className="grid grid-cols-3 gap-3">
          {[
            {
              id: 'deepseek-r1' as ModelType,
              name: 'Deepseek-R1',
              desc: 'Advanced reasoning',
              badge: 'Best',
            },
            {
              id: 'qwen2.5' as ModelType,
              name: 'Qwen2.5',
              desc: 'Balanced speed',
              badge: 'Recommended',
            },
            {
              id: 'gemma2' as ModelType,
              name: 'Gemma 2',
              desc: 'Lightweight',
              badge: 'Fast',
            },
          ].map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`p-4 rounded-lg border transition-all ${
                selectedModel === model.id
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-800 hover:border-purple-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-semibold text-sm text-purple-400">
                  {model.name}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-purple-500/30 text-purple-300">
                  {model.badge}
                </span>
              </div>
              <p className="text-xs text-gray-400">{model.desc}</p>
            </button>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-4">
          {selectedModel === 'deepseek-r1' &&
            'Advanced reasoning for complex analysis. Slower but most insightful.'}
          {selectedModel === 'qwen2.5' &&
            'Balanced performance and quality. Recommended for most use cases.'}
          {selectedModel === 'gemma2' &&
            'Fast inference with good quality. Best for real-time analysis.'}
        </p>
      </div>

      {/* Analysis Button */}
      <button
        onClick={handleGetInsights}
        disabled={loading || !analysis || ollama_status !== 'online'}
        className={`w-full py-3 rounded-lg font-semibold transition-all ${
          loading || !analysis || ollama_status !== 'online'
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚙️</span>
            Generating Insights ({selectedModel})...
          </span>
        ) : ollama_status !== 'online' ? (
          'Ollama Offline - Deploy to Render'
        ) : !analysis ? (
          'No Analysis Data'
        ) : (
          'Get AI Insights'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          <p className="text-sm text-red-400">
            <span className="font-semibold">Error:</span> {error}
          </p>
          {error.includes('Ollama') && (
            <p className="text-xs text-red-300 mt-2">
              Deploy Ollama backend to Render to enable AI reasoning.
            </p>
          )}
        </div>
      )}

      {/* Reasoning Output */}
      {reasoning && (
        <div className="bg-gray-900 rounded-lg border border-green-500 p-6">
          <h3 className="text-lg font-bold text-green-400 mb-4">AI Interpretation</h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {reasoning}
            </p>
          </div>
          <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
            <span>Model: {selectedModel}</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {!analysis && (
        <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4">
          <p className="text-sm text-yellow-400">
            Waiting for analysis data. Run entropy, correlation, or bottleneck analysis first.
          </p>
        </div>
      )}

      {ollama_status === 'offline' && (
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          <p className="text-sm text-red-400 font-semibold mb-2">Ollama Service Offline</p>
          <p className="text-xs text-red-300">
            To enable AI reasoning, deploy Ollama backend to Render following the
            RENDER_DEPLOYMENT.md guide.
          </p>
        </div>
      )}
    </div>
  );
}
