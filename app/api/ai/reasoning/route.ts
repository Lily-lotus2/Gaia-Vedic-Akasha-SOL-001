/**
 * API Endpoint: AI Reasoning via Ollama
 * 
 * POST /api/ai/reasoning
 * 
 * Sends information-theoretic analysis to local Ollama models
 * for advanced reasoning and interpretation
 * 
 * Models: Deepseek-R1, Qwen2.5, Gemma 2
 */

import { NextRequest, NextResponse } from 'next/server';

// Get Ollama endpoint from environment
const OLLAMA_API = process.env.OLLAMA_API_URL || 'http://localhost:11434';

interface ReasoningRequest {
  analysis: {
    entropy_metrics: Record<string, number>;
    correlation_metrics: Record<string, number>;
    complexity_metrics: Record<string, string | number>;
    bottleneck_analysis: Record<string, unknown>;
  };
  model?: 'deepseek-r1' | 'qwen2.5' | 'gemma2';
  prompt?: string;
}

interface OllamaResponse {
  model: string;
  response: string;
  done: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ReasoningRequest = await request.json();
    const {
      analysis,
      model = 'qwen2.5',
      prompt = 'Analyze this information-theoretic analysis and provide doctoral-level insights.',
    } = body;

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis data required' },
        { status: 400 }
      );
    }

    // Construct analysis summary for the model
    const analysisSummary = `
Information-Theoretic Analysis Summary:

Entropy Metrics:
- State Entropy: ${analysis.entropy_metrics.state_entropy?.toFixed(2)} bits
- Normalized Entropy: ${(analysis.entropy_metrics.normalized_entropy * 100)?.toFixed(1)}%
- Dissipation Rate: ${analysis.entropy_metrics.entropy_dissipation_rate?.toFixed(4)} bits/s
- Entropy Trend: ${analysis.entropy_metrics.entropy_trend}

Correlation Metrics:
- Correlation Length: ${analysis.correlation_metrics.correlation_length?.toFixed(2)} nodes
- Average Mutual Information: ${analysis.correlation_metrics.average_mutual_information?.toFixed(3)}

Complexity:
- Complexity Metric: ${analysis.complexity_metrics.complexity_metric?.toFixed(3)}
- System State: ${analysis.complexity_metrics.system_state_classification}

Information Bottlenecks:
- Count: ${Array.isArray(analysis.bottleneck_analysis.information_bottlenecks) ? analysis.bottleneck_analysis.information_bottlenecks.length : 0}
- Top Bottleneck: ${analysis.bottleneck_analysis.top_bottleneck ? JSON.stringify(analysis.bottleneck_analysis.top_bottleneck) : 'None'}

${prompt}
`;

    // Call Ollama API
    const ollamaResponse = await fetch(`${OLLAMA_API}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt: analysisSummary,
        stream: false,
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(
        `Ollama API error: ${ollamaResponse.status} ${ollamaResponse.statusText}`
      );
    }

    const ollamaData: OllamaResponse = await ollamaResponse.json();

    return NextResponse.json({
      success: true,
      timestamp_ms: Date.now(),
      model,
      reasoning: {
        analysis_summary: analysisSummary,
        ai_interpretation: ollamaData.response,
        model_used: ollamaData.model,
      },
      message: `AI reasoning complete using ${model}`,
    });
  } catch (error) {
    console.error('AI reasoning error:', error);

    // Fallback if Ollama is unavailable
    if (error instanceof Error && error.message.includes('Ollama')) {
      return NextResponse.json(
        {
          error: 'Ollama service unavailable',
          details: error.message,
          fallback: 'Using local analysis only. Deploy Ollama backend to Render.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Reasoning failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'status';

    if (action === 'status') {
      // Check Ollama availability
      try {
        const response = await fetch(`${OLLAMA_API}/api/tags`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            ollama_status: 'online',
            models_available: data.models?.map((m: { name: string }) => m.name) || [],
            ollama_url: OLLAMA_API,
          });
        }
      } catch (err) {
        console.error('Ollama status check failed:', err);
      }

      return NextResponse.json({
        success: false,
        ollama_status: 'offline',
        message: 'Ollama service not available. Deploy to Render.',
        ollama_url: OLLAMA_API,
      });
    }

    if (action === 'models') {
      try {
        const response = await fetch(`${OLLAMA_API}/api/tags`);
        const data = await response.json();
        return NextResponse.json({
          success: true,
          models: data.models || [],
        });
      } catch (err) {
        return NextResponse.json(
          {
            error: 'Failed to fetch models',
            details: String(err),
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Unknown action', valid_actions: ['status', 'models'] },
      { status: 400 }
    );
  } catch (error) {
    console.error('AI status error:', error);
    return NextResponse.json(
      { error: 'Status check failed', details: String(error) },
      { status: 500 }
    );
  }
}
