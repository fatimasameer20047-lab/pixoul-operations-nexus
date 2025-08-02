import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StaffAccount {
  id: string;
  username: string;
  full_name: string;
  department: string;
}

interface AuthContextType {
  currentUser: StaffAccount | null;
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
  const [currentUser, setCurrentUser] = useState<StaffAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (stored in localStorage)
    const storedUser = localStorage.getItem('pixoul_staff_account');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        localStorage.removeItem('pixoul_staff_account');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // Query the staff_accounts table
      const { data: staff, error } = await supabase
        .from('staff_accounts')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !staff) {
        const errorMsg = 'Invalid username or password';
        toast({
          title: "Access Denied",
          description: errorMsg,
          variant: "destructive"
        });
        return { error: { message: errorMsg } };
      }

      // Store the user in localStorage and state
      const staffAccount: StaffAccount = {
        id: staff.id,
        username: staff.username,
        full_name: staff.full_name,
        department: staff.department
      };
      
      localStorage.setItem('pixoul_staff_account', JSON.stringify(staffAccount));
      setCurrentUser(staffAccount);
      
      toast({
        title: "Success",
        description: `Welcome, ${staff.full_name}!`
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Login failed',
        variant: "destructive"
      });
      return { error };
    }
  };

  const signOut = () => {
    localStorage.removeItem('pixoul_staff_account');
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