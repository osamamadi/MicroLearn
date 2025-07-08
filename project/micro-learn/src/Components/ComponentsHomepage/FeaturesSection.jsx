// FeaturesSection displays key benefits of the MicroLearn platform
export default function FeaturesSection() {
  return (
    <section id="features" className="section py-12  dark:bg-gray-900">
      {/* Section title */}
      <h2 className="section-title text-gray-900 dark:text-white">
        Why MicroLearn Works
      </h2>
      {/* Section subtitle/description */}
      <p className="section-description text-gray-700 dark:text-gray-300">
        Our platform combines micro-learning, personalized tracking, and AI
        quizzes.
      </p>

      {/* Grid layout for feature cards (1 column on mobile, 3 on desktop) */}
      <div className="features-grid grid-cols-1 md:grid-cols-3">
        {[
          {
            title: "Short & Focused",
            desc: "All videos are under 6 minutes for max retention.",
          },
          {
            title: "Learning History",
            desc: "Track progress with search and video history.",
          },
          {
            title: "AI Mini Quizzes",
            desc: "Smart quizzes reinforce what you’ve watched.",
          },
        ].map((feat, i) => (
          <div
            key={i}
            className="feature-card bg-[#bfd1f3] dark:bg-gray-800 dark:text-white"
          >
            <h3 className="feature-title text-gray-900 dark:text-white">
              {feat.title}
            </h3>
            <p className="feature-description text-gray-700 dark:text-gray-300">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
