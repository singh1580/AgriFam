
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const SendMessageModal = ({ isOpen, onClose, userId, userName }: SendMessageModalProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both subject and message.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Send notification to the user
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: subject,
          message: message,
          type: 'admin_message'
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Message Sent",
        description: `Message sent successfully to ${userName}`,
      });
      
      setSubject('');
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Message to {userName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter message subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SendMessageModal;
