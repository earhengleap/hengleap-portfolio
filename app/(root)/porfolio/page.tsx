"use client";

import Image from "next/image";
import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

const projects = [
  {
    title: "Brilliant AI",
    category: "AI Tool Platform",
    description:
      "Create content using AI 10x faster. Features user-friendly interface with powerful content generation capabilities.",
    image: "/brilliant-cover.mp4",
    isVideo: true,
    website: "https://brilliantai.vercel.app/",
  },
  {
    title: "InFinance",
    category: "Financial Platform",
    description:
      "A comprehensive financial platform featuring real-time market data, portfolio management, and advanced analytics tools for informed investment decisions.",
    image: "/infinance.vercel.app.png",
    isVideo: false,
    website: "https://infinance.vercel.app/",
  },
  {
    title: "Pheasa",
    category: "E-learning Platform",
    description:
      "An innovative e-learning platform providing interactive courses, personalized learning paths, and comprehensive educational resources for students and educators.",
    image: "/pheasa.vercel.app.png",
    isVideo: false,
    website: "https://pheasa.vercel.app/",
  },
  {
    title: "Space Themed Portfolio",
    category: "Web Development",
    description:
      "An immersive space-themed portfolio website showcasing creative work through interactive design elements and smooth animations.",
    image: "/space.portfolio.app.png",
    isVideo: false,
    website: "https://imxing.vercel.app/",
  },
  {
    title: "Coming Soon",
    category: "Future Project",
    description:
      "A new exciting project currently under development. Stay tuned for updates!",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
    isVideo: false,
    website: "",
  },
  {
    title: "Coming Soon",
    category: "Future Project",
    description:
      "Another innovative project in the pipeline. More details coming soon!",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
    isVideo: false,
    website: "",
  },
];

const PortfolioPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "50px",
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const headerVariants: Variants = {
    hidden: {
      opacity: 0,
      y: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  const getProjectVariants = (index: number): Variants => {
    const column = index % 3;
    const xOffset = column === 0 ? -50 : column === 2 ? 50 : 0;

    return {
      hidden: {
        opacity: 0,
        x: xOffset,
        y: 30,
      },
      visible: {
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.6, -0.05, 0.01, 0.99],
          delay: 0.1 * index,
        },
      },
    };
  };

  const projectHoverVariants = {
    hover: {
      scale: 1.03,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const overlayVariants = {
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const arrowVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-20" ref={ref}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={headerVariants}
        className="text-center mb-16"
      >
        <h2 className="text-3xl font-bold mb-4">My Portfolio</h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "5rem" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1.5 bg-blue-600 rounded-full mx-auto mb-4"
        />
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore some of my recent projects and creative works
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <Link
            key={index}
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div
              initial="hidden"
              animate={controls}
              variants={getProjectVariants(index)}
              whileHover="hover"
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setMousePosition({
                  x: e.clientX - rect.left,
                  y: e.clientY - rect.top,
                });
              }}
              className="relative overflow-hidden rounded-2xl cursor-pointer h-[300px] bg-gray-100"
            >
              <motion.div
                variants={projectHoverVariants}
                className="h-full w-full"
              >
                {project.isVideo ? (
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full"
                  >
                    <source src={project.image} type="video/mp4" />
                  </video>
                ) : (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
                <motion.div
                  variants={overlayVariants}
                  initial={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white p-6"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm mb-2">{project.category}</p>
                  <p className="text-xs text-center">{project.description}</p>
                </motion.div>

                {hoveredCard === index && (
                  <motion.div
                    variants={arrowVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute pointer-events-none"
                    style={{
                      left: mousePosition.x - 25,
                      top: mousePosition.y - 25,
                    }}
                  >
                    <div className="bg-white rounded-lg p-3 shadow-lg">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 17L17 7M17 7H7M17 7V17"
                          stroke="black"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
