"use server";
import * as z from "zod";
import { RegisterSchema } from "@/src/schemas/userschema";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, fullname, phone, affiliation } = validatedFields.data;

  // Send Data in JSON Format
  try {
    // Send Data in JSON Format
    const signup_request = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
          "email": email,
          "full_name": fullname,
          "password": password,
          "phone": phone,
          "affiliation": affiliation,
          "user_type": "visitor"
      }),
      cache: "no-store",
    });
    
    if (!signup_request || signup_request.status !== 200) {
      if (signup_request.status === 409) {
        return { error: "User with these credentials already exists" };
      } else if (signup_request.status === 500) {
        return { error: "Enter a phone number registered on whatsapp" };
      }
      throw new Error("An error occurred while trying to register user");
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return { error: "Failed to register user!" };
  }
  return { success: "Signup Success - Please Login!" };
};