// components/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { NavbarItems } from "./navbar-items";
import NavbarRoute from "./navbar-route";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
      },
    },
  };

  const menuItemVariants = {
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.2,
      },
    }),
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center h-20">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 w-[180px]"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-xl font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            >
              HengLeap
            </motion.span>
          </motion.div>

          {/* Desktop Navigation - Centered */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex md:items-center md:justify-center flex-grow"
          >
            <div className="flex items-center space-x-8">
              {NavbarItems.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 * index,
                    type: "spring",
                    stiffness: 100,
                  }}
                  className="group"
                >
                  <NavbarRoute to={item.to} label={item.label} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Download CV Button */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block w-[180px] text-right"
          >
            <Button
              variant="ghost"
              className="group relative px-4 py-2 rounded-full border border-gray-200 hover:border-gray-300 transition-all duration-300"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-800 to-gray-600 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
              <Download size={16} className="mr-2" />
              <span>Download CV</span>
            </Button>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 ml-auto"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden fixed inset-x-0 top-[80px] p-4 mx-4 bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-100"
            >
              <div className="space-y-2">
                {NavbarItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    custom={index}
                    variants={menuItemVariants}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <NavbarRoute
                      to={item.to}
                      label={item.label}
                      className="block w-full px-4 py-3 rounded-xl text-base font-medium hover:bg-gray-50 transition-colors"
                    />
                  </motion.div>
                ))}
                <motion.div
                  custom={NavbarItems.length}
                  variants={menuItemVariants}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-center mt-2 rounded-xl border border-gray-200 hover:bg-gray-50"
                  >
                    <Download size={16} className="mr-2" />
                    Download CV
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
