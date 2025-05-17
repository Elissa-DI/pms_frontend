
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md">
          <div className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">404</span>
          </div>
          <h1 className="text-3xl font-bold">Page not found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={() => navigate(-1)}>
              Go back
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go to homepage
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
