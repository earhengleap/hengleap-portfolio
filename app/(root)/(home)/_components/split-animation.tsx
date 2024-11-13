"use client";

import { ReactNode, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import React from "react";

interface SplitAnimationProps {
  children: ReactNode;
}

export const SplitAnimation = ({ children }: SplitAnimationProps) => {
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

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const leftContentVariants = {
    hidden: { x: -50, opacity: 0, y: 25 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 60,
        duration: 1,
      },
    },
  };

  const rightContentVariants = {
    hidden: { x: 50, opacity: 0, y: 25 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 60,
        duration: 1,
      },
    },
  };

  const childrenArray = React.Children.toArray(children);
  const midPoint = Math.ceil(childrenArray.length / 2);
  const leftContent = childrenArray.slice(0, midPoint);
  const rightContent = childrenArray.slice(midPoint);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center w-full"
    >
      <motion.div variants={leftContentVariants} className="w-full">
        {leftContent}
      </motion.div>
      <motion.div variants={rightContentVariants} className="w-full">
        {rightContent}
      </motion.div>
    </motion.div>
  );
};
