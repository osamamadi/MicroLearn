import React, { useState } from "react";
import { User, Mail, Pencil } from "lucide-react";
import UpdatePage from "./updatePage";

const ProfileCard = ({ user, onUserUpdate }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const showEditWindow = () => setIsUpdateModalOpen(true);
  const hideEditWindow = () => setIsUpdateModalOpen(false);

  return (
    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-blue-100 dark:bg-blue-900 rounded-2xl p-6 shadow-md border border-blue-200 dark:border-blue-700 text-gray-800 dark:text-gray-100 transition-all">
      
      {/* Avatar */}
      <div className="w-24 h-24 bg-purple-200 dark:bg-purple-800 rounded-full flex items-center justify-center shadow-inner">
        <User className="w-10 h-10 text-purple-700 dark:text-purple-300" />
      </div>

      {/* User Details */}
      <div className="flex-1 space-y-4">
        {/* Username */}
        <div className="flex items-center gap-3">
          <User className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          <span className="font-semibold">Username:</span>
          <span className="truncate">{user.username}</span>
        </div>

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-blue-600 dark:text-blue-300" />
          <span className="font-semibold">Email:</span>
          <span className="truncate">{user.email}</span>
        </div>

        {/* Edit Button */}
        <div className="pt-2">
          <button
            id="editProfileButton"
            onClick={showEditWindow}
            className="
              inline-flex items-center gap-2
              bg-purple-600 hover:bg-purple-700
              text-white font-semibold
              py-2 px-4 rounded-lg
              shadow-sm hover:shadow-md
              transition duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75
            "
          >
            <Pencil className="w-4 h-4" />
            Edit Personal Information
          </button>
        </div>

        {/* Update Modal */}
        {isUpdateModalOpen && (
          <UpdatePage onClose={hideEditWindow} onUserUpdated={onUserUpdate} />
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
