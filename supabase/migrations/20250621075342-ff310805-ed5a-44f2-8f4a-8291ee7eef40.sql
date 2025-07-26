
-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('farmer', 'buyer', 'admin');

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role app_role NOT NULL DEFAULT 'farmer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farmer specific details table
CREATE TABLE public.farmer_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  farm_location TEXT,
  farm_size TEXT,
  primary_crops TEXT[],
  certification_documents TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create buyer specific details table
CREATE TABLE public.buyer_profiles (
  id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  business_type TEXT,
  procurement_volume TEXT,
  business_license TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create product categories and quality grades
CREATE TYPE public.product_category AS ENUM ('grain', 'vegetable', 'fruit', 'pulse', 'spice', 'other');
CREATE TYPE public.quality_grade AS ENUM ('A+', 'A', 'B+', 'B', 'C');
CREATE TYPE public.product_status AS ENUM ('pending_review', 'admin_review', 'approved', 'rejected', 'scheduled_collection', 'collected', 'payment_processed');

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category product_category NOT NULL,
  quantity_available DECIMAL NOT NULL,
  quantity_unit TEXT NOT NULL DEFAULT 'tons',
  price_per_unit DECIMAL NOT NULL,
  quality_grade quality_grade NOT NULL,
  description TEXT,
  images TEXT[],
  harvest_date DATE,
  expiry_date DATE,
  location TEXT,
  organic_certified BOOLEAN DEFAULT FALSE,
  status product_status DEFAULT 'pending_review',
  admin_notes TEXT,
  collection_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order status enum
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid_to_farmer', 'completed');

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity_ordered DECIMAL NOT NULL,
  total_amount DECIMAL NOT NULL,
  status order_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'pending',
  delivery_address TEXT,
  delivery_date TIMESTAMP WITH TIME ZONE,
  tracking_id TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TYPE public.notification_type AS ENUM ('product_status', 'order_update', 'payment', 'collection', 'admin_message', 'general');

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL NOT NULL,
  platform_fee DECIMAL DEFAULT 0,
  farmer_amount DECIMAL NOT NULL,
  payment_method TEXT,
  transaction_id TEXT,
  status payment_status DEFAULT 'pending',
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create aggregated products table for admin-curated listings
CREATE TABLE public.aggregated_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  category product_category NOT NULL,
  total_quantity DECIMAL NOT NULL,
  quantity_unit TEXT NOT NULL DEFAULT 'tons',
  standard_price DECIMAL NOT NULL,
  quality_grade quality_grade NOT NULL,
  farmer_count INTEGER NOT NULL DEFAULT 0,
  regions TEXT[],
  admin_certified BOOLEAN DEFAULT TRUE,
  quality_assured BOOLEAN DEFAULT TRUE,
  image TEXT,
  description TEXT,
  product_ids UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aggregated_products ENABLE ROW LEVEL SECURITY;

-- Create helper function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for farmer_profiles
CREATE POLICY "Farmers can manage their own profile"
  ON public.farmer_profiles
  FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all farmer profiles"
  ON public.farmer_profiles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for buyer_profiles
CREATE POLICY "Buyers can manage their own profile"
  ON public.buyer_profiles
  FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all buyer profiles"
  ON public.buyer_profiles
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for products
CREATE POLICY "Farmers can manage their own products"
  ON public.products
  FOR ALL
  USING (auth.uid() = farmer_id);

CREATE POLICY "Everyone can view approved products"
  ON public.products
  FOR SELECT
  USING (status IN ('approved', 'scheduled_collection', 'collected'));

CREATE POLICY "Admins can manage all products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for orders
CREATE POLICY "Buyers can manage their own orders"
  ON public.orders
  FOR ALL
  USING (auth.uid() = buyer_id);

CREATE POLICY "Farmers can view orders for their products"
  ON public.orders
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT farmer_id FROM public.products WHERE id = product_id
    )
  );

CREATE POLICY "Admins can manage all orders"
  ON public.orders
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for notifications
CREATE POLICY "Users can manage their own notifications"
  ON public.notifications
  FOR ALL
  USING (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Farmers can view their payments"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = farmer_id);

CREATE POLICY "Buyers can view their payments"
  ON public.payments
  FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Admins can manage all payments"
  ON public.payments
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for aggregated_products
CREATE POLICY "Everyone can view aggregated products"
  ON public.aggregated_products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage aggregated products"
  ON public.aggregated_products
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'farmer')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Create storage policies for product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Farmers can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Farmers can update their product images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Farmers can delete their product images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create storage bucket for profile pictures
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage policies for avatars
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Enable realtime for tables
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.payments REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;

-- Insert sample aggregated products for demonstration
INSERT INTO public.aggregated_products (
  product_name, category, total_quantity, standard_price, quality_grade,
  farmer_count, regions, image, description
) VALUES
  ('Premium Wheat', 'grain', 500, 25000, 'A', 12, ARRAY['Punjab', 'Haryana'], 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400', 'High-quality wheat from certified farmers'),
  ('Organic Rice', 'grain', 300, 35000, 'A+', 8, ARRAY['West Bengal', 'Odisha'], 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', 'Organic basmati rice, pesticide-free'),
  ('Fresh Tomatoes', 'vegetable', 150, 40000, 'A', 15, ARRAY['Maharashtra', 'Karnataka'], 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', 'Fresh, vine-ripened tomatoes'),
  ('Green Moong Dal', 'pulse', 80, 80000, 'A+', 6, ARRAY['Rajasthan', 'Madhya Pradesh'], 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=400', 'Premium quality green moong dal'),
  ('Organic Turmeric', 'spice', 25, 120000, 'A+', 4, ARRAY['Tamil Nadu', 'Kerala'], 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', 'Certified organic turmeric powder');
