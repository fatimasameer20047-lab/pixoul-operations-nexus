import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
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
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/lost-found" element={<LostFound />} />
          <Route path="/maintenance" element={<MaintenanceReports />} />
          <Route path="/troubleshoot" element={<TroubleshootAssistant />} />
          <Route path="/scheduling" element={<StaffScheduling />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/chat" element={<PrivateChat />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
