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
        const response = await fetch(`http://localhost:8000/api/v1/user/resend-link`, {  // Fixed URL
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            cache: "no-store",
        });
        if (response.ok) {
            return true; // Verification success
        } else {
            console.log('Verification failed', response.statusText);
            return false; // Verification failed
        }
    } catch (error) {
        console.log('Error during verification:', error);
        return false; // In case of any error
    }
}
