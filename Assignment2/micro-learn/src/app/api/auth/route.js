// app/api/auth/route.js
// This file is not being modified as it's backend logic.
// It was provided by you and is included here for context.
import dbConnect from '@/app/api/dbconnection';
import User from '@/app/api/models/userSchema';

//auth
export async function POST(req) {
  try {
    await dbConnect();

    const { username, password, mode } = await req.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), {
        status: 400,
      });
    }

    const existingUser = await User.findOne({ username });

    // ✅ SIGNUP
    if (mode === 'signup') {
      if (existingUser) {
        return new Response(
          JSON.stringify({ error: 'Username already exists' }),
          { status: 409 }
        );
      }

      const newUser = await User.create({ username, password });
      return new Response(
        JSON.stringify({ message: 'Signup successful', user: newUser }),
        { status: 201 }
      );
    }

    // ✅ LOGIN
    if (mode === 'login') {
      if (!existingUser || existingUser.password !== password) {
        return new Response(
          JSON.stringify({ error: 'Invalid username or password' }),
          { status: 401 }
        );
      }

      return new Response(
        JSON.stringify({ message: 'Login successful', user: existingUser }),
        { status: 200 }
      );
    }

    // ❌ fallback if mode is invalid
    return new Response(JSON.stringify({ error: 'Invalid mode' }), {
      status: 400,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
    });
  }
}
