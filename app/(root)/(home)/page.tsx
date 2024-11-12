"use client";

import { Instagram, Dribbble, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useAnimation,
  useScroll,
  Variants,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { wrap } from "@motionone/utils";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";
import React from "react";

import AboutSection from "../about/page";
import SkillsSection from "../skills/page";
import ServicesPage from "../services/page";
import ContactPage from "../contact/page";
import ScrollToTop from "@/components/scroll-to-top";
import PortfolioPage from "../porfolio/page";

// Add the ParallaxText component before your HomePage component
interface ParallaxProps {
  children: string;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="parallax">
      <motion.div className="scroller" style={{ x }}>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
        <span>{children} </span>
      </motion.div>
    </div>
  );
}

const AnimatedSection = ({
  children,
  direction = "left",
  className = "",
}: {
  children: ReactNode;
  direction?: "left" | "right";
  className?: string;
}) => {
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

const SplitAnimation = ({ children }: { children: ReactNode }) => {
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

const HomePage = () => {
  const { scrollYProgress } = useScroll();

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
                  src="/profile.jpg"
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
                    icon: Instagram,
                    href: "#",
                    label: "Instagram",
                    color: "hover:text-pink-600",
                  },
                  {
                    icon: Dribbble,
                    href: "#",
                    label: "Dribbble",
                    color: "hover:text-pink-500",
                  },
                  {
                    icon: Github,
                    href: "#",
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
              className="flex flex-col space-y-6"
            >
              <motion.div variants={contentVariants} className="space-y-4">
                <motion.h1
                  variants={contentVariants}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
                >
                  HengLeap
                  <motion.span
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="inline-block ml-2 text-3xl sm:text-4xl"
                  >
                    👋
                  </motion.span>
                </motion.h1>

                <motion.p
                  variants={contentVariants}
                  className="text-xl sm:text-2xl lg:text-3xl text-gray-600 font-medium"
                >
                  Software Engineer
                </motion.p>

                <motion.p
                  variants={contentVariants}
                  className="text-base sm:text-lg text-gray-600 max-w-md leading-relaxed"
                >
                  I&apos;m a Software Engineer based in Cambodia, passionate
                  about my work.
                </motion.p>

                <motion.button
                  variants={contentVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    bg-gradient-to-r from-gray-900 to-gray-700
                    text-white
                    px-8 py-3
                    rounded-full
                    text-lg
                    font-medium
                    shadow-lg
                    hover:shadow-xl
                    transform hover:-translate-y-0.5
                    transition-all duration-300
                  "
                >
                  Say Hello
                </motion.button>
              </motion.div>
            </motion.div>
          </SplitAnimation>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2"
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

        <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
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
