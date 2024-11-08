"use client";

import { Instagram, Dribbble, Github } from "lucide-react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react"; // Import ReactNode for typing

import AboutSection from "../about/page";
import SkillsSection from "../skills/page";
import ServicesPage from "../services/page";
import ContactPage from "../contact/page";
import ScrollToTop from "@/components/scroll-to-top";
import PortfolioPage from "../porfolio/page";

// Reusable animated section component with left/right animation
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
      {/* Hero Section */}
      <section
        id="homeSection"
        className="min-h-screen relative flex items-center"
      >
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Column - Social Links */}
            <div className="flex flex-col space-y-6">
              <div className="space-y-4">
                {[
                  { icon: Instagram, href: "#" },
                  { icon: Dribbble, href: "#" },
                  { icon: Github, href: "#" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.href}
                    className="block w-fit hover:text-gray-600 transition-colors"
                  >
                    <social.icon className="h-6 w-6" />
                  </Link>
                ))}
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
              <button className="bg-gray-900 text-white px-6 py-3 rounded-full w-fit hover:bg-gray-800 transition-colors">
                Say Hello
              </button>
            </div>
          </div>
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

      {/* Other Sections with AnimatedSection for left/right fade-in on scroll */}
      <section id="aboutSection" className="min-h-screen">
        <AnimatedSection direction="left">
          <AboutSection />
        </AnimatedSection>
      </section>

      <section id="skillsSection" className="min-h-screen">
        <AnimatedSection direction="right">
          <SkillsSection />
        </AnimatedSection>
      </section>

      <section id="servicesSection" className="min-h-screen">
        <AnimatedSection direction="left">
          <ServicesPage />
        </AnimatedSection>
      </section>

      <section id="portfolioSection" className="min-h-screen">
        <AnimatedSection direction="right">
          <PortfolioPage />
        </AnimatedSection>
      </section>

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
