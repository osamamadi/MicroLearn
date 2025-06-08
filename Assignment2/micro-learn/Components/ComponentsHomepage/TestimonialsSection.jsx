import Image from "next/image"

export default function TestimonialsSection() {
  const testimonials = [
    {
      text: "After returning from military service, I was overwhelmed. MicroLearn helped me catch up quickly.",
      name: "David Cohen",
      role: "Computer Science Student",
      image: "/david-cohen.jpg",
      stars: 5,
    },
    {
      text: "The mini quizzes helped me find gaps in my knowledge. Super useful for exams!",
      name: "Sarah Johnson",
      role: "Biology Major",
      image: "/sarah-johnson.jpg",
      stars: 5,
    },
    {
      text: "I was sick for 3 weeks. MicroLearn’s short videos helped me catch up without stress.",
      name: "Michael Rodriguez",
      role: "Engineering Student",
      image: "/michael-rodriguez.jpg",
      stars: 4.5,
    },
  ]

  return (
    <section id="testimonials" className="section bg-[#e6eaef] py-12">
      <h2 className="section-title">What Our Students Say</h2>
      <p className="section-description">Hear from students who used MicroLearn to catch up</p>

      <div className="testimonials-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, index) => (
          <div key={index} className="testimonial-card mb-6 md:mb-0">
            <div className="stars flex gap-1">
              {[...Array(Math.floor(t.stars))].map((_, i) => (
                <svg key={i} width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77
                    5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
              {t.stars % 1 > 0 && (
                <svg width="20" height="20" fill="currentColor" opacity="0.3" viewBox="0 0 24 24">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77
                    5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              )}
            </div>

            <p className="testimonial-text">"{t.text}"</p>

            <div className="testimonial-author flex items-center gap-4 mt-4">
              <Image src={t.image} alt={t.name} width={48} height={48} className="author-image rounded-full" />
              <div className="author-info">
                <h4 className="font-bold">{t.name}</h4>
                <p className="text-sm text-gray-600">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
