"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, X, Maximize2, ChevronRight, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerminalProps {
    isOpen: boolean;
    onClose: () => void;
}

const INITIAL_OUTPUT = [
    { type: "system", content: "Welcome to Hengleap's Portfolio Terminal v1.0.0" },
    { type: "system", content: "Type 'help' to see available commands." },
];

export function Terminal({ isOpen, onClose }: TerminalProps) {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState(INITIAL_OUTPUT);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [output]);

    const handleCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim().toLowerCase();
        if (!trimmedCmd) return;

        setHistory(prev => [cmd, ...prev]);
        setHistoryIndex(-1);

        const newOutput = [...output, { type: "command" as const, content: `➜ ~ ${cmd}` }];

        switch (trimmedCmd) {
            case "help":
                newOutput.push({ type: "system", content: "Available commands: help, clear, ls, whoami, contact, skills, projects, about" });
                break;
            case "clear":
                setOutput([]);
                return;
            case "ls":
                newOutput.push({ type: "system", content: "about.ts  projects.json  skills.md  contact.sh  home.tsx" });
                break;
            case "whoami":
                newOutput.push({ type: "system", content: "hengleap - Software Engineer / Full Stack Developer" });
                break;
            case "about":
                newOutput.push({ type: "system", content: "I am a passionate software engineer building modern web applications." });
                break;
            case "skills":
                newOutput.push({ type: "system", content: "Languages: TypeScript, JavaScript, Python, Go\nFrameworks: React, Next.js, Node.js\nTools: Docker, Git, Prisma" });
                break;
            case "projects":
                newOutput.push({ type: "system", content: "Check out the projects.json file in the explorer for a list of my work!" });
                break;
            case "contact":
                newOutput.push({ type: "system", content: "Email: contact@hengleap.dev\nGitHub: github.com/hengleap" });
                break;
            default:
                newOutput.push({ type: "error", content: `Command not found: ${trimmedCmd}. Type 'help' for assistance.` });
        }

        setOutput(newOutput);
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCommand(input);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                const newIndex = historyIndex + 1;
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            }
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            if (historyIndex > 0) {
                const newIndex = historyIndex - 1;
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
            } else if (historyIndex === 0) {
                setHistoryIndex(-1);
                setInput("");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="h-64 border-t border-border bg-[#1e1e1e] flex flex-col font-mono text-sm animate-in slide-in-from-bottom duration-200">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-1.5 bg-[#252526] border-b border-border shrink-0 select-none">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border-b-2 border-primary h-full px-2 py-0.5">
                        <TerminalIcon className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-gray-300 text-xs font-semibold uppercase tracking-wider">Terminal</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1 hover:bg-muted rounded text-gray-400">
                        <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={onClose} className="p-1 hover:bg-destructive hover:text-white rounded text-gray-400">
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Terminal Body */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-[#1e1e1e]"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="space-y-1">
                    {output.map((line, i) => (
                        <div key={i} className={cn(
                            "whitespace-pre-wrap leading-relaxed",
                            line.type === "command" ? "text-blue-400 font-bold" :
                                line.type === "error" ? "text-red-400" : "text-gray-300"
                        )}>
                            {line.content}
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <span className="text-blue-400 font-bold">➜</span>
                    <span className="text-green-400 font-bold">~</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-gray-300 p-0"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                        autoComplete="off"
                    />
                </div>
            </div>
        </div>
    );
}
