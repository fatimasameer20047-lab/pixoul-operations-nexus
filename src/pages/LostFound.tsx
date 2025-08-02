const LostFound = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="cyber-border bg-card rounded-xl p-8">
          <h1 className="font-orbitron font-bold text-3xl neon-text mb-6">
            Lost & Found System
          </h1>
          <div className="space-y-6">
            <p className="text-muted-foreground font-exo text-lg">
              Manage lost and found items from the VR arcade. Track, log, and reunite items with their owners.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-primary mb-3">Report Lost Item</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Quick form to log new lost items found on premises.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-secondary mb-3">Search Database</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Search existing lost items by description, date, or location.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-8">
              <p className="text-accent font-exo">🔧 Coming soon: Full lost & found management system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostFound;