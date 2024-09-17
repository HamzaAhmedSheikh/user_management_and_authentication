"use client"
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ImCancelCircle } from "react-icons/im";
import { Button } from "@/src/components/ui/button";
import { verify } from "@/src/actions/verify";
import { resendVerification } from "@/src/actions/resend-verification";
import { useToast } from "@/src/components/ui/use-toast"
import Link from 'next/link';
import { ToastAction } from '../ui/toast';

const Verify = () => {
  const { toast } = useToast()
  const searchParams = useSearchParams();
  const [verified, setVerified] = useState<null | boolean>(null); // Store verification status (null initially)
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Only call verify if token is present
      verify(token).then((res) => {
        setVerified(res);
      });
    }
  }, [token]); 

  return (
    <div className="flex justify-center items-center h-screen">
      {verified === null && (
        <div className="flex flex-col justify-center gap-y-5 items-center w-[400px] px-5 shadow-md h-[400px]">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-yellow-600 animate-spin"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 001 1h4a1 1 0 100-2h-3V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold">Verifying...</h2>
          <p>Please wait while we verify your email.</p>
        </div>
      )}
      {verified === true && (
        <div className="flex flex-col justify-center gap-y-5 items-center w-[400px] px-5 shadow-md h-[400px]">
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
            <h2 className="text-2xl font-bold">Email Verified</h2>
            <p>Your email was verified. You can continue using the application.</p>

            <Link href="/dashboard">
              <Button 
                size="sm"
                variant="link"
                asChild
                className="w-full"
                >
                  Go to Dashboard
              </Button>
            </Link>
        </div>
      )}
      {verified === false && (
        <div className="flex flex-col justify-center gap-y-5 items-center w-[400px] px-5 shadow-md h-[400px]">
            <div className="flex justify-center mb-4">
            <ImCancelCircle size={50} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold">Email Verification Failed</h2>
            <p className="px-5">Invalid or expired verification link</p>
        </div>
      )}
    </div>
  );
};

export default Verify;