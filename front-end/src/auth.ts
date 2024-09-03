"use server";
import { cookies } from "next/headers";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "./auth.config";

export async function auth() {
  // Check if cookies exist
  const isCookies = cookies().has("user_data");

  if (!isCookies) {
    console.log("[auth] No cookies. Redirecting to login.");
    return null;
  }

  const cookies_user_data = cookies().get("user_data")?.value;

  if (!cookies_user_data) {
    console.log("[auth] No user data in cookies. Redirecting to login.");
    return null;
  }

  let user_data: UserData = JSON.parse(cookies_user_data);
  console.log("[auth] user_data CALLED @auth");

  if (!user_data.access_token) {
    console.log("[auth] Expired Redirecting to login.");
    return null;
  }

  return user_data;
}

export async function signOut() {
  cookies().delete("user_data");
  console.log("[signOut] User data cookie deleted. Redirecting to login.");
}



export default NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@gmail.com" },
        password: { label: "Password", type: "password", placeholder: "******" },
      },
      async authorize(credentials) {
        const credentialsSchema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        });

        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("Invalid credentials.");
        }

        const { email, password } = parsedCredentials.data;

        try {
          // Make a request to your FastAPI backend for authentication
          const response = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            throw new Error("Failed to authenticate.");
          }

          const data = await response.json();

          // Assuming the FastAPI backend returns user data if authentication is successful
          if (data && data.user) {
            return data.user; // Return the user object if authentication is successful
          } else {
            return null;
          }
        } catch (error) {
          console.error("Failed to authenticate user:", error);
          throw new Error("Failed to authenticate.");
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin", // Custom sign-in page
    error: "/signin",  // Use the sign-in page for errors
  },
  callbacks: {
    // Custom JWT and session callbacks can be added here
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
});
