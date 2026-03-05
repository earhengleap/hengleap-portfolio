"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ChevronRight, CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { FontType, FONTS } from "@/components/providers/settings-provider";

interface TerminalProps {
    isOpen: boolean;
    onClose: () => void;
    isMaximized?: boolean;
    onToggleMaximize?: () => void;
    theme?: TerminalTheme;
    onThemeChange?: (theme: TerminalTheme) => void;
    font?: FontType;
}

export type TerminalTheme = "vscode" | "dracula" | "matrix" | "github";

export const TERMINAL_THEMES: Record<TerminalTheme, {
    bg: string,
    header: string,
    text: string,
    prompt: string,
    accent: string,
    name: string
}> = {
    vscode: {
        name: "VS Code",
        bg: "#1e1e1e",
        header: "#252526",
        text: "#cccccc",
        prompt: "#4e9ad1",
        accent: "#007acc"
    },
    dracula: {
        name: "Dracula",
        bg: "#282a36",
        header: "#21222c",
        text: "#f8f8f2",
        prompt: "#50fa7b",
        accent: "#bd93f9"
    },
    matrix: {
        name: "Matrix",
        bg: "#000000",
        header: "#0d0d0d",
        text: "#00ff41",
        prompt: "#00ff41",
        accent: "#00ff41"
    },
    github: {
        name: "GitHub Dark",
        bg: "#0d1117",
        header: "#161b22",
        text: "#c9d1d9",
        prompt: "#58a6ff",
        accent: "#1f6feb"
    }
};

const INITIAL_OUTPUT = [
    { type: "system", content: "Welcome to Hengleap's Portfolio Terminal v1.1.0" },
    { type: "system", content: "Type 'help' to see available commands." },
];

export function Terminal({ isOpen, onClose, isMaximized, onToggleMaximize, theme = "vscode", onThemeChange, font = "jetbrains" }: TerminalProps) {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState(INITIAL_OUTPUT);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeTheme = TERMINAL_THEMES[theme];
    const fontClass = FONTS[font];

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

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                        height: isMaximized ? "100%" : 256,
                        opacity: 1,
                        flex: isMaximized ? "1 1 0%" : "none"
                    }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.5,
                        opacity: { duration: 0.2 }
                    }}
                    className={cn(
                        "border-t border-border flex flex-col text-sm overflow-hidden",
                        isMaximized ? "absolute inset-0 z-50 border-t-0" : "relative border-t",
                        fontClass
                    )}
                    style={{ backgroundColor: activeTheme.bg }}
                >
                    {/* Terminal Header */}
                    <div
                        className="flex items-center justify-between px-4 py-1.5 border-b border-border shrink-0 select-none transition-colors duration-300"
                        style={{ backgroundColor: activeTheme.header }}
                    >
                        <div className="flex items-center gap-4">
                            <div
                                className="flex items-center gap-2 border-b-2 h-full px-2 py-0.5"
                                style={{ borderBottomColor: activeTheme.accent }}
                            >
                                <TerminalIcon className="w-3.5 h-3.5" style={{ color: activeTheme.text }} />
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: activeTheme.text }}>
                                    Terminal
                                </span>
                            </div>

                            {/* Theme Selector */}
                            <div className="flex items-center gap-1.5 ml-2 border-l border-border pl-4">
                                {(Object.entries(TERMINAL_THEMES) as [TerminalTheme, typeof activeTheme][]).map(([key, t]) => (
                                    <button
                                        key={key}
                                        onClick={() => onThemeChange?.(key)}
                                        className={cn(
                                            "w-3 h-3 rounded-full border border-white/10 transition-all hover:scale-125",
                                            theme === key ? "ring-1 ring-white/50 scale-110" : "opacity-60 hover:opacity-100"
                                        )}
                                        style={{ backgroundColor: t.bg }}
                                        title={t.name}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onToggleMaximize}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                                style={{ color: activeTheme.text }}
                                title={isMaximized ? "Restore" : "Maximize"}
                            >
                                {isMaximized ? (
                                    <Minimize2 className="w-3.5 h-3.5" />
                                ) : (
                                    <Maximize2 className="w-3.5 h-3.5" />
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-destructive hover:text-white rounded transition-colors"
                                style={{ color: activeTheme.text }}
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto p-4 custom-scrollbar transition-colors duration-300"
                        style={{ backgroundColor: activeTheme.bg }}
                        onClick={() => inputRef.current?.focus()}
                    >
                        <div className="space-y-1">
                            {output.map((line, i) => (
                                <div key={i} className={cn(
                                    "whitespace-pre-wrap leading-relaxed transition-colors duration-300",
                                )}
                                    style={{
                                        color: line.type === "command" ? activeTheme.prompt :
                                            line.type === "error" ? "#f87171" : activeTheme.text,
                                        fontWeight: line.type === "command" ? "bold" : "normal"
                                    }}>
                                    {line.content}
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                            <span style={{ color: activeTheme.prompt, fontWeight: "bold" }}>➜</span>
                            <span style={{ color: activeTheme.prompt === activeTheme.text ? activeTheme.prompt : "#4ade80", fontWeight: "bold" }}>~</span>
                            <input
                                ref={inputRef}
                                type="text"
                                className="flex-1 bg-transparent border-none outline-none p-0 transition-colors duration-300"
                                style={{ color: activeTheme.text }}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                spellCheck={false}
                                autoComplete="off"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
