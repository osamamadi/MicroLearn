// ✅ HeroSection.jsx
import Image from "next/image";

// HeroSection is the main banner section that introduces the platform
export default function HeroSection() {
  return (
    <section className="hero-section dark:bg-gray-900 text-[var(--color-text)]">
      {/* Left side: text content (title + description) */}
      <div className="hero-content">
        <h1 className="hero-title">
          Learn Faster with <span className="text-accent">Micro-Learning</span>
        </h1>
        <p className="hero-description">
          Catch up on missed lectures with short, focused 6-minute video
          lessons. Designed for busy students, MicroLearn helps you grasp key
          concepts quickly and efficiently—anytime, anywhere.
        </p>
      </div>
      {/* Right side: illustration/image */}
      <div className="mt-8 md:mt-0">
        <Image
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
          alt="Students learning together"
          width={500}
          height={400}
          className="hero-image mx-auto md:mx-0"
        />
      </div>
    </section>
  );
}
