import { StaffCard } from "@/components/StaffCard";
import { NavigationHeader } from "@/components/NavigationHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-orbitron font-bold text-5xl neon-text mb-4">
            Pixoul Staff Hub
          </h1>
          <p className="font-exo text-xl text-muted-foreground">
            Your Central Dashboard for Staff Operations
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <StaffCard
            title="Lost & Found"
            description="Manage lost items from the VR arcade. Track, log, and reunite items with their owners efficiently."
            icon="🔍"
            route="/lost-found"
            variant="primary"
          />
          
          <StaffCard
            title="Maintenance Reports"
            description="Report equipment issues, schedule maintenance, and monitor VR system health and performance."
            icon="🔧"
            route="/maintenance"
            variant="secondary"
          />
          
          <StaffCard
            title="Troubleshoot Assistant"
            description="AI-powered troubleshooting guide for common VR equipment and software issues."
            icon="🤖"
            route="/troubleshoot"
            variant="accent"
          />
          
          <StaffCard
            title="Staff Scheduling"
            description="Manage work schedules, shift assignments, and staff availability for optimal operations."
            icon="📅"
            route="/scheduling"
            variant="primary"
          />
          
          <StaffCard
            title="Important Announcements"
            description="Stay updated with critical information, policy changes, and important notices for staff."
            icon="📢"
            route="/announcements"
            variant="destructive"
          />
          
          <StaffCard
            title="Private Chat"
            description="Secure communication platform for staff collaboration and management discussions."
            icon="💬"
            route="/chat"
            variant="secondary"
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
