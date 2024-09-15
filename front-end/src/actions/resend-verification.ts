"use server"
import { redirect } from "next/navigation";
import { auth } from "../auth";

export const resendVerification = async () => {
    const session = await auth();
    if (!session) {
        console.log("[session] No cookies. Redirecting...");
        redirect("/login");
    }
    const token = session.access_token;
    try {
        const response = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/user/resend-link`, {  // Fixed URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
        });
        if (response.ok) {
            return { success: true }; // Verification success
        } else if (response.status === 401) {
            return { success: false, error: "Unauthorized", redirectTo: "/login", action: "Please Login" };
        } else if (response.status === 400) {
            return { success: false, error: "User is already verified", redirectTo: "/dashboard", action: "Go to Dashboard" };
        } 
        else {
            return { success: false, error: "Error during verification", redirectTo: "/login", action: "Please Login" };
        }
    } catch (error) {
        console.log('Error during verification:', error);
        return { success: false, error: "Error during verification", redirectTo: "/login", action: "Please Login" };
    }
    return { success: "Email Sent" };
}
