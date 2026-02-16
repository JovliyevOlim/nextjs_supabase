export interface InvoiceRecord {
  id: string;
  invoice_id: string;
  customer_name: string;
  customer_email: string | null;
  invoice_date: string;
  due_date: string | null;
  amount: number | null;
  tax: number | null;
  total: number | null;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
}

export interface OrderRecord {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string | null;
  order_date: string;
  shipping_address: string | null;
  items_count: number | null;
  subtotal: number | null;
  shipping_cost: number | null;
  discount: number | null;
  total: number | null;
  status: 'pending' | 'confirmed' | 'processing' | 'delivered' | string;
  tracking_number: string | null;
  estimated_delivery: string | null;
  created_at: string;
}
