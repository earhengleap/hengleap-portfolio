"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Send, Linkedin, Github, Heart } from "lucide-react";
import Loader from "@/components/loading"; // Assuming this is the correct path to your Loader component

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTimeout, setLoadingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Clear timeout when component unmounts
  useEffect(() => {
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [loadingTimeout]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const socialLinks = [
    {
      icon: Send,
      href: "https://t.me/imxingg",
      label: "Telegram",
      color: "text-gray-600 hover:text-blue-500",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/earhengleap",
      label: "LinkedIn",
      color: "text-gray-600 hover:text-blue-700",
    },
    {
      icon: Github,
      href: "https://github.com/earhengleap",
      label: "GitHub",
      color: "text-gray-600 hover:text-black",
    },
  ];

  // Handler for social link clicks with loading effect
  const handleSocialClick =
    (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setIsLoading(true);

      // Set timeout and store the reference for cleanup
      const timeout = setTimeout(() => {
        window.location.href = href;
        setIsLoading(false);
      }, 1500);

      setLoadingTimeout(timeout);
    };

  // Scroll handler for navigation links
  const handleScrollToSection =
    (sectionId: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });

        // Update URL without showing the hash
        window.history.pushState({}, "", window.location.pathname);
      }
    };

  // Navigation links with section IDs
  const navigationLinks = [
    { name: "About", sectionId: "aboutSection" },
    { name: "Skills", sectionId: "skillsSection" },
    { name: "Services", sectionId: "servicesSection" },
    { name: "Portfolio", sectionId: "portfolioSection" },
    { name: "Contact", sectionId: "contactSection" },
  ];

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="bg-white border-t border-gray-100 py-12"
    >
      {isLoading && <Loader />}
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              HengLeap
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Software Engineer crafting digital experiences with passion and
              precision.
            </p>
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  onClick={handleSocialClick(social.href)}
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`${social.color} transition-all duration-300`}
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Navigation
            </h3>
            <ul className="space-y-2">
              {navigationLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <button
                    onClick={handleScrollToSection(link.sectionId)}
                    className="text-gray-500 hover:text-black text-sm transition-colors duration-300 cursor-pointer"
                  >
                    {link.name}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Get in Touch
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>Phnom Penh, Cambodia</li>
              <li>
                <a
                  href="mailto:hengleap70@gmail.com"
                  className="hover:text-black transition-colors duration-300"
                >
                  hengleap70@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+85578231215"
                  className="hover:text-black transition-colors duration-300"
                >
                  (+855) 78 231 215
                </a>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-6 border-t border-gray-100 text-center"
        >
          <p className="text-sm text-gray-500 flex justify-center items-center gap-2">
            © {currentYear} HengLeap
            <Heart className="h-4 w-4 text-red-500" strokeWidth={1.5} />
            Crafted in Cambodia
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
