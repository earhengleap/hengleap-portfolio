// components/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { NavbarItems } from "./navbar-items";
import NavbarRoute from "./navbar-route";
import { motion } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
        <div className="flex items-center justify-between h-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0"
          >
            <motion.span
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="text-xl font-medium bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent"
            >
              HengLeap
            </motion.span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex md:items-center md:space-x-8"
          >
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
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

//old

