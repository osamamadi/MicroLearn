// HowItWorks.jsx – section that visually explains how the platform works in 3 simple steps
export default function HowItWorks() {
  // Steps for learning flow: search, watch, quiz
  const steps = [
    {
      title: "Search a Topic",
      desc: "Type any subject or concept you want to learn — from algorithms to atoms.",
    },
    {
      title: "Watch Short Videos",
      desc: "Each lesson is just 6 minutes, designed to give you a focused understanding fast.",
    },
    {
      title: "Take Mini Quizzes",
      desc: "Test your knowledge immediately with 4-question quizzes based on what you learned.",
    },
  ];

  return (
    <section className="w-full   py-16 border-t border-gray-300 dark:border-gray-700 text-center">
      {/* Section title */}
      <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
        How It Works
      </h2>
      {/* Section subtitle */}
      <p className="text-gray-600 dark:text-gray-400 mb-10">
        Simple steps to start learning fast
      </p>

      {/* Steps layout: stacked on mobile, row on desktop */}
      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch w-full px-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-[#bfd1f3] dark:bg-[#2d2f40] rounded-2xl shadow-md p-6 flex-1 flex flex-col items-center text-center"
          >
            {/* Step number circle */}
            <div className="bg-[#5b47f2] dark:bg-[#6d5ffc] text-white w-10 h-10 flex items-center justify-center rounded-full text-lg font-semibold mb-4">
              {i + 1}
            </div>
            {/* Step title */}
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              {step.title}
            </h3>
            {/* Step description */}
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
