import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const response = NextResponse.json({ message: "Logged out successfully" });

    // ✅ Correct way to delete the token
    response.cookies.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: new Date(0), // 👈 Expire the cookie immediately
        path: "/",
    });

    return response;
}
