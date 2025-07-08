// src/app/admin/users/page.js
'use client';
import React, { useState, useEffect, useMemo, useCallback } from 'react'; // Added useCallback
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import UserAdminTable from '../../../Components/ComponentsAdmin/UserAdminTable';
import MostSearchedPieChart from '../../../Components/ComponentsAdmin/MostSearchedPieChart';
import CategorySearchCountBarChart from '../../../Components/ComponentsAdmin/CategorySearchCountBarChart';
import { getUserBadges } from '@/lib/badgeUtils';

// Helper function to find the most frequent string in an array
const getMostFrequentItem = (arr) => {
  if (!arr || arr.length === 0) return 'N/A';
  const counts = {};
  let maxCount = 0;
  let mostFrequent = '';

  for (const item of arr) {
    if (item && typeof item === 'string') {
      counts[item] = (counts[item] || 0) + 1;
      if (counts[item] > maxCount) {
        maxCount = counts[item];
        mostFrequent = item;
      }
    }
  }
  return mostFrequent || 'N/A';
};

const AdminUsersPage = () => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [usernameFilter, setUsernameFilter] = useState('');
  const [minAchievementsFilter, setMinAchievementsFilter] = useState('');
  const [mostSearchedFilter, setMostSearchedFilter] = useState('');

  // Function to fetch users from the backend
  // Wrapped in useCallback to prevent unnecessary re-renders of children
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // --- IMPORTANT: HARDCODED USER ID AND ROLE FOR LOCAL TESTING ---
      // This MUST be the _id of an actual 'admin' user in your MongoDB database
      // and needs to match the ID you put in UserAdminTable.jsx for consistency.
      const adminUserId = '684ebae7af864d08576b707d'; // <<< REPLACE THIS! E.g., '60c72b2f9c9b1f0015f8e21a'
      const adminUserRole = 'admin';

      if (!adminUserId || adminUserRole !== 'admin') {
        console.error('Frontend Error: Admin user ID or role not set for headers.');
        setError('Configuration Error: Admin credentials missing on client-side.');
        // Consider redirecting even here if essential for admin page access
        // router.push('/unauthorized');
        return;
      }

      const res = await fetch('/api/admin/users', {
        headers: {
          'x-user-id': adminUserId,
          'x-user-role': adminUserRole,
        },
      });
      const data = await res.json();

      if (res.ok) {
        const processedUsers = data.users.map((userItem) => {
          const { badges } = getUserBadges(userItem.quizHistory);
          const achievementCount = badges.length;
          const searchTerms = userItem.searchHistory ? userItem.searchHistory.map(s => s.value) : [];
          const mostSearched = getMostFrequentItem(searchTerms);

          return {
            ...userItem,
            mostSearched,
            achievementCount,
          };
        });
        setAllUsers(processedUsers);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch users');
        if (res.status === 403 || res.status === 401) {
          router.push('/login'); // Or /unauthorized
        }
      }
    } catch (err) {
      console.error('❌ Error fetching users for admin:', err);
      setError('An unexpected error occurred while fetching users.');
    } finally {
      setLoading(false);
    }
  }, [router]); // fetchUsers depends on router

  // Authentication check and data fetching trigger
  useEffect(() => {
    if (authLoading) return; // Wait for authentication state to resolve

    // Client-side check for admin role
    if (!user || user.role !== 'admin') {
      router.push('/'); // Redirect if not authenticated or not an admin
      return;
    }

    // Fetch users only if authenticated as admin
    fetchUsers();
  }, [user, authLoading, router, fetchUsers]); // Added fetchUsers to dependency array

  // Filtered users based on current filter states (memoized for performance)
  const filteredUsers = useMemo(() => {
    return allUsers.filter((userItem) => {
      const matchesUsername = usernameFilter
        ? userItem.username.toLowerCase().includes(usernameFilter.toLowerCase())
        : true;

      const matchesAchievements = minAchievementsFilter
        ? userItem.achievementCount >= parseInt(minAchievementsFilter)
        : true;

      const matchesMostSearched = mostSearchedFilter
        ? userItem.mostSearched
            .toLowerCase()
            .includes(mostSearchedFilter.toLowerCase())
        : true;

      return matchesUsername && matchesAchievements && matchesMostSearched;
    });
  }, [allUsers, usernameFilter, minAchievementsFilter, mostSearchedFilter]);

  // Data for the pie chart (top 3 most searched *terms* across ALL users)
  const pieChartData = useMemo(() => {
    const allSearchValues = allUsers
      .flatMap((userItem) => userItem.searchHistory || [])
      .map(item => item.value)
      .filter(item => item && typeof item === 'string');

    const searchCounts = {};
    for (const searchValue of allSearchValues) {
      searchCounts[searchValue] = (searchCounts[searchValue] || 0) + 1;
    }

    const sortedSearches = Object.entries(searchCounts).sort(
      ([, countA], [, countB]) => countB - countA
    );
    const top3Searches = sortedSearches.slice(0, 3);

    return {
      labels: top3Searches.map(([term]) => term),
      data: top3Searches.map(([, count]) => count),
    };
  }, [allUsers]);

  // Data for the bar chart (total searches per category, excluding 'Other')
  const categorySearchChartData = useMemo(() => {
    const categoryCounts = {};
    allUsers.forEach(userItem => {
      (userItem.searchHistory || []).forEach(searchEntry => {
        const category = searchEntry.category;
        if (category && category.toLowerCase() !== 'other') {
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });
    });

    const sortedCategories = Object.entries(categoryCounts).sort(
      ([, countA], [, countB]) => countB - countA
    );

    return {
      labels: sortedCategories.map(([category]) => category),
      data: sortedCategories.map(([, count]) => count),
    };
  }, [allUsers]);

  // Display loading/access denied state while authentication is in progress or user is not admin
  if (authLoading || !user || user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
        <div className="text-xl font-semibold text-indigo-700 dark:text-blue-400">
          {authLoading
            ? 'Loading authentication...'
            : 'Access Denied: You must be an administrator.'}
        </div>
      </div>
    );
  }

  // Display page loading state while data is being fetched (after auth)
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-950">
        <div className="text-xl font-semibold text-indigo-700 dark:text-blue-400">
          Loading user data...
        </div>
      </div>
    );
  }

  // Display error state if data fetching failed
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 p-4 rounded-lg">
        <p className="text-lg">Error: {error}</p>
      </div>
    );
  }

  // Render the admin page content if authentication and data fetching are successful
  return (
    <div className="p-8 bg-gray-50 dark:bg-gradient-to-br dark:from-gray-950 dark:to-blue-950 min-h-screen text-gray-800 dark:text-gray-200">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-purple-700 dark:text-blue-400">
        Admin User Overview
      </h1>

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:bg-gray-900 dark:border-blue-900">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700 dark:text-blue-300">
          Filters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="usernameFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Filter by Username
            </label>
            <input
              type="text"
              id="usernameFilter"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-blue-700 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:text-white dark:placeholder-gray-400"
              placeholder="e.g., JohnDoe"
              value={usernameFilter}
              onChange={(e) => setUsernameFilter(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="minAchievementsFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Min. Achievements
            </label>
            <input
              type="number"
              id="minAchievementsFilter"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-blue-700 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:text-white dark:placeholder-gray-400"
              placeholder="e.g., 1"
              value={minAchievementsFilter}
              onChange={(e) => setMinAchievementsFilter(e.target.value)}
            />
          </div>
          <div>
            <label
              htmlFor="mostSearchedFilter"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Filter by Most Searched
            </label>
            <input
              type="text"
              id="mostSearchedFilter"
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500 dark:bg-gray-800 dark:border-blue-700 dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:text-white dark:placeholder-gray-400"
              placeholder="e.g., JavaScript"
              value={mostSearchedFilter}
              onChange={(e) => setMostSearchedFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* User Table Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200 dark:bg-gray-900 dark:border-blue-900">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700 dark:text-blue-300">
          User Data
        </h2>
        {/* Pass fetchUsers as onUserDeleted prop to trigger refresh */}
        <UserAdminTable users={filteredUsers} onUserDeleted={fetchUsers} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Pie Chart Section (Existing) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-md mx-auto w-full dark:bg-gray-900 dark:border-blue-900">
          <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700 dark:text-blue-300">
            Top 3 Most Searched Terms
          </h2>
          {pieChartData.labels.length > 0 ? (
            <MostSearchedPieChart
              labels={pieChartData.labels}
              data={pieChartData.data}
            />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No search term data available for charting.
            </p>
          )}
        </div>

        {/* NEW: Bar Chart Section for Categories - Adjusted max-width */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-full lg:max-w-xl mx-auto w-full dark:bg-gray-900 dark:border-blue-900">
          <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-700 dark:text-blue-300">
            Search Count by Category
          </h2>
          {categorySearchChartData.labels.length > 0 ? (
            <CategorySearchCountBarChart
              labels={categorySearchChartData.labels}
              data={categorySearchChartData.data}
            />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No categorized search data available for charting (excluding 'Other').
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;