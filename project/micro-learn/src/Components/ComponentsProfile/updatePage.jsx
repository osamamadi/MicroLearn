"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext"; // ✅ import context

function UpdatePage({ onClose, onUserUpdated }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, login } = useAuth(); // ✅ access auth context

  const initialUsername = user?.username || searchParams.get("username") || "";
  const [username] = useState(initialUsername);
  const [newusername, setNewUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newemail, setNewEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle profile update request
  const handleSaveChanges = async () => {
    const trimmedNewUsername = newusername.trim();

    // Require old password to make any changes
    if (!oldPassword.trim()) {
      setErrorMessage(
        "To change anything, you must enter your current password."
      );
      return;
    }

    // Prevent submitting same username
    if (trimmedNewUsername && trimmedNewUsername === username) {
      setErrorMessage("You entered the same username.");
      return;
    }

    try {
      const response = await fetch("/api/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          newusername,
          newemail,
          oldPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Update global AuthContext with latest user data
        login(data.user);

        // ✅ Call optional parent update logic if needed
        if (onUserUpdated) {
          onUserUpdated(data.user);
        }

        // ✅ Replace current URL with updated username
        if (trimmedNewUsername) {
          const params = new URLSearchParams(searchParams.toString());
          params.set("username", trimmedNewUsername);
          router.replace(`/profile?${params.toString()}`);
        }

        onClose();
      } else {
        setErrorMessage(data?.error || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("A network error occurred. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl w-full max-w-md mx-4 transition-all">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          Edit Profile Information
        </h2>

        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="usernameInput"
            className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
          >
            New Username
          </label>
          <input
            type="text"
            id="usernameInput"
            value={newusername}
            onChange={(e) => {
              setNewUsername(e.target.value);
              setErrorMessage("");
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter new username"
          />
        </div>

        {/* Old Password */}
        <div className="mb-4">
          <label
            htmlFor="oldPasswordInput"
            className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
          >
            Old Password
          </label>
          <input
            type="password"
            id="oldPasswordInput"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setErrorMessage("");
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter old password"
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label
            htmlFor="newPasswordInput"
            className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPasswordInput"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrorMessage("");
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter new password"
          />
        </div>

        {/* New Email */}
        <div className="mb-4">
          <label
            htmlFor="emailInput"
            className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
          >
            New Email
          </label>
          <input
            type="email"
            id="emailInput"
            value={newemail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setErrorMessage("");
            }}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter Gmail address"
          />
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 text-red-600 text-sm font-medium text-center">
            {errorMessage}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdatePage;
