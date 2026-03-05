"use client";

import { useState, useEffect } from "react";
import { NavbarItems } from "./navbar-items";
import NavbarRoute from "./navbar-route";
import { motion, AnimatePresence } from "framer-motion";
import MobileMenuButton from "./mobile-menu-button";

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
    <div className="fixed top-0 w-full z-50 px-4 pt-4">
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`hidden md:block mx-auto max-w-fit rounded-full border border-gray-200/20 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-sm shadow-sm"
            : "bg-white/5 backdrop-blur-sm"
        }`}
      >
        <div className="px-4">
          <div className="flex items-center h-12">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center space-x-1">
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
                    className="group relative px-3 py-1"
                  >
                    <NavbarRoute
                      to={item.to}
                      label={item.label}
                      className="text-sm font-medium transition-colors hover:text-gray-900"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-1"
          >
            <MobileMenuButton
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          </motion.div>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed inset-x-4 top-20 p-4 bg-white/95 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-100"
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
