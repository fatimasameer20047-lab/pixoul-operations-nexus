import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import LostFound from "./pages/LostFound";
import MaintenanceReports from "./pages/MaintenanceReports";
import TroubleshootAssistant from "./pages/TroubleshootAssistant";
import StaffScheduling from "./pages/StaffScheduling";
import Announcements from "./pages/Announcements";
import PrivateChat from "./pages/PrivateChat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/lost-found" element={<ProtectedRoute><LostFound /></ProtectedRoute>} />
            <Route path="/maintenance" element={<ProtectedRoute><MaintenanceReports /></ProtectedRoute>} />
            <Route path="/troubleshoot" element={<ProtectedRoute><TroubleshootAssistant /></ProtectedRoute>} />
            <Route path="/scheduling" element={<ProtectedRoute><StaffScheduling /></ProtectedRoute>} />
            <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
            <Route path="/private-chat" element={<ProtectedRoute><PrivateChat /></ProtectedRoute>} />
            <Route path="/staff-scheduling" element={<ProtectedRoute><StaffScheduling /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute><PrivateChat /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
