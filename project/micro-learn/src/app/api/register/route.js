// src/app/api/register/route.js - NO CHANGES REQUIRED FOR DEFAULT ROLE
import dbConnect from "@/app/api/dbconnection";
import User from "@/app/api/models/userSchema";
// Handle POST request for user registration

export async function POST(req) {
  try {
    // Connect to MongoDB

    await dbConnect();
    // Parse request body

    const { username, password, email } = await req.json();
    console.log("🆕 Incoming signup:", username);
    // Validate required fields

    if (!username || !password || !email) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }
    // Check if username already exists in the database

    const existingUser = await User.findOne({ username });
    // If user already exists, return a 409 Conflict error

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Username already exists" }),
        { status: 409 }
      );
    }

    // When you create the new user, if `role` is not passed,
    // Mongoose will automatically apply the 'user' default from the schema.
    const newUser = await User.create({ username, password, email });

    return new Response(
      JSON.stringify({ message: "Signup successful", user: newUser }),
      { status: 201 }
    );
  } catch (err) {
    console.error("❌ Error in /api/register route:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
