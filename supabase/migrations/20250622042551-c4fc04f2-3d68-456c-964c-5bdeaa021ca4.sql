
-- Complete cleanup and recreation of user profile system

-- Drop existing objects to start completely fresh
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Recreate the app_role enum (if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('farmer', 'buyer', 'admin');
    END IF;
END $$;

-- Create the profiles table with proper structure
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role app_role NOT NULL DEFAULT 'farmer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

-- Create the handle_new_user function with comprehensive error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
  user_name TEXT;
  user_role app_role;
BEGIN
  -- Log the trigger execution
  RAISE LOG 'handle_new_user triggered for user %', NEW.id;
  
  -- Extract data with safe defaults
  user_email := COALESCE(NEW.email, 'unknown@example.com');
  user_name := COALESCE(NEW.raw_user_meta_data ->> 'full_name', user_email);
  
  -- Handle role conversion safely
  BEGIN
    user_role := COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'farmer'::app_role);
  EXCEPTION
    WHEN invalid_text_representation THEN
      user_role := 'farmer'::app_role;
      RAISE LOG 'Invalid role provided for user %, defaulting to farmer', NEW.id;
  END;
  
  -- Insert the profile record
  INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    NEW.id,
    user_email,
    user_name,
    user_role,
    NOW(),
    NOW()
  );
  
  RAISE LOG 'Profile created successfully for user %', NEW.id;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't block the user creation
    RAISE LOG 'Error in handle_new_user for user %: % %', NEW.id, SQLSTATE, SQLERRM;
    -- Re-raise the exception to prevent user creation if profile creation fails
    RAISE;
END;
$$;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE PROCEDURE public.handle_new_user();

-- Verify the setup by checking if everything exists
DO $$
BEGIN
  -- Check if the function exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_proc p 
    JOIN pg_namespace n ON p.pronamespace = n.oid 
    WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
  ) THEN
    RAISE EXCEPTION 'Function handle_new_user was not created properly';
  END IF;
  
  -- Check if the trigger exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'auth' AND c.relname = 'users' AND t.tgname = 'on_auth_user_created'
  ) THEN
    RAISE EXCEPTION 'Trigger on_auth_user_created was not created properly';
  END IF;
  
  -- Check if the profiles table exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    RAISE EXCEPTION 'Profiles table was not created properly';
  END IF;
  
  RAISE LOG 'All database objects created successfully';
END $$;
