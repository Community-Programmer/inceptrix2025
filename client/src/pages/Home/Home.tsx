import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Feature } from "./types";
import FeatureCard from "./FeatureCard";
const features: Feature[] = [
  {
    id: 1,
    title: "AI Tutor",
    description:
      "1-to-1 interaction with AI tutors, doubt solving, and screen sharing capabilities for personalized learning.",
    icon: "user-plus",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    title: "Voice-Controlled Whiteboard",
    description:
      "Create diagrams, flowcharts, and code with just your voice. Real-time visualization of your ideas.",
    icon: "mic",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 3,
    title: "AI Mock Interviews",
    description:
      "Practice with realistic 3D AI interviewers with voice, body movement, and screen sharing capabilities.",
    icon: "video",
    color: "from-green-500 to-green-600",
  },
  {
    id: 4,
    title: "Resume Evaluator & Builder",
    description:
      "Get instant feedback on your resume and build professional resumes with AI assistance.",
    icon: "file-text",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    id: 5,
    title: "Roadmap Generator",
    description:
      "Create personalized learning roadmaps for any field or career path with AI guidance.",
    icon: "map",
    color: "from-red-500 to-red-600",
  },
  {
    id: 6,
    title: "Custom Course Creator",
    description:
      "Build tailored courses that match your learning style, pace, and goals.",
    icon: "book-open",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id: 7,
    title: "Interview Quiz Generator",
    description:
      "Generate custom quizzes based on job descriptions and company profiles.",
    icon: "help-circle",
    color: "from-pink-500 to-pink-600",
  },
  {
    id: 8,
    title: "Chat with PDF",
    description:
      "Upload study materials and interact with them through natural conversation.",
    icon: "file",
    color: "from-cyan-500 to-cyan-600",
  },
  {
    id: 9,
    title: "Company-Specific DSA Questions",
    description:
      "Practice with data structures and algorithms questions tailored to specific companies.",
    icon: "code",
    color: "from-orange-500 to-orange-600",
  },
  {
    id: 10,
    title: "Real-World Industry Insights",
    description:
      "Get up-to-date information about industry trends, technologies, and best practices.",
    icon: "trending-up",
    color: "from-teal-500 to-teal-600",
  },
];

function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;

      const { clientX, clientY } = e;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;

      heroRef.current.style.setProperty("--mouse-x", x.toString());
      heroRef.current.style.setProperty("--mouse-y", y.toString());
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div className="font-sans bg-gradient-to-br from-white to-gray-50 min-h-screen">
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 top-[-70px] md:pb-28 overflow-hidden bg-gradient-to-r from-blue-50 to-purple-50"
        style={
          {
            "--mouse-x": "0.5",
            "--mouse-y": "0.5",
          } as React.CSSProperties
        }
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-3xl transform translate-x-[calc(var(--mouse-x)*20px)] translate-y-[calc(var(--mouse-y)*20px)]"></div>
          <div className="absolute top-1/2 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-green-200/30 to-blue-200/30 blur-3xl transform translate-x-[calc(var(--mouse-x)*-20px)] translate-y-[calc(var(--mouse-y)*-20px)]"></div>
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 rounded-full bg-gradient-to-r from-purple-200/30 to-pink-200/30 blur-3xl transform translate-x-[calc(var(--mouse-x)*15px)] translate-y-[calc(var(--mouse-y)*15px)]"></div>
        </div>

        <div className="container mx-auto px-6 z-10 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              className="lg:col-span-6 lg:pr-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight">
                Revolutionize Learning{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
                  with AI
                </span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 max-w-lg">
                Experience personalized education powered by artificial
                intelligence. Learn faster, smarter, and more effectively than
                ever before.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try It Free
                </motion.button>
                <motion.button
                  className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 transform hover:-translate-y-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">10k+</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">95%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800">24/7</div>
                  <div className="text-sm text-gray-600">AI Support</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-blue-500 opacity-70"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-purple-500 opacity-70"></div>
                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 w-6 h-6 rounded-full bg-green-500 opacity-70"></div>
                <div className="absolute top-1/2 -left-3 transform -translate-y-1/2 w-6 h-6 rounded-full bg-yellow-500 opacity-70"></div>

                {/* Main image container */}
                <div className="relative bg-white rounded-full p-4 shadow-2xl border border-gray-100 overflow-hidden">
                  z{/* Main platform image */}
                  <div className="relative rounded-full overflow-hidden shadow-lg">
                    <img
                      src="src/assets/ai-first.jpg"
                      alt="AI Learning Platform Interface"
                      className="w-full h-auto object-cover"
                    />

                    {/* Floating UI elements */}
                    <motion.div
                      className="absolute top-8 right-8 bg-white p-4 rounded-xl shadow-lg"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    ></motion.div>

                    <motion.div
                      className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-lg"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    ></motion.div>
                  </div>
                  {/* Action button */}
                  <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-4 shadow-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trusted by section */}
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with educational
              expertise to deliver an unmatched learning experience.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </section>
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              See It In Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience how our AI-powered platform transforms the way you
              learn and prepare for your career.
            </p>
          </motion.div>

          <div ref={ref} className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={
                isInView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.95 }
              }
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10 bg-white/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/50 max-w-5xl mx-auto overflow-hidden"
            >
              {/* Demo video or interactive preview */}
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                <img
                  src="/placeholder.svg?height=600&width=1000"
                  alt="Platform Demo"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Interactive feature highlights */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  {
                    title: "AI Tutoring",
                    description: "Get personalized help 24/7",
                  },
                  {
                    title: "Interactive Exercises",
                    description: "Learn by doing with real-time feedback",
                  },
                  {
                    title: "Progress Tracking",
                    description: "Monitor your growth with detailed analytics",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-md border border-gray-100"
                  >
                    <h3 className="font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Decorative elements */}
            <div className="absolute top-1/4 -left-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
