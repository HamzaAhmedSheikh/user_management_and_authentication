import { LoginForm } from "@/src/components/auth/Login-form";
import { Suspense } from "react";
import SignInButton from "@/src/components/google/siginInButton";

const LoginPage = () => {
  return (
    <> 
    <div className="flex justify-center items-center min-h-screen">
      <Suspense>
        <LoginForm />
        
      </Suspense>
    </div>
    <div>
    <SignInButton /> 
    </div>
    </>
  );
};

export default LoginPage;