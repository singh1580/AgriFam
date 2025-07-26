
-- Add unique constraint for the aggregated_products table to support ON CONFLICT
ALTER TABLE public.aggregated_products 
ADD CONSTRAINT unique_aggregated_product 
UNIQUE (product_name, category, quality_grade);

-- Also add an index for better performance
CREATE INDEX IF NOT EXISTS idx_aggregated_products_lookup 
ON public.aggregated_products (product_name, category, quality_grade);
