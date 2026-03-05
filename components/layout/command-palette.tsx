"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, File as FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getFileIconAndColor } from "@/lib/file-icons";
import { THEMES, FONTS, ThemeType, FontType } from "@/components/providers/settings-provider";
import { TerminalTheme, TERMINAL_THEMES } from "./terminal";

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    files: { name: string; path: string }[];
    onSelect: (path: string) => void;
    initialQuery?: string;
    setTheme?: (theme: ThemeType) => void;
    setFont?: (font: FontType) => void;
    terminalTheme?: TerminalTheme;
    setTerminalTheme?: (theme: TerminalTheme) => void;
    terminalFont?: FontType;
    setTerminalFont?: (font: FontType) => void;
}

type PaletteMode = "files" | "commands" | "theme-select" | "font-select" | "terminal-theme-select" | "terminal-font-select";

interface PaletteItem {
    id: string;
    name: string;
    description?: string;
    icon?: any;
    color?: string;
    action: () => void;
    type: "file" | "command" | "setting";
}

export function CommandPalette({
    isOpen,
    onClose,
    files,
    onSelect,
    initialQuery = "",
    setTheme,
    setFont,
    terminalTheme,
    setTerminalTheme,
    terminalFont,
    setTerminalFont,
}: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mode, setMode] = useState<PaletteMode>("files");
    const inputRef = useRef<HTMLInputElement>(null);
    const hasNavigatedWithCtrl = useRef(false);

    // Helper to highlight matches
    const renderHighlightedText = (text: string, highlight: string) => {
        if (!highlight.trim()) return <span>{text}</span>;
        const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
        const parts = text.split(regex);
        return (
            <span>
                {parts.map((part, i) =>
                    regex.test(part) ? (
                        <span key={i} className="text-blue-400 font-bold">{part}</span>
                    ) : (
                        <span key={i}>{part}</span>
                    )
                )}
            </span>
        );
    };

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            const initialVal = initialQuery;
            setQuery(initialVal);
            setSelectedIndex(0);
            setMode(initialVal.startsWith(">") ? "commands" : "files");
            hasNavigatedWithCtrl.current = false;
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [isOpen, initialQuery]);

    const cleanQuery = query.startsWith(">") ? query.slice(1).trim().toLowerCase() : query.toLowerCase();

    // Derived list of items based on mode and query
    const items: PaletteItem[] = React.useMemo(() => {
        if (mode === "theme-select") {
            return Object.keys(THEMES).map(t => ({
                id: `theme-${t}`,
                name: t.charAt(0).toUpperCase() + t.slice(1),
                description: `Apply ${t} theme`,
                type: "setting" as const,
                action: () => {
                    setTheme?.(t as ThemeType);
                    onClose();
                }
            })).filter(item => item.name.toLowerCase().includes(cleanQuery));
        }

        if (mode === "font-select") {
            return Object.keys(FONTS).map(f => ({
                id: `font-${f}`,
                name: f.charAt(0).toUpperCase() + f.slice(1),
                description: `Apply ${f} font`,
                type: "setting" as const,
                action: () => {
                    setFont?.(f as FontType);
                    onClose();
                }
            })).filter(item => item.name.toLowerCase().includes(cleanQuery));
        }

        if (mode === "terminal-theme-select") {
            return (Object.keys(TERMINAL_THEMES) as TerminalTheme[]).map(t => ({
                id: `term-theme-${t}`,
                name: TERMINAL_THEMES[t].name,
                description: `Apply ${TERMINAL_THEMES[t].name} to terminal`,
                type: "setting" as const,
                action: () => {
                    setTerminalTheme?.(t);
                    onClose();
                }
            })).filter(item => item.name.toLowerCase().includes(cleanQuery));
        }

        if (mode === "terminal-font-select") {
            return Object.keys(FONTS).map(f => ({
                id: `term-font-${f}`,
                name: f.charAt(0).toUpperCase() + f.slice(1),
                description: `Apply ${f} font to terminal`,
                type: "setting" as const,
                action: () => {
                    setTerminalFont?.(f as FontType);
                    onClose();
                }
            })).filter(item => item.name.toLowerCase().includes(cleanQuery));
        }

        if (query.startsWith(">")) {
            const commands: PaletteItem[] = [
                {
                    id: "cmd-theme",
                    name: "Change Theme",
                    description: "Select a different color theme for the IDE",
                    type: "command",
                    action: () => {
                        setMode("theme-select");
                        setQuery(">");
                        setSelectedIndex(0);
                    }
                },
                {
                    id: "cmd-font",
                    name: "Change Font",
                    description: "Select a different monospace font",
                    type: "command",
                    action: () => {
                        setMode("font-select");
                        setQuery(">");
                        setSelectedIndex(0);
                    }
                },
                {
                    id: "cmd-term-theme",
                    name: "Change Terminal Theme",
                    description: "Select a different color theme for the terminal",
                    type: "command",
                    action: () => {
                        setMode("terminal-theme-select");
                        setQuery(">");
                        setSelectedIndex(0);
                    }
                },
                {
                    id: "cmd-term-font",
                    name: "Change Terminal Font",
                    description: "Select a different monospace font for the terminal",
                    type: "command",
                    action: () => {
                        setMode("terminal-font-select");
                        setQuery(">");
                        setSelectedIndex(0);
                    }
                }
            ];
            return commands.filter(cmd => cmd.name.toLowerCase().includes(cleanQuery));
        }

        // File mode
        return files
            .filter(f => f.name.toLowerCase().includes(cleanQuery) || f.path.toLowerCase().includes(cleanQuery))
            .map(f => {
                const { icon, color } = getFileIconAndColor(f.name);
                return {
                    id: f.path,
                    name: f.name,
                    description: f.path,
                    icon,
                    color,
                    type: "file" as const,
                    action: () => onSelect(f.path)
                };
            })
            .slice(0, 10);
    }, [query, mode, files, onSelect, onClose, setTheme, setFont]);

    // Handle index bounds when items change
    useEffect(() => {
        setSelectedIndex(0);
    }, [items.length]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown" || (e.ctrlKey && !e.shiftKey && e.key === "p")) {
                e.preventDefault();
                if (e.ctrlKey && e.key === "p") hasNavigatedWithCtrl.current = true;
                setSelectedIndex((prev) => (prev + 1) % Math.max(1, items.length));
            } else if (e.key === "ArrowUp" || (e.ctrlKey && e.shiftKey && (e.key === "p" || e.key === "P"))) {
                e.preventDefault();
                if (e.ctrlKey && (e.key === "p" || e.key === "P")) hasNavigatedWithCtrl.current = true;
                setSelectedIndex((prev) => (prev - 1 + items.length) % Math.max(1, items.length));
            } else if (e.key === "Enter") {
                if (items[selectedIndex]) {
                    items[selectedIndex].action();
                    if (items[selectedIndex].type !== "command") {
                        onClose();
                    }
                }
            } else if (e.key === "Escape") {
                if (mode !== "files" && !initialQuery.startsWith(">")) {
                    setMode("files");
                    setQuery("");
                } else {
                    onClose();
                }
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Control" && hasNavigatedWithCtrl.current) {
                if (items[selectedIndex]) {
                    items[selectedIndex].action();
                    if (items[selectedIndex].type !== "command") {
                        onClose();
                    }
                }
                hasNavigatedWithCtrl.current = false;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [isOpen, items, selectedIndex, onSelect, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-black/40 pointer-events-auto"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: -10, filter: "blur(2px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.97, y: -10, filter: "blur(2px)" }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="relative z-10 w-full max-w-2xl bg-[#1e1e1e] border border-[#333] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto flex flex-col"
                    >
                        <div className="flex items-center px-4 py-3 border-b border-[#333] bg-[#252526] shrink-0">
                            <Search className="w-4 h-4 mr-3 text-blue-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="flex-1 h-8 bg-transparent border-none outline-none text-sm text-gray-200 placeholder:text-gray-500"
                                placeholder={mode === "theme-select" ? "Search themes..." : mode === "font-select" ? "Search fonts..." : "Search files or commands..."}
                                value={query}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setQuery(val);
                                    if (val.startsWith(">")) {
                                        if (mode === "files") setMode("commands");
                                    } else {
                                        setMode("files");
                                    }
                                }}
                            />
                            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded bg-[#333] border border-[#444] px-2 font-mono text-[10px] font-medium text-gray-400">
                                {mode === "files" ? "ESC" : "← ESC"}
                            </kbd>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto overflow-x-hidden custom-scrollbar py-2 bg-[#1e1e1e]">
                            {items.length > 0 ? (
                                items.map((item, index) => {
                                    const IconComponent = item.icon || (item.type === "command" ? Search : FileIcon);
                                    return (
                                        <button
                                            key={item.id}
                                            className={cn(
                                                "w-full flex items-center px-4 py-2.5 text-sm transition-colors text-left outline-none",
                                                index === selectedIndex ? "bg-[#2d2d2d] text-blue-400" : "hover:bg-[#252526] text-gray-300"
                                            )}
                                            onClick={() => {
                                                item.action();
                                                if (item.type !== "command") onClose();
                                            }}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <IconComponent className={cn("w-4 h-4 mr-3 shrink-0", index === selectedIndex ? "text-blue-400" : (item.color || "text-gray-400"))} />
                                            <div className="flex flex-col min-w-0">
                                                <span className="font-medium truncate">
                                                    {renderHighlightedText(item.name, cleanQuery)}
                                                </span>
                                                {item.description && (
                                                    <span className={cn("text-[10px] truncate", index === selectedIndex ? "text-blue-400/70" : "text-gray-500")}>
                                                        {item.description}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                    No results matching your search.
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-2 border-t border-[#333] bg-[#252526] flex items-center justify-between text-[10px] text-gray-500 shrink-0">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5"><kbd className="border border-[#444] bg-[#333] px-1.5 py-0.5 rounded text-gray-400">↑↓</kbd> Navigate</span>
                                <span className="flex items-center gap-1.5"><kbd className="border border-[#444] bg-[#333] px-1.5 py-0.5 rounded text-gray-400">Enter</kbd> Select</span>
                                {mode !== "files" && (
                                    <span className="flex items-center gap-1.5"><kbd className="border border-[#444] bg-[#333] px-1.5 py-0.5 rounded text-gray-400">ESC</kbd> Back</span>
                                )}
                            </div>
                            <span>{items.length} result(s)</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
