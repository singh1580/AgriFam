
-- First, let's safely add only missing constraints
DO $$ 
BEGIN
    -- Add foreign key for products.farmer_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_farmer_id_fkey' 
        AND table_name = 'products'
    ) THEN
        ALTER TABLE public.products 
        ADD CONSTRAINT products_farmer_id_fkey 
        FOREIGN KEY (farmer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for orders.buyer_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_buyer_id_fkey' 
        AND table_name = 'orders'
    ) THEN
        ALTER TABLE public.orders 
        ADD CONSTRAINT orders_buyer_id_fkey 
        FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for payments.buyer_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_buyer_id_fkey' 
        AND table_name = 'payments'
    ) THEN
        ALTER TABLE public.payments 
        ADD CONSTRAINT payments_buyer_id_fkey 
        FOREIGN KEY (buyer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for payments.farmer_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_farmer_id_fkey' 
        AND table_name = 'payments'
    ) THEN
        ALTER TABLE public.payments 
        ADD CONSTRAINT payments_farmer_id_fkey 
        FOREIGN KEY (farmer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for payments.order_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payments_order_id_fkey' 
        AND table_name = 'payments'
    ) THEN
        ALTER TABLE public.payments 
        ADD CONSTRAINT payments_order_id_fkey 
        FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
    END IF;

    -- Add foreign key for notifications.user_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'notifications_user_id_fkey' 
        AND table_name = 'notifications'
    ) THEN
        ALTER TABLE public.notifications 
        ADD CONSTRAINT notifications_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes for better performance (these are safe to run multiple times)
CREATE INDEX IF NOT EXISTS idx_products_farmer_id ON public.products(farmer_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- Enable real-time for all tables
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication (safe to run multiple times)
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END;
END $$;
