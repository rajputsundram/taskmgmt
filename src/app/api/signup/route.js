// ✅ Correct way to set cookies in Next.js App Router (await cookies())
export async function POST(request) {
    try {
        await connectDb();

        const { name, email, password } = await request.json();

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
        const payload = { user: { id: newUser._id, email: newUser.email } }; // ✅ Include email in payload
        const authToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // ✅ Set token in cookies
        const cookieStore = await cookies();
        cookieStore.set("authToken", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            path: "/",
            sameSite: "Strict",
        });

        // ✅ Set email in cookies
        cookieStore.set("userEmail", email, {
            httpOnly: false, // ❗ Make it accessible to frontend
            secure: process.env.NODE_ENV === "production",
            maxAge: 3600,
            path: "/",
            sameSite: "Strict",
        });

        return NextResponse.json({ success: true, msg: "User registered successfully." });

    } catch (error) {
        return NextResponse.json({ success: false, msg: "Signup failed", error: error.message });
    }
}
