"use server";
import * as z from "zod";
import { UpdatePasswordSchema } from "@/src/schemas/userschema";

export const updatepassword = async (values: z.infer<typeof UpdatePasswordSchema>) => {
  const validatedFields = UpdatePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { otp, email, new_password } = validatedFields.data;

  // Send Data in JSON Format
  const update_password = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/auth/verify-otp-update-password?email=${email}&otp=${otp}&new_password=${new_password}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  console.log('update_password', update_password.status, update_password.statusText);

  if (update_password.status !== 200) {
    const error = await update_password.json();
    return { error: error.detail };
  }
  
  return { success: "Password Updated successfully" };
};