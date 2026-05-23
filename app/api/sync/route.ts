import { NextResponse } from 'next/server';
import { syncFromSILOC, getLatestExiston, getAllExistonsFromSILOC } from '@/lib/silo-c-sync';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'latest';

    if (action === 'latest') {
      await syncFromSILOC();
      const latest = await getLatestExiston();

      return NextResponse.json({
        action: 'latest_existon',
        data: latest,
        timestamp_ms: Date.now(),
      });
    }

    if (action === 'all') {
      await syncFromSILOC();
      const all = await getAllExistonsFromSILOC();

      return NextResponse.json({
        action: 'all_existons',
        total_records: all.length,
        total_existons: Math.ceil(all.length / 28),
        data: all,
        timestamp_ms: Date.now(),
      });
    }

    return NextResponse.json({
      error: 'Unknown action. Use ?action=latest or ?action=all',
    }, { status: 400 });
  } catch (error) {
    console.error('[SYNC ERROR]', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await syncFromSILOC();

    return NextResponse.json({
      success: true,
      message: 'SILO C sync completed',
      timestamp_ms: Date.now(),
    });
  } catch (error) {
    console.error('[SYNC ERROR]', error);
    return NextResponse.json(
      { error: 'Sync failed', details: String(error) },
      { status: 500 }
    );
  }
}
