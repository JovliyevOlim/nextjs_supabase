import {getInvoices} from '@/lib/api';
import InvoicesGrid from '@/features/invoices/components/InvoicesGrid';

export default async function InvoicesPage() {
  const {data, totalCount} = await getInvoices({start: 0, end: 20});

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Invoices Management</h1>
      <InvoicesGrid initialData={data} totalCount={totalCount}/>
    </div>
  );
}
