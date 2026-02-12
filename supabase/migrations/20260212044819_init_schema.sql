CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE invoices (
                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                          invoice_id TEXT UNIQUE NOT NULL,
                          customer_name TEXT NOT NULL,
                          customer_email TEXT,
                          invoice_date DATE DEFAULT CURRENT_DATE,
                          due_date DATE,
                          amount DECIMAL(12, 2),
                          tax DECIMAL(5, 2),
                          total DECIMAL(12, 2),
                          status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
                          payment_method TEXT,
                          notes TEXT,
                          created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        order_id TEXT UNIQUE NOT NULL,
                        customer_name TEXT NOT NULL,
                        customer_phone TEXT,
                        order_date DATE DEFAULT CURRENT_DATE,
                        shipping_address TEXT,
                        items_count INT,
                        subtotal DECIMAL(12, 2),
                        shipping_cost DECIMAL(12, 2),
                        discount DECIMAL(5, 2),
                        total DECIMAL(12, 2),
                        status TEXT CHECK (status IN ('pending', 'confirmed', 'processing', 'delivered')),
                        tracking_number TEXT,
                        estimated_delivery DATE,
                        created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE grid_views (
                            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
                            view_name TEXT NOT NULL,
                            grid_type TEXT NOT NULL,
                            config JSONB NOT NULL,
                            is_default BOOLEAN DEFAULT false,
                            created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE grid_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own views" ON grid_views FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Public read access for invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Public read access for orders" ON orders FOR SELECT USING (true);