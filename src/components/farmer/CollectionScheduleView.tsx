import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Truck, Calendar, MapPin, Package } from 'lucide-react';
import { format } from 'date-fns';

interface CollectionItem {
  id: string;
  product_name: string;
  quantity_available: number;
  quantity_unit: string;
  collection_date: string;
  location: string;
  status: string;
  admin_notes?: string;
}

const CollectionScheduleView = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchCollections = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('farmer_id', user.id)
        .in('status', ['scheduled_collection', 'collected'])
        .not('collection_date', 'is', null)
        .order('collection_date', { ascending: true });

      if (error) {
        console.error('Error fetching collections:', error);
      } else {
        // Map the database fields to match our interface
        const mappedCollections = data?.map(item => ({
          id: item.id,
          product_name: item.name, // Map 'name' from DB to 'product_name' for our interface
          quantity_available: item.quantity_available,
          quantity_unit: item.quantity_unit,
          collection_date: item.collection_date,
          location: item.location || '',
          status: item.status,
          admin_notes: item.admin_notes
        })) || [];
        
        setCollections(mappedCollections);
      }
      setLoading(false);
    };

    fetchCollections();

    // Set up real-time subscription
    const channel = supabase
      .channel('collection-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
          filter: `farmer_id=eq.${user.id}`
        },
        () => {
          fetchCollections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Truck className="h-5 w-5 text-sky-blue" />
          <span>Collection Schedule</span>
          <Badge variant="secondary">{collections.length} items</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {collections.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No collections scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-lg">{item.product_name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.quantity_available} {item.quantity_unit}
                    </p>
                  </div>
                  <Badge 
                    variant={item.status === 'collected' ? 'default' : 'secondary'}
                    className={item.status === 'collected' ? 'bg-green-500' : 'bg-sky-blue'}
                  >
                    {item.status === 'collected' ? 'Collected' : 'Scheduled'}
                  </Badge>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(new Date(item.collection_date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  {item.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>

                {item.admin_notes && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-sm">
                      <strong>Admin Notes:</strong> {item.admin_notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollectionScheduleView;
