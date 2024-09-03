"use server";
import * as z from "zod";
import { UpdatePasswordSchema } from "@/schemas/userschema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const updatepassword = async (values: z.infer<typeof UpdatePasswordSchema>) => {
  const validatedFields = UpdatePasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { current_password, new_password } = validatedFields.data;

  const session = await auth();

  if (!session) {
      console.log("[session] No cookies. Redirecting...");
      redirect('/login')
  }

  // Send Data in JSON Format
  const update_password = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/password-update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
        "current_password": current_password,
        "new_password": new_password
    }),
    cache: "no-store",
  });

  console.log('update_password', update_password.status, update_password.statusText);

  if (update_password.status !== 200) {
    const error = await update_password.json();
    return { error: error.detail };
  }

  return { success: "Password Updated successfully" };
};