// ✅ SearchSection.jsx
import Link from "next/link"
import { useAuth } from '../../src/app/context/AuthContext'; // Fix the path

export default function SearchSection() {
  const { username } = useAuth();
  const safeUsername = username || "guest";

  return (
    <section className="py-16 bg-gradient-to-r from-[#b8c6d9] to-[#a5b4d0] text-black text-center">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Try Our Search Feature Now</h2>
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8">
          No account needed! Experience how quick and easy it is to find short, focused video lessons.
        </p>
        <Link
          href={`/search?username=${safeUsername}`}
          className="btn-outline px-4 py-2 border rounded-md text-white border-purple-500 bg-purple-500 hover:bg-purple-600 hover:border-purple-600 transition-colors"
        >
          Search Any Topic
        </Link>
      </div>
    </section>
  )
}