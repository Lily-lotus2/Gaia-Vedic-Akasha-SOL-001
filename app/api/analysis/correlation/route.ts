/**
 * API Endpoint: Correlation and Network Analysis
 * 
 * POST /api/analysis/correlation
 * 
 * Analyzes node correlations, network structure, and synchronization
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateCorrelationAnalysisReport,
} from '@/lib/correlation-analysis';
import { StateVector } from '@/lib/existon';

// Global state history (in production, use persistent storage)
let stateHistory: StateVector[] = [];
const MAX_HISTORY_SIZE = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stateVector, agent = 'system' } = body;

    if (!stateVector || !Array.isArray(stateVector)) {
      return NextResponse.json(
        { error: 'Invalid state vector' },
        { status: 400 }
      );
    }

    // Add to history
    stateHistory.push(stateVector);
    if (stateHistory.length > MAX_HISTORY_SIZE) {
      stateHistory = stateHistory.slice(-MAX_HISTORY_SIZE);
    }

    // Generate report if we have enough history
    if (stateHistory.length < 2) {
      return NextResponse.json({
        success: true,
        message: 'Insufficient history for correlation analysis. Need at least 2 states.',
        states_collected: stateHistory.length,
      });
    }

    const report = generateCorrelationAnalysisReport(stateHistory);

    return NextResponse.json({
      success: true,
      timestamp_ms: Date.now(),
      agent,
      analysis: {
        network_metrics: {
          synchronization_index: report.synchronization_index,
          clustering_coefficient: report.clustering_coefficient,
          network_density: report.network_density,
        },
        correlation_statistics: {
          average_correlation: report.average_correlation,
          max_correlation: report.max_correlation,
          min_correlation: report.min_correlation,
        },
        correlation_matrix_summary: {
          dimensions: `${report.correlation_matrix.length}x${report.correlation_matrix.length}`,
          diagonal_sum: report.correlation_matrix.reduce(
            (sum, row, i) => sum + row[i],
            0
          ),
        },
      },
      message: `Network analysis complete. Synchronization: ${(report.synchronization_index * 100).toFixed(1)}%. Clustering: ${(report.clustering_coefficient * 100).toFixed(1)}%.`,
    });
  } catch (error) {
    console.error('Correlation analysis error:', error);
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
        state_history_size: stateHistory.length,
        max_history_size: MAX_HISTORY_SIZE,
        ready_for_analysis: stateHistory.length >= 2,
      });
    }

    if (action === 'clear') {
      stateHistory = [];
      return NextResponse.json({
        success: true,
        message: 'State history cleared',
      });
    }

    return NextResponse.json(
      { error: 'Unknown action', valid_actions: ['status', 'clear'] },
      { status: 400 }
    );
  } catch (error) {
    console.error('Correlation GET error:', error);
    return NextResponse.json(
      { error: 'Request failed', details: String(error) },
      { status: 500 }
    );
  }
}
