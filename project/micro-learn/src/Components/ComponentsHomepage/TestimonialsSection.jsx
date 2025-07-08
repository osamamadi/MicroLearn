import Image from "next/image";

// TestimonialsSection displays feedback from real students who used MicroLearn
export default function TestimonialsSection() {
  // Array of testimonial objects (text, name, role, image, rating)
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
  ];

  return (
    <section id="testimonials" className="section  dark:bg-gray-900 py-12">
      {/* Section title */}
      <h2 className="section-title text-gray-900 dark:text-white">
        What Our Students Say
      </h2>
      <p className="section-description text-gray-700 dark:text-gray-300">
        Hear from students who used MicroLearn to catch up
      </p>
      {/* Grid layout for testimonial cards (responsive) */}

      <div className="testimonials-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="testimonial-card bg-white dark:bg-[#2c2c2c] dark:text-white mb-6 md:mb-0"
          >
            {/* Star rating display */}
            <div className="stars flex gap-1 text-yellow-500">
              {[...Array(Math.floor(t.stars))].map((_, i) => (
                <svg
                  key={i}
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77
                    5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
              ))}
              {t.stars % 1 > 0 && (
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  opacity="0.3"
                  viewBox="0 0 24 24"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77
                    5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
              )}
            </div>

            {/* Testimonial text */}
            <p className="testimonial-text text-gray-700 dark:text-gray-300">
              "{t.text}"
            </p>

            {/* Author info: image, name, and role */}
            <div className="testimonial-author flex items-center gap-4 mt-4">
              <Image
                src={t.image}
                alt={t.name}
                width={48}
                height={48}
                className="author-image rounded-full"
              />
              <div className="author-info">
                <h4 className="font-bold text-gray-900 dark:text-white">
                  {t.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
