'use server'

import { signIn } from "@/src/components/google/auth";
import { AuthError } from "next-auth";

export async function googleAuthenticate(
    prevState: string | undefined,
    formData: FormData,
  ) {
    try {
      await signIn('google');
    } catch (error) {
      if (error instanceof AuthError) {
        return 'google log in failed'
      }
      throw error;
    }
  }