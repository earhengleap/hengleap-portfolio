// components/navbar-route.tsx
import { Link } from "react-scroll";
import { motion } from "framer-motion";

export interface NavbarRouteProps {
  to: string;
  label: string;
  className?: string;
  onClick?: () => void;
}

const NavbarRoute = ({
  to,
  label,
  className = "",
  onClick,
}: NavbarRouteProps) => {
  return (
    <motion.div className={`relative ${className}`}>
      <Link
        activeClass="text-gray-900 font-medium"
        to={to}
        spy={true}
        smooth={true}
        offset={-70}
        duration={500}
        className="cursor-pointer text-sm text-gray-600 relative block h-6"
        onClick={onClick}
      >
        <div className="overflow-hidden h-full">
          <div className="relative transform-gpu">
            <span className="block transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
              {label}
            </span>
            <span className="absolute top-full left-0 block transition-transform duration-300 ease-in-out transform group-hover:-translate-y-full">
              {label}
            </span>
          </div>
        </div>
        <motion.span
          className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  );
};

export default NavbarRoute;
