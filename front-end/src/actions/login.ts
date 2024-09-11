"use server";

import * as z from "zod";
import { cookies } from "next/headers";
import { LoginSchema } from "@/src/schemas/userschema";

export const login = async (
  values: z.infer<typeof LoginSchema>,
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  try {

    const user = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/user/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (!user || user.status !== 200) {
      const errorData = await user.json(); // Parse the error response body to check for specific details

      if (user.status === 401) {
        if (errorData.detail === "User with this email is not verified") {
          return { error: "Email not verified", message: "User with this email is not verified" };
        } else if (errorData.detail === "Incorrect email or password") {
          return { error: "Incorrect email or password", message: "Incorrect email or password" };
        }
      }
      throw new Error("An error occurred while trying to login");
    }

    const user_data = await user.json();

    // Include the token expiration time in seconds and milliseconds
    const expiresInSeconds = user_data.expires_in; // Replace with the actual key in your response
    const expiresInMilliseconds = expiresInSeconds * 1000;

    const updated_user_data: UserData = {
      ...user_data,
      accessTokenExpires: Date.now() + expiresInMilliseconds,
    };

    console.log("Login Request Response To Set in Cookies");
  
    cookies().set({
      name: "user_data",
      value: JSON.stringify(updated_user_data), // Convert object to a string
      httpOnly: true,
    });

    return { success: "Authenticated!", message: `Welcome` };
  } catch (error) {
    if (error instanceof Error) {
          return { error: "Invalid credentials!", message: error.message };
      }
      return { error: "Invalid credentials!", message: "Invalid credentials!" };
    }
}