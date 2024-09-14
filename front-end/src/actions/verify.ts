"use server";

export const verify = async (token: string) => {
    try {
    const response = await fetch(`http:localhost:8000/api/v1/user/verify?token=${token}`
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