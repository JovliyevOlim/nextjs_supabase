import {getOrders} from '@/lib/api';
import OrdersGrid from '@/features/orders/components/OrdersGrid';

export default async function OrdersPage() {
  const {data, totalCount} = await getOrders({start: 0, end: 20});

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Orders Management</h1>
      <OrdersGrid initialData={data} totalCount={totalCount}/>
    </div>
  );
}
