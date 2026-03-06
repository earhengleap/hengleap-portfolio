"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Command, Keyboard, Search, Settings, Terminal, Users, Files, X } from "lucide-react";

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SHORTCUTS = [
    { label: "Command Palette", keys: ["Ctrl", "Shift", "P"], icon: Command },
    { label: "Toggle Explorer", keys: ["Ctrl", "Shift", "E"], icon: Files },
    { label: "Global Search", keys: ["Ctrl", "Shift", "F"], icon: Search },
    { label: "Live Visitors", keys: ["Ctrl", "Shift", "V"], icon: Users },
    { label: "MonkeyType", keys: ["Ctrl", "Shift", "K"], icon: Keyboard },
    { label: "Open Settings", keys: ["Ctrl", ","], icon: Settings },
    { label: "Toggle Terminal", keys: ["Ctrl", "`"], icon: Terminal },
    { label: "Keyboard Shortcuts", keys: ["Ctrl", "/"], icon: Keyboard },
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none no-global-context">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm pointer-events-auto"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="relative w-full max-w-lg bg-[#181818] border border-border/50 rounded-xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[#1e1e1e]">
                            <div className="flex items-center gap-2">
                                <Keyboard className="w-5 h-5 text-primary" />
                                <h2 className="text-sm font-semibold text-foreground">Keyboard Shortcuts</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-md transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {SHORTCUTS.map((shortcut, index) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    key={shortcut.label}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5 transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <shortcut.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{shortcut.label}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        {shortcut.keys.map((key) => (
                                            <kbd
                                                key={key}
                                                className="min-w-[24px] h-6 px-2 inline-flex items-center justify-center text-[11px] font-mono font-medium text-muted-foreground bg-[#2d2d2d] border border-border/40 rounded shadow-sm"
                                            >
                                                {key}
                                            </kbd>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-3 bg-[#141414] border-t border-border/40 text-[11px] text-muted-foreground italic flex justify-between items-center">
                            <span>Press Esc to close</span>
                            <span className="text-primary/70">Codex Coder OS</span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
