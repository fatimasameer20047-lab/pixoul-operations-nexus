import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { usePrivateMessageNotifications } from '@/hooks/usePrivateMessageNotifications';
import { MessageSquare } from 'lucide-react';

export const NavigationHeader = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = usePrivateMessageNotifications();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="bg-card border-b border-border p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <button 
          onClick={() => navigate('/')}
          className="font-bold text-xl hover:opacity-80 transition-opacity"
        >
          Pixoul Staff Hub
        </button>
        
        {currentUser && (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/private-chat')}
              className="relative p-2 hover:bg-muted rounded-md transition-colors"
              title="Private Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </button>
            <span className="text-sm text-muted-foreground">
              {currentUser.full_name}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};