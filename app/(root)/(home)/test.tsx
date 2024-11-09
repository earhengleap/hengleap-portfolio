"use client";

import { Instagram, Dribbble, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";
import React from "react";

import AboutSection from "../about/page";
import SkillsSection from "../skills/page";
import ServicesPage from "../services/page";
import ContactPage from "../contact/page";
import ScrollToTop from "@/components/scroll-to-top";
import PortfolioPage from "../porfolio/page";

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

const AnimatedSection = ({
  children,
  direction,
}: {
  children: ReactNode;
  direction: "left" | "right";
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, x: direction === "left" ? -50 : 50 },
        visible: {
          opacity: 1,
          x: 0,
          transition: { duration: 0.6, ease: "easeOut" },
        },
      }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
};

const HomePage = () => {
  return (
    <main className="flex flex-col">
      <section
        id="homeSection"
        className="min-h-screen relative flex items-center"
      >
        <div className="max-w-7xl mx-auto px-8 w-full">
          <SplitAnimation>
            {/* Left Column - Profile Image and Social Links */}
            <div className="flex flex-col items-center space-y-8">
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
                <Image
                  src="/profile.jpg"
                  alt="Profile Picture"
                  fill
                  style={{ objectFit: "cover" }}
                  className="w-full h-full"
                  priority
                />
                {/* Social Links */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4">
                  {[
                    { icon: Instagram, href: "#", label: "Instagram" },
                    { icon: Dribbble, href: "#", label: "Dribbble" },
                    { icon: Github, href: "#", label: "Github" },
                  ].map((social, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={social.href}
                        className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300"
                        aria-label={social.label}
                      >
                        <social.icon className="h-5 w-5 text-gray-700 hover:text-gray-900 transition-colors" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="flex flex-col space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold">
                HengLeap <span className="text-4xl">👋</span>
              </h1>
              <p className="text-2xl text-gray-600">Software Engineer</p>
              <p className="text-gray-600 max-w-md">
                I&apos;m a Software Engineer based in Cambodia, passionate about
                my work.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gray-900 text-white px-6 py-3 rounded-full w-fit hover:bg-gray-800 transition-colors"
              >
                Say Hello
              </motion.button>
            </div>
          </SplitAnimation>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1 h-2 bg-gray-400 rounded-full"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          </div>
          <span className="text-sm text-gray-400">Scroll down</span>
        </div>
      </section>

      {/* About Section */}
      <section id="aboutSection" className="min-h-screen">
        <AnimatedSection direction="left">
          <AboutSection />
        </AnimatedSection>
      </section>

      {/* Skills Section */}
      <section id="skillsSection" className="min-h-screen">
        <AnimatedSection direction="right">
          <SkillsSection />
        </AnimatedSection>
      </section>

      {/* Services Section */}
      <section id="servicesSection" className="min-h-screen">
        <AnimatedSection direction="left">
          <ServicesPage />
        </AnimatedSection>
      </section>

      {/* Portfolio Section */}
      <section id="portfolioSection" className="min-h-screen">
        <AnimatedSection direction="right">
          <PortfolioPage />
        </AnimatedSection>
      </section>

      {/* Contact Section */}
      <section id="contactSection" className="min-h-screen">
        <AnimatedSection direction="left">
          <ContactPage />
        </AnimatedSection>
      </section>

      <ScrollToTop />
    </main>
  );
};

export default HomePage;

//OLD
