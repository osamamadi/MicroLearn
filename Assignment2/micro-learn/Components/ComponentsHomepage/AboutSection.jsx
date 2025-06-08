// ✅ AboutSection.jsx
import Image from "next/image"

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-gradient-to-r from-[#b8c6d9] to-[#a5b4d0] text-black">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <Image src="/about-image.jpg" alt="Student learning" width={600} height={400} className="rounded-lg shadow-lg" />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-6">About MicroLearn</h2>
          <p className="text-lg mb-4">
            MicroLearn helps students catch up after missing lectures using focused 6-minute videos.
          </p>
          <p className="text-lg">
            Education should be accessible and time-efficient. Our platform delivers both.
          </p>
        </div>
      </div>
    </section>
  )
}