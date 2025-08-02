-- Add language preference to profiles table
ALTER TABLE public.profiles 
ADD COLUMN language text DEFAULT 'english' CHECK (language IN ('english', 'hindi', 'bengali', 'tamil', 'telugu', 'marathi'));