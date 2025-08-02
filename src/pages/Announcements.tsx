import { NavigationHeader } from '@/components/NavigationHeader';
import { BackButton } from '@/components/BackButton';

const Announcements = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="cyber-border bg-card rounded-xl p-8">
            <BackButton className="mb-6" />
            <h1 className="font-bold text-3xl mb-6">
              Important Announcements
            </h1>
            <div className="space-y-6">
              <p className="text-muted-foreground text-lg">
                Stay updated with critical information, policy changes, and important notices for staff.
              </p>
              
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-6 border-l-4 border-primary">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-primary">System Update Notice</h3>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    VR system maintenance scheduled for Sunday 3AM-5AM. All stations will be offline during this window.
                  </p>
                </div>
                
                <div className="bg-muted rounded-lg p-6 border-l-4 border-secondary">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-secondary">New Safety Protocol</h3>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Updated emergency procedures for VR equipment malfunctions. Please review the new guidelines.
                  </p>
                </div>
                
                <div className="bg-muted rounded-lg p-6 border-l-4 border-accent">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-accent">Staff Recognition</h3>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Congratulations to Team Alpha for achieving 99.2% customer satisfaction this month!
                  </p>
                </div>
              </div>
              
              <div className="text-center pt-8">
                <p className="text-accent">📢 Coming soon: Real-time notification system</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
