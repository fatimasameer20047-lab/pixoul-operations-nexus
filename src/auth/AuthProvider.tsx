import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, type SafeUser } from './authService';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: SafeUser | null;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<{ error: any }>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    const { user: authUser, error } = authService.signIn(username, password);
    
    if (error) {
      toast({
        title: "Access Denied",
        description: error,
        variant: "destructive"
      });
      return { error: { message: error } };
    }

    setUser(authUser);
    toast({
      title: "Success",
      description: `Welcome, ${authUser?.full_name}!`
    });

    return { error: null };
  };

  const signOut = () => {
    authService.signOut();
    setUser(null);
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully."
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    signIn,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};