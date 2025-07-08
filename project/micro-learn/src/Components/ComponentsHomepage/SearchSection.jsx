// ✅ SearchSection.jsx
import Link from "next/link";
import { useAuth } from "../../app/context/AuthContext"; // Fix the path

// This section encourages users to try the search feature (even without logging in)
export default function SearchSection() {
  const { username } = useAuth();
  const safeUsername = username || "guest";

  return (
    <section className="py-16 bg-gradient-to-r from-[#b8c6d9] to-[#a5b4d0] text-black text-center">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
          Try Our Search Feature Now
        </h2>
        {/* Section description */}
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8">
          No account needed! Experience how quick and easy it is to find short,
          focused video lessons.
        </p>
        {/* Call-to-action button linking to search page with username query param */}
        <Link
          href={`/search?username=${safeUsername}`}
          className="btn-outline px-4 py-2 border rounded-md  border-purple-500 bg-purple-500 hover:bg-purple-600 hover:border-purple-600 transition-colors"
        >
          Search Any Topic
        </Link>
      </div>
    </section>
  );
}
