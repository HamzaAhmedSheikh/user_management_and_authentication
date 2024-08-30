import { RegisterForm } from "@/components/auth/register-form";
import { Suspense } from 'react'

const RegisterPage = () => {
  return <div className="flex justify-center items-center min-h-screen">
  <Suspense><RegisterForm /></Suspense>
  </div>
};

export default RegisterPage;