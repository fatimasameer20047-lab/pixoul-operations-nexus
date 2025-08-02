import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ImageUpload } from '@/components/ImageUpload';
import { toast } from '@/hooks/use-toast';

const reportSchema = z.object({
  device: z.string().min(1, "Device is required"),
  room: z.string().min(1, "Room is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional()
});

type ReportForm = z.infer<typeof reportSchema>;

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

interface MaintenanceReportFormProps {
  onSuccess: () => void;
}

export const MaintenanceReportForm = ({ onSuccess }: MaintenanceReportFormProps) => {
  const { currentUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [imageData, setImageData] = useState('');

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      device: '',
      room: '',
      description: '',
      image: ''
    }
  });

  const onSubmit = (data: ReportForm) => {
    if (!currentUser) return;

    setSubmitting(true);
    try {
      const newReport: MaintenanceReport = {
        id: Date.now().toString(),
        ...data,
        image: imageData,
        reported_by: currentUser,
        status: 'open',
        created_at: new Date().toISOString()
      };

      // Get existing reports
      const existingReports = JSON.parse(localStorage.getItem('pixoul_maintenance_reports') || '[]');
      const updatedReports = [newReport, ...existingReports];
      localStorage.setItem('pixoul_maintenance_reports', JSON.stringify(updatedReports));

      toast({
        title: "Success",
        description: "Maintenance report submitted successfully"
      });

      form.reset();
      setImageData('');
      onSuccess();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit maintenance report",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="cyber-border">
      <CardHeader>
        <CardTitle>Report Equipment Issue</CardTitle>
        <CardDescription>
          Submit details about equipment problems or maintenance needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="device"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device/Equipment</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. VR Headset, PC Station 3, Audio System" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="room"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room/Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. VR Room 1, Main Lounge, Reception" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Problem Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the issue in detail, including any error messages or symptoms..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <label className="text-sm font-medium">Image (Optional)</label>
              <ImageUpload 
                onImageCapture={setImageData}
                currentImage={imageData}
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};