'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileCard from './ProfileCard';
import ActivityOverview from './ActivityOverview';
import UserInsight from './UserInsight'; // 💡 חדש

const ProfilePageContent = () => {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/profileData?username=${username}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    fetchUser();
  }, [username]);

  if (!user) {
    return <div className="text-center py-20 text-xl">Loading profile...</div>;
  }

  return (
    <section className="min-h-screen bg-white text-gray-800 px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          My Profile
        </h1>

        <ProfileCard user={user} />

        <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Activity Overview
        </h2>

        <ActivityOverview user={user} />

        <UserInsight user={user} /> {/* ✅ מוסיף תובנה */}
      </div>
    </section>
  );
};

export default ProfilePageContent;
