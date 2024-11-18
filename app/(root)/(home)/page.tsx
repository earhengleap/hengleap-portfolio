"use client";

import { Send, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, Variants } from "framer-motion";
import React, { useState } from "react";
import AboutSection from "../about/page";
import SkillsSection from "../skills/page";
import ServicesPage from "../services/page";
import ContactPage from "../contact/page";
import ScrollToTop from "@/components/scroll-to-top";
import PortfolioPage from "../porfolio/page";
import { ParallaxText } from "./_components/parallax-text";
import { AnimatedSection } from "./_components/animated-section";
import { SplitAnimation } from "./_components/split-animation";
import Loader from "@/components/loading";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialClick = (href: string) => {
    setIsLoading(true);

    // Simulate loading for external links
    setTimeout(() => {
      window.location.href = href;
    }, 1500);
  };

  const profileVariants: Variants = {
    hidden: {
      scale: 0.8,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  const socialVariants: Variants = {
    hidden: { x: -25, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const contentVariants: Variants = {
    hidden: { x: 25, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <main className="flex flex-col w-full overflow-x-hidden">
      {isLoading && <Loader />}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <section
        id="homeSection"
        className="min-h-screen relative flex items-center py-16 sm:py-20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <SplitAnimation>
            <motion.div variants={profileVariants} className="relative w-full">
              <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/my-profile.jpg"
                  alt="Profile Picture"
                  fill
                  style={{ objectFit: "cover" }}
                  className="w-full h-full transform hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>

              <motion.div
                variants={socialVariants}
                className="absolute -left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4 z-10"
              >
                {[
                  {
                    icon: Send,
                    href: "https://t.me/imxingg",
                    label: "Telegram",
                    color: "hover:text-pink-600",
                  },
                  {
                    icon: Linkedin,
                    href: "https://linkedin.com/in/earhengleap",
                    label: "Linkedin",
                    color: "hover:text-pink-500",
                  },
                  {
                    icon: Github,
                    href: "https://github.com/earhengleap",
                    label: "Github",
                    color: "hover:text-gray-900",
                  },
                ].map((social, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <Link
                      href={social.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSocialClick(social.href);
                      }}
                      className={`
                flex items-center justify-center
                w-10 h-10 sm:w-12 sm:h-12
                bg-white rounded-full
                shadow-lg hover:shadow-xl
                transform hover:-translate-y-1
                transition-all duration-300
                relative z-10
              `}
                      aria-label={social.label}
                    >
                      <social.icon
                        className={`
                  h-5 w-5 sm:h-6 sm:w-6
                  text-gray-700 ${social.color}
                  transition-colors duration-300
                `}
                      />
                      <span
                        className="
                absolute left-full ml-4
                bg-white px-3 py-1
                rounded-md shadow-md
                text-sm font-medium
                opacity-0 group-hover:opacity-100
                transform -translate-x-2 group-hover:translate-x-0
                transition-all duration-300
                whitespace-nowrap
                pointer-events-none
              "
                      >
                        {social.label}
                      </span>
                    </Link>
                    <div
                      className="
              absolute inset-0
              bg-gradient-to-r from-blue-500 to-purple-500
              opacity-0 group-hover:opacity-20
              rounded-full
              transition-opacity duration-300
            "
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              variants={contentVariants}
              className="flex flex-col space-y-8 lg:space-y-10"
            >
              <motion.div variants={contentVariants} className="space-y-6">
                {/* Name with animated background */}
                <motion.div className="relative">
                  <motion.h1
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight"
                  >
                    <motion.span
                      className="inline-block text-black"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    >
                      HengLeap
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        rotate: [0, -5, 5, -5, 0],
                      }}
                      transition={{
                        opacity: { duration: 0.5, delay: 1 },
                        rotate: {
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 4,
                          ease: "easeInOut",
                        },
                      }}
                      className="inline-block ml-3 text-4xl sm:text-5xl"
                    >
                      👋
                    </motion.span>
                  </motion.h1>
                </motion.div>

                {/* Role with typing effect */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="relative h-12"
                >
                  <motion.p
                    className="text-2xl sm:text-3xl lg:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900"
                    animate={{
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      times: [0, 0.2, 0.8, 1],
                    }}
                  >
                    Software Engineer
                  </motion.p>
                </motion.div>

                {/* Description with line drawing effect */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="relative max-w-lg"
                >
                  <motion.div
                    className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600"
                    initial={{ height: 0 }}
                    animate={{ height: "100%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <motion.p className="text-lg sm:text-xl text-gray-600 leading-relaxed pl-4">
                    I&apos;m a passionate Software Engineer based in Cambodia,
                    specializing in creating exceptional digital experiences.
                    With a focus on innovation and clean code, I transform ideas
                    into reality.
                  </motion.p>
                </motion.div>

                {/* New CTA Button */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="mt-8"
                >
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    }}
                    className="w-fit"
                  >
                    <Button
                      variant="ghost"
                      size="lg"
                      className="group relative bg-transparent hover:bg-black/5 rounded-full px-8 py-4 text-base border-2 border-black/80 transition-all duration-300 min-w-[160px] overflow-hidden"
                    >
                      <motion.span
                        className="flex items-center justify-center gap-2 text-black w-full"
                        initial={{ gap: "8px" }}
                        whileHover={{ gap: "12px" }}
                        transition={{
                          duration: 0.3,
                          ease: "easeInOut",
                        }}
                      >
                        Let's Talk
                        <div className="relative">
                          <motion.div
                            initial={{ x: 0 }}
                            animate={{
                              x: [0, 5, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatType: "reverse",
                              ease: "easeInOut",
                            }}
                            className="relative"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-black transform rotate-[-45deg]"
                            >
                              <path
                                d="M1 8H15M15 8L8 1M15 8L8 15"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <div className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-black"></div>
                          </motion.div>
                        </div>
                      </motion.span>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </SplitAnimation>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2"
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-3 bg-gray-400 rounded-full"
              animate={{
                y: [0, 8, 0],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <span className="text-sm text-gray-400 font-medium">Scroll down</span>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <section id="aboutSection" className="min-h-screen py-12 sm:py-16">
          <AnimatedSection direction="left">
            <AboutSection />
          </AnimatedSection>
        </section>

        <section id="skillsSection" className="min-h-screen py-12 sm:py-16">
          <AnimatedSection direction="right">
            <SkillsSection />
          </AnimatedSection>
        </section>

        <section id="servicesSection" className="min-h-screen py-12 sm:py-16">
          <AnimatedSection direction="left">
            <ServicesPage />
          </AnimatedSection>
        </section>

        <section className="py-16 bg-gradient-to-b">
          <div className="relative overflow-hidden">
            {/* Optional overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none"></div>
            <ParallaxText baseVelocity={-5}>Portfolio Showcase</ParallaxText>
            <ParallaxText baseVelocity={5}>Creative Works</ParallaxText>
          </div>
        </section>

        <section id="portfolioSection" className="min-h-screen py-12 sm:py-16">
          <AnimatedSection direction="right">
            <PortfolioPage />
          </AnimatedSection>
        </section>

        <section id="contactSection" className="min-h-screen py-12 sm:py-16">
          <AnimatedSection direction="left">
            <ContactPage />
          </AnimatedSection>
        </section>
      </div>

      <ScrollToTop />
    </main>
  );
};

export default HomePage;
