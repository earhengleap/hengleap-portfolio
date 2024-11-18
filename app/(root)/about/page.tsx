// app/(root)/about/page.tsx

"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import React from "react";
import Image from "next/image";

const AboutPage = () => {
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

  const headerVariants: Variants = {
    hidden: { y: -50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80,
        duration: 1.2,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80,
        duration: 1.2,
      },
    },
  };

  const contentVariants: Variants = {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80,
        duration: 1.2,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 80,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="min-h-screen pt-32 px-8 flex justify-center items-center">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div
          variants={headerVariants}
          className="space-y-4 mb-16 text-center"
        >
          <h1 className="text-5xl font-bold">About Me</h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="h-1.5 bg-blue-600 rounded-full mx-auto"
          />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left Content - Image */}
          <motion.div variants={imageVariants}>
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
              <Image
                src="/about-me.jpg"
                alt="About Me"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>

          {/* Right Content - Information */}
          <motion.div variants={contentVariants} className="space-y-8">
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-semibold"
            >
              Web & Mobile Developer
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-gray-600 leading-relaxed"
            >
              I&apos;m a full-stack developer specializing in web and mobile
              development, with expertise in creating user-centered digital
              experiences. I also bring UI/UX design skills to my projects,
              ensuring they&apos;re not only functional but also intuitive and
              engaging. With 3 years of experience, I&apos;m constantly
              exploring new technologies and enhancing my skill set.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 gap-8"
            >
              <div>
                <h3 className="font-semibold mb-4">Personal Info</h3>
                <ul className="space-y-4">
                  {[
                    { label: "Name", value: "Hengleap" },
                    { label: "Age", value: "23 Years" },
                    { label: "Location", value: "Cambodia, PP" },
                    { label: "Experience", value: "3 Years" },
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-600">{item.label}:</span>{" "}
                      <p className="font-medium">{item.value}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Interests</h3>
                <ul className="space-y-4">
                  {[
                    "Web Development",
                    "Mobile Development",
                    "UI/UX Design",
                    "New Technologies",
                  ].map((interest, index) => (
                    <motion.li
                      key={index}
                      variants={itemVariants}
                      custom={index}
                      whileHover={{ x: 5 }}
                      className="text-gray-600"
                    >
                      {interest}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-900 text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              Download CV
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
