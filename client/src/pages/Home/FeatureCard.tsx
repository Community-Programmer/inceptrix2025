"use client";

import type React from "react";

import { motion } from "framer-motion";
import {
  UserPlus,
  Mic,
  Video,
  FileText,
  Map,
  BookOpen,
  HelpCircle,
  File,
  Code,
  TrendingUp,
} from "lucide-react";
import type { Feature } from "./types";

const iconComponents: Record<string, React.ElementType> = {
  "user-plus": UserPlus,
  mic: Mic,
  video: Video,
  "file-text": FileText,
  map: Map,
  "book-open": BookOpen,
  "help-circle": HelpCircle,
  file: File,
  code: Code,
  "trending-up": TrendingUp,
};

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

const FeatureCard = ({ feature, index }: FeatureCardProps) => {
  const IconComponent = iconComponents[feature.icon];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 },
      }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
      <div className="relative bg-white backdrop-blur-sm border border-gray-100 p-8 rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300">
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-r ${feature.color} mb-6 shadow-md group-hover:shadow-lg transition-all duration-300`}
        >
          {IconComponent && <IconComponent className="h-7 w-7 text-white" />}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {feature.title}
        </h3>
        <p className="text-gray-600">{feature.description}</p>

        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;
