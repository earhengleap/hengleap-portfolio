"use client";

import React from "react";
import { useSettings, ThemeType, FontType } from "@/components/providers/settings-provider";
import { cn } from "@/lib/utils";
import { Palette, Type, X } from "lucide-react";
import Draggable from 'react-draggable';

export function SettingsPanel({ onClose }: { onClose: () => void }) {
    const { theme, setTheme, font, setFont } = useSettings();

    const themes: { id: ThemeType; name: string; color: string }[] = [
        { id: "default", name: "Codex Dark", color: "bg-[#0A0A0C] border-[#1e1e1e]" },
        { id: "dracula", name: "Dracula", color: "bg-[#282a36] border-[#ff79c6]" },
        { id: "matrix", name: "Hacker Matrix", color: "bg-[#030d04] border-[#00ff00]" },
        { id: "github-dark", name: "GitHub Dark", color: "bg-[#0d1117] border-[#58a6ff]" },
    ];

    const fonts: { id: FontType; name: string }[] = [
        { id: "jetbrains", name: "JetBrains Mono" },
        { id: "fira", name: "Fira Code" },
        { id: "source-code", name: "Source Code Pro" },
        { id: "cascadia", name: "Cascadia Code" },
    ];

    // Prevent scroll on body when modal is open
    React.useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    // Also close on Escape key
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-start justify-center pt-[15vh]">
            <Draggable handle=".drag-handle" cancel="button">
                <div className="pointer-events-auto flex flex-col w-[500px] max-w-[95vw] max-h-[85vh] bg-card text-card-foreground rounded-lg shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="drag-handle flex items-center justify-between p-4 border-b border-border cursor-move bg-muted hover:bg-muted/80 transition-colors">
                        <h2 className="text-sm font-semibold tracking-widest uppercase text-muted-foreground select-none">Settings</h2>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-background rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="p-4 space-y-8 overflow-y-auto">
                        {/* Theme Selection */}
                        <section>
                            <div className="flex items-center gap-2 mb-4 text-foreground">
                                <Palette size={16} />
                                <h3 className="text-sm font-medium">Color Theme</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => setTheme(t.id)}
                                        className={cn(
                                            "flex flex-col items-center p-3 rounded border transition-all text-xs",
                                            theme === t.id
                                                ? "border-primary bg-primary/10 text-foreground"
                                                : "border-border hover:border-primary/50 hover:bg-muted"
                                        )}
                                    >
                                        <div className={cn("w-full h-8 rounded mb-2 border", t.color)}></div>
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Font Selection */}
                        <section>
                            <div className="flex items-center gap-2 mb-4 text-foreground">
                                <Type size={16} />
                                <h3 className="text-sm font-medium">Font Family</h3>
                            </div>
                            <div className="space-y-2">
                                {fonts.map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFont(f.id)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded border transition-all text-sm flex justify-between items-center",
                                            font === f.id
                                                ? "border-primary bg-primary/10 text-foreground"
                                                : "border-border hover:border-primary/50 hover:bg-muted"
                                        )}
                                    >
                                        <span className={cn("truncate", `font-${f.id}`)}>{f.name}</span>
                                        {font === f.id && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </Draggable>
        </div>
    );
}
