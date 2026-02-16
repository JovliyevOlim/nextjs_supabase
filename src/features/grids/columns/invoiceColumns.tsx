'use client';

import type {ColDef, ICellRendererParams, ValueGetterParams} from 'ag-grid-community';
import type {InvoiceRecord} from '@/types/data';

function formatCurrencyValue(value: unknown): string {
  if (typeof value !== 'number') {
    return '';
  }

  return `€${value.toLocaleString()}`;
}

function formatPercentValue(value: unknown): string {
  if (typeof value !== 'number') {
    return '';
  }

  return `${value}%`;
}

export const invoiceColumns: ColDef<InvoiceRecord>[] = [
  {
    field: 'invoice_id',
    headerName: 'Invoice ID',
    filter: 'agTextColumnFilter',
  },
  {
    field: 'customer_name',
    headerName: 'Customer Name',
    filter: 'agTextColumnFilter',
  },
  {
    field: 'customer_email',
    headerName: 'Email',
    filter: 'agTextColumnFilter',
    hide: true,
  },
  {
    field: 'invoice_date',
    headerName: 'Invoice Date',
    filter: 'agDateColumnFilter',
  },
  {
    field: 'due_date',
    headerName: 'Due Date',
    filter: 'agDateColumnFilter',
  },
  {
    field: 'amount',
    headerName: 'Amount',
    filter: 'agNumberColumnFilter',
    hide: true,
    valueFormatter: (params) => formatCurrencyValue(params.value),
  },
  {
    field: 'tax',
    headerName: 'Tax (%)',
    filter: 'agNumberColumnFilter',
    hide: true,
    valueFormatter: (params) => formatPercentValue(params.value),
  },
  {
    field: 'total',
    headerName: 'Total',
    sortable: true,
    cellStyle: {fontWeight: 'bold'},
    valueGetter: (params: ValueGetterParams<InvoiceRecord>): number => {
      if (params.data?.total != null) {
        return params.data.total;
      }

      const amount = params.data?.amount ?? 0;
      const tax = params.data?.tax ?? 0;
      return amount + (amount * tax) / 100;
    },
    valueFormatter: (params) => formatCurrencyValue(params.value),
  },
  {
    field: 'status',
    headerName: 'Status',
    filter: 'agTextColumnFilter',
    cellRenderer: (params: ICellRendererParams<InvoiceRecord, string>): React.ReactNode => {
      const styles: Record<string, string> = {
        paid: 'bg-green-100 text-green-800',
        sent: 'bg-blue-100 text-blue-800',
        overdue: 'bg-red-100 text-red-800',
        draft: 'bg-gray-100 text-gray-800',
        cancelled: 'bg-orange-100 text-orange-800',
      };

      return (
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[params.value ?? ''] ?? ''}`}>
          {params.value?.toUpperCase()}
        </span>
      );
    },
  },
  {field: 'payment_method', headerName: 'Payment Method', hide: true},
  {field: 'notes', headerName: 'Notes', hide: true},
];
