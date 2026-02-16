import {NextRequest, NextResponse} from 'next/server';
import {getOrders} from '@/lib/api';
import type {FetchParams, GridFilterModel} from '@/types/grid';

function parseNumberParam(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseJsonParam<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export async function GET(request: NextRequest) {
  try {
    const {searchParams} = new URL(request.url);

    const params: FetchParams = {
      start: parseNumberParam(searchParams.get('start'), 0),
      end: parseNumberParam(searchParams.get('end'), 20),
      sort: parseJsonParam(searchParams.get('sort'), []),
      filter: parseJsonParam<GridFilterModel | undefined>(searchParams.get('filter'), undefined),
    };

    const result = await getOrders(params);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({message: 'Failed to fetch orders.'}, {status: 500});
  }
}
