
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Truck, DollarSign, CheckCircle, Clock, User, Package } from 'lucide-react';
import GradientCard from '@/components/ui/gradient-card';
import InteractiveButton from '@/components/ui/interactive-button';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useCollections, useCollectionStats } from '@/hooks/useCollections';
import { useStartCollection, useCompleteCollection, useProcessPayment } from '@/hooks/useCollectionMutations';
import { useAggregatedProductsInventory } from '@/hooks/useAggregatedProductsInventory';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';
import { Check } from 'lucide-react';
import AggregatedProductsView from './AggregatedProductsView';

const AdminCollections = () => {
  const { data: collections = [], isLoading: collectionsLoading, error: collectionsError } = useCollections();
  const { data: stats, isLoading: statsLoading } = useCollectionStats();
  const { data: inventoryStats } = useAggregatedProductsInventory();
  const [showProductsView, setShowProductsView] = useState(false);
  
  const startCollectionMutation = useStartCollection();
  const completeCollectionMutation = useCompleteCollection();
  const processPaymentMutation = useProcessPayment();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-harvest-yellow/10 text-harvest-yellow border-harvest-yellow/30';
      case 'scheduled_collection': return 'bg-harvest-yellow/10 text-harvest-yellow border-harvest-yellow/30';
      case 'collected': return 'bg-crop-green/10 text-crop-green border-crop-green/30';
      case 'payment_processed': return 'bg-green-500/10 text-green-600 border-green-500/30';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'scheduled_collection': return <Calendar className="h-4 w-4" />;
      case 'collected': return <CheckCircle className="h-4 w-4" />;
      case 'payment_processed': return <DollarSign className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Scheduled';
      case 'scheduled_collection': return 'Scheduled';
      case 'collected': return 'Collected';
      case 'payment_processed': return 'Payment Complete';
      default: return status;
    }
  };

  const handleStartCollection = (collectionId: string) => {
    startCollectionMutation.mutate(collectionId);
  };

  const handleCompleteCollection = (collectionId: string) => {
    completeCollectionMutation.mutate({
      productId: collectionId,
      notes: 'Collection completed successfully',
      qualityGrade: 'A'
    });
  };

  const handleProcessPayment = (collectionId: string) => {
    processPaymentMutation.mutate(collectionId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (showProductsView) {
    return (
      <AggregatedProductsView onBack={() => setShowProductsView(false)} />
    );
  }

  if (collectionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" variant="agricultural" />
      </div>
    );
  }

  if (collectionsError) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">Error loading collections: {collectionsError.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Collection Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <ResponsiveStatsCard
          title="Today's Collections"
          value={statsLoading ? 0 : stats?.todaysCollections || 0}
          icon={Calendar}
          gradient="from-harvest-yellow/10 to-harvest-sunshine/5"
        />
        
        <ResponsiveStatsCard
          title="In Progress"
          value={statsLoading ? 0 : stats?.inProgress || 0}
          icon={Clock}
          gradient="from-sky-blue/10 to-sky-deep/5"
        />
        
        <ResponsiveStatsCard
          title="Total Value"
          value={statsLoading ? 0 : (stats?.totalValue || 0)}
          prefix="₹"
          icon={DollarSign}
          gradient="from-crop-green/10 to-crop-field/5"
        />
        
        <ResponsiveStatsCard
          title="Paid Today"
          value={statsLoading ? 0 : (stats?.paidToday || 0)}
          prefix="₹"
          icon={Check}
          gradient="from-green-500/10 to-green-600/5"
        />

        <div 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setShowProductsView(true)}
        >
          <ResponsiveStatsCard
            title="Products Available"
            value={inventoryStats?.totalProducts || 0}
            icon={Package}
            gradient="from-purple-500/10 to-purple-600/5"
          />
        </div>
      </div>

      {/* Farmer Collection Schedule & Management */}
      <GradientCard gradient="from-white to-crop-green/5">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-crop-green" />
            <span>Farmer Collection Schedule & Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {collections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No farmer collections scheduled at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {collections.map((collection) => (
                <div key={collection.id} className="bg-white rounded-xl p-6 border border-border/10 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-3">
                      {/* Header Info */}
                      <div className="flex items-center space-x-4">
                        <h4 className="font-bold text-lg">{collection.productName}</h4>
                        <Badge variant="outline" className={getStatusColor(collection.status)}>
                          {getStatusIcon(collection.status)}
                          <span className="ml-1">{getStatusText(collection.status)}</span>
                        </Badge>
                        {collection.qualityGrade && (
                          <Badge variant="outline" className="border-crop-green/30 text-crop-green">
                            Grade {collection.qualityGrade}
                          </Badge>
                        )}
                      </div>

                      {/* Farmer & Location Info */}
                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{collection.farmerName} ({collection.farmerId.slice(0, 8)})</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{collection.location}</span>
                        </div>
                      </div>

                      {/* Schedule & Quantity Info */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-sky-blue" />
                          <span>{collection.scheduledDate} at {collection.scheduledTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">
                            Quantity: {collection.quantity} {collection.quantityUnit}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-crop-green" />
                          <span className="font-bold text-crop-green">
                            {formatCurrency(collection.estimatedValue)}
                          </span>
                        </div>
                      </div>

                      {/* Collection Notes */}
                      {collection.collectionNotes && (
                        <div className="bg-crop-green/5 rounded-lg p-3 text-sm">
                          <span className="font-medium text-crop-green">Notes: </span>
                          <span>{collection.collectionNotes}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      {(collection.status === 'approved' || collection.status === 'scheduled_collection') && (
                        <InteractiveButton
                          size="sm"
                          className="bg-gradient-to-r from-sky-blue to-sky-deep text-white"
                          onClick={() => handleStartCollection(collection.id)}
                          disabled={startCollectionMutation.isPending}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          {startCollectionMutation.isPending ? 'Starting...' : 'Start Collection'}
                        </InteractiveButton>
                      )}
                      {collection.status === 'scheduled_collection' && (
                        <InteractiveButton
                          size="sm"
                          className="bg-gradient-to-r from-crop-green to-crop-field"
                          onClick={() => handleCompleteCollection(collection.id)}
                          disabled={completeCollectionMutation.isPending}
                          glow
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {completeCollectionMutation.isPending ? 'Completing...' : 'Complete Collection'}
                        </InteractiveButton>
                      )}
                      {collection.status === 'collected' && (
                        <InteractiveButton
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white"
                          onClick={() => handleProcessPayment(collection.id)}
                          disabled={processPaymentMutation.isPending}
                          glow
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          {processPaymentMutation.isPending ? 'Processing...' : 'Process Payment'}
                        </InteractiveButton>
                      )}
                      {collection.status === 'payment_processed' && (
                        <Badge className="bg-green-500 text-white">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Payment Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </GradientCard>
    </div>
  );
};

export default AdminCollections;
