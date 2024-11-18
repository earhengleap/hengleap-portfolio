"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Send, Linkedin, Github, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const socialLinks = [
    {
      icon: Send,
      href: "https://t.me/imxingg",
      label: "Telegram",
      color: "hover:text-pink-600",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/in/earhengleap",
      label: "LinkedIn",
      color: "hover:text-blue-600",
    },
    {
      icon: Github,
      href: "https://github.com/earhengleap",
      label: "GitHub",
      color: "hover:text-gray-900",
    },
  ];

  const footerLinks = [
    { name: "About", href: "#aboutSection" },
    { name: "Skills", href: "#skillsSection" },
    { name: "Services", href: "#servicesSection" },
    { name: "Portfolio", href: "#portfolioSection" },
    { name: "Contact", href: "#contactSection" },
  ];

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
      className="bg-white border-t border-gray-200"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">HengLeap</h3>
              <p className="text-gray-600 text-sm max-w-xs">
                Software Engineer passionate about creating exceptional digital
                experiences and transforming ideas into reality.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`text-gray-600 ${social.color} transition-colors duration-300`}
                    aria-label={social.label}
                  >
                    <social.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Links
              </h3>
              <ul className="space-y-2">
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Phnom Penh, Cambodia</li>
                <li>
                  <a
                    href="mailto:hengleap.ear23@gmail.com"
                    className="hover:text-gray-900 transition-colors duration-300"
                  >
                    hengleap70@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+85569696969"
                    className="hover:text-gray-900 transition-colors duration-300"
                  >
                    (+855) 78 231 215
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-200 py-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              © {currentYear} HengLeap. Made with{" "}
              <Heart className="h-4 w-4 text-red-500 inline-block" /> in
              Cambodia
            </p>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
