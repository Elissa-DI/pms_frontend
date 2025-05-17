
import { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, loading } = useAuth();
  
  // If still loading, don't show anything yet
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not an admin, redirect to home
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your parking system</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
