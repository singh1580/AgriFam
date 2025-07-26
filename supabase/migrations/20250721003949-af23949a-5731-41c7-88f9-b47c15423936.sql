-- Add product_name column to orders table to store the actual product name
ALTER TABLE public.orders 
ADD COLUMN product_name TEXT;

-- Update existing orders with product names from products table
UPDATE public.orders 
SET product_name = p.name 
FROM public.products p 
WHERE orders.product_id = p.id;

-- Create a trigger to automatically set product_name when inserting new orders
CREATE OR REPLACE FUNCTION public.set_order_product_name()
RETURNS TRIGGER AS $$
BEGIN
    SELECT name INTO NEW.product_name 
    FROM public.products 
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_product_name_trigger
    BEFORE INSERT ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.set_order_product_name();