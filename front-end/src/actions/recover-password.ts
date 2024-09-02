"use server";
import * as z from "zod";
import { RecoverPasswordSchema } from "@/src/schemas/userschema";

export const resetpassword = async (values: z.infer<typeof RecoverPasswordSchema>) => {
  const validatedFields = RecoverPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email} = validatedFields.data;

  // Send Data in JSON Format
  const reset_request = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/password-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
        "email": email
    }),
    cache: "no-store",
  });

  console.log('reset_request', reset_request.status, reset_request.statusText);

  if (reset_request.status !== 200) {
    const error = await reset_request.json();
    return { error: error.detail };
  }

  return { success: "Password Reset Success - Please Check Your Email!" };
};