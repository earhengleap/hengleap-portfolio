"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";
import React from "react";

// Split animation wrapper component
const SplitAnimation = ({ children }: { children: ReactNode }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const leftContentVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
      },
    },
  };

  const rightContentVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
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
      className="grid md:grid-cols-2 gap-16 items-center"
    >
      <motion.div variants={leftContentVariants}>{leftContent}</motion.div>
      <motion.div variants={rightContentVariants}>{rightContent}</motion.div>
    </motion.div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen pt-32 px-8 flex justify-center items-center">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-4 mb-16 text-center">
          <h1 className="text-5xl font-bold">About Me</h1>
          <div className="w-20 h-1.5 bg-blue-600 rounded-full mx-auto" />
        </div>

        <SplitAnimation>
          {/* Left Content */}
          <div className="relative h-[400px] w-full rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
            <div className="w-full h-full bg-gray-200">
              {/* Add your image here */}
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <h2 className="text-3xl font-semibold">
              Web Developer & Visual Designer
            </h2>
            <p className="text-gray-600 leading-relaxed">
              I&apos;m a web developer and designer with a passion for creating
              beautiful, functional, and user-centered digital experiences. With
              4 years of experience in the field, I am always looking forward to
              improving my skills and learning new technologies.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Personal Info</h3>
                <ul className="space-y-4">
                  <li>
                    <span className="text-gray-600">Name:</span>{" "}
                    <p className="font-medium">John Smith</p>
                  </li>
                  <li>
                    <span className="text-gray-600">Age:</span>{" "}
                    <p className="font-medium">25 Years</p>
                  </li>
                  <li>
                    <span className="text-gray-600">Location:</span>{" "}
                    <p className="font-medium">New York, USA</p>
                  </li>
                  <li>
                    <span className="text-gray-600">Experience:</span>{" "}
                    <p className="font-medium">4 Years</p>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Interests</h3>
                <ul className="space-y-4">
                  <li>
                    <span className="text-gray-600">UI/UX</span>
                  </li>
                  <li>
                    <span className="text-gray-600">Web Development</span>
                  </li>
                  <li>
                    <span className="text-gray-600">Mobile Design</span>
                  </li>
                  <li>
                    <span className="text-gray-600">Photography</span>
                  </li>
                </ul>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              Download CV
            </motion.button>
          </div>
        </SplitAnimation>
      </div>
    </div>
  );
};

export default AboutPage;
