// ✅ HowItWorks.jsx

export default function HowItWorks() {
  return (
    <section className="section bg-[#e6eaef] py-12 border-t border-gray-300">
      <h2 className="section-title">How It Works</h2>
      <p className="section-description">Simple steps to start learning fast</p>
      <div className="steps-container flex-col md:flex-row">
        {["Search a Topic", "Watch Short Videos", "Take Mini Quizzes"].map((step, i) => (
          <div key={i} className="step-card bg-[#bfd1f3]">
            <div className="step-number">{i + 1}</div>
            <h3 className="step-title">{step}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}