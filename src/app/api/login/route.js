import Users from "../../../lib/models/Users";
import { connectDb } from "../../../lib/config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        console.error("🚨 JWT_SECRET is not defined!");
        return NextResponse.json(
            { success: false, error: "JWT_SECRET is not defined" },
            { status: 500 }
        );
    }

    try {
        const body = await req.json();
        const { email, password } = body;

        console.log("📩 Received login request for:", email);

        await connectDb();

        let user = await Users.findOne({ email });
        if (!user) {
            console.error("❌ User not found:", email);
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 400 }
            );
        }

        const pwdCompare = await bcrypt.compare(password, user.password);
        if (!pwdCompare) {
            console.error("❌ Password incorrect for:", email);
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 400 }
            );
        }

        // ✅ Generate Token
        const payload = { user: { id: user._id } };
        const authToken = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

        console.log("✅ Login successful, setting cookie...");

        // ✅ Set the token as an HTTP-only secure cookie
        const response = NextResponse.json(
            { success: true, message: "Login successful" },
            { status: 200 }
        );

        response.cookies.set("authToken", authToken, {
            httpOnly: true, // Prevents access from JavaScript
            secure: process.env.NODE_ENV === "production", // Only secure in production
            sameSite: "strict", // Prevents CSRF attacks
            maxAge: 3600, // 1 hour expiry
            path: "/", // Available across the site
        });

        return response;
    } catch (error) {
        console.error("🚨 Login Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
