import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Star } from 'lucide-react';
import FeedbackSubmissionModal from './FeedbackSubmissionModal';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeedbackSectionProps {
  userType: 'buyer' | 'farmer';
}

const FeedbackSection = ({ userType }: FeedbackSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t('feedback.title')}</h2>
        <p className="text-muted-foreground">
          Help us improve your experience by sharing your feedback
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              {t('feedback.submit')}
            </CardTitle>
            <CardDescription>
              Share your thoughts and suggestions to help us improve our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {t('feedback.submit')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              {t('feedback.rate')}
            </CardTitle>
            <CardDescription>
              Your ratings help other users and improve our services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={() => setIsModalOpen(true)}>
              <Star className="h-4 w-4 mr-2" />
              {t('feedback.rate')}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Categories</CardTitle>
          <CardDescription>What would you like to share feedback about?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: 'Product Quality', icon: '🌟' },
              { label: 'User Interface', icon: '🎨' },
              { label: 'Feature Request', icon: '💡' },
              { label: 'Technical Issue', icon: '🐛' },
              { label: 'General Feedback', icon: '💬' },
              { label: 'Other', icon: '❓' }
            ].map((category) => (
              <Button
                key={category.label}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-primary/5"
                onClick={() => setIsModalOpen(true)}
              >
                <span className="text-2xl">{category.icon}</span>
                <span className="text-sm">{category.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <FeedbackSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userType={userType}
      />
    </div>
  );
};

export default FeedbackSection;