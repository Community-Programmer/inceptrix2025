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
