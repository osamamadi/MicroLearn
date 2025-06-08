// ✅ FeaturesSection.jsx

export default function FeaturesSection() {
  return (
    <section id="features" className="section bg-[#e6eaef] py-12">
      <h2 className="section-title">Why MicroLearn Works</h2>
      <p className="section-description">
        Our platform combines micro-learning, personalized tracking, and AI quizzes.
      </p>
      <div className="features-grid grid-cols-1 md:grid-cols-3">
        {[
          {
            title: "Short & Focused",
            desc: "All videos are under 6 minutes for max retention."
          },
          {
            title: "Learning History",
            desc: "Track progress with search and video history."
          },
          {
            title: "AI Mini Quizzes",
            desc: "Smart quizzes reinforce what you’ve watched."
          }
        ].map((feat, i) => (
          <div key={i} className="feature-card bg-[#bfd1f3]">
            <h3 className="feature-title">{feat.title}</h3>
            <p className="feature-description">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}