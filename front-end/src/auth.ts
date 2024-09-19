"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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

export async function adminAuth() {
  const session = await auth();
  if (!session) {
    console.log("[session] No cookies. Redirecting...");
    // redirect("/login");
    return null;
  }
  const token = session.access_token;
  try {
    const response = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/user/admin`, {
      method: "GET",
      headers: {
        "Content-Type": "application",
        "Authorization": `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return { message: "Network issue", redirectTo: "/login" };
  }
}

export async function signOut() {
  cookies().delete("user_data");  // Deleting the cookie
  console.log("[signOut] User data cookie deleted. Redirecting to login.");

  // Redirect to login or home page
  redirect("/login");  // You can replace "/login" with the correct path
}