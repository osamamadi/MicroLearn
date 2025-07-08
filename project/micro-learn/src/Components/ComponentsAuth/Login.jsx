// src/Components/ComponentsAuth/Login.jsx
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../app/context/AuthContext"; // Ensure this path is correct
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
// LoginComponent handles user login and routing based on role

const LoginComponent = () => {
  // State to manage form input values
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [error, setError] = useState(""); // Error message to show on failed login
  const router = useRouter();
  const { login } = useAuth(); // Get login method from AuthContext

  // Update form state when input fields change

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    form.username = form.username.toLowerCase();

    try {
      // Send login credentials to backend API
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // IMPORTANT: Pass the entire user object to your login context
        // Your API returns: { message: "Login successful", user: existingUser }
        // So, data.user contains the full user object including 'role'
        login(data.user); // <--- CHANGE: Pass the full user object

        if (data.user && data.user.role === "admin") {
          router.push("/admin/users"); // Redirect admin to admin page
        } else {
          router.push(`/profile?username=${data.user.username}`); // Redirect regular user to their profile
        }
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login API call failed:", err);
      setError("An unexpected error occurred during login.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-8">
          Sign in to continue your learning journey
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="text"
                name="username" // This field is used for both username/email in your API
                value={form.username}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </span>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              className="h-4 w-4 text-purple-600 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-500"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700 dark:text-gray-200"
            >
              Remember me
            </label>
          </div>

          {/* Sign in button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-md hover:opacity-90 transition shadow-md"
          >
            Sign In
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}

        <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-purple-600 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>

        <div className="text-center mt-6">
          <a
            href="/"
            className="text-purple-600 hover:text-purple-800 flex items-center justify-center text-sm font-medium"
          >
            <span className="mr-1">←</span> Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
