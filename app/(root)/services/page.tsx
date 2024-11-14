"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  CodeIcon,
  PaintbrushIcon,
  LayoutIcon,
  SmartphoneIcon,
  GlobeIcon,
  PaletteIcon,
} from "lucide-react";

const services = [
  {
    icon: LayoutIcon,
    title: "UI/UX Design",
    description:
      "Create beautiful and functional interfaces with focus on user experience.",
  },
  {
    icon: CodeIcon,
    title: "Web Development",
    description:
      "Build responsive and dynamic websites using modern technologies.",
  },
  {
    icon: SmartphoneIcon,
    title: "App Development",
    description:
      "Develop cross-platform mobile applications for iOS and Android.",
  },
  {
    icon: PaintbrushIcon,
    title: "Brand Identity",
    description:
      "Design memorable brand identities that leave lasting impressions.",
  },
  {
    icon: PaletteIcon,
    title: "Graphic Design",
    description: "Create stunning visuals for digital and print media.",
  },
  {
    icon: GlobeIcon,
    title: "Digital Marketing",
    description: "Implement effective strategies to grow your online presence.",
  },
];

const ServicesPage = () => {
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
        ease: [0.77, 0, 0.175, 1],
      },
    },
  };

  const getColumnVariants = (columnIndex: number): Variants => {
    let xOffset = 0;

    // Determine x-offset based on column position
    if (columnIndex % 3 === 0) xOffset = -50; // Left column
    else if (columnIndex % 3 === 1) xOffset = 0; // Middle column
    else xOffset = 50; // Right column

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
          ease: [0.77, 0, 0.175, 1],
          delay: 0.1 * columnIndex,
        },
      },
    };
  };

  const iconVariants: Variants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-20" ref={ref}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={headerVariants}
        className="text-center mb-16 space-y-4"
      >
        <h2 className="text-3xl font-bold">My Services</h2>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "5rem" }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.77, 0, 0.175, 1],
          }}
          className="h-1.5 bg-blue-600 rounded-full mx-auto"
        />
        <p className="text-gray-600 max-w-2xl mx-auto">
          I offer a wide range of creative services to help bring your ideas to
          life
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate={controls}
            variants={getColumnVariants(index)}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.3, ease: [0.77, 0, 0.175, 1] },
            }}
            className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all"
          >
            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={iconVariants}
            >
              <service.icon className="h-12 w-12 mb-6 text-blue-600" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
