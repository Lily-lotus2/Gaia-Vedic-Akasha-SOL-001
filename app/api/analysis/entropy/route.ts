/**
 * API Endpoint: Information-Theoretic Analysis
 * 
 * POST /api/analysis/entropy
 * 
 * Calculates comprehensive entropy and information-theoretic metrics
 * for the current system state
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  generateInformationTheoreticReport,
  EntropyHistoryTracker,
} from '@/lib/entropy-analysis';
import { StateVector } from '@/lib/existon';

// Global entropy tracker (in production, use persistent storage)
let entropyTracker = new EntropyHistoryTracker();
let previousStateVector: StateVector | undefined;

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

    // Generate comprehensive report
    const report = generateInformationTheoreticReport(
      stateVector,
      previousStateVector,
      100 // 100ms time step
    );

    // Track entropy history
    entropyTracker.addEntry(stateVector);

    // Get entropy trend
    const entropyTrend = entropyTracker.getEntropyTrend();
    const averageEntropy = entropyTracker.getAverageEntropy();

    // Update previous state
    previousStateVector = stateVector;

    return NextResponse.json({
      success: true,
      timestamp_ms: Date.now(),
      agent,
      analysis: {
        entropy_metrics: {
          state_entropy: report.state_entropy,
          normalized_entropy: report.normalized_entropy,
          maximum_entropy: report.maximum_entropy,
          entropy_dissipation_rate: report.entropy_dissipation_rate,
          entropy_trend: entropyTrend,
          average_entropy_history: averageEntropy,
        },
        correlation_metrics: {
          correlation_length: report.correlation_length,
          average_mutual_information: report.average_mutual_information,
        },
        complexity_metrics: {
          complexity_metric: report.complexity_metric,
          system_state_classification: report.system_state_classification,
        },
        bottleneck_analysis: {
          information_bottlenecks: report.information_bottlenecks,
          bottleneck_count: report.information_bottlenecks.length,
          top_bottleneck: report.information_bottlenecks[0] || null,
        },
      },
      message: `Entropy analysis complete. System state: ${report.system_state_classification}. Dissipation rate: ${report.entropy_dissipation_rate.toFixed(4)} bits/s.`,
    });
  } catch (error) {
    console.error('Entropy analysis error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'history';

    if (action === 'history') {
      const history = entropyTracker.getHistory();
      return NextResponse.json({
        success: true,
        timestamp_ms: Date.now(),
        entropy_history: history,
        history_length: history.length,
        average_entropy: entropyTracker.getAverageEntropy(),
        entropy_trend: entropyTracker.getEntropyTrend(),
      });
    }

    if (action === 'clear') {
      entropyTracker.clear();
      previousStateVector = undefined;
      return NextResponse.json({
        success: true,
        message: 'Entropy history cleared',
      });
    }

    return NextResponse.json(
      { error: 'Unknown action', valid_actions: ['history', 'clear'] },
      { status: 400 }
    );
  } catch (error) {
    console.error('Entropy GET error:', error);
    return NextResponse.json(
      { error: 'Request failed', details: String(error) },
      { status: 500 }
    );
  }
}
