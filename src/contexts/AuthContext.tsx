import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: string | null;
  signIn: (fullName: string, password: string) => Promise<{ error: any }>;
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
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (stored in localStorage)
    const storedUser = localStorage.getItem('pixoul_current_user');
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setLoading(false);
  }, []);

  const signIn = async (fullName: string, password: string) => {
    if (password !== 'Pixoul_Help123') {
      const error = { message: 'Access denied. Invalid password.' };
      toast({
        title: "Access Denied",
        description: error.message,
        variant: "destructive"
      });
      return { error };
    }

    // Store the user in localStorage and state
    localStorage.setItem('pixoul_current_user', fullName);
    setCurrentUser(fullName);
    
    toast({
      title: "Success",
      description: `Welcome, ${fullName}!`
    });

    return { error: null };
  };

  const signOut = () => {
    localStorage.removeItem('pixoul_current_user');
    setCurrentUser(null);
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully."
    });
  };

  const value = {
    currentUser,
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