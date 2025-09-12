import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Megaphone, 
  MessageSquare, 
  Calendar, 
  Search, 
  ExternalLink,
  Clock
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'announcement' | 'mention' | 'schedule' | 'maintenance';
  title: string;
  description: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  source: string;
  unread: boolean;
}

export const ActivityView = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load activities from localStorage or use mock data
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'announcement',
        title: 'System Maintenance Tonight',
        description: 'VR systems will be offline from 2-4 AM for routine maintenance',
        timestamp: new Date().toISOString(),
        priority: 'high',
        source: 'Management',
        unread: true
      },
      {
        id: '2',
        type: 'mention',
        title: 'Mentioned in #ai-team',
        description: 'Sarah mentioned you in a discussion about the new VR setup',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        priority: 'medium',
        source: 'Sarah Smith',
        unread: true
      },
      {
        id: '3',
        type: 'schedule',
        title: 'Schedule Updated',
        description: 'Your Thursday shift has been moved to 10 AM - 6 PM',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        priority: 'medium',
        source: 'Scheduling System',
        unread: false
      }
    ];
    setActivities(mockActivities);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="w-5 h-5 text-primary" />;
      case 'mention':
        return <MessageSquare className="w-5 h-5 text-accent" />;
      case 'schedule':
        return <Calendar className="w-5 h-5 text-secondary" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = (now.getTime() - time.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return time.toLocaleDateString();
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="pixoul-title mb-4">Activity Feed</h2>
        
        {/* Filters and Search */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search activity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'announcement' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('announcement')}
            >
              Announcements
            </Button>
            <Button
              variant={filter === 'mention' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('mention')}
            >
              Mentions
            </Button>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {filteredActivities.length === 0 ? (
          <Card className="pixoul-card">
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No activity found</p>
                <p className="text-sm">Try adjusting your filters or search terms</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredActivities.map((activity) => (
            <Card 
              key={activity.id} 
              className={`pixoul-card cursor-pointer transition-all hover:shadow-lg ${
                activity.unread ? 'border-primary/50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-foreground truncate pr-2">
                        {activity.title}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={getPriorityColor(activity.priority)} className="text-xs">
                          {activity.priority}
                        </Badge>
                        {activity.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {activity.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>From {activity.source}</span>
                      <div className="flex items-center gap-2">
                        <span>{formatTime(activity.timestamp)}</span>
                        <Button variant="ghost" size="sm" className="p-1">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};