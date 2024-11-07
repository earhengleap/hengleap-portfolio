// app/(root)/portfolio/page.tsx
"use client";

import Image from "next/image";

const projects = [
  {
    title: "E-commerce Website",
    category: "Web Development",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Mobile Banking App",
    category: "App Development",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Brand Identity Design",
    category: "Branding",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Social Media App",
    category: "UI/UX Design",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Portfolio Website",
    category: "Web Development",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
  {
    title: "Restaurant App",
    category: "App Development",
    image:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3C/svg%3E",
  },
];

const PortfolioPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">My Portfolio</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore some of my recent projects and creative works
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl cursor-pointer h-[300px]"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-6">
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-sm">{project.category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
