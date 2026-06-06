/**
 * API Endpoint: Information Bottleneck Analysis
 * 
 * POST /api/analysis/bottleneck
 * 
 * Identifies critical nodes and information bottlenecks in the system
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateInformationBottleneckReport,
} from '@/lib/information-bottleneck';
import { StateVector } from '@/lib/existon';

// Global state and outcome history (in production, use persistent storage)
let stateHistory: StateVector[] = [];
let outcomeHistory: number[] = [];
const MAX_HISTORY_SIZE = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stateVector, systemOutcome, agent = 'system' } = body;

    if (!stateVector || !Array.isArray(stateVector)) {
      return NextResponse.json(
        { error: 'Invalid state vector' },
        { status: 400 }
      );
    }

    if (systemOutcome === undefined || systemOutcome === null) {
      return NextResponse.json(
        { error: 'System outcome required for bottleneck analysis' },
        { status: 400 }
      );
    }

    // Add to history
    stateHistory.push(stateVector);
    outcomeHistory.push(systemOutcome);

    if (stateHistory.length > MAX_HISTORY_SIZE) {
      stateHistory = stateHistory.slice(-MAX_HISTORY_SIZE);
      outcomeHistory = outcomeHistory.slice(-MAX_HISTORY_SIZE);
    }

    // Generate report if we have enough history
    if (stateHistory.length < 10) {
      return NextResponse.json({
        success: true,
        message: 'Insufficient history for bottleneck analysis. Need at least 10 samples.',
        samples_collected: stateHistory.length,
      });
    }

    const report = generateInformationBottleneckReport(
      stateHistory,
      outcomeHistory
    );

    return NextResponse.json({
      success: true,
      timestamp_ms: Date.now(),
      agent,
      analysis: {
        bottleneck_identification: {
          bottleneck_nodes: report.bottleneck_nodes,
          bottleneck_count: report.bottleneck_nodes.length,
          compression_ratio: stateHistory[0]?.length
            ? report.bottleneck_nodes.length / stateHistory[0].length
            : 0,
        },
        information_metrics: {
          total_information: report.total_information,
          compressed_information: report.compressed_information,
          compression_efficiency: report.compression_efficiency,
          synergistic_information: report.synergistic_information,
        },
        attractor_analysis: {
          attractors_count: report.attractors_count,
          average_basin_size: report.average_basin_size,
          predictability_index: report.predictability_index,
        },
      },
      message: `Bottleneck analysis complete. ${report.bottleneck_nodes.length} critical nodes identified. Compression efficiency: ${(report.compression_efficiency * 100).toFixed(1)}%. Predictability: ${(report.predictability_index * 100).toFixed(1)}%.`,
    });
  } catch (error) {
    console.error('Bottleneck analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'status';

    if (action === 'status') {
      return NextResponse.json({
        success: true,
        timestamp_ms: Date.now(),
        state_samples: stateHistory.length,
        outcome_samples: outcomeHistory.length,
        max_history_size: MAX_HISTORY_SIZE,
        ready_for_analysis: stateHistory.length >= 10,
      });
    }

    if (action === 'clear') {
      stateHistory = [];
      outcomeHistory = [];
      return NextResponse.json({
        success: true,
        message: 'Analysis history cleared',
      });
    }

    return NextResponse.json(
      { error: 'Unknown action', valid_actions: ['status', 'clear'] },
      { status: 400 }
    );
  } catch (error) {
    console.error('Bottleneck GET error:', error);
    return NextResponse.json(
      { error: 'Request failed', details: String(error) },
      { status: 500 }
    );
  }
}
