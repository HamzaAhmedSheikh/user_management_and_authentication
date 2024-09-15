"use server";

export const verify = async (token: string) => {
    try {
    const response = await fetch(`${process.env.BACKEND_AUTH_SERVER_URL}/api/v1/user/verify?token=${token}`
        , {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
    if (response.ok) {
        return true; // Verification success
    } else {
        return false; // Verification failed
    }
    } catch (error) {
    return false; // In case of any error
    }
};