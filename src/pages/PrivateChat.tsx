import { useState, useEffect } from 'react';
import { NavigationHeader } from '@/components/NavigationHeader';
import { BackButton } from '@/components/BackButton';
import { ChatRoom } from '@/components/ChatRoom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtime } from '@/hooks/useRealtime';
import { MessageSquare, Users, Search, Hash, User } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  description?: string;
  department?: string;
}

interface StaffMember {
  id: string;
  username: string;
  full_name: string;
  department: string;
}

const PrivateChat = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [directMessageUser, setDirectMessageUser] = useState<StaffMember | null>(null);
  const [showDirectMessage, setShowDirectMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { notifications } = useRealtime();

  useEffect(() => {
    fetchChannels();
    fetchStaffMembers();
  }, []);

  const fetchChannels = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_channels')
        .select('*')
        .order('name');

      if (error) throw error;
      setChannels(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load chat channels",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('staff_accounts')
        .select('*')
        .neq('id', currentUser?.id) // Exclude current user
        .order('full_name');

      if (error) throw error;
      setStaffMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load staff members",
        variant: "destructive"
      });
    }
  };

  const startDirectMessage = (staff: StaffMember) => {
    setDirectMessageUser(staff);
    setShowDirectMessage(true);
    setSelectedChannel(null);
    setStaffSearchTerm('');
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = staffMembers.filter(staff =>
    staff.full_name.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
    staff.username.toLowerCase().includes(staffSearchTerm.toLowerCase()) ||
    staff.department.toLowerCase().includes(staffSearchTerm.toLowerCase())
  );

  const emergencyNotifications = notifications.filter(n => n.type === 'emergency');

  if (selectedChannel || showDirectMessage) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationHeader />
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="cyber-border bg-card rounded-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedChannel(null);
                    setShowDirectMessage(false);
                  }}
                >
                  ← Back to Channels
                </Button>
                <h1 className="font-bold text-2xl">
                  {showDirectMessage ? `Direct Message with ${directMessageUser?.full_name}` : `#${selectedChannel?.name}`}
                </h1>
              </div>
              
              <ChatRoom
                channelId={selectedChannel?.id}
                recipientId={showDirectMessage ? directMessageUser?.id : undefined}
                channelName={selectedChannel?.name}
                isDirectMessage={showDirectMessage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="cyber-border bg-card rounded-xl p-8">
            <BackButton className="mb-6" />
            
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-bold text-3xl">Private Chat</h1>
              {emergencyNotifications.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  🚨 {emergencyNotifications.length} Emergency Alert(s)
                </Badge>
              )}
            </div>
            
            <div className="space-y-6">
              <p className="text-muted-foreground text-lg">
                Real-time secure communication platform for staff collaboration.
              </p>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search channels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Direct Messages */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Direct Messages - Search Staff
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search staff by name, username, or department..."
                      value={staffSearchTerm}
                      onChange={(e) => setStaffSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {staffSearchTerm && (
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {filteredStaff.map((staff) => (
                        <div
                          key={staff.id}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                          onClick={() => startDirectMessage(staff)}
                        >
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{staff.full_name}</p>
                              <p className="text-sm text-muted-foreground">@{staff.username} • {staff.department}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Chat
                          </Button>
                        </div>
                      ))}
                      {filteredStaff.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No staff members found matching your search
                        </p>
                      )}
                    </div>
                  )}
                  
                  {!staffSearchTerm && (
                    <p className="text-sm text-muted-foreground">
                      Start typing to search for staff members to chat with
                    </p>
                  )}
                </div>
              </Card>

              {/* Team Channels */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  Team Channels
                </h3>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading channels...</p>
                  </div>
                ) : filteredChannels.length === 0 ? (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No channels found.</p>
                  </Card>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {filteredChannels.map((channel) => (
                      <Card 
                        key={channel.id} 
                        className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setSelectedChannel(channel)}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Users className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold">#{channel.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{channel.description}</p>
                        {channel.department && (
                          <Badge variant="outline" className="mt-2">
                            {channel.department}
                          </Badge>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="text-center pt-8">
                <p className="text-accent">💬 Real-time encrypted messaging system active!</p>
                {notifications.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {notifications.length} new notification(s) received
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
