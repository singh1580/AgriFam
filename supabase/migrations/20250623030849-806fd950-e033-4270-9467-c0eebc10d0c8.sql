
-- Fix the search_path security issue in the has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$function$;
