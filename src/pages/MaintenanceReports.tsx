import { useState, useEffect } from 'react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { BackButton } from '@/components/BackButton';
import { MaintenanceReportForm } from '@/components/MaintenanceReportForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MaintenanceReport {
  id: string;
  device: string;
  room: string;
  description: string;
  image?: string;
  status: 'open' | 'in-progress' | 'resolved';
  created_at: string;
  reported_by: string;
}

type ViewMode = 'overview' | 'report' | 'status' | 'health';

const MaintenanceReports = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('overview');
  const [reports, setReports] = useState<MaintenanceReport[]>([]);

  useEffect(() => {
    const storedReports = localStorage.getItem('pixoul_maintenance_reports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, []);

  const refreshReports = () => {
    const storedReports = localStorage.getItem('pixoul_maintenance_reports');
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  };

  const mockDiagnostics = [
    { system: 'VR Room 1 - PC Station', status: 'OK', lastChecked: 'Today', details: 'All systems operational' },
    { system: 'VR Room 2 - Audio System', status: 'Warning', lastChecked: 'Today', details: 'Volume levels need adjustment' },
    { system: 'VR Room 3 - Lighting', status: 'OK', lastChecked: 'Yesterday', details: 'All lights functioning' },
    { system: 'Main Network', status: 'OK', lastChecked: 'Today', details: 'Stable connection, low latency' },
    { system: 'VR Headsets (All)', status: 'Maintenance', lastChecked: 'Today', details: '2 units need cleaning' }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground font-exo text-lg">
        Report and track equipment issues, schedule maintenance, and monitor VR system health.
      </p>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('report')}
        >
          <h3 className="font-orbitron font-semibold text-primary mb-3">Report Issue</h3>
          <p className="text-sm text-muted-foreground font-exo">
            Submit new equipment problems or maintenance requests.
          </p>
        </div>
        
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('status')}
        >
          <h3 className="font-orbitron font-semibold text-secondary mb-3">Track Status</h3>
          <p className="text-sm text-muted-foreground font-exo">
            Monitor ongoing maintenance and repair progress.
          </p>
        </div>
        
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('health')}
        >
          <h3 className="font-orbitron font-semibold text-accent mb-3">Equipment Health</h3>
          <p className="text-sm text-muted-foreground font-exo">
            View system diagnostics and performance metrics.
          </p>
        </div>
      </div>
    </div>
  );

  const renderReportForm = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-orbitron font-semibold text-xl">Report Equipment Issue</h2>
      </div>
      <MaintenanceReportForm onSuccess={() => {
        refreshReports();
        setCurrentView('overview');
      }} />
    </div>
  );

  const renderStatusTracking = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-orbitron font-semibold text-xl">Maintenance Status</h2>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-orbitron font-semibold text-lg text-primary">
          Recent Reports ({reports.length})
        </h3>
        
        {reports.length === 0 ? (
          <Card className="cyber-border">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground font-exo">No maintenance reports found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {reports.map((report) => (
              <Card key={report.id} className="cyber-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-orbitron font-semibold text-lg">
                        {report.device}
                      </h3>
                      <p className="text-sm text-muted-foreground font-exo">
                        Location: {report.room}
                      </p>
                      <p className="text-xs text-muted-foreground font-exo">
                        {new Date(report.created_at).toLocaleDateString()} by {report.reported_by}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        report.status === 'open' ? 'destructive' : 
                        report.status === 'in-progress' ? 'default' : 
                        'secondary'
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm font-exo mb-3">
                    {report.description}
                  </p>
                  
                  {report.image && (
                    <img 
                      src={report.image} 
                      alt={report.device}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderEquipmentHealth = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-orbitron font-semibold text-xl">Equipment Health</h2>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-orbitron font-semibold text-lg text-primary">
          System Diagnostics
        </h3>
        
        <div className="grid gap-4">
          {mockDiagnostics.map((diagnostic, index) => (
            <Card key={index} className="cyber-border">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-orbitron font-semibold text-lg">
                      {diagnostic.system}
                    </h3>
                    <p className="text-sm text-muted-foreground font-exo">
                      {diagnostic.details}
                    </p>
                    <p className="text-xs text-muted-foreground font-exo">
                      Last checked: {diagnostic.lastChecked}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      diagnostic.status === 'OK' ? 'secondary' : 
                      diagnostic.status === 'Warning' ? 'default' : 
                      'destructive'
                    }
                  >
                    {diagnostic.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                <h1 className="font-orbitron font-bold text-3xl neon-text mb-6">
                  Maintenance Reports
                </h1>
                {renderOverview()}
              </>
            )}
            {currentView === 'report' && renderReportForm()}
            {currentView === 'status' && renderStatusTracking()}
            {currentView === 'health' && renderEquipmentHealth()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceReports;