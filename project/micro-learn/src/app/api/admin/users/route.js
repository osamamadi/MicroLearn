// src/app/api/admin/users/route.js (Modified)
import dbConnect from '@/app/api/dbconnection';
import User from '@/app/api/models/userSchema'; // Assuming you have a User model

export async function GET(req) {
  await dbConnect();

  try {
    // --- IMPORTANT: AUTHENTICATION AND AUTHORIZATION CHECK ---
    // In a real application, you'd verify a session token or JWT here.
    // For this example, we'll try to get user_id and role from custom headers.
    // You would need to ensure these headers are sent from the client-side fetch call.

    // This is a SIMPLIFIED and potentially INSECURE way to check.
    // A proper solution would involve:
    // 1. Server-set HttpOnly cookies for sessions.
    // 2. JWTs verified against a secret key.
    // 3. NextAuth.js/Auth.js which handles this complexity.
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (!userId || userRole !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Admin access required.' }),
        { status: 403 } // 403 Forbidden
      );
    }

    // Optional: Verify user actually exists in DB and role is correct
    // This adds another layer of security against tampered headers.
    const requestingUser = await User.findById(userId);
    if (!requestingUser || requestingUser.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid user or role.' }),
        { status: 403 }
      );
    }
    // --- END AUTHENTICATION CHECK ---

    const users = await User.find({})
      .select('-password') // Exclude password from the response
      .lean(); // Return plain JavaScript objects

    return new Response(JSON.stringify({ users }), { status: 200 });
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
