// microlearn/Components/ComponentsLayout/MobileMenu.js
'use client';
import Link from 'next/link';
// CORRECTED IMPORT PATH
import { useAuth } from '../../src/app/context/AuthContext'; // Fix the path
import { useRouter } from 'next/navigation';

export default function MobileMenu({ setIsMenuOpen }) {
  const { isLoggedIn, logout, username } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <div className="mobile-menu md:hidden">
      <nav className="flex flex-col gap-4 py-4">
        <Link href="/#about" onClick={() => setIsMenuOpen(false)}>
          About
        </Link>
        <Link href="/#features" onClick={() => setIsMenuOpen(false)}>
          Features
        </Link>
        <Link href="/#testimonials" onClick={() => setIsMenuOpen(false)}>
          Testimonials
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/search" onClick={() => setIsMenuOpen(false)}>
              Search
            </Link>
            <Link
              href={`/profile?username=${username}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="mobile-cta text-left w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
            <Link
              href="/signup"
              onClick={() => setIsMenuOpen(false)}
              className="mobile-cta"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}
