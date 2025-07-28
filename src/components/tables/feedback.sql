-- Create feedback table for better organization
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('buyer', 'farmer')),
  subject TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  admin_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only insert their own feedback
CREATE POLICY "Users can insert own feedback" ON public.feedback
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can view all feedback
CREATE POLICY "Admins can view all feedback" ON public.feedback
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Policy: Admins can update all feedback
CREATE POLICY "Admins can update all feedback" ON public.feedback
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Create function to send feedback notifications only to admins
CREATE OR REPLACE FUNCTION send_feedback_to_admins()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification for all admin users
  INSERT INTO notifications (user_id, title, message, type)
  SELECT 
    p.id,
    'New ' || NEW.user_type || ' Feedback: ' || NEW.subject,
    'Priority: ' || NEW.priority || ' | Category: ' || NEW.category || ' | Rating: ' || NEW.rating || '/5',
    'admin_message'
  FROM profiles p
  WHERE p.role = 'admin';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS feedback_admin_notification ON public.feedback;
CREATE TRIGGER feedback_admin_notification
  AFTER INSERT ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION send_feedback_to_admins();