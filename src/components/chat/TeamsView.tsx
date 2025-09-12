import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { chatService, type ChatChannel } from '@/services/chatService';
import { 
  Search, 
  Plus, 
  Hash, 
  Users, 
  Settings,
  Star,
  MoreHorizontal
} from 'lucide-react';

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  channels: ChatChannel[];
  favorite: boolean;
  department: string;
  privacy: 'public' | 'private';
}

export const TeamsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [channels, setChannels] = useState<ChatChannel[]>([]);

  useEffect(() => {
    // Load teams and channels
    const loadedChannels = chatService.getChannels();
    setChannels(loadedChannels);

    // Mock teams data
    const mockTeams: Team[] = [
      {
        id: '1',
        name: 'AI Development Team',
        description: 'Artificial Intelligence research and development',
        memberCount: 8,
        channels: loadedChannels.filter(c => c.name === 'ai-team'),
        favorite: true,
        department: 'Technology',
        privacy: 'private'
      },
      {
        id: '2',
        name: 'Operations Team',
        description: 'Daily operations and customer support',
        memberCount: 15,
        channels: loadedChannels.filter(c => c.name === 'general'),
        favorite: false,
        department: 'Operations',
        privacy: 'public'
      },
      {
        id: '3',
        name: 'Management',
        description: 'Leadership and strategic planning',
        memberCount: 5,
        channels: loadedChannels.filter(c => c.name === 'announcements'),
        favorite: true,
        department: 'Management',
        privacy: 'private'
      }
    ];
    
    setTeams(mockTeams);
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="pixoul-title">Teams & Channels</h2>
          <Button className="pixoul-btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Create Team
          </Button>
        </div>
        
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teams and channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-8">
        {/* Favorite Teams */}
        <div>
          <h3 className="pixoul-subtitle mb-4 uppercase tracking-wide">
            ⭐ Favorite Teams
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.filter(team => team.favorite).map((team) => (
              <Card key={team.id} className="pixoul-card hover:border-primary/50 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {team.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{team.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {team.department}
                          </Badge>
                          <Badge variant={team.privacy === 'private' ? 'secondary' : 'default'} className="text-xs">
                            {team.privacy}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">{team.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {team.memberCount} members
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {team.channels.length} channels
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Teams */}
        <div>
          <h3 className="pixoul-subtitle mb-4 uppercase tracking-wide">
            All Teams
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTeams.map((team) => (
              <Card key={team.id} className="pixoul-card hover:border-primary/50 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-muted">
                          {team.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {team.name}
                          {team.favorite && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {team.department}
                          </Badge>
                          <Badge variant={team.privacy === 'private' ? 'secondary' : 'default'} className="text-xs">
                            {team.privacy}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">{team.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {team.memberCount} members
                    </div>
                    <div className="flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      {team.channels.length} channels
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    View Team
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Public Channels */}
        <div>
          <h3 className="pixoul-subtitle mb-4 uppercase tracking-wide">
            Public Channels
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChannels.map((channel) => (
              <Card key={channel.id} className="pixoul-card hover:border-primary/50 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Hash className="w-5 h-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{channel.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {channel.description || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {channel.department || 'General'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};