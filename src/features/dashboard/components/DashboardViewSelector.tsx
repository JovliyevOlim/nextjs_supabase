'use client';

import {useRouter} from 'next/navigation';
import {LayoutGrid} from 'lucide-react';

const options = [
  {label: 'Invoices', value: '/invoices'},
  {label: 'Orders', value: '/orders'},
];

export default function DashboardViewSelector() {
  const router = useRouter();

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-gray-700">
        <LayoutGrid size={18}/>
        <h2 className="text-sm font-semibold uppercase tracking-wide">View Selector</h2>
      </div>
      <label htmlFor="dashboardView" className="mb-2 block text-sm font-medium text-gray-600">
        Choose a grid view
      </label>
      <select
        id="dashboardView"
        defaultValue=""
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(event) => {
          if (event.target.value) {
            router.push(event.target.value);
          }
        }}
      >
        <option value="" disabled>
          Select view
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
