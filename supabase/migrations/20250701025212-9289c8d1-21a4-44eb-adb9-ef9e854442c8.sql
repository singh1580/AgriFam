
CREATE OR REPLACE FUNCTION public.process_aggregated_order(
    p_buyer_id uuid,
    p_aggregated_product_id uuid,
    p_quantity numeric,
    p_delivery_address text,
    p_phone text DEFAULT NULL,
    p_preferred_delivery_date timestamp with time zone DEFAULT NULL,
    p_special_instructions text DEFAULT NULL
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
    
    total_amount := agg_product.standard_price * p_quantity;
    
    INSERT INTO public.orders (
        buyer_id, 
        product_id, 
        quantity_ordered, 
        total_amount, 
        delivery_address,
        delivery_date,
        notes
    )
    VALUES (
        p_buyer_id, 
        (agg_product.product_ids)[1],
        p_quantity, 
        total_amount, 
        p_delivery_address,
        p_preferred_delivery_date,
        p_special_instructions
    )
    RETURNING id INTO order_id;
    
    UPDATE public.aggregated_products 
    SET total_quantity = total_quantity - p_quantity,
        updated_at = NOW()
    WHERE id = p_aggregated_product_id;
    
    PERFORM send_notification(
        p_buyer_id, 
        'Order Placed Successfully', 
        'Your order for ' || agg_product.product_name || ' has been placed and is being processed by our admin team.',
        'order_confirmed'::notification_type,
        (agg_product.product_ids)[1],
        order_id
    );
    
    RETURN order_id;
END;
$function$
