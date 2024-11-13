"use client";

import { ReactNode, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface AnimatedSectionProps {
  children: ReactNode;
  direction?: "left" | "right";
  className?: string;
}

export const AnimatedSection = ({
  children,
  direction = "left",
  className = "",
}: AnimatedSectionProps) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {
          opacity: 0,
          x: direction === "left" ? -50 : 50,
          y: 25,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            type: "spring",
            duration: 1,
            damping: 15,
            stiffness: 60,
          },
        },
      }}
      className={`overflow-hidden w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
