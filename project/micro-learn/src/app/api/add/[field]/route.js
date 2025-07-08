// src/app/api/add/[field]/route.js (for Next.js App Router)
import dbConnect from '@/app/api/dbconnection';
import User from '@/app/api/models/userSchema';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    await dbConnect();

    // Fix: Explicitly await params to resolve the Next.js warning
    // This ensures `params` is fully resolved before destructuring its properties.
    const { field } = await params; 
    // Await req.json() to get the request body
    const { username, value } = await req.json();

    // --- Input Validation ---
    if (!username || value === undefined || !field) {
      let errorMessage = 'Missing data: ';
      if (!username) errorMessage += 'username is required. ';
      if (value === undefined) errorMessage += 'value is required in the request body. ';
      if (!field) errorMessage += 'field name is missing from the URL. ';

      console.log('Missing data:', { username, value, field });
      return NextResponse.json({ error: errorMessage.trim() }, { status: 400 });
    }

    // Validate the field name against allowed fields to prevent arbitrary updates
    const allowedFields = ['searchHistory', 'quizHistory', 'videoHistory']; 
    if (!allowedFields.includes(field)) {
      console.log('Attempted to update disallowed field:', field);
      return NextResponse.json({ error: `Invalid field name: ${field}. Allowed fields are: ${allowedFields.join(', ')}` }, { status: 400 });
    }

    // --- Type Validation for 'value' ---
    // This is the core fix for the "ObjectParameterError".
    // It checks if the 'value' being pushed is an object.
    // Assuming your history fields (searchHistory, quizHistory, videoHistory)
    // are intended to store objects (e.g., { id: "...", timestamp: "..." })
    // and not simple strings.
    if (typeof value !== 'object' || value === null) {
      console.error(`Invalid value type for field '${field}'. Expected an object, got: ${typeof value === 'object' ? 'null' : typeof value}. Value:`, value);
      return NextResponse.json(
        { error: `Invalid value type for field '${field}'. Expected an object in the request body (e.g., { videoId: 'someId', watchedAt: '2023-01-01T12:00:00Z' }), but received a ${typeof value === 'object' ? 'null' : typeof value}.` },
        { status: 400 }
      );
    }

    // Construct the update object dynamically for $push
    const updateOperation = {
      $push: {
        [field]: value // Use computed property name for dynamic field update
      }
    };

    // Find the user by username and update the specified array field
    await User.updateOne(
      { username },
      updateOperation
    );

    return NextResponse.json({ message: `${field} updated successfully for ${username}` });

  } catch (err) {
    // Log the full error for debugging
    console.error(`❌ Error updating user field ${params?.field || 'unknown'}:`, err);

    // Return a generic error message to the client for security
    return NextResponse.json({ error: 'Database error occurred' }, { status: 500 });
  }
}
