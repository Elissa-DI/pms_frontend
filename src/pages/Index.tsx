
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const Index = () => {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect based on user role if logged in
  useEffect(() => {
    if (isLoggedIn) {
      if (user?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/slots');
      }
    }
  }, [isLoggedIn, navigate, user]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto p-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            PMS
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find, book, and manage parking spots with ease. 
            Say goodbye to parking stress and hello to a seamless parking experience.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/register')}>
              Create account
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">User-friendly</h3>
              <p className="text-muted-foreground">
                Easy to use interface to manage your parking needs with just a few clicks
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Convenient Booking</h3>
              <p className="text-muted-foreground">
                Book parking slots in advance for hassle-free arrivals
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-600 dark:text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground">
                Rest assured with our secure booking system and reliable customer service
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
