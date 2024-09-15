"use client"
import { resendVerification } from '@/src/actions/resend-verification';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';
import Link from 'next/link';
import { ToastAction } from '../ui/toast';

const EmailVerificationPending = () => {
    const { toast } = useToast()
  const resendEmail = () => {
    resendVerification().then((res) => {
      if (res?.error) {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
          action: (
            <Link href={res.redirectTo}> 
              <ToastAction altText={res.action}>{res.action}</ToastAction>
            </Link>
          ),
        });
      }
      if (res?.success) {
        toast({
          title: "Email Sent",
          description: "Email has been sent to your inbox",
        });
      }
      })
    }

  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Email Verification Pending
        </h2>
        <p className="text-gray-600 mb-4">
          We have sent an email for verification. Follow the instructions in the
          email for logging into your account.
        </p>
        <Button
          onClick={resendEmail}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full hover:bg-blue-700 transition"
        >
          Send Email Again
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationPending;
