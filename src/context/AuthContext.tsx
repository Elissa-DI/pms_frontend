
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { getCurrentUser, isAuthenticated } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const refreshUser = async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to get user:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to load your profile. Please log in again.",
        variant: "destructive",
      });
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  
  // Load user on mount
  useEffect(() => {
    refreshUser();
  }, []);
  
  const value = {
    user,
    loading,
    isLoggedIn: user !== null,
    setUser,
    refreshUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
