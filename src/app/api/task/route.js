import { connectDb } from "../../../lib/config/db";
import Task from "../../../lib/models/Task";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // ✅ Import cookies API

// ✅ Function to extract user email from cookies
const getUserEmailFromCookies = () => {
  const cookieStore = cookies();
  const userEmail = cookieStore.get("userEmail")?.value; // Extract userEmail
  if (!userEmail) {
    throw new Error("Unauthorized: User email not found in cookies");
  }
  return userEmail;
};

// ✅ GET: Fetch all tasks for the logged-in user
export async function GET() {
  try {
    console.log("➡️ [GET] Fetching all tasks...");

    await connectDb();
    const userEmail = getUserEmailFromCookies(); // ✅ Get email from cookies

    console.log("✔️ Logged-in User Email:", userEmail);

    // Fetch only tasks that belong to the logged-in user
    const tasks = await Task.find({ userEmail });

    console.log("✔️ Found Tasks:", tasks.length);

    return NextResponse.json({ success: true, tasks });
  } catch (error) {
    console.error("❌ Error in GET:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}

// ✅ POST: Create a new task for the logged-in user
export async function POST(req) {
  try {
    console.log("➡️ [POST] Adding new task...");

    await connectDb();
    const userEmail = getUserEmailFromCookies(); // ✅ Get email from cookies

    console.log("✔️ Logged-in User Email:", userEmail);

    const { title, description, isCompleted } = await req.json(); // Get data from request body

    console.log("✔️ Received Data:", { title, description, isCompleted });

    if (!title || !description) {
      console.error("❌ Missing title or description");
      return NextResponse.json({ success: false, error: "Title and Description are required" }, { status: 400 });
    }

    // Create a new task and save it to the database
    const newTask = new Task({
      title,
      description,
      userEmail, // ✅ Associate the task with the logged-in user's email
      isCompleted: isCompleted || false, // Default to false if not provided
    });

    await newTask.save();

    console.log("✔️ Task Saved:", newTask);

    return NextResponse.json({ success: true, task: newTask });
  } catch (error) {
    console.error("❌ Error in POST:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 401 });
  }
}
