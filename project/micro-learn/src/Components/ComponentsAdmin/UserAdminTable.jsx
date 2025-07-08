'use client';
import React, { useState } from 'react'; // Import useState
import { useRouter } from 'next/navigation';

const UserAdminTable = ({ users, onUserDeleted }) => {
  const router = useRouter();

  // State for the confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDeleteId, setUserToDeleteId] = useState(null);
  const [userToDeleteUsername, setUserToDeleteUsername] = useState('');

  // State for the notification/toast message
  const [notification, setNotification] = useState({ show: false, message: '', type: '' }); // type: 'success' or 'error'

  // Function to show the confirmation modal
  const handleDeleteUser = (userId, username) => {
    setUserToDeleteId(userId);
    setUserToDeleteUsername(username);
    setShowConfirmModal(true); // Show confirmation modal
  };

  // Function to execute the delete operation after confirmation
  const executeDelete = async () => {
    setShowConfirmModal(false); // Hide the confirmation modal immediately

    try {
      const adminUserId = '684ebae7af864d08576b707d'; // <<< REPLACE THIS with a valid admin user ID
      const adminUserRole = 'admin';

      if (!adminUserId || adminUserRole !== 'admin') {
        setNotification({
          show: true,
          message: 'Configuration Error: Admin credentials missing on client-side.',
          type: 'error'
        });
        console.error('Missing adminUserId or adminUserRole for DELETE request headers.');
        return;
      }

      const response = await fetch(`/api/admin/users/${userToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': adminUserId,
          'x-user-role': adminUserRole
        },
      });

      if (response.ok) {
        setNotification({
          show: true,
          message: `User "${userToDeleteUsername}" deleted successfully.`,
          type: 'success'
        });
        // Call the prop function to notify the parent (AdminUsersPage) to re-fetch users
        if (onUserDeleted) {
          onUserDeleted();
        }
      } else {
        const errorData = await response.json();
        setNotification({
          show: true,
          message: `Failed to delete user: ${errorData.message || 'Unknown error'}`,
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error deleting user (frontend):', error);
      setNotification({
        show: true,
        message: 'An error occurred while deleting the user.',
        type: 'error'
      });
    } finally {
      // Clear userToDelete state after attempt
      setUserToDeleteId(null);
      setUserToDeleteUsername('');
      // Automatically hide notification after 4 seconds
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 4000);
    }
  };

  // Function to cancel deletion (close modal)
  const cancelDelete = () => {
    setShowConfirmModal(false);
    setUserToDeleteId(null);
    setUserToDeleteUsername('');
  };

  if (!users || users.length === 0) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-4">
        No users found matching your criteria.
      </p>
    );
  }

  const sortedUsers = users.slice().sort((a, b) => {
    const achievementsA = a.achievementCount || 0;
    const achievementsB = b.achievementCount || 0;
    return achievementsB - achievementsA;
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-300 dark:border-gray-900">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead className="bg-gray-100 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase tracking-wider">Username</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase tracking-wider">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase tracking-wider">Role</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase tracking-wider">Most Searched</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase tracking-wider">Achievements</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-200 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-950 dark:divide-gray-800">
          {sortedUsers.map((user) => (
            <tr
              key={user._id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150"
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {user.username}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {user.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800 dark:bg-indigo-800 dark:text-indigo-200'
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-200'
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {user.mostSearched}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {user.achievementCount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => handleDeleteUser(user._id, user.username)}
                  className="text-red-600 hover:text-red-900 transition-colors duration-150 dark:text-red-400 dark:hover:text-red-200"
                  title="Delete user"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-auto border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Confirm Deletion</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete user: <span className="font-semibold">{userToDeleteUsername}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-150 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-150"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification/Toast */}
      {notification.show && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 z-50
            ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default UserAdminTable;