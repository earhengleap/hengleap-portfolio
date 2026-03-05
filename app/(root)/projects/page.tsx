"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const projects = [
  {
    title: "Brilliant AI",
    category: "AI Tool Platform",
    description: "Create content using AI 10x faster. Features user-friendly interface with powerful content generation capabilities.",
    demoUrl: "https://brilliantai.vercel.app/",
    tech: ["Next.js", "AI", "TailwindCSS"]
  },
  {
    title: "InFinance",
    category: "Financial Platform",
    description: "A comprehensive financial platform featuring real-time market data, portfolio management, and advanced analytics tools.",
    demoUrl: "https://infinance.vercel.app/",
    tech: ["React", "Finance API", "UI/UX"]
  },
  {
    title: "Pheasa",
    category: "E-learning Platform",
    description: "An innovative e-learning platform providing interactive courses, personalized learning paths, and educational resources.",
    demoUrl: "https://pheasa.vercel.app/",
    tech: ["Next.js", "Education", "Video"]
  },
  {
    title: "Space Themed Portfolio",
    category: "Web Development",
    description: "An immersive space-themed portfolio website showcasing creative work through interactive design elements.",
    demoUrl: "https://imxing.vercel.app/",
    tech: ["Three.js", "Framer Motion", "React"]
  },
  {
    title: "Rub Pheap",
    category: "Web Development",
    description: "Web application that allows users to create visual images from imagination using custom model training.",
    demoUrl: "https://rubpheap.vercel.app/",
    tech: ["AI", "Image Gen", "React"]
  }
];

export default function ProjectsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate the formatted JSON string with specific interactive markers
  const renderJsonLine = (key: string, value: any, isLast: boolean, isLink: boolean = false, index?: number) => {
    const isString = typeof value === 'string';
    const isArray = Array.isArray(value);

    let valueDisplay;
    if (isLink && isString) {
      valueDisplay = (
        <Link
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#98c379] hover:underline hover:text-green-300 inline-flex items-center gap-1"
        >
          "{value}" <ExternalLink className="w-3 h-3 inline" />
        </Link>
      );
    } else if (isArray) {
      valueDisplay = (
        <span className="text-gray-300">
          [ {value.map((v: string, i: number) => (
            <span key={i}><span className="text-[#98c379]">"{v}"</span>{i < value.length - 1 ? ", " : ""}</span>
          ))} ]
        </span>
      );
    } else if (isString) {
      valueDisplay = <span className="text-[#98c379]">"{value}"</span>;
    } else {
      valueDisplay = <span className="text-[#d19a66]">{JSON.stringify(value)}</span>;
    }

    return (
      <div
        className="pl-8"
        onMouseEnter={() => index !== undefined && setHoveredIndex(index)}
        onMouseLeave={() => index !== undefined && setHoveredIndex(null)}
      >
        <span className="text-[#e06c75]">"{key}"</span>
        <span className="text-gray-300">: </span>
        {valueDisplay}
        <span className="text-gray-300">{isLast ? "" : ","}</span>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col font-mono text-sm max-w-5xl mx-auto py-8">
      <div className="flex-1 bg-[#1e1e1e] rounded-lg border border-[#333] shadow-2xl overflow-hidden flex flex-col">
        {/* Editor Header */}
        <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#333] flex items-center gap-2">
          <span className="text-green-400 font-bold">&#123;&nbsp;&#125;</span>
          <span className="text-gray-300">projects.json</span>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-auto flex-1 flex">
          {/* Static Line Numbers (Approximate for visual effect) */}
          <div className="text-[#5c6370] pr-4 select-none text-right flex flex-col min-w-[2.5rem] border-r border-[#333] mr-4 pt-1">
            {Array.from({ length: projects.length * 8 + 4 }).map((_, i) => (
              <span key={i} className="leading-6">{i + 1}</span>
            ))}
          </div>

          <div className="text-gray-300 w-full pt-1 leading-6">
            <div><span className="text-gray-300">&#123;</span></div>
            <div className="pl-4"><span className="text-[#e06c75]">"projects"</span><span className="text-gray-300">: [</span></div>

            {projects.map((proj, index) => (
              <div
                key={index}
                className={`pl-8 py-1 transition-colors ${hoveredIndex === index ? 'bg-[#2a2d3e]/50 rounded' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div>&#123;</div>
                {renderJsonLine("title", proj.title, false, false, index)}
                {renderJsonLine("category", proj.category, false, false, index)}
                {renderJsonLine("description", proj.description, false, false, index)}
                {renderJsonLine("tech", proj.tech, false, false, index)}
                {renderJsonLine("demoUrl", proj.demoUrl, true, true, index)}
                <div>&#125;{index < projects.length - 1 ? "," : ""}</div>
              </div>
            ))}

            <div className="pl-4">]</div>
            <div>&#125;</div>
          </div>
        </div>
      </div>
    </div>
  );
}
