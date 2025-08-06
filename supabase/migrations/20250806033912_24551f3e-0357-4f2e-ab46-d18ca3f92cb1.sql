-- Add language column to profiles table for user-specific language preferences
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS language text DEFAULT 'english';