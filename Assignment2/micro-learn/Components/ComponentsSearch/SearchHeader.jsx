// componentsSearch/SearchHeader.js
import React from 'react';
import { Search } from 'lucide-react';

export default function SearchHeader({ query, setQuery, handleSubmit, username }) {
  return (
    <section className="py-12 bg-gradient-to-r from-white-500 to-white-600">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-[#202774] mr-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-black">
              Search & Learn
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="relative mb-6">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full py-5 px-6 pr-16 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-orange-300 shadow-xl text-lg"
              placeholder="Try searching for 'Data Structures', 'Quantum Physics'..."
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#202774] text-white p-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
