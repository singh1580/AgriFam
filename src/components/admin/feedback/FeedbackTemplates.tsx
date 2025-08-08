import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Plus, 
  Copy, 
  Edit, 
  Trash2,
  BookOpen
} from 'lucide-react';

interface ResponseTemplate {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
}

interface FeedbackTemplatesProps {
  onTemplateSelect: (content: string) => void;
}

const defaultTemplates: ResponseTemplate[] = [
  {
    id: '1',
    title: 'Product Quality Issue - Resolved',
    content: 'Thank you for bringing this product quality issue to our attention. We have investigated the matter and taken corrective actions with our farmers. We apologize for any inconvenience caused and have implemented additional quality checks to prevent similar issues in the future.',
    category: 'product_quality',
    tags: ['resolved', 'quality', 'apology']
  },
  {
    id: '2',
    title: 'Payment Delay - Processing',
    content: 'We understand your concern regarding the payment delay. Our finance team is currently processing your payment and you should receive it within 24-48 hours. We apologize for the delay and any inconvenience it may have caused.',
    category: 'payment_problems',
    tags: ['payment', 'processing', 'timeline']
  },
  {
    id: '3',
    title: 'Delivery Issue - Acknowledgment',
    content: 'Thank you for reporting the delivery issue. We have contacted our logistics partner to investigate the delay. We will keep you updated on the status and ensure better communication for future deliveries.',
    category: 'delivery_issues',
    tags: ['delivery', 'logistics', 'communication']
  },
  {
    id: '4',
    title: 'Feature Request - Under Review',
    content: 'Thank you for your valuable feature suggestion. Our development team has reviewed your request and it has been added to our product roadmap. We will notify you when this feature is implemented.',
    category: 'feature_request',
    tags: ['feature', 'roadmap', 'development']
  },
  {
    id: '5',
    title: 'UI/UX Feedback - Appreciated',
    content: 'We appreciate your feedback about the user interface. User experience is very important to us and we are constantly working to improve it. Your suggestions have been forwarded to our design team for consideration.',
    category: 'user_interface',
    tags: ['ui', 'ux', 'design']
  },
  {
    id: '6',
    title: 'General Inquiry - Information Provided',
    content: 'Thank you for your inquiry. We hope the information provided has been helpful. If you have any additional questions or need further assistance, please don\'t hesitate to contact us.',
    category: 'general_feedback',
    tags: ['inquiry', 'information', 'assistance']
  }
];

export const FeedbackTemplates = ({ onTemplateSelect }: FeedbackTemplatesProps) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<ResponseTemplate[]>(defaultTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ResponseTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    content: '',
    category: '',
    tags: ''
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.title || !newTemplate.content) {
      toast({
        title: "Missing Information",
        description: "Please provide a title and content for the template",
        variant: "destructive"
      });
      return;
    }

    const template: ResponseTemplate = {
      id: Date.now().toString(),
      title: newTemplate.title,
      content: newTemplate.content,
      category: newTemplate.category || 'general',
      tags: newTemplate.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    setTemplates(prev => [...prev, template]);
    setNewTemplate({ title: '', content: '', category: '', tags: '' });
    setIsModalOpen(false);
    
    toast({
      title: "Template Created",
      description: "New response template has been created successfully",
    });
  };

  const handleEditTemplate = (template: ResponseTemplate) => {
    setEditingTemplate(template);
    setNewTemplate({
      title: template.title,
      content: template.content,
      category: template.category,
      tags: template.tags.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleUpdateTemplate = () => {
    if (!editingTemplate) return;

    const updatedTemplate: ResponseTemplate = {
      ...editingTemplate,
      title: newTemplate.title,
      content: newTemplate.content,
      category: newTemplate.category,
      tags: newTemplate.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? updatedTemplate : t));
    setEditingTemplate(null);
    setNewTemplate({ title: '', content: '', category: '', tags: '' });
    setIsModalOpen(false);
    
    toast({
      title: "Template Updated",
      description: "Response template has been updated successfully",
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: "Response template has been deleted",
    });
  };

  const handleTemplateSelect = (content: string) => {
    onTemplateSelect(content);
    toast({
      title: "Template Applied",
      description: "Template content has been applied to the response field",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'product_quality': return 'bg-green-100 text-green-800';
      case 'payment_problems': return 'bg-red-100 text-red-800';
      case 'delivery_issues': return 'bg-blue-100 text-blue-800';
      case 'feature_request': return 'bg-purple-100 text-purple-800';
      case 'user_interface': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Response Templates</h3>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingTemplate(null);
            setNewTemplate({ title: '', content: '', category: '', tags: '' });
          }
        }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Template Title</label>
                <Input
                  placeholder="e.g., Product Quality Issue - Resolved"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Input
                  placeholder="e.g., product_quality, payment_problems"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                <Input
                  placeholder="e.g., resolved, quality, apology"
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Template Content</label>
                <Textarea
                  placeholder="Enter the response template content..."
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
                >
                  {editingTemplate ? 'Update' : 'Create'} Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-sm">{template.title}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(template.category)} variant="secondary">
                      {template.category.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTemplateSelect(template.content)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditTemplate(template)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                {template.content}
              </p>
              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};