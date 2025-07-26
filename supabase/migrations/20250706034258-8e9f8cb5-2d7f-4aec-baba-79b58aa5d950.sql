-- Update payments table to allow null buyer_id and order_id for collection payments
ALTER TABLE public.payments 
ALTER COLUMN buyer_id DROP NOT NULL,
ALTER COLUMN order_id DROP NOT NULL;

-- Add index for better performance on collection payments
CREATE INDEX IF NOT EXISTS idx_payments_collection_type 
ON public.payments (farmer_id, status, processed_at) 
WHERE buyer_id IS NULL AND order_id IS NULL;

-- Add constraint to ensure data integrity
ALTER TABLE public.payments 
ADD CONSTRAINT check_payment_type 
CHECK (
  (buyer_id IS NOT NULL AND order_id IS NOT NULL) OR 
  (buyer_id IS NULL AND order_id IS NULL AND payment_method = 'instant_collection_payment')
);