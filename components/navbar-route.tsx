// components/navbar-route.tsx
import { Link } from "react-scroll";

interface NavbarRouteProps {
  to: string;
  label: string;
}

const NavbarRoute = ({ to, label }: NavbarRouteProps) => {
  return (
    <Link
      activeClass="text-gray-900 font-medium"
      to={to}
      spy={true}
      smooth={true}
      offset={-70}
      duration={500}
      className="cursor-pointer text-sm hover:text-gray-600 transition-colors text-gray-600"
    >
      {label}
    </Link>
  );
};

export default NavbarRoute;
