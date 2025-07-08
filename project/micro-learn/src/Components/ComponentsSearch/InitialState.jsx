import React from "react";
import { Lightbulb, Search, GraduationCap } from "lucide-react";
/**
 * InitialState Component
 *
 * This component is displayed as the default state before the user searches for a topic.
 * It encourages the user to start learning by showing a simple 3-step process:
 * - Search a topic
 * - Watch short videos
 * - Learn efficiently
 */
export default function InitialState() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          {/* Lightbulb icon at top */}
          <div className="text-6xl text-orange-200 dark:text-orange-300 mb-6">
            <Lightbulb className="w-16 h-16 mx-auto" />
          </div>
          {/* Main heading and description */}
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Start Learning Something New
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Enter a topic in the search bar above to discover short, focused
            video lessons
          </p>
          {/* 3-step feature cards: Search, Watch, Learn */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <Search className="w-8 h-8 text-black dark:text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Search
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Enter any topic you want to learn about
              </p>
            </div>

            {/* Step 2: Watch */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <GraduationCap className="w-8 h-8 text-black dark:text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Watch
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                View short, focused videos under 6 minutes
              </p>
            </div>

            {/* Step 3: Learn */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <GraduationCap className="w-8 h-8 text-black dark:text-white mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Learn
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gain knowledge quickly and efficiently
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
