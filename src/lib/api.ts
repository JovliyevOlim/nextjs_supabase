import {createClient} from './server';
import type {InvoiceRecord, OrderRecord} from '@/types/data';
import type {
  DateFilterModel,
  FetchParams,
  FetchResponse,
  GridFilterModel,
  NumberFilterModel,
  TextFilterModel,
} from '@/types/grid';

function isTextFilter(value: unknown): value is TextFilterModel {
  return (
    typeof value === 'object' &&
    value !== null &&
    'filterType' in value &&
    (value as {filterType?: unknown}).filterType === 'text' &&
    'filter' in value
  );
}

function isNumberFilter(value: unknown): value is NumberFilterModel {
  return (
    typeof value === 'object' &&
    value !== null &&
    'filterType' in value &&
    (value as {filterType?: unknown}).filterType === 'number' &&
    'type' in value &&
    'filter' in value
  );
}

function isDateFilter(value: unknown): value is DateFilterModel {
  return (
    typeof value === 'object' &&
    value !== null &&
    'filterType' in value &&
    (value as {filterType?: unknown}).filterType === 'date' &&
    'type' in value &&
    'dateFrom' in value
  );
}

function applyTextFilter<T>(
  query: T,
  field: string,
  filter: TextFilterModel,
): T {
  if (!filter.filter.trim()) {
    return query;
  }

  return (query as {ilike: (column: string, value: string) => T}).ilike(field, `%${filter.filter}%`);
}

function applyNumberFilter<T>(
  query: T,
  field: string,
  filter: NumberFilterModel,
): T {
  const q = query as {
    eq: (column: string, value: number) => T;
    neq: (column: string, value: number) => T;
    lt: (column: string, value: number) => T;
    lte: (column: string, value: number) => T;
    gt: (column: string, value: number) => T;
    gte: (column: string, value: number) => T;
  };

  switch (filter.type) {
    case 'equals':
      return q.eq(field, filter.filter);
    case 'notEqual':
      return q.neq(field, filter.filter);
    case 'lessThan':
      return q.lt(field, filter.filter);
    case 'lessThanOrEqual':
      return q.lte(field, filter.filter);
    case 'greaterThan':
      return q.gt(field, filter.filter);
    case 'greaterThanOrEqual':
      return q.gte(field, filter.filter);
    default:
      return query;
  }
}

function applyDateFilter<T>(
  query: T,
  field: string,
  filter: DateFilterModel,
): T {
  const q = query as {
    eq: (column: string, value: string) => T;
    lt: (column: string, value: string) => T;
    gt: (column: string, value: string) => T;
  };

  switch (filter.type) {
    case 'equals':
      return q.eq(field, filter.dateFrom);
    case 'lessThan':
      return q.lt(field, filter.dateFrom);
    case 'greaterThan':
      return q.gt(field, filter.dateFrom);
    default:
      return query;
  }
}

function applyFilters<T>(query: T, filter: GridFilterModel | undefined): T {
  if (!filter) {
    return query;
  }

  return Object.entries(filter).reduce((acc, [field, value]) => {
    if (isTextFilter(value)) {
      return applyTextFilter(acc, field, value);
    }

    if (isNumberFilter(value)) {
      return applyNumberFilter(acc, field, value);
    }

    if (isDateFilter(value)) {
      return applyDateFilter(acc, field, value);
    }

    return acc;
  }, query);
}

export async function getInvoices(params: FetchParams): Promise<FetchResponse<InvoiceRecord>> {
  const supabase = await createClient();
  const {start, end, sort, filter} = params;

  let query = supabase.from('invoices').select('*', {count: 'exact'});

  if (sort?.length) {
    sort.forEach((item) => {
      query = query.order(item.colId, {ascending: item.sort === 'asc'});
    });
  }

  query = applyFilters(query, filter);

  const lastRow = Math.max(start, end - 1);
  const {data, count, error} = await query.range(start, lastRow);

  if (error) {
    throw error;
  }

  return {data: (data ?? []) as InvoiceRecord[], totalCount: count ?? 0};
}

export async function getOrders(params: FetchParams): Promise<FetchResponse<OrderRecord>> {
  const supabase = await createClient();
  const {start, end, sort, filter} = params;

  let query = supabase.from('orders').select('*', {count: 'exact'});

  if (sort?.length) {
    sort.forEach((item) => {
      query = query.order(item.colId, {ascending: item.sort === 'asc'});
    });
  }

  query = applyFilters(query, filter);

  const lastRow = Math.max(start, end - 1);
  const {data, count, error} = await query.range(start, lastRow);

  if (error) {
    throw error;
  }

  return {data: (data ?? []) as OrderRecord[], totalCount: count ?? 0};
}
