import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface SuspendAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const SuspendAccountModal = ({ isOpen, onClose, userId, userName }: SuspendAccountModalProps) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuspendAccount = async () => {
    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a reason for suspending this account.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call - replace with actual implementation
    setTimeout(() => {
      toast({
        title: "Account Suspended",
        description: `${userName}'s account has been suspended successfully.`,
        variant: "destructive"
      });
      setReason('');
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Suspend Account</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You are about to suspend <strong>{userName}</strong>'s account. 
              This action will prevent them from accessing the platform.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Suspension</Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed reason for suspending this account..."
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleSuspendAccount} 
              disabled={isLoading}
            >
              {isLoading ? 'Suspending...' : 'Suspend Account'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SuspendAccountModal;