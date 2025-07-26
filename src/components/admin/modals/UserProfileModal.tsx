
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, Calendar, User, MapPin, FileText, Building } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: 'farmer' | 'buyer' | 'admin';
  created_at: string;
  updated_at: string;
}

interface UserProfileModalProps {
  profile: Profile | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileModal = ({ profile, isOpen, onClose }: UserProfileModalProps) => {
  const [farmerProfile, setFarmerProfile] = useState<any>(null);
  const [buyerProfile, setBuyerProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchExtendedProfile = async () => {
    if (!profile || !isOpen) return;
    
    setIsLoading(true);
    try {
      if (profile.role === 'farmer') {
        const { data, error } = await supabase
          .from('farmer_profiles')
          .select('*')
          .eq('id', profile.id)
          .single();
        
        if (!error && data) {
          setFarmerProfile(data);
        }
      } else if (profile.role === 'buyer') {
        const { data, error } = await supabase
          .from('buyer_profiles')
          .select('*')
          .eq('id', profile.id)
          .single();
        
        if (!error && data) {
          setBuyerProfile(data);
        }
      }
    } catch (error) {
      console.error('Error fetching extended profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExtendedProfile();
  }, [profile, isOpen]);

  if (!profile) return null;

  const getUserInitials = (name: string, email: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return email.charAt(0).toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'bg-green-100 text-green-800 border-green-200';
      case 'buyer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Profile Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                {getUserInitials(profile.full_name || '', profile.email)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{profile.full_name || 'Unknown User'}</h3>
              <Badge className={getRoleColor(profile.role)}>
                {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
              </div>
              {profile.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{profile.phone}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Role-specific Information */}
          {profile.role === 'farmer' && farmerProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Farm Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {farmerProfile.farm_location && (
                  <div>
                    <p className="text-sm font-medium">Farm Location</p>
                    <p className="text-sm text-muted-foreground">{farmerProfile.farm_location}</p>
                  </div>
                )}
                {farmerProfile.farm_size && (
                  <div>
                    <p className="text-sm font-medium">Farm Size</p>
                    <p className="text-sm text-muted-foreground">{farmerProfile.farm_size}</p>
                  </div>
                )}
                {farmerProfile.primary_crops && farmerProfile.primary_crops.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Primary Crops</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {farmerProfile.primary_crops.map((crop: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {profile.role === 'buyer' && buyerProfile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Business Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {buyerProfile.company_name && (
                  <div>
                    <p className="text-sm font-medium">Company Name</p>
                    <p className="text-sm text-muted-foreground">{buyerProfile.company_name}</p>
                  </div>
                )}
                {buyerProfile.business_type && (
                  <div>
                    <p className="text-sm font-medium">Business Type</p>
                    <p className="text-sm text-muted-foreground">{buyerProfile.business_type}</p>
                  </div>
                )}
                {buyerProfile.procurement_volume && (
                  <div>
                    <p className="text-sm font-medium">Procurement Volume</p>
                    <p className="text-sm text-muted-foreground">{buyerProfile.procurement_volume}</p>
                  </div>
                )}
                {buyerProfile.business_license && (
                  <div>
                    <p className="text-sm font-medium">Business License</p>
                    <p className="text-sm text-muted-foreground">{buyerProfile.business_license}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Joined</p>
                  <p className="text-sm">{format(new Date(profile.created_at), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                  <p className="text-sm">{format(new Date(profile.updated_at), 'PPP')}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="text-sm font-mono">{profile.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
