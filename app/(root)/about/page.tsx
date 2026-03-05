"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import Loader from "@/components/shared/loading"; // Updated path after folder restructure

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadCV = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/ear-hengleap-cv.pdf";
      link.download = "ear-hengleap-cv.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setIsLoading(false), 500);
    }, 1200);
  };

  const codeString = `
/**
 * @file about.ts
 * @author HengLeap
 * @description Developer profile instantiation
 */

import { Developer, Experience, Interest } from '@/types/developer';

<span className="token-keyword">export const</span> hengleap<span className="token-keyword">:</span> Developer <span className="token-keyword">=</span> {
  <span className="token-property">name</span>: <span className="token-string">"Ear Hengleap"</span>,
  <span className="token-property">age</span>: <span className="token-number">23</span>,
  <span className="token-property">location</span>: <span className="token-string">"Phnom Penh, Cambodia"</span>,
  <span className="token-property">title</span>: <span className="token-string">"Software Engineer"</span>,
  
  <span className="token-property">bio</span>: <span className="token-string">"I'm a full-stack developer specializing in web and mobile \n         development, with expertise in creating user-centered digital \n         experiences. I also bring UI/UX design skills to my projects, \n         ensuring they're not only functional but also intuitive. \n         With 3 years of experience, I'm constantly exploring new \n         technologies and enhancing my skill set."</span>,

  <span className="token-property">experience</span>: <span className="token-number">3</span> <span className="token-comment">// Years of professional experience</span>,

  <span className="token-property">interests</span>: [
    <span className="token-string">"Web Development"</span>,
    <span className="token-string">"Mobile Development"</span>,
    <span className="token-string">"UI/UX Design"</span>,
    <span className="token-string">"New Technologies"</span>
  ],

  <span className="token-function">downloadResume</span>: <span className="token-keyword">async</span> () <span className="token-keyword">=></span> {
    <span className="token-keyword">await</span> <span className="token-function">fetch</span>(<span className="token-string">"/ear-hengleap-cv.pdf"</span>);
    <span className="token-comment">// Click the button below to execute this function</span>
  }
};
  `;

  return (
    <div className="h-full flex flex-col font-mono text-sm max-w-4xl mx-auto py-8">
      {isLoading && <Loader />}

      <div className="flex-1 bg-[#1e1e1e] rounded-lg border border-[#333] overflow-hidden shadow-2xl">
        {/* Editor Header */}
        <div className="bg-[#2d2d2d] px-4 py-2 border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400 font-bold">TS</span>
            <span className="text-gray-300">about.ts</span>
          </div>
          <button
            onClick={handleDownloadCV}
            className="flex items-center gap-2 text-xs bg-primary/20 text-primary hover:bg-primary hover:text-white px-2 sm:px-3 py-1 rounded transition-colors"
          >
            <Download className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline">Execute downloadResume()</span>
            <span className="sm:hidden">Download CV</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-auto flex">
          {/* Line Numbers */}
          <div className="text-[#5c6370] pr-4 select-none text-right flex flex-col min-w-[2.5rem] border-r border-[#333] mr-4">
            {codeString.split('\n').map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>

          {/* Syntax Highlighted Code */}
          <pre className="text-gray-300 whitespace-pre-wrap leading-relaxed">
            <code
              dangerouslySetInnerHTML={{ __html: codeString }}
            />
          </pre>
        </div>
      </div>
    </div>
  );
}
