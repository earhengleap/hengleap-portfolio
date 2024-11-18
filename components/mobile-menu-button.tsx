"use client";

import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

const MobileMenuButton = ({
  isMenuOpen,
  setIsMenuOpen,
}: MobileMenuButtonProps) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      {isMenuOpen ? (
        <X size={28} className="text-gray-700" />
      ) : (
        <Menu size={28} className="text-gray-700" />
      )}
    </motion.button>
  );
};

export default MobileMenuButton;
