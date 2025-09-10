import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/auth/AuthProvider';
import { NavigationHeader } from '@/components/NavigationHeader';
import { BackButton } from '@/components/BackButton';
import { WeeklyScheduleGrid } from '@/components/WeeklyScheduleGrid';
import { DailyScheduleViewer } from '@/components/DailyScheduleViewer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, AlertCircle } from 'lucide-react';

type ViewMode = 'overview' | 'schedule' | 'availability' | 'swapping' | 'coverage';

const timeOffSchema = z.object({
  date: z.string().min(1, "Date is required"),
  reason: z.string().min(1, "Reason is required")
});

const swapRequestSchema = z.object({
  currentShift: z.string().min(1, "Current shift is required"),
  desiredShift: z.string().min(1, "Desired shift is required"),
  reason: z.string().min(1, "Reason is required")
});

const coverageSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  estimatedDelay: z.string().min(1, "Estimated delay is required")
});

type TimeOffForm = z.infer<typeof timeOffSchema>;
type SwapRequestForm = z.infer<typeof swapRequestSchema>;
type CoverageForm = z.infer<typeof coverageSchema>;

const StaffScheduling = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('overview');

  const timeOffForm = useForm<TimeOffForm>({
    resolver: zodResolver(timeOffSchema),
    defaultValues: { date: '', reason: '' }
  });

  const swapForm = useForm<SwapRequestForm>({
    resolver: zodResolver(swapRequestSchema),
    defaultValues: { currentShift: '', desiredShift: '', reason: '' }
  });

  const coverageForm = useForm<CoverageForm>({
    resolver: zodResolver(coverageSchema),
    defaultValues: { reason: '', estimatedDelay: '' }
  });

  const weeklySchedule = [
    { day: 'Monday', shift: '9:00 AM - 5:00 PM', staff: 'John Doe, Sarah Smith', status: 'Confirmed' },
    { day: 'Tuesday', shift: '10:00 AM - 6:00 PM', staff: 'Mike Johnson, Lisa Wang', status: 'Confirmed' },
    { day: 'Wednesday', shift: '9:00 AM - 5:00 PM', staff: user?.full_name + ', Alex Chen', status: 'Confirmed' },
    { day: 'Thursday', shift: '11:00 AM - 7:00 PM', staff: 'Emma Davis, Tom Wilson', status: 'Needs Coverage' },
    { day: 'Friday', shift: '9:00 AM - 5:00 PM', staff: user?.full_name + ', Rachel Brown', status: 'Confirmed' },
    { day: 'Saturday', shift: '12:00 PM - 8:00 PM', staff: 'David Lee, Jessica Taylor', status: 'Confirmed' },
    { day: 'Sunday', shift: '12:00 PM - 6:00 PM', staff: 'Chris Anderson', status: 'Needs Coverage' }
  ];

  const onTimeOffSubmit = (data: TimeOffForm) => {
    toast({
      title: "Success",
      description: "Time-off request submitted successfully"
    });
    timeOffForm.reset();
  };

  const onSwapSubmit = (data: SwapRequestForm) => {
    toast({
      title: "Success",
      description: "Shift swap request sent to available staff"
    });
    swapForm.reset();
  };

  const onCoverageSubmit = (data: CoverageForm) => {
    toast({
      title: "Success",
      description: "Coverage alert sent to supervisor"
    });
    coverageForm.reset();
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground text-lg">
        Manage work schedules, shift assignments, and staff availability for optimal arcade operations.
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('schedule')}
        >
          <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
            <Calendar size={20} />
            Weekly Schedule – Current Week
          </h3>
          <p className="text-sm text-muted-foreground">
            Day-by-day viewer of all staff shifts with navigation arrows.
          </p>
        </div>
        
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('swapping')}
        >
          <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
            <Users size={20} />
            Shift Swapping
          </h3>
          <p className="text-sm text-muted-foreground">
            Enable staff to request and approve shift exchanges.
          </p>
        </div>
        
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('availability')}
        >
          <h3 className="font-semibold text-accent mb-3 flex items-center gap-2">
            <Clock size={20} />
            Availability
          </h3>
          <p className="text-sm text-muted-foreground">
            Submit availability preferences and time-off requests.
          </p>
        </div>
        
        <div 
          className="bg-muted rounded-lg p-6 cursor-pointer hover:bg-muted/80 transition-colors"
          onClick={() => setCurrentView('coverage')}
        >
          <h3 className="font-semibold text-destructive mb-3 flex items-center gap-2">
            <AlertCircle size={20} />
            Coverage Alerts
          </h3>
          <p className="text-sm text-muted-foreground">
            Real-time notifications for understaffing or urgent coverage needs.
          </p>
        </div>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
      </div>
      <DailyScheduleViewer />
    </div>
  );

  const renderAvailability = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-semibold text-xl">Availability Management</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Request Time Off</CardTitle>
          <CardDescription>Submit time-off requests or report unavailability</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...timeOffForm}>
            <form onSubmit={timeOffForm.handleSubmit(onTimeOffSubmit)} className="space-y-4">
              <FormField
                control={timeOffForm.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={timeOffForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Personal appointment, family emergency, vacation"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit Request</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );

  const renderSwapping = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-semibold text-xl">Shift Swapping</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Request Shift Swap</CardTitle>
          <CardDescription>Find someone to swap shifts with you</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...swapForm}>
            <form onSubmit={swapForm.handleSubmit(onSwapSubmit)} className="space-y-4">
              <FormField
                control={swapForm.control}
                name="currentShift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Current Shift</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wednesday 9:00 AM - 5:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={swapForm.control}
                name="desiredShift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Shift</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Friday 9:00 AM - 5:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={swapForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Swap</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief explanation for the swap request"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Send Swap Request</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );

  const renderCoverage = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => setCurrentView('overview')}>← Back</Button>
        <h2 className="font-semibold text-xl">Coverage Alerts</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Report Lateness / Request Coverage</CardTitle>
          <CardDescription>Notify supervisor and request emergency coverage</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...coverageForm}>
            <form onSubmit={coverageForm.handleSubmit(onCoverageSubmit)} className="space-y-4">
              <FormField
                control={coverageForm.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason for Coverage Need</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="e.g., Traffic delay, emergency situation, illness"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={coverageForm.control}
                name="estimatedDelay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Delay</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 30 minutes, 2 hours, full shift" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" variant="destructive">Send Coverage Alert</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
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
                  Staff Scheduling
                </h1>
                <WeeklyScheduleGrid />
                {renderOverview()}
              </>
            )}
            {currentView === 'schedule' && renderSchedule()}
            {currentView === 'availability' && renderAvailability()}
            {currentView === 'swapping' && renderSwapping()}
            {currentView === 'coverage' && renderCoverage()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffScheduling;