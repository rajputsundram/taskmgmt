import { connectDb } from "../../../../lib/config/db";
import Task from "../../../../lib/models/Task";
import Users from "../../../../lib/models/Users";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// ✅ Function to extract user email from JWT stored in cookies
const getUserFromToken = async () => {
  try {
    const cookieStore = await cookies();
    const token = await cookieStore.get("authToken")?.value; // ✅ Ensure await

    if (!token) {
      console.warn("⚠️ No auth token found in cookies.");
      return null;
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded.user.email;
  } catch (error) {
    console.error("❌ Error verifying token:", error.message);
    return null;
  }
};

// ✅ PUT: Update task by ID
export async function PUT(req, context) { // Use `context` to await params
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

    const { params } = context;
    const { id } = await params; // ✅ Await params before accessing its properties
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    const task = await Task.findOne({ _id: id, user: user._id });
    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    const { isCompleted } = await req.json();
    task.isCompleted = isCompleted;
    await task.save();

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error("❌ Error updating task:", error);
    return NextResponse.json({ success: false, error: "Failed to update task" }, { status: 500 });
  }
}

// ✅ DELETE: Remove task by ID
export async function DELETE(req, context) {
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

    const { params } = context;
    const { id } = await params; // ✅ Fix: Await params before using it
    
    if (!id) {
      return NextResponse.json({ success: false, error: "Task ID is required" }, { status: 400 });
    }

    const task = await Task.findOne({ _id: id, user: user._id });
    if (!task) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    await Task.deleteOne({ _id: id });

    return NextResponse.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting task:", error);
    return NextResponse.json({ success: false, error: "Failed to delete task" }, { status: 500 });
  }
}
