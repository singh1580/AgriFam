-- Update process_aggregated_order function to NOT automatically set delivery date
CREATE OR REPLACE FUNCTION public.process_aggregated_order(
    p_buyer_id uuid, 
    p_aggregated_product_id uuid, 
    p_quantity numeric, 
    p_delivery_address text, 
    p_phone text DEFAULT NULL::text, 
    p_preferred_delivery_date timestamp with time zone DEFAULT NULL::timestamp with time zone, 
    p_special_instructions text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    order_id UUID;
    agg_product RECORD;
    total_amount NUMERIC;
    selected_product_id UUID;
BEGIN
    SELECT * INTO agg_product
    FROM public.aggregated_products 
    WHERE id = p_aggregated_product_id;
    
    IF agg_product IS NULL THEN
        RAISE EXCEPTION 'Aggregated product not found';
    END IF;
    
    IF p_quantity > agg_product.total_quantity THEN
        RAISE EXCEPTION 'Requested quantity exceeds available stock';
    END IF;
    
    -- Handle case where product_ids array might be null or empty
    IF agg_product.product_ids IS NULL OR array_length(agg_product.product_ids, 1) IS NULL THEN
        RAISE EXCEPTION 'No products available for this aggregated product';
    END IF;
    
    selected_product_id := (agg_product.product_ids)[1];
    
    IF selected_product_id IS NULL THEN
        RAISE EXCEPTION 'Invalid product ID in aggregated product';
    END IF;
    
    total_amount := agg_product.standard_price * p_quantity;
    
    -- Create order WITHOUT automatic delivery date - admin will set it later
    INSERT INTO public.orders (
        buyer_id, 
        product_id, 
        quantity_ordered, 
        total_amount, 
        delivery_address,
        -- Remove automatic delivery_date assignment
        notes
    )
    VALUES (
        p_buyer_id, 
        selected_product_id,
        p_quantity, 
        total_amount, 
        p_delivery_address,
        -- Don't set delivery date automatically
        p_special_instructions
    )
    RETURNING id INTO order_id;
    
    UPDATE public.aggregated_products 
    SET total_quantity = total_quantity - p_quantity,
        updated_at = NOW()
    WHERE id = p_aggregated_product_id;
    
    -- Notify buyer that order is placed and pending admin confirmation
    PERFORM send_notification(
        p_buyer_id, 
        'Order Placed Successfully', 
        'Your order for ' || agg_product.product_name || ' has been placed and is pending admin confirmation. You will receive delivery date once confirmed.',
        'order_update'::notification_type,
        selected_product_id,
        order_id
    );
    
    RETURN order_id;
END;
$function$