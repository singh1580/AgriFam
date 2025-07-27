import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Star, Bug, Lightbulb, AlertTriangle, Send } from 'lucide-react';

interface FeedbackSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'buyer' | 'farmer';
}

const FeedbackSubmissionModal = ({ isOpen, onClose, userType }: FeedbackSubmissionModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    description: '',
    rating: 5
  });

  const categories = [
    { value: 'product_quality', label: 'Product Quality', icon: Star },
    { value: 'delivery_issues', label: 'Delivery Issues', icon: AlertTriangle },
    { value: 'payment_problems', label: 'Payment Problems', icon: AlertTriangle },
    { value: 'user_interface', label: 'User Interface', icon: Bug },
    { value: 'feature_request', label: 'Feature Request', icon: Lightbulb },
    { value: 'technical_issue', label: 'Technical Issue', icon: Bug },
    { value: 'general_feedback', label: 'General Feedback', icon: MessageSquare },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim() || !formData.category) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Store feedback as a notification with structured data
      const feedbackData = {
        subject: formData.subject,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        rating: formData.rating,
        userType: userType,
        timestamp: new Date().toISOString()
      };

      // Send structured feedback as notification
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user?.id,
          title: `${userType.charAt(0).toUpperCase() + userType.slice(1)} Feedback: ${formData.subject}`,
          message: JSON.stringify(feedbackData),
          type: 'admin_message',
          read: false
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! We'll review it soon.",
      });

      setFormData({
        subject: '',
        category: '',
        priority: 'medium',
        description: '',
        rating: 5
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Submit Feedback
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of your feedback"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {cat.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="rating">Overall Rating</Label>
              <Select value={formData.rating.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseInt(value) }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <SelectItem key={rating} value={rating.toString()}>
                      <div className="flex items-center gap-1">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-1">({rating}/5)</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Please provide detailed feedback..."
              rows={6}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackSubmissionModal;