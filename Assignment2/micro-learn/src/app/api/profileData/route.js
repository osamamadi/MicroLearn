import dbConnect from '@/app/api/dbconnection';
import User from '@/app/api/models/userSchema';

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), {
      status: 400,
    });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
