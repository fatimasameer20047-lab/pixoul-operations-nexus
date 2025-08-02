import { useState } from 'react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { BackButton } from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Search, FileText } from 'lucide-react';

type ViewMode = 'overview' | 'diagnostics' | 'guides' | 'knowledge' | 'emergency';

const TroubleshootAssistant = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');

  const diagnosticResults = [
    { system: 'VR Headset Connection', status: 'OK', message: 'All headsets responding normally' },
    { system: 'Network Connectivity', status: 'Warning', message: 'Slow response from VR Room 2' },
    { system: 'Audio Systems', status: 'OK', message: 'Audio levels optimal' },
    { system: 'PC Performance', status: 'Error', message: 'Station 3 showing high CPU usage' },
    { system: 'Software Updates', status: 'OK', message: 'All systems up to date' }
  ];

  const troubleshootingGuides = [
    {
      title: 'VR Headset Not Tracking',
      steps: ['Check lighthouse positioning', 'Verify USB connections', 'Restart SteamVR', 'Recalibrate play area'],
      difficulty: 'Beginner'
    },
    {
      title: 'Audio Not Working in VR',
      steps: ['Check audio output device', 'Verify VR audio settings', 'Test with different headset', 'Restart audio service'],
      difficulty: 'Beginner'
    },
    {
      title: 'Frame Rate Issues',
      steps: ['Check GPU temperature', 'Close unnecessary applications', 'Lower VR graphics settings', 'Update graphics drivers'],
      difficulty: 'Intermediate'
    },
    {
      title: 'Controller Connectivity Problems',
      steps: ['Replace controller batteries', 'Re-pair controllers', 'Check for interference', 'Update controller firmware'],
      difficulty: 'Beginner'
    }
  ];

  const knowledgeBase = [
    {
      title: 'Daily Maintenance Checklist',
      category: 'Maintenance',
      content: 'Complete daily checks for all VR equipment including cleaning, calibration, and system updates.'
    },
    {
      title: 'Customer Complaint Handling',
      category: 'Customer Service',
      content: 'Best practices for handling technical issues during customer sessions.'
    },
    {
      title: 'Emergency Shutdown Procedures',
      category: 'Safety',
      content: 'Step-by-step guide for safely shutting down all systems in emergency situations.'
    },
    {
      title: 'Software Troubleshooting',
      category: 'Technical',
      content: 'Common software issues and their solutions for VR applications.'
    }
  ];

  const emergencyProtocols = [
    {
      priority: 'Critical',
      title: 'Power Outage',
      steps: ['Ensure customer safety', 'Activate emergency lighting', 'Save all progress', 'Contact facilities management']
    },
    {
      priority: 'High',
      title: 'Equipment Fire',
      steps: ['Evacuate customers immediately', 'Use appropriate fire extinguisher', 'Call emergency services', 'Document incident']
    },
    {
      priority: 'Medium',
      title: 'System-Wide Crash',
      steps: ['Check network connectivity', 'Restart affected systems', 'Switch to backup equipment', 'Contact IT support']
    },
    {
      priority: 'Low',
      title: 'Customer Injury',
      steps: ['Assess injury severity', 'Provide first aid if trained', 'Document incident', 'Contact management']
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground text-lg">
        AI-powered troubleshooting guide for common VR equipment and software issues.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('diagnostics')}
        >
          <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
            <CheckCircle size={20} />
            Quick Diagnostics
          </h3>
          <p className="text-sm text-muted-foreground">
            Automated system checks and common problem detection.
          </p>
        </div>
        
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('guides')}
        >
          <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
            <FileText size={20} />
            Step-by-Step Guides
          </h3>
          <p className="text-sm text-muted-foreground">
            Interactive troubleshooting workflows for complex issues.
          </p>
        </div>
        
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('knowledge')}
        >
          <h3 className="font-semibold text-accent mb-3 flex items-center gap-2">
            <Search size={20} />
            Knowledge Base
          </h3>
          <p className="text-sm text-muted-foreground">
            Searchable database of solutions and best practices.
          </p>
        </div>
        
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('emergency')}
        >
          <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
            <AlertTriangle size={20} />
            Emergency Protocols
          </h3>
          <p className="text-sm text-muted-foreground">
            Critical system failure procedures and escalation paths.
          </p>
        </div>
      </div>
    </div>
  );

  const renderDiagnostics = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-semibold text-xl">Quick Diagnostics</h2>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-primary">System Status</h3>
        
        {diagnosticResults.map((result, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{result.system}</h4>
                  <p className="text-sm text-muted-foreground">{result.message}</p>
                </div>
                <Badge 
                  variant={
                    result.status === 'OK' ? 'secondary' : 
                    result.status === 'Warning' ? 'default' : 
                    'destructive'
                  }
                >
                  {result.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderGuides = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-semibold text-xl">Step-by-Step Guides</h2>
      </div>
      
      <div className="grid gap-4">
        {troubleshootingGuides.map((guide, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{guide.title}</CardTitle>
                <Badge variant="outline">{guide.difficulty}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {guide.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-sm">{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderKnowledge = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-semibold text-xl">Knowledge Base</h2>
      </div>
      
      <div className="grid gap-4">
        {knowledgeBase.map((article, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{article.title}</CardTitle>
                <Badge variant="outline">{article.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{article.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderEmergency = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-semibold text-xl">Emergency Protocols</h2>
      </div>
      
      <div className="grid gap-4">
        {emergencyProtocols.map((protocol, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{protocol.title}</CardTitle>
                <Badge 
                  variant={
                    protocol.priority === 'Critical' ? 'destructive' : 
                    protocol.priority === 'High' ? 'default' : 
                    protocol.priority === 'Medium' ? 'secondary' : 
                    'outline'
                  }
                >
                  {protocol.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {protocol.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="text-sm">{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="cyber-border bg-card rounded-xl p-8">
            {currentView === 'overview' && (
              <>
                <BackButton className="mb-6" />
                <h1 className="font-bold text-3xl mb-6">
                  Troubleshoot Assistant
                </h1>
                {renderOverview()}
              </>
            )}
            {currentView === 'diagnostics' && renderDiagnostics()}
            {currentView === 'guides' && renderGuides()}
            {currentView === 'knowledge' && renderKnowledge()}
            {currentView === 'emergency' && renderEmergency()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TroubleshootAssistant;