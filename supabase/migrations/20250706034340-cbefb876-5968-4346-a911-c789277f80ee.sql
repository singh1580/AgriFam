-- Clean up fake orders created by old payment processing
-- Delete orders where buyer_id equals farmer_id (these are fake orders)
DELETE FROM public.orders 
WHERE buyer_id IN (
  SELECT farmer_id 
  FROM public.products 
  WHERE id = orders.product_id
) AND buyer_id = (
  SELECT farmer_id 
  FROM public.products 
  WHERE id = orders.product_id
);

-- Update any payments that might be referencing these fake orders
UPDATE public.payments 
SET order_id = NULL, buyer_id = NULL, payment_method = 'instant_collection_payment'
WHERE order_id IS NOT NULL AND order_id NOT IN (SELECT id FROM public.orders);