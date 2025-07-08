// src/app/api/admin/users/[userId]/route.js
import dbConnect from '../../../dbconnection';
import User from '../../../models/userSchema';
import { NextResponse } from 'next/server';

// Note: params is destructured from the second argument of the handler function.
export async function DELETE(req, { params }) {
    await dbConnect();

    try {
        // --- IMPORTANT: HEADER-BASED "AUTHENTICATION" (INSECURE FOR PRODUCTION) ---
        const userIdFromHeader = req.headers.get('x-user-id');
        const userRoleFromHeader = req.headers.get('x-user-role');

        if (!userIdFromHeader || userRoleFromHeader !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized: Admin access required or headers missing.' },
                { status: 403 }
            );
        }

        const requestingUser = await User.findById(userIdFromHeader);
        if (!requestingUser || requestingUser.role !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized: Invalid user ID or role in database.' },
                { status: 403 }
            );
        }
        // --- END HEADER-BASED "AUTHENTICATION" ---

        // ✨ MODIFIED LINE: Explicitly await params before accessing userId
        const awaitedParams = await params; // Add this line
        const userId = awaitedParams.userId; // Access userId from the awaited object

        // Optional: Prevent an admin from deleting their own account via this interface
        if (userIdFromHeader === userId) {
            return NextResponse.json({ message: 'Cannot delete your own admin account through this interface.' }, { status: 403 });
        }

        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully', userId: userId }, { status: 200 });

    } catch (error) {
        console.error('Error deleting user (API):', error);
        if (error.name === 'CastError') {
            return NextResponse.json({ message: 'Invalid user ID format' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Server error during user deletion' }, { status: 500 });
    }
}