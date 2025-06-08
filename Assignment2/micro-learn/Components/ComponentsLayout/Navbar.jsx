// microlearn/Components/ComponentsLayout/Navbar.js
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../src/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar({ toggleMenu, isMenuOpen }) {
  const { isLoggedIn, logout, username } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="flex items-center justify-between w-full py-1">
      {/* Logo and site title, linked to the home page */}
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
        <span className="logo-text ml-2 font-bold text-lg text-white">
          MicroLearn
        </span>
      </Link>

      {/* Mobile menu toggle button (visible on small screens) */}
      <button
        className="menu-button md:hidden text-white focus:outline-none text-2xl"
        onClick={toggleMenu}
      >
        {isMenuOpen ? '✖' : '☰'}
      </button>

      {/* Desktop navigation links and authentication buttons (hidden on small screens) */}
      {/* MODIFIED: Adjusted spacing to make nav links more central */}
      <div className="hidden md:flex justify-between flex-1">
        {' '}
        {/* Removed ml-10 */}
        {/* MODIFIED: Made links bigger */}
        <nav className="nav-links flex space-x-8 mx-auto">
          {' '}
          {/* Added mx-auto to center, increased space-x */}
          <Link
            href="/#about"
            className="text-white hover:text-gray-300 transition-colors font-medium text-base" // Changed text-sm to text-base
          >
            About
          </Link>
          <Link
            href="/#features"
            className="text-white hover:text-gray-300 transition-colors font-medium text-base" // Changed text-sm to text-base
          >
            Features
          </Link>
          <Link
            href="/#testimonials"
            className="text-white hover:text-gray-300 transition-colors font-medium text-base" // Changed text-sm to text-base
          >
            Testimonials
          </Link>
        </nav>
        <div className="auth-buttons flex space-x-3">
          {isLoggedIn ? (
            <>
              <Link
                href={`/search?username=${username}`}
                className="px-4 py-2 border border-white rounded-lg text-white font-semibold text-sm
                           hover:bg-white hover:text-[#202774] transition-colors duration-200"
              >
                Start Learning
              </Link>
              <Link
                href={`/profile?username=${username}`}
                className="px-4 py-2 border border-white rounded-lg text-white font-semibold text-sm
                           hover:bg-white hover:text-[#202774] transition-colors duration-200"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-white rounded-lg text-white font-semibold text-sm
                           hover:bg-white hover:text-[#202774] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
                           transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 border border-white rounded-lg text-white font-semibold text-sm
                           hover:bg-white hover:text-[#202774] transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 border border-white rounded-lg text-white font-semibold text-sm
                           hover:bg-white hover:text-[#202774] focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
                           transition-all duration-200"
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
