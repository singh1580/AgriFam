
-- Fix the update_aggregated_products function to properly cast product IDs to UUID
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
        ARRAY_AGG(DISTINCT p.id)
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
