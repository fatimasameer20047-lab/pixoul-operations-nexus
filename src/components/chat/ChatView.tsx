import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatRoom } from '@/components/ChatRoom';
import { chatService, type ChatChannel } from '@/services/chatService';
import { useAuth } from '@/auth/AuthProvider';
import { 
  Search, 
  Hash, 
  User, 
  Plus, 
  ArrowLeft,
  MessageSquare
} from 'lucide-react';

interface StaffMember {
  id: string;
  username: string;
  full_name: string;
  department: string;
  online: boolean;
}

export const ChatView = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<{
    type: 'channel' | 'direct';
    id: string;
    name: string;
  } | null>(null);
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  
  const mockStaff: StaffMember[] = [
    { id: '1', username: 'sarah.smith', full_name: 'Sarah Smith', department: 'Management', online: true },
    { id: '2', username: 'mike.johnson', full_name: 'Mike Johnson', department: 'AI Team', online: true },
    { id: '3', username: 'lisa.wang', full_name: 'Lisa Wang', department: 'Operations', online: false },
    { id: '4', username: 'alex.chen', full_name: 'Alex Chen', department: 'Maintenance', online: true },
  ];

  useEffect(() => {
    const loadChannels = () => {
      setChannels(chatService.getChannels());
    };

    loadChannels();
    const unsubscribe = chatService.addListener(loadChannels);
    return unsubscribe;
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleConversationSelect = (type: 'channel' | 'direct', id: string, name: string) => {
    setSelectedConversation({ type, id, name });
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = mockStaff.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    member.id !== user?.id
  );

  if (selectedConversation) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b border-border p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedConversation(null)}
            className="p-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            {selectedConversation.type === 'channel' ? (
              <Hash className="w-4 h-4 text-muted-foreground" />
            ) : (
              <User className="w-4 h-4 text-muted-foreground" />
            )}
            <h2 className="font-semibold">{selectedConversation.name}</h2>
          </div>
        </div>
        
        <div className="flex-1">
          <ChatRoom
            channelId={selectedConversation.type === 'channel' ? selectedConversation.id : undefined}
            recipientId={selectedConversation.type === 'direct' ? selectedConversation.id : undefined}
            channelName={selectedConversation.name}
            isDirectMessage={selectedConversation.type === 'direct'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex">
      {/* Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Conversations</h2>
            <Button variant="ghost" size="sm" className="p-2">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Channels Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Team Channels
            </h3>
            <div className="space-y-1">
              {filteredChannels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => handleConversationSelect('channel', channel.id, channel.name)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <Hash className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{channel.name}</p>
                    {channel.description && (
                      <p className="text-xs text-muted-foreground truncate">{channel.description}</p>
                    )}
                  </div>
                  {channel.unread_count && channel.unread_count > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 text-xs">
                      {channel.unread_count > 9 ? '9+' : channel.unread_count}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Direct Messages Section */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Direct Messages
            </h3>
            <div className="space-y-1">
              {filteredStaff.map((member) => (
                <div
                  key={member.id}
                  onClick={() => handleConversationSelect('direct', member.id, member.full_name)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs">
                        {getInitials(member.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    {member.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{member.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{member.department}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {member.online ? 'Online' : 'Offline'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
          <p className="text-sm max-w-md">
            Choose a team channel or start a direct message with a colleague to begin chatting.
          </p>
        </div>
      </div>
    </div>
  );
};