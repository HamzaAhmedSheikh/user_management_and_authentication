"use server";
import * as z from "zod";
import { VerifyEmailSchema } from "@/src/schemas/userschema";
import { RecoverPasswordSchema } from "@/src/schemas/userschema";

export const resetpassword = async (values: z.infer<typeof VerifyEmailSchema>) => {
  const validatedFields = VerifyEmailSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email } = validatedFields.data;
  console.log(email.toString())
  // Send Data in JSON Format
  const reset_request = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/auth/request-otp?email=${email}`, {
    method: "POST",
    headers: {
      "accept": "application/json"
    },
    cache: "no-store",
  });

  console.log(reset_request)

  console.log('reset_request', reset_request.status, reset_request.statusText);

  if (reset_request.status !== 200) {
    const error = await reset_request.json();
    return { error: error.detail };
  }

  return { success: "OTP sent successfully" };
};