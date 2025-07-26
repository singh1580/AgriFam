
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  Mail, 
  Phone,
  Calendar,
  MoreHorizontal,
  Download,
  Shield
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ResponsiveStatsCard from '@/components/ui/responsive-stats-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import UserProfileModal from './modals/UserProfileModal';
import SendMessageModal from './modals/SendMessageModal';
import UserActivityModal from './modals/UserActivityModal';
import SuspendAccountModal from './modals/SuspendAccountModal';
import { generateUserReportPDF } from '@/utils/pdfExport';

const AdminUserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  // Modal states
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');

  // Fetch all profiles with better error handling
  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['admin-profiles'],
    queryFn: async () => {
      console.log('Fetching admin profiles...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      console.log('Fetched profiles:', data);
      return data || [];
    },
    staleTime: 300000,
  });

  // Calculate user counts with proper filtering
  const farmers = profiles?.filter(p => p.role === 'farmer') || [];
  const buyers = profiles?.filter(p => p.role === 'buyer') || [];
  const admins = profiles?.filter(p => p.role === 'admin') || [];
  const totalUsers = profiles?.length || 0;

  const userStats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      gradient: 'from-blue-50 to-blue-100',
    },
    {
      title: 'Active Farmers',
      value: farmers.length,
      icon: UserCheck,
      gradient: 'from-green-50 to-green-100',
    },
    {
      title: 'Active Buyers',
      value: buyers.length,
      icon: UserCheck,
      gradient: 'from-purple-50 to-purple-100',
    },
    {
      title: 'Admin Users',
      value: admins.length,
      icon: Shield,
      gradient: 'from-orange-50 to-orange-100',
    },
  ];

  const filteredProfiles = profiles?.filter(profile => {
    const matchesSearch = profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || profile.role === activeTab;
    return matchesSearch && matchesTab;
  }) || [];

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

  const handleExportUsers = (roleFilter = 'all') => {
    if (!profiles || profiles.length === 0) {
      toast({
        title: "No Data",
        description: "No users found to export.",
        variant: "destructive"
      });
      return;
    }

    let filteredData = profiles;
    if (roleFilter !== 'all') {
      filteredData = profiles.filter(p => p.role === roleFilter);
    }

    if (filteredData.length === 0) {
      toast({
        title: "No Data",
        description: `No ${roleFilter} users found to export.`,
        variant: "destructive"
      });
      return;
    }

    generateUserReportPDF(filteredData, roleFilter);
    toast({
      title: "Export Started",
      description: `${roleFilter === 'all' ? 'All users' : roleFilter} report is being prepared for download...`,
    });
  };

  const handleViewProfile = (profile: any) => {
    setSelectedProfile(profile);
    setProfileModalOpen(true);
  };

  const handleSendMessage = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setMessageModalOpen(true);
  };

  const handleViewActivity = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setActivityModalOpen(true);
  };

  const handleGenerateReport = (userId: string, userName: string) => {
    // Create a detailed user report
    const user = profiles?.find(p => p.id === userId);
    if (!user) return;
    
    const reportContent = `
User Report - ${userName}
Generated on: ${new Date().toLocaleString()}
===================================

Profile Information:
- Name: ${user.full_name || 'N/A'}
- Email: ${user.email}
- Role: ${user.role}
- Phone: ${user.phone || 'N/A'}
- Account Created: ${format(new Date(user.created_at), 'PPP')}
- Last Updated: ${format(new Date(user.updated_at), 'PPP')}
- User ID: ${user.id}

Account Status: Active
===================================
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `user_report_${userName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Generated",
      description: `Comprehensive report for ${userName} has been downloaded.`,
    });
  };

  const handleSuspendAccount = (userId: string, userName: string) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setSuspendModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 p-6">
        <Card className="border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading user data: {error.message}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage farmers, buyers, and admin accounts ({totalUsers} total users)
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-white/70 backdrop-blur-sm border-white/30">
                <Download className="h-4 w-4 mr-2" />
                Export Users
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/95 backdrop-blur-md border border-white/20">
              <DropdownMenuItem onClick={() => handleExportUsers('all')}>
                Export All Users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportUsers('farmer')}>
                Export Farmers Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportUsers('buyer')}>
                Export Buyers Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportUsers('admin')}>
                Export Admins Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {userStats.map((stat) => (
          <ResponsiveStatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            gradient={stat.gradient}
          />
        ))}
      </div>

      {/* User Management Interface */}
      <Card className="bg-gradient-to-br from-white/80 via-white/90 to-white/80 backdrop-blur-xl border border-white/20 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>All Users</span>
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 bg-white/50 backdrop-blur-sm border-white/30"
                />
              </div>
              <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm border-white/30">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/50 backdrop-blur-sm border border-white/20">
              <TabsTrigger value="all" className="data-[state=active]:bg-white/80">All ({totalUsers})</TabsTrigger>
              <TabsTrigger value="farmer" className="data-[state=active]:bg-white/80">Farmers ({farmers.length})</TabsTrigger>
              <TabsTrigger value="buyer" className="data-[state=active]:bg-white/80">Buyers ({buyers.length})</TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-white/80">Admins ({admins.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredProfiles.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {searchTerm ? 'No users found matching your search' : 'No users found'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProfiles.map((profile) => (
                    <Card key={profile.id} className="bg-gradient-to-br from-white/60 to-white/80 backdrop-blur-sm border border-white/30 shadow-md hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {getUserInitials(profile.full_name || '', profile.email)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-foreground">
                                  {profile.full_name || 'Unknown User'}
                                </h3>
                                <Badge className={`${getRoleColor(profile.role)} border shadow-sm`}>
                                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                                </Badge>
                              </div>
                              
                              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-1">
                                  <Mail className="h-3 w-3" />
                                  <span>{profile.email}</span>
                                </div>
                                {profile.phone && (
                                  <div className="flex items-center space-x-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{profile.phone}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Joined {format(new Date(profile.created_at), 'MMM dd, yyyy')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewProfile(profile)}
                              className="bg-white/70 backdrop-blur-sm border-white/40 hover:bg-white/90"
                            >
                              View Profile
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="bg-white/70 backdrop-blur-sm border-white/40">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border border-white/20">
                                <DropdownMenuItem onClick={() => handleSendMessage(profile.id, profile.full_name || profile.email)}>
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewActivity(profile.id, profile.full_name || profile.email)}>
                                  View Activity
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleGenerateReport(profile.id, profile.full_name || profile.email)}>
                                  Generate Report
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleSuspendAccount(profile.id, profile.full_name || profile.email)}
                                >
                                  Suspend Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        </Card>
      
      {/* Modals */}
      <UserProfileModal
        profile={selectedProfile}
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
      
      <SendMessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        userId={selectedUserId}
        userName={selectedUserName}
      />
      
      <UserActivityModal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        userId={selectedUserId}
        userName={selectedUserName}
      />
      
      <SuspendAccountModal
        isOpen={suspendModalOpen}
        onClose={() => setSuspendModalOpen(false)}
        userId={selectedUserId}
        userName={selectedUserName}
      />
    </div>
  );
};

export default AdminUserManagement;
