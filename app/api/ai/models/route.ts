/**
 * API Endpoint: Ollama Model Management
 * 
 * GET /api/ai/models - List available models
 * POST /api/ai/models - Pull/install new models
 */

import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_API = process.env.OLLAMA_API_URL || 'http://localhost:11434';

interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

interface OllamaTagsResponse {
  models: OllamaModel[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'list';

    if (action === 'list') {
      const response = await fetch(`${OLLAMA_API}/api/tags`);

      if (!response.ok) {
        throw new Error('Failed to fetch models from Ollama');
      }

      const data: OllamaTagsResponse = await response.json();

      // Format model information
      const models = data.models?.map((model) => ({
        name: model.name,
        size_mb: (model.size / (1024 * 1024)).toFixed(2),
        modified: model.modified_at,
        digest: model.digest.substring(0, 12),
      })) || [];

      return NextResponse.json({
        success: true,
        timestamp_ms: Date.now(),
        models_available: models,
        model_count: models.length,
        recommended_models: [
          'deepseek-r1:70b',
          'qwen2.5:72b',
          'gemma2:27b',
        ],
      });
    }

    return NextResponse.json(
      { error: 'Unknown action', valid_actions: ['list'] },
      { status: 400 }
    );
  } catch (error) {
    console.error('Model list error:', error);
    return NextResponse.json(
      {
        error: 'Failed to list models',
        details: String(error),
        message: 'Ensure Ollama is running and accessible',
      },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { model, action = 'pull' } = body;

    if (!model) {
      return NextResponse.json(
        { error: 'Model name required' },
        { status: 400 }
      );
    }

    if (action === 'pull') {
      // Pull model from Ollama registry
      const response = await fetch(`${OLLAMA_API}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: model, stream: false }),
      });

      if (!response.ok) {
        throw new Error(`Failed to pull model: ${response.statusText}`);
      }

      const data = await response.json();

      return NextResponse.json({
        success: true,
        timestamp_ms: Date.now(),
        action: 'pull',
        model,
        status: data.status,
        message: `Model ${model} pulled successfully`,
      });
    }

    if (action === 'delete') {
      // Delete model from Ollama
      const response = await fetch(`${OLLAMA_API}/api/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: model }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete model: ${response.statusText}`);
      }

      return NextResponse.json({
        success: true,
        timestamp_ms: Date.now(),
        action: 'delete',
        model,
        message: `Model ${model} deleted successfully`,
      });
    }

    return NextResponse.json(
      {
        error: 'Unknown action',
        valid_actions: ['pull', 'delete'],
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Model management error:', error);
    return NextResponse.json(
      {
        error: 'Model management failed',
        details: String(error),
      },
      { status: 500 }
    );
  }
}
