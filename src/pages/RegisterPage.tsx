import Layout from "@/components/Layout";
import RegisterForm from "@/components/RegisterForm";

const RegisterPage = () => {
  return (
    <Layout>
      <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default RegisterPage;
