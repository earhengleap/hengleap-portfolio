"use client";

import Image from "next/image";
import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const projects = [
  {
    title: "E-commerce Website",
    category: "Web Development",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Mobile Banking App",
    category: "App Development",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Brand Identity Design",
    category: "Branding",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Social Media App",
    category: "UI/UX Design",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Portfolio Website",
    category: "Web Development",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Restaurant App",
    category: "App Development",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
];

const PortfolioPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
    rootMargin: "50px",
  });

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
          <motion.div
            key={index}
            initial="hidden"
            animate={controls}
            variants={getProjectVariants(index)}
            whileHover="hover"
            className="relative overflow-hidden rounded-2xl cursor-pointer h-[300px] bg-gray-100"
          >
            <motion.div
              variants={projectHoverVariants}
              className="h-full w-full"
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <motion.div
                variants={overlayVariants}
                initial={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex flex-col justify-center items-center text-white p-6"
              >
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-sm">{project.category}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
