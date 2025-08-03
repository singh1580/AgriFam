import React, { memo, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, CheckCircle, Clock, AlertCircle, Eye, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Optimized Product Status Card with proper memoization
interface OptimizedProductCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    quantity: string;
    submittedPrice: string;
    quality: string;
    status: string;
    submittedDate: string;
    expectedPayment: string;
    collectionDate?: string;
    adminNotes?: string;
  };
  onViewDetails?: (product: any) => void;
}

export const OptimizedProductCard = memo(({ product, onViewDetails }: OptimizedProductCardProps) => {
  const { t } = useLanguage();
  
  const statusConfig = useMemo(() => {
    switch (product.status) {
      case 'approved':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle };
      case 'pending review':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle };
      case 'scheduled collection':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Calendar };
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: Package };
    }
  }, [product.status]);

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(product);
  }, [product, onViewDetails]);

  const StatusIcon = statusConfig.icon;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold text-foreground">
              {product.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <Badge className={statusConfig.color}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {product.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">{t('products.quantity')}</p>
            <p className="font-medium">{product.quantity}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('products.price')}</p>
            <p className="font-medium text-primary">{product.submittedPrice}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('products.quality')}</p>
            <p className="font-medium">{product.quality}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('products.expectedPayment')}</p>
            <p className="font-medium text-green-600">{product.expectedPayment}</p>
          </div>
        </div>
        
        {product.collectionDate && (
          <div className="bg-muted/50 p-2 rounded-lg">
            <p className="text-xs text-muted-foreground">{t('products.collectionDate')}</p>
            <p className="text-sm font-medium">{product.collectionDate}</p>
          </div>
        )}
        
        {product.adminNotes && (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-2 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">{t('products.adminNotes')}</p>
            <p className="text-sm">{product.adminNotes}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-muted-foreground">
            {t('products.submitted')}: {product.submittedDate}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewDetails}
            className="hover:bg-primary/10"
          >
            <Eye className="w-3 h-3 mr-1" />
            {t('common.view')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedProductCard.displayName = 'OptimizedProductCard';

// Optimized Stats Card with proper memoization
interface OptimizedStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<any>;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

export const OptimizedStatsCard = memo(({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  className 
}: OptimizedStatsCardProps) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {change && (
              <p className={`text-xs ${change.positive ? 'text-green-600' : 'text-red-600'}`}>
                {change.positive ? '+' : ''}{change.value}
              </p>
            )}
          </div>
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedStatsCard.displayName = 'OptimizedStatsCard';