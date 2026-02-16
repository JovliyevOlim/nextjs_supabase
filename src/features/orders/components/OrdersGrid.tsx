'use client';

import AGGridTable from '@/components/grid/AGGridTable';
import {orderColumns} from '@/features/grids/columns/orderColumns';
import type {OrderRecord} from '@/types/data';

interface OrdersGridProps {
  initialData: OrderRecord[];
  totalCount: number;
}

export default function OrdersGrid({initialData, totalCount}: OrdersGridProps) {
  return (
    <AGGridTable
      gridType="orders"
      initialData={initialData}
      totalCount={totalCount}
      columnDefs={orderColumns}
    />
  );
}
