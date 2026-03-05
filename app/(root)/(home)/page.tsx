"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Terminal, Code2, Cpu, UserCircle, FolderGit2 } from "lucide-react";

const BOOT_SEQUENCE = [
  "Initializing Codex Coder v1.0.0...",
  "Loading kernel modules...................[OK]",
  "Mounting root filesystem.................[OK]",
  "Starting network interface...............[OK]",
  "Connecting to HengLeap's neural net......[OK]",
  "Loading portfolio data...................",
  "SUCCESS: System Ready."
];

export default function HomePage() {
  const [lines, setLines] = useState<string[]>([]);
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    let delay = 0;
    BOOT_SEQUENCE.forEach((line, index) => {
      delay += Math.random() * 300 + 200; // Random delay between 200-500ms
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (index === BOOT_SEQUENCE.length - 1) {
          setTimeout(() => setIsBooted(true), 600);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="h-full flex flex-col font-mono text-sm max-w-4xl mx-auto">
      <div className="flex-1 flex flex-col justify-center">
        {/* Boot Sequence */}
        <div className="mb-8 space-y-1">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={line.includes("SUCCESS") || line.includes("[OK]") ? "text-primary" : "text-gray-400"}
            >
              <span className="text-blue-400 mr-2">➜</span>
              {line}
            </motion.div>
          ))}
          {!isBooted && (
            <motion.div
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-gray-400 ml-2"
            />
          )}
        </div>

        {/* Welcome Dashboard */}
        {isBooted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="border border-[#333] bg-[#1e1e1e]/80 rounded-lg overflow-hidden backdrop-blur-sm shadow-2xl"
          >
            <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#333] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300 font-semibold cursor-default">Welcome to HengLeap&apos;s Workspace</span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1 space-y-4">
                  <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    <span className="text-primary">const</span> developer = <span className="text-blue-400">"HengLeap EAR"</span>;
                  </h1>
                  <p className="text-gray-400 text-lg">
                    Software Engineer • Problem Solver • Tech Enthusiast
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <QuickLink href="/about" icon={UserCircle} text="about.ts" color="text-yellow-400" />
                    <QuickLink href="/projects" icon={FolderGit2} text="projects.json" color="text-green-400" />
                    <QuickLink href="/skills" icon={Cpu} text="skills.md" color="text-purple-400" />
                    <QuickLink href="/contact" icon={Code2} text="contact.sh" color="text-orange-400" />
                  </div>
                </div>

                {/* ASCII Art or Logo representation could go here */}
                <div className="hidden md:flex bg-black/40 p-6 rounded-lg border border-[#333] text-primary whitespace-pre font-mono text-xs shadow-inner">
                  {`
   ____          __         
  / __/    __   / /_  ____  
 / /_     / /_ / __/ / __/  
/ /_/__  / __// /_  / /_    
\____//_/\__/ \__/  \__/    
                  `}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function QuickLink({ href, icon: Icon, text, color }: { href: string; icon: any; text: string; color: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 border border-[#333] rounded-md hover:bg-[#2d2d2d] transition-colors group"
    >
      <Icon className={`w-4 h-4 ${color} group-hover:scale-110 transition-transform`} />
      <span className="text-gray-300 group-hover:text-white transition-colors">{text}</span>
    </Link>
  );
}
