import { LoginForm } from "@/components/auth/Login-form";
import { Suspense } from "react";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;