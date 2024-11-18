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
      category: "Web Development",
      items: [
        { name: "HTML/CSS", level: 95 },
        { name: "JavaScript/TypeScript", level: 90 },
        { name: "React.js", level: 88 },
        { name: "Next.js", level: 85 },
        { name: "Tailwind CSS", level: 92 },
        { name: "Responsive Design", level: 90 },
      ],
    },
    {
      category: "Database & Backend",
      items: [
        { name: "Node.js", level: 88 },
        { name: "PostgreSQL", level: 88 },
        { name: "MongoDB", level: 85 },
        { name: "Express.js", level: 85 },
        { name: "REST APIs", level: 90 },
        { name: "GraphQL", level: 82 },
      ],
    },
    {
      category: "Mobile Development",
      items: [
        { name: "Flutter", level: 85 },
        { name: "Java/Android", level: 80 },
        { name: "Dart", level: 85 },
        { name: "Mobile UI", level: 88 },
        { name: "Native Android", level: 78 },
        { name: "App Performance", level: 82 },
      ],
    },
    {
      category: "UI/UX Design",
      items: [
        { name: "Figma", level: 88 },
        { name: "Adobe XD", level: 85 },
        { name: "Wireframing", level: 90 },
        { name: "User Research", level: 85 },
        { name: "Interactive Prototypes", level: 87 },
        { name: "Design Systems", level: 85 },
      ],
    },
  ];

  const otherSkills: string[] = [
    "Docker",
    "Kubernetes",
    "AWS Services",
    "CI/CD Pipelines",
    "Jest Testing",
    "Redux Toolkit",
    "Material UI",
    "Socket.IO",
    "Redis",
    "TypeORM",
    "Prisma",
    "Git & GitHub",
    "Microservices",
    "Web Security",
    "Performance Optimization",
    "AWS Lambda",
    "Serverless",
    "Firebase",
    "Vercel",
    "Netlify",
    "Database Optimization",
    "API Design",
    "System Architecture",
    "Cloud Infrastructure",
    "DevOps Practices",
    "Agile Methodologies",
  ];

  return (
    <div className="min-h-screen pt-32 px-8 bg-white dark:bg-gray-900">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={headerVariants} className="space-y-4 mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            My Skills
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="h-1.5 bg-blue-600 rounded-full"
          />
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
            As a full-stack developer, I specialize in modern web development,
            with expertise in both frontend and backend technologies. I have
            extensive experience with Node.js and various database systems,
            allowing me to build scalable, performant applications from start to
            finish.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <motion.div
            variants={leftColumnVariants}
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <SkillCategory skillSet={skills[0]} variants={skillBarVariants} />
          </motion.div>

          <motion.div
            variants={middleColumnVariants}
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <SkillCategory skillSet={skills[1]} variants={skillBarVariants} />
          </motion.div>

          <motion.div
            variants={rightColumnVariants}
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <SkillCategory skillSet={skills[2]} variants={skillBarVariants} />
          </motion.div>

          <motion.div
            variants={rightColumnVariants}
            className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg"
          >
            <SkillCategory skillSet={skills[3]} variants={skillBarVariants} />
          </motion.div>
        </div>

        {/* Additional Skills */}
        <motion.div variants={middleColumnVariants} className="mt-20">
          <h2 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">
            Other Technologies & Tools
          </h2>
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
                  backgroundColor: "#3B82F6",
                  color: "white",
                  transition: { duration: 0.3 },
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium cursor-pointer text-gray-800 dark:text-gray-200 hover:shadow-md transition-all duration-300"
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
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {skillSet.category}
      </h2>
      <div className="space-y-6">
        {skillSet.items.map((skill, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <div className="flex justify-between">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {skill.name}
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {skill.level}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                custom={skill.level}
                variants={variants}
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsPage;
