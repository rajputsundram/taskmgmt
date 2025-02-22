import { connectDb } from "../../../lib/config/db";
import Task from "../../../lib/models/Task";
import Users from "../../../lib/models/Users";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// ✅ Function to extract user email from JWT stored in cookies
const getUserFromToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value;


    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.user.email; // Extract user email from token payload
  } catch (error) {
    console.error("❌ Error verifying token:", error.message);
    return null;
  }
};

// ✅ GET: Fetch all tasks for the logged-in user
export async function GET() {
  try {
    await connectDb();
    const userEmail = await getUserFromToken();
    if (!userEmail) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await Users.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const tasks = await Task.find({ user: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✅ POST: Create a new task for the logged-in user
export async function POST(req) {
  try {
    await connectDb();
    const userEmail = await getUserFromToken();
    if (!userEmail) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await Users.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { title, description, isCompleted } = await req.json();
    if (!title || !description) {
      return NextResponse.json({ success: false, error: "Title and Description are required" }, { status: 400 });
    }

    const newTask = await Task.create({ title, description, user: user._id, isCompleted: isCompleted || false });
    return NextResponse.json({ success: true, task: newTask });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
