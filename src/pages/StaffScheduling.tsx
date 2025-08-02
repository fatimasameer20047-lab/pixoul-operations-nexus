const StaffScheduling = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="cyber-border bg-card rounded-xl p-8">
          <h1 className="font-orbitron font-bold text-3xl neon-text mb-6">
            Staff Scheduling
          </h1>
          <div className="space-y-6">
            <p className="text-muted-foreground font-exo text-lg">
              Manage work schedules, shift assignments, and staff availability for optimal arcade operations.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-primary mb-3">Weekly Schedule</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  View and manage the current week's staff assignments.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-secondary mb-3">Shift Swapping</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Enable staff to request and approve shift exchanges.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-accent mb-3">Availability</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Submit availability preferences and time-off requests.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-destructive mb-3">Coverage Alerts</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Real-time notifications for understaffing or urgent coverage needs.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-8">
              <p className="text-accent font-exo">📅 Coming soon: Smart scheduling with AI optimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffScheduling;