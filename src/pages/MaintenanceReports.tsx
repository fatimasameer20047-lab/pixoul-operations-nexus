const MaintenanceReports = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="cyber-border bg-card rounded-xl p-8">
          <h1 className="font-orbitron font-bold text-3xl neon-text mb-6">
            Maintenance Reports
          </h1>
          <div className="space-y-6">
            <p className="text-muted-foreground font-exo text-lg">
              Report and track equipment issues, schedule maintenance, and monitor VR system health.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-primary mb-3">Report Issue</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Submit new equipment problems or maintenance requests.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-secondary mb-3">Track Status</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Monitor ongoing maintenance and repair progress.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-accent mb-3">Equipment Health</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  View system diagnostics and performance metrics.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-8">
              <p className="text-accent font-exo">🔧 Coming soon: Comprehensive maintenance tracking system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceReports;