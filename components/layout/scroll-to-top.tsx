"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{
            scale: 1.1,
            opacity: 0.9,
          }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="relative flex flex-col items-center justify-center w-12 h-24 transition-all duration-300 group"
        >
          <div className="relative">
            <motion.div
              animate={{
                y: [-2, -4, -2],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-[-4px]"
            >
              <ChevronUp className="w-5 h-5 absolute -top-1" />
              <ChevronUp className="w-5 h-5" />
            </motion.div>
          </div>
          <div className="text-xs tracking-widest rotate-90 mt-8">
            SCROLL&nbsp;TOP
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
