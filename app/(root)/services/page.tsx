// app/(root)/services/page.tsx
"use client";

import {
  CodeIcon,
  PaintbrushIcon,
  LayoutIcon,
  SmartphoneIcon,
  GlobeIcon,
  PaletteIcon,
} from "lucide-react";

const services = [
  {
    icon: LayoutIcon,
    title: "UI/UX Design",
    description:
      "Create beautiful and functional interfaces with focus on user experience.",
  },
  {
    icon: CodeIcon,
    title: "Web Development",
    description:
      "Build responsive and dynamic websites using modern technologies.",
  },
  {
    icon: SmartphoneIcon,
    title: "App Development",
    description:
      "Develop cross-platform mobile applications for iOS and Android.",
  },
  {
    icon: PaintbrushIcon,
    title: "Brand Identity",
    description:
      "Design memorable brand identities that leave lasting impressions.",
  },
  {
    icon: PaletteIcon, // Changed from SwatchesIcon
    title: "Graphic Design",
    description: "Create stunning visuals for digital and print media.",
  },
  {
    icon: GlobeIcon,
    title: "Digital Marketing",
    description: "Implement effective strategies to grow your online presence.",
  },
];

const ServicesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">My Services</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          I offer a wide range of creative services to help bring your ideas to
          life
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <service.icon className="h-12 w-12 mb-6 text-gray-900" />
            <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
