import dbConnect from "@/app/api/dbconnection";
import User from "@/app/api/models/userSchema";
// Handle POST request for user login

export async function POST(req) {
  try {
    // Establish MongoDB connection

    await dbConnect();
    // Extract username and password from request body

    const { username, password } = await req.json();

    console.log("!! Incoming login:", username);
    console.log("🔐 Incoming Password:", password);

    const identifier = username; // Treat the identifier as username OR email
    // Look for user in the database by username or email

    const existingUser = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }],
    });

    console.log("👤 Found user:", existingUser);
    // If user not found or password mismatch, return unauthorized

    if (!existingUser || existingUser.password !== password) {
      console.log("❌ Invalid credentials");
      return new Response(
        JSON.stringify({ error: "Invalid username or password" }),
        { status: 401 }
      );
    }
    // Login successful, return user object

    console.log("✅ Login success");
    return new Response(
      JSON.stringify({ message: "Login successful", user: existingUser }),
      { status: 200 }
    );
  } catch (err) {
    // Handle internal server error

    console.error("❌ Error in /api/login route:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
