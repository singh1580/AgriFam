-- Add RLS policy to allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Also allow admins to manage (update/delete) all profiles if needed
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL
TO authenticated  
USING (has_role(auth.uid(), 'admin'));