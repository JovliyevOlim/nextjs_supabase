'use client';

import type {ColDef, ICellRendererParams, ValueGetterParams} from 'ag-grid-community';
import type {OrderRecord} from '@/types/data';

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

export const orderColumns: ColDef<OrderRecord>[] = [
    {
        field: 'order_id',
        headerName: 'Order ID',
        filter: 'agTextColumnFilter',
    },
    {
        field: 'customer_name',
        headerName: 'Customer Name',
        filter: 'agTextColumnFilter',
    },
    {
        field: 'customer_phone',
        headerName: 'Phone',
        filter: 'agTextColumnFilter',
        hide: true,
    },
    {
        field: 'order_date',
        headerName: 'Order Date',
        filter: 'agDateColumnFilter',
    },
    {
        field: 'shipping_address',
        headerName: 'Shipping Address',
        filter: 'agTextColumnFilter',
        hide: true,
    },
    {
        field: 'items_count',
        headerName: 'Items Count',
        filter: 'agNumberColumnFilter',
    },
    {
        field: 'subtotal',
        headerName: 'Subtotal',
        filter: 'agNumberColumnFilter',
        hide: true,
        valueFormatter: (params) => formatCurrencyValue(params.value),
    },
    {
        field: 'shipping_cost',
        headerName: 'Shipping Cost',
        filter: 'agNumberColumnFilter',
        hide: true,
        valueFormatter: (params) => formatCurrencyValue(params.value),
    },
    {
        field: 'discount',
        headerName: 'Discount (%)',
        filter: 'agNumberColumnFilter',
        hide: true,
        valueFormatter: (params) => formatPercentValue(params.value),
    },
    {
        field: 'total',
        headerName: 'Total',
        sortable: true,
        cellStyle: {fontWeight: 'bold'},
        valueGetter: (params: ValueGetterParams<OrderRecord>): number => {
            if (params.data?.total != null) {
                return params.data.total;
            }

            const subtotal = params.data?.subtotal ?? 0;
            const shippingCost = params.data?.shipping_cost ?? 0;
            const discount = params.data?.discount ?? 0;
            const beforeDiscount = subtotal + shippingCost;
            return beforeDiscount - (beforeDiscount * discount) / 100;
        },
        valueFormatter: (params) => formatCurrencyValue(params.value),
    },
    {
        field: 'status',
        headerName: 'Status',
        filter: 'agTextColumnFilter',
        cellRenderer: (params: ICellRendererParams<OrderRecord, string>): React.ReactNode => {
            const styles: Record<string, string> = {
                delivered: 'bg-green-100 text-green-800',
                processing: 'bg-blue-100 text-blue-800',
                confirmed: 'bg-purple-100 text-purple-800',
                pending: 'bg-amber-100 text-amber-800',
            };

            return (
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[params.value ?? ''] ?? ''}`}>
          {params.value?.toUpperCase()}
        </span>
            );
        },
    },
    {
        field: 'tracking_number',
        headerName: 'Tracking Number',
        filter: 'agTextColumnFilter',
    },
    {
        field: 'estimated_delivery',
        headerName: 'Estimated Delivery',
        filter: 'agDateColumnFilter',
        hide: true,
    },
];
