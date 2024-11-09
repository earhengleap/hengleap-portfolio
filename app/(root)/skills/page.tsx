"use client";

import { motion, useAnimation, Variants } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface SkillItem {
  name: string;
  level: number;
}

interface SkillSet {
  category: string;
  items: SkillItem[];
}

interface SkillCategoryProps {
  skillSet: SkillSet;
  variants: Variants;
}

const SkillsPage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: false, // Changed to false to trigger on every scroll
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

  const leftColumnVariants: Variants = {
    hidden: { x: -100, opacity: 0 },
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

  const middleColumnVariants: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
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

  const rightColumnVariants: Variants = {
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

  const skillBarVariants: Variants = {
    hidden: { width: 0, opacity: 0 },
    visible: (level: number) => ({
      width: `${level}%`,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeInOut",
        delay: 0.4,
      },
    }),
  };

  const skills: SkillSet[] = [
    {
      category: "Frontend Development",
      items: [
        { name: "HTML/CSS", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "React.js", level: 80 },
        { name: "Next.js", level: 75 },
      ],
    },
    {
      category: "Backend Development",
      items: [
        { name: "Node.js", level: 75 },
        { name: "Python", level: 70 },
        { name: "MongoDB", level: 65 },
        { name: "PostgreSQL", level: 60 },
      ],
    },
    {
      category: "Design",
      items: [
        { name: "Figma", level: 85 },
        { name: "Adobe XD", level: 80 },
        { name: "Photoshop", level: 75 },
        { name: "Illustrator", level: 70 },
      ],
    },
  ];

  const otherSkills: string[] = [
    "Git",
    "RESTful APIs",
    "Responsive Design",
    "SEO",
    "UI/UX Design",
    "Agile",
    "Problem Solving",
    "Team Collaboration",
  ];

  return (
    <div className="min-h-screen pt-32 px-8">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={headerVariants} className="space-y-4 mb-16">
          <h1 className="text-5xl font-bold">My Skills</h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="h-1.5 bg-blue-600 rounded-full"
          />
          <p className="text-gray-600 max-w-2xl">
            I&apos;ve spent several years improving my skills in both
            development and design. Here&apos;s an overview of my main technical
            skill sets and tools I use.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          <motion.div variants={leftColumnVariants}>
            <SkillCategory skillSet={skills[0]} variants={skillBarVariants} />
          </motion.div>

          <motion.div variants={middleColumnVariants}>
            <SkillCategory skillSet={skills[1]} variants={skillBarVariants} />
          </motion.div>

          <motion.div variants={rightColumnVariants}>
            <SkillCategory skillSet={skills[2]} variants={skillBarVariants} />
          </motion.div>
        </div>

        {/* Additional Skills */}
        <motion.div variants={middleColumnVariants} className="mt-20">
          <h2 className="text-2xl font-semibold mb-8">Other Skills</h2>
          <motion.div
            variants={middleColumnVariants}
            className="flex flex-wrap gap-4"
          >
            {otherSkills.map((skill, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 20 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.15,
                      type: "spring",
                      damping: 15,
                      stiffness: 80,
                      duration: 1.2,
                    },
                  },
                }}
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#f3f4f6",
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-100 rounded-full text-sm font-medium cursor-pointer"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const SkillCategory: React.FC<SkillCategoryProps> = ({
  skillSet,
  variants,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{skillSet.category}</h2>
      <div className="space-y-6">
        {skillSet.items.map((skill, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-medium">{skill.name}</span>
              <span className="text-gray-600">{skill.level}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                custom={skill.level}
                variants={variants}
                className="h-full bg-blue-600 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPage;
