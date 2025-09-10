import { useState, useEffect } from 'react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { BackButton } from '@/components/BackButton';
import { AnnouncementForm } from '@/components/AnnouncementForm';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  message: string;
  image_url?: string;
  author_name: string;
  created_at: string;
}

// Mock announcements data
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to Pixoul Staff Hub!',
    message: 'This is a demo announcement. All staff members can view and post announcements here.',
    author_name: 'System Admin',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Maintenance Schedule',
    message: 'Routine maintenance will be performed this weekend. Please report any issues beforehand.',
    author_name: 'Fatima Samer',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    title: 'New Team Member',
    message: 'Please welcome our new team member who will be joining the AI department next week.',
    author_name: 'Hala Samer',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const addNewAnnouncement = (newAnnouncement: Omit<Announcement, 'id' | 'created_at'>) => {
    const announcement: Announcement = {
      ...newAnnouncement,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setAnnouncements(prev => [announcement, ...prev]);
    setShowForm(false);
    toast({
      title: "Success",
      description: "Announcement posted successfully!",
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="cyber-border bg-card rounded-xl p-8">
            <BackButton className="mb-6" />
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-bold text-3xl">Important Announcements</h1>
              <Button 
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Announcement
              </Button>
            </div>
            
            {showForm && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Post New Announcement</h2>
                <AnnouncementForm onSuccess={addNewAnnouncement} />
              </div>
            )}
            
            <div className="space-y-6">
              <p className="text-muted-foreground text-lg">
                Stay informed with the latest updates and important notices.
              </p>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading announcements...</p>
                </div>
              ) : announcements.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No announcements yet. Be the first to post one!</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="border-l-4 border-primary bg-muted p-6 rounded-r-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{announcement.title}</h3>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(announcement.created_at)}
                        </span>
                      </div>
                      <p className="text-sm mb-2">{announcement.message}</p>
                      <p className="text-xs text-muted-foreground">Posted by: {announcement.author_name}</p>
                      
                      {announcement.image_url && (
                        <div className="mt-4">
                          <img 
                            src={announcement.image_url} 
                            alt="Announcement" 
                            className="max-w-full h-auto rounded border"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-center pt-8">
                <p className="text-accent">📢 Demo mode - Local announcements active!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
