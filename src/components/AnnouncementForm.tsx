import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/AuthProvider';
import { FileUpload } from './FileUpload';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required')
});

type AnnouncementForm = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  onSuccess?: (announcement: { title: string; message: string; author_name: string; image_url?: string }) => void;
}

export const AnnouncementForm = ({ onSuccess }: AnnouncementFormProps) => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { user } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema)
  });

  const onSubmit = async (data: AnnouncementForm) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In demo mode, just call the onSuccess callback
      const announcement = {
        title: data.title,
        message: data.message,
        author_name: user.full_name,
        image_url: imageFile ? URL.createObjectURL(imageFile) : undefined
      };

      if (onSuccess) {
        onSuccess(announcement);
      }

      reset();
      setImageFile(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to post announcement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register('title')}
            placeholder="Enter announcement title"
            className="mt-1"
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            {...register('message')}
            placeholder="Enter announcement message"
            rows={4}
            className="mt-1"
          />
          {errors.message && (
            <p className="text-sm text-destructive mt-1">{errors.message.message}</p>
          )}
        </div>

        <div>
          <Label>Image (Optional)</Label>
          <FileUpload
            onFileSelect={setImageFile}
            selectedFile={imageFile}
            accept="image/*"
            className="mt-1"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Posting...' : 'Post Announcement'}
        </Button>
      </form>
    </Card>
  );
};