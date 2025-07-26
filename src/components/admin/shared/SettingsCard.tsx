
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, RefreshCw } from 'lucide-react';

interface SettingsCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onSave: () => void;
  onReset: () => void;
  isLoading?: boolean;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  title,
  icon,
  children,
  onSave,
  onReset,
  isLoading = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
        <div className="flex space-x-4">
          <Button onClick={onSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
