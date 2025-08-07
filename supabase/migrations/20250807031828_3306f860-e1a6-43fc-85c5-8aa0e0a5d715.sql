-- Insert sample feedback data for testing
INSERT INTO feedback (user_id, subject, category, priority, description, rating, user_type, status) VALUES
('e966019a-49b5-46ae-ac68-dd9a39db7c5c', 'Great Product Quality', 'product_quality', 'high', 'The vegetables I ordered were fresh and of excellent quality. Very satisfied with the purchase.', 5, 'buyer', 'resolved'),
('42ee06af-1a4b-4ec7-983d-9353d63355d6', 'Payment Issue', 'payment_problems', 'critical', 'I have not received payment for my last order. Please help resolve this issue urgently.', 2, 'farmer', 'pending'),
('6e28a3c3-2e79-46a0-935a-7d6448f009e3', 'Delivery Delay', 'delivery_issues', 'medium', 'My order was delayed by 2 days. Would appreciate better communication about delivery schedules.', 3, 'buyer', 'in_progress'),
('326f9a78-1918-4666-b5b3-14c05d19adf3', 'Feature Request', 'feature_request', 'low', 'It would be great to have a mobile app for easier access to the platform.', 4, 'farmer', 'pending'),
('9b4943da-56f8-473e-bae9-4fef564b4852', 'User Interface Feedback', 'user_interface', 'medium', 'The dashboard could be more intuitive. Some buttons are hard to find.', 3, 'buyer', 'resolved');