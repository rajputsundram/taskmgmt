import Users from "../../../lib/models/Users";
import { connectDb } from "../../../lib/config/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
    try {
        await connectDb();

        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        if (!name || !email || !password) {
            return NextResponse.json({ success: false, msg: "All fields are required." });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ success: false, msg: "Email is already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT
        const payload = { user: { id: newUser._id } };
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // ✅ Set token in cookies
        const response = NextResponse.json({ success: true, msg: "User registered successfully." });
        response.cookies.set("token", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            path: "/",
            sameSite: "Strict",
        });

        return response;

    } catch (error) {
        return NextResponse.json({ success: false, msg: "Signup failed", error: error.message });
    }
}
