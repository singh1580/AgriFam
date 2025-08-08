import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useFeedbackRealtime } from '@/hooks/useFeedbackRealtime';
import { FeedbackAnalyticsModal } from './feedback/FeedbackAnalyticsModal';
import { BulkFeedbackActions } from './feedback/BulkFeedbackActions';
import { FeedbackTemplates } from './feedback/FeedbackTemplates';
import { 
  MessageSquare, 
  Star, 
  User, 
  Clock, 
  CheckCircle, 
  XCircle,
  Eye,
  Reply,
  Search,
  Filter,
  RefreshCw,
  BarChart3,
  FileText,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const AdminFeedbackManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);
  const [selectedFeedbacks, setSelectedFeedbacks] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Real-time updates
  useFeedbackRealtime({
    onNewFeedback: (feedback) => {
      console.log('New feedback received:', feedback);
    },
    onFeedbackUpdate: (feedback) => {
      console.log('Feedback updated:', feedback);
    }
  });

  // Fetch all feedback from the feedback table
  const { data: feedbacks = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select(`
          *,
          user:profiles(full_name, email, role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Feedback fetch error:', error);
        throw error;
      }
      
      return (data || []).map(feedback => ({
        ...feedback,
        user: feedback.user || { full_name: 'Unknown User', email: 'unknown@email.com', role: 'unknown' }
      }));
    },
    refetchInterval: 30000,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const updateFeedbackStatus = async (feedbackId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .eq('id', feedbackId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      toast({
        title: "Status Updated",
        description: `Feedback status changed to ${status}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const submitResponse = async (feedbackId: string) => {
    if (!responseText.trim()) {
      toast({
        title: "Response Required",
        description: "Please enter a response",
        variant: "destructive"
      });
      return;
    }

    setSubmittingResponse(true);
    try {
      const feedback = feedbacks.find(f => f.id === feedbackId);
      
      // Update feedback with admin response and mark as resolved
      const { error: updateError } = await supabase
        .from('feedback')
        .update({ 
          status: 'resolved',
          admin_response: responseText,
          updated_at: new Date().toISOString()
        })
        .eq('id', feedbackId);

      if (updateError) throw updateError;

      // Send notification to user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: feedback?.user_id,
          title: 'Feedback Response',
          message: `Admin has responded to your feedback: "${feedback?.subject}"\n\nResponse: ${responseText}`,
          type: 'admin_message' as const,
          read: false
        });

      if (notificationError) throw notificationError;

      queryClient.invalidateQueries({ queryKey: ['admin-feedback'] });
      setResponseText('');
      setSelectedFeedback(null);
      toast({
        title: "Response Sent",
        description: "User has been notified about the response",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Enhanced filtering and sorting
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || feedback.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || feedback.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || feedback.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  }).sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'created_at' || sortBy === 'updated_at') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const buyerFeedbacks = filteredFeedbacks.filter(f => f.user_type === 'buyer');
  const farmerFeedbacks = filteredFeedbacks.filter(f => f.user_type === 'farmer');

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading feedback data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            User Feedback Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Review and respond to user feedback and issues
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAnalytics(true)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{feedbacks.filter(f => f.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-xl font-bold">{feedbacks.filter(f => f.status === 'resolved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-xl font-bold">{feedbacks.filter(f => f.priority === 'critical').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-xl font-bold">
                  {feedbacks.length > 0 ? 
                    (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1) : 
                    '0.0'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{feedbacks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="product_quality">Product Quality</SelectItem>
                <SelectItem value="delivery_issues">Delivery Issues</SelectItem>
                <SelectItem value="payment_problems">Payment Problems</SelectItem>
                <SelectItem value="user_interface">User Interface</SelectItem>
                <SelectItem value="feature_request">Feature Request</SelectItem>
                <SelectItem value="technical_issue">Technical Issue</SelectItem>
                <SelectItem value="general_feedback">General Feedback</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
              setFilterCategory('all');
              setFilterPriority('all');
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center space-x-4 mt-4 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="updated_at">Last Updated</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <TrendingUp className={`h-4 w-4 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
              {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <BulkFeedbackActions
        feedbacks={filteredFeedbacks}
        selectedFeedbacks={selectedFeedbacks}
        onSelectionChange={setSelectedFeedbacks}
      />

      {/* Templates */}
      {showTemplates && (
        <Card>
          <CardContent className="p-4">
            <FeedbackTemplates
              onTemplateSelect={(content) => {
                setResponseText(content);
                setShowTemplates(false);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Feedback Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Feedback ({filteredFeedbacks.length})</TabsTrigger>
          <TabsTrigger value="buyers">Buyers ({buyerFeedbacks.length})</TabsTrigger>
          <TabsTrigger value="farmers">Farmers ({farmerFeedbacks.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredFeedbacks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No feedback found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredFeedbacks.map((feedback) => (
                <Card key={feedback.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <Checkbox
                            checked={selectedFeedbacks.includes(feedback.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFeedbacks(prev => [...prev, feedback.id]);
                              } else {
                                setSelectedFeedbacks(prev => prev.filter(id => id !== feedback.id));
                              }
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{feedback.subject}</h3>
                            <p className="text-xs text-muted-foreground">{feedback.user?.full_name} • {feedback.user_type}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={getStatusColor(feedback.status)}>
                            {feedback.status}
                          </Badge>
                          <Badge className={getPriorityColor(feedback.priority)}>
                            {feedback.priority}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">({feedback.rating}/5)</span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground line-clamp-2">{feedback.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                        </span>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedFeedback(feedback)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {feedback.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => updateFeedbackStatus(feedback.id, 'in_progress')}
                            >
                              Start Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="buyers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {buyerFeedbacks.map((feedback) => (
              <Card key={feedback.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{feedback.subject}</h3>
                        <p className="text-xs text-muted-foreground">{feedback.user?.full_name} • Buyer</p>
                      </div>
                      <Badge className={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{feedback.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="farmers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {farmerFeedbacks.map((feedback) => (
              <Card key={feedback.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{feedback.subject}</h3>
                        <p className="text-xs text-muted-foreground">{feedback.user?.full_name} • Farmer</p>
                      </div>
                      <Badge className={getStatusColor(feedback.status)}>
                        {feedback.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{feedback.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(feedback.created_at), 'MMM dd, yyyy')}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedFeedback(feedback)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Analytics Modal */}
      <FeedbackAnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        timeRange={30}
      />

      {/* Feedback Detail Modal */}
      {selectedFeedback && (
        <Card className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedFeedback.subject}</h2>
                  <p className="text-sm text-muted-foreground">
                    From: {selectedFeedback.user?.full_name} ({selectedFeedback.user_type})
                  </p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedFeedback(null)}>
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex space-x-2">
                <Badge className={getStatusColor(selectedFeedback.status)}>
                  {selectedFeedback.status}
                </Badge>
                <Badge className={getPriorityColor(selectedFeedback.priority)}>
                  {selectedFeedback.priority}
                </Badge>
                <Badge variant="outline">{selectedFeedback.category.replace('_', ' ')}</Badge>
              </div>

              <div className="flex items-center space-x-1">
                <span className="text-sm font-medium">Rating:</span>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < selectedFeedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-sm text-muted-foreground">({selectedFeedback.rating}/5)</span>
              </div>

              <div>
                <h3 className="font-medium mb-2">Description:</h3>
                <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                  {selectedFeedback.description}
                </p>
              </div>

              {selectedFeedback.admin_response && (
                <div>
                  <h3 className="font-medium mb-2">Admin Response:</h3>
                  <p className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    {selectedFeedback.admin_response}
                  </p>
                </div>
              )}

              {!selectedFeedback.admin_response && (
                <div>
                  <h3 className="font-medium mb-2">Admin Response:</h3>
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Enter your response to the user..."
                    rows={4}
                  />
                  <div className="flex space-x-2 mt-2">
                    <Button 
                      onClick={() => submitResponse(selectedFeedback.id)}
                      disabled={submittingResponse}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                    {selectedFeedback.status === 'pending' && (
                      <Button 
                        variant="outline"
                        onClick={() => updateFeedbackStatus(selectedFeedback.id, 'in_progress')}
                      >
                        Mark In Progress
                      </Button>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Submitted: {format(new Date(selectedFeedback.created_at), 'PPpp')}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AdminFeedbackManagement;
