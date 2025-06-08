// componentsSearch/InitialState.js
import React from 'react';
import { Lightbulb, Search, GraduationCap } from 'lucide-react';

export default function InitialState() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-6xl text-orange-200 mb-6">
            <Lightbulb className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Start Learning Something New
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Enter a topic in the search bar above to discover short, focused
            video lessons
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <Search className="w-8 h-8 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Enter any topic you want to learn about
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <GraduationCap className="w-8 h-8 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Watch</h3>
              <p className="text-gray-600">
                View short, focused videos under 6 minutes
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <GraduationCap className="w-8 h-8 text-black mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Learn</h3>
              <p className="text-gray-600">
                Gain knowledge quickly and efficiently
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
