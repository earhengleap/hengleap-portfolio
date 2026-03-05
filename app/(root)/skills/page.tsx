"use client";

import { useState } from "react";
import React from "react";

const skillsData = {
  name: "hengleap-portfolio",
  version: "1.0.0",
  description: "Full-stack developer skills and dependencies",
  main: "index.js",
  scripts: {
    start: "node server.js",
    dev: "next dev",
    build: "next build",
    test: "echo \"Error: no test specified\" && exit 1"
  },
  dependencies: {
    "html-css": "^85.0.0",
    "javascript-typescript": "^80.0.0",
    "react.js": "^80.0.0",
    "next.js": "^85.0.0",
    "tailwind-css": "^75.0.0",
    "node-express": "^75.0.0"
  },
  devDependencies: {
    "postgresql": "^75.0.0",
    "mongodb": "^60.0.0",
    "rest-apis": "^65.0.0"
  },
  peerDependencies: {
    "flutter": "^75.0.0",
    "java-android": "^80.0.0",
    "dart": "^85.0.0",
    "mobile-ui": "^85.0.0",
    "native-android": "^58.0.0"
  },
  optionalDependencies: {
    "figma": "^80.0.0",
    "adobe-xd": "^50.0.0",
    "user-research": "^65.0.0",
    "docker": "beta",
    "aws-services": "beta"
  },
  author: "Ear Hengleap",
  license: "ISC"
};

export default function SkillsPage() {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  // Generate the formatted JSON string with specific interactive markers
  const renderJsonValue = (value: any, indent: number = 1, lineIndex: { current: number }): React.ReactNode => {
    if (typeof value === 'string') {
      return <span className="text-[#98c379]">"{value}"</span>;
    }

    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      const isObjectEmpty = entries.length === 0;

      if (isObjectEmpty) return <span className="text-gray-300">&#123; &#125;</span>;

      return (
        <span className="text-gray-300">
          &#123;
          {entries.map(([k, v], i) => {
            lineIndex.current += 1;
            const currentIdx = lineIndex.current;
            return (
              <div
                key={k}
                className={`pl-${indent * 4} py-0.5 transition-colors ${hoveredLine === currentIdx ? 'bg-[#2a2d3e]/50 rounded' : ''}`}
                onMouseEnter={() => setHoveredLine(currentIdx)}
                onMouseLeave={() => setHoveredLine(null)}
              >
                <span className="text-[#e06c75]">"{k}"</span>: {renderJsonValue(v, indent + 1, lineIndex)}
                {i < entries.length - 1 ? "," : ""}
              </div>
            );
          })}
          <div className={`pl-${(indent - 1) * 4}`}>&#125;</div>
        </span>
      );
    }
    return <span className="text-[#d19a66]">{JSON.stringify(value)}</span>;
  };

  const lineIndex = { current: 1 };

  return (
    <div className="h-full flex flex-col font-mono text-sm max-w-4xl mx-auto py-8">
      <div className="flex-1 bg-[#1e1e1e] rounded-lg border border-[#333] overflow-hidden shadow-2xl flex flex-col">
        {/* Editor Header */}
        <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#333] flex items-center gap-2">
          <span className="text-yellow-400 font-bold">&#123;&nbsp;&#125;</span>
          <span className="text-gray-300">package.json</span>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-auto flex flex-1">
          {/* Static Line Numbers (Approximate for visual effect) */}
          <div className="text-[#5c6370] pr-4 select-none text-right flex flex-col min-w-[2.5rem] border-r border-[#333] mr-4 pt-1">
            {Array.from({ length: 45 }).map((_, i) => (
              <span key={i} className="leading-6">{i + 1}</span>
            ))}
          </div>

          <div className="text-gray-300 w-full pt-1 leading-6">
            <div>&#123;</div>
            {Object.entries(skillsData).map(([key, val], index) => {
              lineIndex.current += 1;
              const currentIdx = lineIndex.current;
              return (
                <div key={key}>
                  <div
                    className={`pl-4 py-0.5 transition-colors ${hoveredLine === currentIdx ? 'bg-[#2a2d3e]/50 rounded' : ''}`}
                    onMouseEnter={() => setHoveredLine(currentIdx)}
                    onMouseLeave={() => setHoveredLine(null)}
                  >
                    <span className="text-[#e06c75]">"{key}"</span>: {renderJsonValue(val, 2, lineIndex)}
                    {index < Object.keys(skillsData).length - 1 ? "," : ""}
                  </div>
                </div>
              );
            })}
            <div>&#125;</div>
          </div>
        </div>
      </div>
    </div>
  );
}
