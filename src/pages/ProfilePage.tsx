
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { getCurrentUser, logout } from '@/lib/auth';
import { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Check, LogOut, User as UserIcon } from 'lucide-react';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        toast.error('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">
            View and manage your account information
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 md:p-8">
            <div className="flex items-center mb-6">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="ml-4">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32 mt-2" />
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-1" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            <Skeleton className="h-10 w-32" />
          </div>
        ) : user ? (
          <div className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-6 mb-6">
                <div className="h-24 w-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <UserIcon className="h-12 w-12" />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center justify-center sm:justify-start mt-2">
                    <div className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500 text-xs px-2.5 py-0.5 rounded-full flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      {user.isVerified ? 'Verified' : 'Not Verified'}
                    </div>
                    <div className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 text-xs px-2.5 py-0.5 rounded-full ml-2">
                      {user.role}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Name</h3>
                  <div className="bg-muted/50 p-3 rounded-md">{user.name}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                  <div className="bg-muted/50 p-3 rounded-md">{user.email}</div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Role</h3>
                  <div className="bg-muted/50 p-3 rounded-md">{user.role}</div>
                </div>
              </div>
              
              <Button variant="destructive" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 border rounded-lg">
            <h2 className="text-xl font-medium mb-2">Profile not found</h2>
            <p className="text-muted-foreground text-center max-w-md">
              There was an issue loading your profile. Please try logging in again.
            </p>
            <Button onClick={handleLogout} className="mt-4">
              Go to login
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
