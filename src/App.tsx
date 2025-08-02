
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import FarmerDashboard from "./components/farmer/FarmerDashboard";
import BuyerAnonymousDashboard from "./components/buyer/BuyerAnonymousDashboard";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./components/admin/AdminDashboard";
import AdminProductsPage from "./components/admin/AdminProductsPage";
import AdminOrdersPage from "./components/admin/AdminOrdersPage";
import AdminPaymentsPage from "./components/admin/AdminPaymentsPage";
import AdminCollectionsPage from "./components/admin/AdminCollections";
import EnhancedNotificationSystem from "./components/admin/EnhancedNotificationSystem";
import AdminUserManagement from "./components/admin/AdminUserManagement";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import AdminSettings from "./components/admin/AdminSettings";
import AdminFeedbackManagement from "./components/admin/AdminFeedbackManagement";
import { AdminErrorBoundary } from "./components/admin/AdminErrorBoundary";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

// Enhanced React Query client configuration for maximum performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000, // 10 minutes - longer cache for better performance
      gcTime: 15 * 60 * 1000, // 15 minutes cache time
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false, // Reduce unnecessary refetches
      refetchInterval: false,
      refetchIntervalInBackground: false,
    },
    mutations: {
      retry: 1,
      gcTime: 0,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected dashboard routes */}
              <Route path="/farmer-dashboard" element={
                <ProtectedRoute allowedRoles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/buyer-dashboard" element={
                <ProtectedRoute allowedRoles={['buyer']}>
                  <BuyerAnonymousDashboard />
                </ProtectedRoute>
              } />
              
              {/* Admin dashboard with nested routes */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminErrorBoundary>
                    <AdminLayout />
                  </AdminErrorBoundary>
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="payments" element={<AdminPaymentsPage />} />
                <Route path="collections" element={<AdminCollectionsPage />} />
                <Route path="users" element={<AdminUserManagement />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="notifications" element={<EnhancedNotificationSystem />} />
                <Route path="communications" element={<EnhancedNotificationSystem />} />
                <Route path="feedback" element={<AdminFeedbackManagement />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              {/* Catch-all route for 404 - MUST BE LAST */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
