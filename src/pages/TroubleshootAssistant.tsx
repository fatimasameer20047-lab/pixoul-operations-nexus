const TroubleshootAssistant = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="cyber-border bg-card rounded-xl p-8">
          <h1 className="font-orbitron font-bold text-3xl neon-text mb-6">
            Troubleshoot Assistant
          </h1>
          <div className="space-y-6">
            <p className="text-muted-foreground font-exo text-lg">
              AI-powered troubleshooting guide for common VR equipment and software issues.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-primary mb-3">Quick Diagnostics</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Automated system checks and common problem detection.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-secondary mb-3">Step-by-Step Guides</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Interactive troubleshooting workflows for complex issues.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-accent mb-3">Knowledge Base</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Searchable database of solutions and best practices.
                </p>
              </div>
              
              <div className="bg-muted rounded-lg p-6">
                <h3 className="font-orbitron font-semibold text-destructive mb-3">Emergency Protocols</h3>
                <p className="text-sm text-muted-foreground font-exo">
                  Critical system failure procedures and escalation paths.
                </p>
              </div>
            </div>
            
            <div className="text-center pt-8">
              <p className="text-accent font-exo">🤖 Coming soon: AI-powered troubleshooting assistant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootAssistant;