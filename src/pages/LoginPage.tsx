
import Layout from '@/components/Layout';
import LoginForm from '@/components/LoginForm';

const LoginPage = () => {
  return (
    <Layout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default LoginPage;
