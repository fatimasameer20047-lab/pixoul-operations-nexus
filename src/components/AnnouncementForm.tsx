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
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FileUpload } from './FileUpload';

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required')
});

type AnnouncementForm = z.infer<typeof announcementSchema>;

export const AnnouncementForm = () => {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { currentUser } = useAuth();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AnnouncementForm>({
    resolver: zodResolver(announcementSchema)
  });

  const onSubmit = async (data: AnnouncementForm) => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('announcements')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('announcements')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Insert announcement
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: data.title,
          message: data.message,
          image_url: imageUrl,
          author_id: crypto.randomUUID(),
          author_name: currentUser
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Announcement posted successfully!"
      });

      reset();
      setImageFile(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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