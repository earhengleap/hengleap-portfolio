import { Instagram, Dribbble, Github } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Dribbble, href: "#", label: "Dribbble" },
  { icon: Github, href: "#", label: "Github" },
];

export const SocialLinks = () => (
  <motion.div
    className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col space-y-4"
    variants={{
      hidden: { opacity: 0, x: -20 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }}
  >
    {socialLinks.map((social, index) => (
      <motion.div
        key={index}
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: { opacity: 1, x: 0 },
        }}
      >
        <Link
          href={social.href}
          className="flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-sm 
                   rounded-full shadow-lg hover:bg-white hover:shadow-xl transform hover:scale-110 
                   transition-all duration-300"
          aria-label={social.label}
        >
          <social.icon className="h-5 w-5 text-gray-700 hover:text-gray-900 transition-colors" />
        </Link>
      </motion.div>
    ))}
  </motion.div>
);
