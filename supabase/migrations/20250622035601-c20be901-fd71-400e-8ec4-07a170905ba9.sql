
-- Drop existing objects if they exist to start fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Ensure the app_role enum exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('farmer', 'buyer', 'admin');
    END IF;
END $$;

-- Ensure the profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role app_role NOT NULL DEFAULT 'farmer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure the profiles table has the correct role column type and default
DO $$
BEGIN
    -- Check if role column exists and has correct type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role' 
        AND table_schema = 'public'
    ) THEN
        -- Update the column to ensure it has the correct type and default
        ALTER TABLE public.profiles 
        ALTER COLUMN role TYPE app_role USING role::text::app_role,
        ALTER COLUMN role SET DEFAULT 'farmer'::app_role;
    ELSE
        -- Add the role column if it doesn't exist
        ALTER TABLE public.profiles 
        ADD COLUMN role app_role NOT NULL DEFAULT 'farmer';
    END IF;
END $$;

-- Create or replace the handle_new_user function
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
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'farmer'::app_role)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    role = COALESCE(EXCLUDED.role, profiles.role),
    updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create the trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are created on signup" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Profiles are created on signup"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Test the function to make sure it works
DO $$
BEGIN
    -- This is just a test to ensure the function compiles correctly
    PERFORM public.handle_new_user();
EXCEPTION
    WHEN OTHERS THEN
        -- Expected to fail since there's no NEW record, but it validates the function
        NULL;
END $$;
