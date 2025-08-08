-- Enable real-time for feedback table
ALTER TABLE feedback REPLICA IDENTITY FULL;

-- Add feedback table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE feedback;