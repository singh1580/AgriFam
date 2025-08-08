import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  MessageSquare,
  CheckSquare,
  Users
} from 'lucide-react';

interface BulkFeedbackActionsProps {
  feedbacks: any[];
  selectedFeedbacks: string[];
  onSelectionChange: (feedbackIds: string[]) => void;
}

export const BulkFeedbackActions = ({
  feedbacks,
  selectedFeedbacks,
  onSelectionChange
}: BulkFeedbackActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkResponse, setBulkResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectAll = () => {
    if (selectedFeedbacks.length === feedbacks.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(feedbacks.map(f => f.id));
    }
  };

  const handleBulkAction = async () => {
    if (selectedFeedbacks.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select feedback items to perform bulk action",
        variant: "destructive"
      });
      return;
    }

    if (!bulkAction) {
      toast({
        title: "No Action Selected",
        description: "Please select an action to perform",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const updates: any = { updated_at: new Date().toISOString() };
      
      // Determine updates based on action
      switch (bulkAction) {
        case 'mark_resolved':
          updates.status = 'resolved';
          if (bulkResponse.trim()) {
            updates.admin_response = bulkResponse;
          }
          break;
        case 'mark_in_progress':
          updates.status = 'in_progress';
          break;
        case 'mark_closed':
          updates.status = 'closed';
          break;
        case 'add_response':
          if (!bulkResponse.trim()) {
            toast({
              title: "Response Required",
              description: "Please enter a response message",
              variant: "destructive"
            });
            setIsProcessing(false);
            return;
          }
          updates.admin_response = bulkResponse;
          break;
      }

      // Update feedback records
      const { error: updateError } = await supabase
        .from('feedback')
        .update(updates)
        .in('id', selectedFeedbacks);

      if (updateError) throw updateError;

      // Send notifications to users if resolved with response
      if (bulkAction === 'mark_resolved' && bulkResponse.trim()) {
        const selectedFeedbackData = feedbacks.filter(f => selectedFeedbacks.includes(f.id));
        
        const notifications = selectedFeedbackData.map(feedback => ({
          user_id: feedback.user_id,
          title: 'Feedback Response',
          message: `Admin has responded to your feedback: "${feedback.subject}"\n\nResponse: ${bulkResponse}`,
          type: 'admin_message' as const,
          read: false
        }));

        const { error: notificationError } = await supabase
          .from('notifications')
          .insert(notifications);

        if (notificationError) {
          console.error('Notification error:', notificationError);
        }
      }

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      queryClient.invalidateQueries({ queryKey: ['feedback-analytics'] });

      // Reset state
      onSelectionChange([]);
      setBulkAction('');
      setBulkResponse('');

      toast({
        title: "Bulk Action Completed",
        description: `Successfully updated ${selectedFeedbacks.length} feedback items`,
      });

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'mark_resolved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'mark_in_progress':
        return <Clock className="h-4 w-4" />;
      case 'mark_closed':
        return <XCircle className="h-4 w-4" />;
      case 'add_response':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  if (feedbacks.length === 0) return null;

  return (
    <Card className="bg-muted/30 border-dashed">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Selection Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox
                checked={selectedFeedbacks.length === feedbacks.length}
                onCheckedChange={handleSelectAll}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
                className="text-xs"
              >
                <CheckSquare className="h-3 w-3 mr-1" />
                {selectedFeedbacks.length === feedbacks.length ? 'Deselect All' : 'Select All'}
              </Button>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {selectedFeedbacks.length} of {feedbacks.length} selected
                </span>
              </div>
            </div>
            
            {selectedFeedbacks.length > 0 && (
              <Badge variant="secondary">
                {selectedFeedbacks.length} selected
              </Badge>
            )}
          </div>

          {/* Bulk Actions */}
          {selectedFeedbacks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-background rounded-lg border">
              <div>
                <label className="text-sm font-medium mb-2 block">Bulk Action</label>
                <Select value={bulkAction} onValueChange={setBulkAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mark_resolved">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Mark as Resolved</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mark_in_progress">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>Mark as In Progress</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="mark_closed">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-4 w-4 text-gray-600" />
                        <span>Mark as Closed</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="add_response">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                        <span>Add Response</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-2 block">
                  Response Message {(bulkAction === 'add_response' || bulkAction === 'mark_resolved') && '(Optional)'}
                </label>
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Enter response message..."
                    value={bulkResponse}
                    onChange={(e) => setBulkResponse(e.target.value)}
                    className="min-h-[40px] resize-none"
                    rows={2}
                  />
                  <Button 
                    onClick={handleBulkAction}
                    disabled={isProcessing || !bulkAction}
                    className="px-6"
                  >
                    {isProcessing ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        {getActionIcon(bulkAction)}
                        <span>Apply</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};