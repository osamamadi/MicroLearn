// src/app/Components/ComponentsLayout/Navbar.jsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../app/context/AuthContext";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

// Navbar is the fixed top navigation bar with responsive layout and user-specific links
export default function Navbar({ toggleMenu, isMenuOpen }) {
  // Destructure 'user' along with isLoggedIn, logout, username
  const { isLoggedIn, logout, username, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#202774] dark:bg-[#1a202c] flex items-center justify-between w-full py-1 h-20 p-2">
      {/* Logo and site title */}
      <Link href="/" className="logo-link flex items-center">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-0.5 border border-white">
          <Image
            src="/microlearn-logo.png"
            alt="MicroLearn Logo"
            width={24}
            height={24}
            className="rounded-full"
            priority
          />
        </div>
        <span className="logo-text ml-2 font-bold text-lg text-white dark:text-gray-100">
          MicroLearn
        </span>
      </Link>

      {/* Mobile menu button */}
      <button
        className="menu-button md:hidden text-white dark:text-gray-100 focus:outline-none text-2xl"
        onClick={toggleMenu}
      >
        {isMenuOpen ? "✖" : "☰"}
      </button>

      {/* Nav links + buttons */}
      <div className="hidden md:flex justify-between items-center flex-1">
        <nav className="nav-links flex space-x-8 mx-auto">
          <Link
            href="/#about"
            className="text-white dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-300 transition-colors font-medium text-base"
          >
            About
          </Link>
          <Link
            href="/#features"
            className="text-white dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-300 transition-colors font-medium text-base"
          >
            Features
          </Link>
          <Link
            href="/#testimonials"
            className="text-white dark:text-gray-100 hover:text-gray-300 dark:hover:text-gray-300 transition-colors font-medium text-base"
          >
            Testimonials
          </Link>
        </nav>

        <div className="auth-buttons flex space-x-3">
          <ThemeToggle />
          {isLoggedIn ? (
            <>
              {/* Admin Panel Button - Only visible to admins */}
              {user && user.role === "admin" && (
                <Link
                  href="/admin/users"
                  className="px-4 py-2 border border-blue-500 rounded-lg text-blue-300 font-semibold text-sm hover:bg-blue-500 hover:text-white transition-colors duration-200"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                href={`/search?username=${username}`}
                className="px-4 py-2 border border-white dark:border-gray-300 rounded-lg text-white dark:text-gray-100 font-semibold text-sm hover:bg-white hover:text-[#202774] dark:hover:bg-gray-300 dark:hover:text-[#202774] transition-colors duration-200"
              >
                Start Learning
              </Link>
              <Link
                href={`/profile?username=${username}`}
                className="px-4 py-2 border border-white dark:border-gray-300 rounded-lg text-white dark:text-gray-100 font-semibold text-sm hover:bg-white hover:text-[#202774] dark:hover:bg-gray-300 dark:hover:text-[#202774] transition-colors duration-200"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-white dark:border-gray-300 rounded-lg text-white dark:text-gray-100 font-semibold text-sm hover:bg-white hover:text-[#202774] dark:hover:bg-gray-300 dark:hover:text-[#202774] transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border border-white dark:border-gray-300 rounded-lg text-white dark:text-gray-100 font-semibold text-sm hover:bg-white hover:text-[#202774] dark:hover:bg-gray-300 dark:hover:text-[#202774] transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 border border-white dark:border-gray-300 rounded-lg text-white dark:text-gray-100 font-semibold text-sm hover:bg-white hover:text-[#202774] dark:hover:bg-gray-300 dark:hover:text-[#202774] transition-all duration-200"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
