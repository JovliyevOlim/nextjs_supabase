"use client"
import AGGridTable from '@/components/grid/AGGridTable';
import {getInvoices} from '@/lib/api';
import {useMemo} from "react";


export default function InvoicesPage() {


    const columnDefs = useMemo(() => [
        {
            field: 'invoice_id',
            headerName: 'Invoice ID',
            filter: 'agTextColumnFilter',
            checkboxSelection: true,
            headerCheckboxSelection: true
        },
        {
            field: 'customer_name',
            headerName: 'Customer Name',
            filter: 'agTextColumnFilter'
        },
        {
            field: 'customer_email',
            headerName: 'Email',
            filter: 'agTextColumnFilter',
            hide: true
        },
        {
            field: 'invoice_date',
            headerName: 'Invoice Date',
            filter: 'agDateColumnFilter'
        },
        {
            field: 'due_date',
            headerName: 'Due Date',
            filter: 'agDateColumnFilter'
        },
        {
            field: 'amount',
            headerName: 'Amount',
            filter: 'agNumberColumnFilter',
            hide: true,
            valueFormatter: (p: any) => p.value ? `€${p.value.toLocaleString()}` : ''
        },
        {
            field: 'tax',
            headerName: 'Tax (%)',
            filter: 'agNumberColumnFilter',
            hide: true,
            valueFormatter: (p: any) => p.value ? `${p.value}%` : ''
        },
        {
            field: 'total',
            headerName: 'Total',
            sortable: true,
            cellStyle: {fontWeight: 'bold'},
            valueGetter: (p: any) => {
                if (p.data?.total) return p.data.total;
                const amount = p.data?.amount || 0;
                const tax = p.data?.tax || 0;
                return amount + (amount * tax / 100);
            },
            valueFormatter: (p: any) => p.value ? `€${p.value.toLocaleString()}` : ''
        },
        {
            field: 'status',
            headerName: 'Status',
            filter: 'agTextColumnFilter',
            cellRenderer: (p: any) => {
                const styles: any = {
                    paid: 'bg-green-100 text-green-800',
                    sent: 'bg-blue-100 text-blue-800',
                    overdue: 'bg-red-100 text-red-800',
                    draft: 'bg-gray-100 text-gray-800',
                    cancelled: 'bg-orange-100 text-orange-800',
                };
                return (
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[p.value] || ''}`}>
            {p.value?.toUpperCase()}
          </span>
                );
            }
        },
        {field: 'payment_method', headerName: 'Payment Method', hide: true},
        {field: 'notes', headerName: 'Notes', hide: true},
    ], []);

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Invoices Management</h1>
            <AGGridTable
                gridType="invoices"
                initialColumnDefs={columnDefs}
                fetchData={getInvoices}
            />
        </div>
    );
}