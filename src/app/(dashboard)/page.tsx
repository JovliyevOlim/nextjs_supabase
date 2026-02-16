import Link from 'next/link';
import DashboardViewSelector from '@/features/dashboard/components/DashboardViewSelector';

export default function DashboardPage() {
  return (
    <section className="grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Choose a view from the selector or jump directly to one of the managed tables.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/invoices"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Open Invoices
          </Link>
          <Link
            href="/orders"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
          >
            Open Orders
          </Link>
        </div>
      </div>

      <DashboardViewSelector/>
    </section>
  );
}
