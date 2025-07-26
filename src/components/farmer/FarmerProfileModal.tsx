
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Calendar, Save, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FarmerProfileModal = ({ isOpen, onClose }: FarmerProfileModalProps) => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const result = await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
      });

      if (result.error) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center space-x-3 text-2xl font-bold bg-gradient-to-r from-crop-green via-emerald-600 to-teal-700 bg-clip-text text-transparent">
            <div className="p-2 rounded-xl bg-gradient-to-br from-crop-green/20 to-emerald-200 backdrop-blur-sm">
              <User className="h-6 w-6 text-crop-green" />
            </div>
            <span>Farmer Profile</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Overview */}
          <Card className="bg-gradient-to-br from-white/80 to-gray-50/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name" className="text-gray-700 font-medium">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="Enter your full name"
                      className="mt-2 bg-white/70 backdrop-blur-sm border-gray-200 focus:border-crop-green"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 mt-2 p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                      <User className="h-4 w-4 text-crop-green" />
                      <span className="text-gray-800">{profile?.full_name || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <div className="flex items-center space-x-2 mt-2 p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <Mail className="h-4 w-4 text-crop-green" />
                    <span className="text-gray-800">{user?.email}</span>
                    <Badge variant="secondary" className="ml-auto bg-crop-green/20 text-crop-green border-0">
                      Verified
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className="mt-2 bg-white/70 backdrop-blur-sm border-gray-200 focus:border-crop-green"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 mt-2 p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                      <Phone className="h-4 w-4 text-crop-green" />
                      <span className="text-gray-800">{profile?.phone || 'Not set'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="role" className="text-gray-700 font-medium">Role</Label>
                  <div className="flex items-center space-x-2 mt-2 p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                    <Badge className="bg-gradient-to-r from-crop-green to-emerald-600 text-white border-0 shadow-md">
                      Farmer
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Details */}
          <Card className="bg-gradient-to-br from-white/80 to-gray-50/60 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-gray-800">Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg backdrop-blur-sm">
                <Calendar className="h-4 w-4 text-crop-green" />
                <span className="text-sm text-gray-700">
                  Member since {new Date(profile?.created_at || '').toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  disabled={isSaving}
                  className="bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-gray-50/80"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-crop-green to-emerald-600 hover:from-crop-green/90 hover:to-emerald-600/90 text-white border-0 shadow-lg"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-crop-green to-emerald-600 hover:from-crop-green/90 hover:to-emerald-600/90 text-white border-0 shadow-lg"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FarmerProfileModal;
