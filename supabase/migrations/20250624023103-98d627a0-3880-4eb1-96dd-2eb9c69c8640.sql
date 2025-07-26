
-- Enable realtime for existing tables (only if not already enabled)
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.aggregated_products REPLICA IDENTITY FULL;

-- Add tables to realtime publication (only if not already added)
DO $$
BEGIN
    -- Check and add products table if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'products'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    END IF;
    
    -- Check and add orders table if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
    
    -- Check and add payments table if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'payments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
    END IF;
    
    -- Check and add notifications table if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    END IF;
    
    -- Check and add aggregated_products table if not exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'aggregated_products'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.aggregated_products;
    END IF;
END $$;

-- Create function to update aggregated products when individual products change
CREATE OR REPLACE FUNCTION update_aggregated_products()
RETURNS TRIGGER AS $$
BEGIN
    -- Update or create aggregated product entry
    INSERT INTO public.aggregated_products (
        product_name, 
        category, 
        total_quantity, 
        quality_grade, 
        standard_price,
        farmer_count,
        regions,
        product_ids
    )
    SELECT 
        NEW.name,
        NEW.category,
        SUM(p.quantity_available),
        NEW.quality_grade,
        AVG(p.price_per_unit),
        COUNT(DISTINCT p.farmer_id),
        ARRAY_AGG(DISTINCT p.location),
        ARRAY_AGG(DISTINCT p.id::text)
    FROM public.products p
    WHERE p.name = NEW.name 
        AND p.category = NEW.category 
        AND p.quality_grade = NEW.quality_grade
        AND p.status = 'approved'
    GROUP BY p.name, p.category, p.quality_grade
    ON CONFLICT (product_name, category, quality_grade) 
    DO UPDATE SET
        total_quantity = EXCLUDED.total_quantity,
        standard_price = EXCLUDED.standard_price,
        farmer_count = EXCLUDED.farmer_count,
        regions = EXCLUDED.regions,
        product_ids = EXCLUDED.product_ids,
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists and create new one
DROP TRIGGER IF EXISTS trigger_update_aggregated_products ON public.products;
CREATE TRIGGER trigger_update_aggregated_products
    AFTER INSERT OR UPDATE ON public.products
    FOR EACH ROW
    WHEN (NEW.status = 'approved')
    EXECUTE FUNCTION update_aggregated_products();

-- Create function to send notifications
CREATE OR REPLACE FUNCTION send_notification(
    p_user_id UUID,
    p_title TEXT,
    p_message TEXT,
    p_type notification_type DEFAULT 'general',
    p_product_id UUID DEFAULT NULL,
    p_order_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (user_id, title, message, type, product_id, order_id)
    VALUES (p_user_id, p_title, p_message, p_type, p_product_id, p_order_id)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to process orders
CREATE OR REPLACE FUNCTION process_order(
    p_buyer_id UUID,
    p_product_id UUID,
    p_quantity NUMERIC,
    p_delivery_address TEXT
)
RETURNS UUID AS $$
DECLARE
    order_id UUID;
    product_price NUMERIC;
    farmer_user_id UUID;
    total_amount NUMERIC;
BEGIN
    -- Get product price and farmer info
    SELECT price_per_unit, farmer_id INTO product_price, farmer_user_id
    FROM public.products 
    WHERE id = p_product_id AND status = 'approved';
    
    IF product_price IS NULL THEN
        RAISE EXCEPTION 'Product not found or not approved';
    END IF;
    
    total_amount := product_price * p_quantity;
    
    -- Create order
    INSERT INTO public.orders (buyer_id, product_id, quantity_ordered, total_amount, delivery_address)
    VALUES (p_buyer_id, p_product_id, p_quantity, total_amount, p_delivery_address)
    RETURNING id INTO order_id;
    
    -- Create payment record
    INSERT INTO public.payments (buyer_id, farmer_id, order_id, amount, farmer_amount)
    VALUES (p_buyer_id, farmer_user_id, order_id, total_amount, total_amount * 0.85);
    
    -- Send notifications
    PERFORM send_notification(
        p_buyer_id, 
        'Order Placed Successfully', 
        'Your order has been placed and is being processed.',
        'order_status'::notification_type,
        p_product_id,
        order_id
    );
    
    PERFORM send_notification(
        farmer_user_id,
        'New Order Received',
        'You have received a new order for your product.',
        'order_status'::notification_type,
        p_product_id,
        order_id
    );
    
    RETURN order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS and create policies only if they don't exist
DO $$
BEGIN
    -- Enable RLS on tables if not already enabled
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.aggregated_products ENABLE ROW LEVEL SECURITY;
EXCEPTION
    WHEN OTHERS THEN
        -- RLS might already be enabled, continue
        NULL;
END $$;

-- Create policies (drop existing ones first)
DROP POLICY IF EXISTS "Anyone can view approved products" ON public.products;
CREATE POLICY "Anyone can view approved products" ON public.products
    FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Farmers can manage their products" ON public.products;
CREATE POLICY "Farmers can manage their products" ON public.products
    FOR ALL USING (farmer_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Admins can manage all products" ON public.products
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Orders policies
DROP POLICY IF EXISTS "Users can view their orders" ON public.orders;
CREATE POLICY "Users can view their orders" ON public.orders
    FOR SELECT USING (
        buyer_id = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.products WHERE id = product_id AND farmer_id = auth.uid())
    );

DROP POLICY IF EXISTS "Buyers can create orders" ON public.orders;
CREATE POLICY "Buyers can create orders" ON public.orders
    FOR INSERT WITH CHECK (buyer_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
CREATE POLICY "Admins can manage all orders" ON public.orders
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Payments policies
DROP POLICY IF EXISTS "Users can view their payments" ON public.payments;
CREATE POLICY "Users can view their payments" ON public.payments
    FOR SELECT USING (buyer_id = auth.uid() OR farmer_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
CREATE POLICY "Admins can manage all payments" ON public.payments
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
CREATE POLICY "Users can view their notifications" ON public.notifications
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
CREATE POLICY "Users can update their notifications" ON public.notifications
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can create notifications" ON public.notifications;
CREATE POLICY "Admins can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Aggregated products policies
DROP POLICY IF EXISTS "Anyone can view aggregated products" ON public.aggregated_products;
CREATE POLICY "Anyone can view aggregated products" ON public.aggregated_products
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage aggregated products" ON public.aggregated_products;
CREATE POLICY "Admins can manage aggregated products" ON public.aggregated_products
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));
