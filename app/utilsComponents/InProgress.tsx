"use client";

import { motion } from "framer-motion";
import { Sparkles, Wrench, Rocket } from "lucide-react";

export default function InProgress() {
  return (
    <div className="flex items-center justify-center h-[80vh] w-full  from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black overflow-hidden relative">

      {/* Floating Background Blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-purple-400 rounded-full blur-3xl opacity-30"
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 30, 0] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30"
        animate={{ x: [0, -50, 50, 0], y: [0, 40, -40, 0] }}
        transition={{ repeat: Infinity, duration: 12 }}
      />

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl rounded-3xl p-10 text-center max-w-md w-full"
      >
        {/* Icon Animation */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex justify-center mb-6"
        >
          <Wrench className="w-12 h-12 text-purple-600" />
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
          We’re Building Something Awesome 🚀
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          This feature is currently under construction. Sit tight — it’s going to
          be worth it.
        </p>

        {/* Loader */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-3 h-3 bg-purple-600 rounded-full"
              animate={{ y: ["0%", "-100%", "0%"] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Bottom Icons */}
        <div className="flex justify-center gap-4 text-gray-500">
          <Sparkles className="animate-pulse" />
          <Rocket className="animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
}