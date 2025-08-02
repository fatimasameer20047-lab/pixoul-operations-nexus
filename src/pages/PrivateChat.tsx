const PrivateChat = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="cyber-border bg-card rounded-xl p-8">
          <h1 className="font-orbitron font-bold text-3xl neon-text mb-6">
            Private Chat
          </h1>
          <div className="space-y-6">
            <p className="text-muted-foreground font-exo text-lg">
              Secure communication platform for staff collaboration and management discussions.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-primary mb-3">Team Channels</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Organized chat rooms for different departments and shifts.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-secondary mb-3">Direct Messages</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Private one-on-one conversations with colleagues and supervisors.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-accent mb-3">File Sharing</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Secure document and media sharing for work-related content.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-destructive mb-3">Emergency Alerts</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Instant notifications for urgent situations and critical updates.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-8">
              <p className="text-accent font-exo">💬 Coming soon: Real-time encrypted messaging system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;