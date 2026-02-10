'use client';

import AGGridTable from '@/components/grid/AGGridTable';
import {getOrders} from '@/lib/api';
import {useMemo} from 'react';

export default function OrdersPage() {
    const columnDefs = useMemo(() => [
        {
            field: 'order_id',
            headerName: 'Order ID',
            checkboxSelection: true,
            headerCheckboxSelection: true,
            filter: 'agTextColumnFilter'
        },
        {field: 'customer_name', headerName: 'Customer Name', filter: 'agTextColumnFilter'},
        {field: 'customer_phone', headerName: 'Phone', filter: 'agTextColumnFilter', hide: true},
        {field: 'order_date', headerName: 'Order Date', filter: 'agDateColumnFilter'},
        {field: 'shipping_address', headerName: 'Address', hide: true},
        {field: 'items_count', headerName: 'Items Count', filter: 'agNumberColumnFilter'},
        {field: 'subtotal', headerName: 'Subtotal', hide: true},
        {field: 'shipping_cost', headerName: 'Shipping', hide: true},
        {field: 'discount', headerName: 'Discount (%)', hide: true},
        {
            field: 'total',
            headerName: 'Total',
            cellStyle: {fontWeight: 'bold'},
            valueGetter: (p: any) => {
                if (p.data?.total) return p.data.total;
                const subtotal = p.data?.subtotal || 0;
                const shipping = p.data?.shipping_cost || 0;
                const discountPercent = p.data?.discount || 0;
                const discountAmount = (subtotal * discountPercent) / 100;
                return subtotal + shipping - discountAmount;
            },
            valueFormatter: (p: any) => p.value ? `€${p.value.toLocaleString()}` : ''
        },
        {
            field: 'status',
            headerName: 'Status',
            cellRenderer: (p: any) => {
                const colors: any = {
                    pending: 'bg-yellow-100 text-yellow-800',
                    confirmed: 'bg-blue-100 text-blue-800',
                    processing: 'bg-purple-100 text-purple-800',
                    delivered: 'bg-green-100 text-green-800',
                };
                return (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[p.value] || 'bg-gray-100'}`}>
                        {p.value?.toUpperCase()}
                    </span>
                );
            }
        },
        {field: 'tracking_number', headerName: 'Tracking Number', filter: 'agTextColumnFilter'},
        {field: 'estimated_delivery', headerName: 'Est. Delivery', hide: true},
    ], []);

    return (
        <div className="p-6 space-y-4">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800">Orders Management</h1>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <AGGridTable
                    gridType="orders"
                    initialColumnDefs={columnDefs}
                    fetchData={getOrders}
                />
            </div>
        </div>
    );
}