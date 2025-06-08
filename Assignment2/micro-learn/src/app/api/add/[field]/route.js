// src/app/api/add/[field]/route.js (for Next.js App Router)
import dbConnect from '@/app/api/dbconnection';
import User from '@/app/api/models/userSchema';
import { NextResponse } from 'next/server';

// Fix: Await params if it's a Promise before destructuring
export async function POST(req, { params }) {
  try {
    await dbConnect();

    const { field } = await params; // Await params here
    const { username, value } = await req.json(); // 'value' will be the data to push

    if (!username || value === undefined || !field) { // Check for undefined value
      console.log('Missing data:', { username, value, field });
      let errorMessage = 'Missing data: ';
      if (!username) errorMessage += 'username is required. ';
      if (value === undefined) errorMessage += 'value is required in the request body. ';
      if (!field) errorMessage += 'field name is missing from the URL. ';

      return NextResponse.json({ error: errorMessage.trim() }, { status: 400 });
    }

    // Validate the field name to prevent arbitrary updates
    const allowedFields = ['searchHistory', 'quizHistory', 'videoHistory']; // Add your fields here
    if (!allowedFields.includes(field)) {
      console.log('Attempted to update disallowed field:', field);
      return NextResponse.json({ error: `Invalid field name: ${field}` }, { status: 400 });
    }

    // Construct the update object dynamically
    const updateOperation = {
      $push: {
        [field]: value // Use computed property name for dynamic field update
      }
    };

    await User.updateOne(
      { username },
      updateOperation
    );

    return NextResponse.json({ message: `${field} updated successfully for ${username}` });

  } catch (err) {
    console.error(`❌ Error updating user field ${params?.field || 'unknown'}:`, err);
    return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
  }
}