"use client";
import { motion } from "framer-motion";

const Footer = () => {
  const socialLinks = [
    { name: "Twitter", icon: "twitter", url: "#" },
    { name: "Facebook", icon: "facebook", url: "#" },
    { name: "Instagram", icon: "instagram", url: "#" },
    { name: "LinkedIn", icon: "linkedin", url: "#" },
    { name: "YouTube", icon: "youtube", url: "#" },
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-50 to-purple-50 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="relative">
          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 mb-16 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-100 rounded-full opacity-50 blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-lg text-gray-600">
                  Join thousands of students already using our AI-powered
                  platform to accelerate their education and career.
                </p>
              </div>

              <div className="md:w-1/3 flex flex-col gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Free
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  Schedule Demo
                </motion.button>
              </div>
            </div>
          </motion.div>

          

          {/* Footer content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">EduAI</h3>
              <p className="text-gray-600 mb-4">
                Revolutionizing education with AI-powered learning tools and
                personalized experiences.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                    aria-label={link.name}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Platform</h3>
              <ul className="space-y-2">
                {["Features", "Pricing", "Testimonials", "FAQ", "Support"].map(
                  (item, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Resources
              </h3>
              <ul className="space-y-2">
                {[
                  "Blog",
                  "Documentation",
                  "Community",
                  "Webinars",
                  "Tutorials",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Company</h3>
              <ul className="space-y-2">
                {[
                  "About Us",
                  "Careers",
                  "Press",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-500 transition-colors duration-300"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} NextHire. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
