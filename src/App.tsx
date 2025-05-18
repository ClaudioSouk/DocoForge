
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProposalGenerator from "./pages/Proposals";
import OnboardingEmailGenerator from "./pages/Onboarding";
import InvoiceGenerator from "./pages/Invoices";
import Subscription from "./pages/Subscription";
import AdminDashboard from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ReactMarkdown from 'react-markdown';

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // In a real app, you would check for an admin role
  // For this demo, we'll use a hardcoded email
  if (!user || user.email !== "admin@example.com") {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/proposals" 
      element={
        <ProtectedRoute>
          <ProposalGenerator />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/onboarding" 
      element={
        <ProtectedRoute>
          <OnboardingEmailGenerator />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/invoices" 
      element={
        <ProtectedRoute>
          <InvoiceGenerator />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/subscription" 
      element={
        <ProtectedRoute>
          <Subscription />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/admin" 
      element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } 
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
