// components/navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { NavbarItems } from "./navbar-items";
import NavbarRoute from "./navbar-route";

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
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <span className="text-xl font-medium">HengLeap</span>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-8">
            {NavbarItems.map((item) => (
              <NavbarRoute key={item.to} to={item.to} label={item.label} />
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
