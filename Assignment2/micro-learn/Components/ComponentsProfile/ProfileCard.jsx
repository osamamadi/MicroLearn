import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const ProfileCard = ({ user }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex flex-col sm:flex-row items-start gap-6 bg-blue-100 rounded-2xl p-6 shadow-md border border-blue-200">
      
      {/* Avatar icon */}
      <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
        <User className="w-10 h-10 text-purple-600" />
      </div>

      {/* User details */}
      <div className="flex-1 space-y-4 text-gray-800 mt-1">
        {/* Username */}
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Username:</span>
          <span>{user.username}</span>
        </div>

        {/* Password */}
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-600" />
          <span className="font-medium">Password:</span>
          <span>{showPassword ? user.password : '••••••••'}</span>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-blue-600 hover:text-blue-800"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
