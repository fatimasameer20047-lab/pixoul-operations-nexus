import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const NavigationHeader = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();

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