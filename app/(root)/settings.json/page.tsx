"use client";

import React from "react";
import { useSettings, ThemeType, FontType, FontSizeType } from "@/components/providers/settings-provider";
import { cn } from "@/lib/utils";
import { Palette, Type, TextSelect } from "lucide-react";

export default function SettingsPage() {
    const { theme, setTheme, font, setFont, fontSize, setFontSize } = useSettings();

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

    const fontSizes: { id: FontSizeType; name: string }[] = [
        { id: "sm", name: "Small" },
        { id: "md", name: "Medium" },
        { id: "lg", name: "Large" },
    ];

    return (
        <div className="max-w-2xl mx-auto py-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2 text-foreground">settings.json</h1>
                <p className="text-muted-foreground text-sm">Configure your workspace environment natively.</p>
            </div>

            <div className="space-y-10">
                {/* Theme Selection */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-foreground pb-2 border-b border-border">
                        <Palette size={18} />
                        <h2 className="text-lg font-medium">Color Theme</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {themes.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={cn(
                                    "flex flex-col items-center p-4 rounded-lg border transition-all text-sm",
                                    theme === t.id
                                        ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                                        : "border-border hover:border-primary/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <div className={cn("w-full h-12 rounded mb-3 border", t.color)}></div>
                                {t.name}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Font Selection */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-foreground pb-2 border-b border-border">
                        <Type size={18} />
                        <h2 className="text-lg font-medium">Font Family</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {fonts.map((f) => (
                            <button
                                key={f.id}
                                onClick={() => setFont(f.id)}
                                className={cn(
                                    "w-full text-left px-4 py-3 rounded border transition-all text-sm flex justify-between items-center",
                                    font === f.id
                                        ? "border-primary bg-primary/10 text-foreground"
                                        : "border-border hover:border-primary/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span className={cn("truncate", `font-${f.id}`)}>{f.name}</span>
                                {font === f.id && <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"></div>}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Font Size Selection */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-foreground pb-2 border-b border-border">
                        <TextSelect size={18} />
                        <h2 className="text-lg font-medium">Font Size Scaling</h2>
                    </div>
                    <div className="flex bg-muted rounded border border-border overflow-hidden">
                        {fontSizes.map((fs, idx) => (
                            <button
                                key={fs.id}
                                onClick={() => setFontSize(fs.id)}
                                className={cn(
                                    "flex-1 text-center py-3 text-sm font-medium transition-colors border-r last:border-r-0 border-border",
                                    fontSize === fs.id
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-muted-foreground/10 hover:text-foreground"
                                )}
                            >
                                {fs.name}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
