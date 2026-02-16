'use client';

import AGGridTable from '@/components/grid/AGGridTable';
import {invoiceColumns} from '@/features/grids/columns/invoiceColumns';
import type {InvoiceRecord} from '@/types/data';

interface InvoicesGridProps {
  initialData: InvoiceRecord[];
  totalCount: number;
}

export default function InvoicesGrid({initialData, totalCount}: InvoicesGridProps) {
  return (
    <AGGridTable
      gridType="invoices"
      initialData={initialData}
      totalCount={totalCount}
      columnDefs={invoiceColumns}
    />
  );
}
