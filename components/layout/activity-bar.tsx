"use client";

import { Files, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export type PanelType = "explorer" | "search" | "settings" | null;

interface ActivityBarProps {
    activePanel: PanelType;
    onPanelChange: (panel: PanelType) => void;
}

export function ActivityBar({ activePanel, onPanelChange }: ActivityBarProps) {
    const pathname = usePathname();
    const isSettingsActive = pathname === "/settings.json";

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+Shift+E
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                onPanelChange(activePanel === "explorer" ? null : "explorer");
            }
            // Ctrl+Shift+F
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                onPanelChange(activePanel === "search" ? null : "search");
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activePanel, onPanelChange]);

    return (
        <div className="w-12 h-full bg-card border-r border-border flex flex-col items-center pt-2 pb-4 z-50 shrink-0">
            <button
                onClick={() => onPanelChange(activePanel === "explorer" ? null : "explorer")}
                className={cn(
                    "p-2 mb-2 rounded transition-colors group relative",
                    activePanel === "explorer" ? "text-foreground border-l-2 border-primary -ml-[2px]" : "text-muted-foreground hover:text-foreground"
                )}
                title="Explorer (Ctrl+Shift+E)"
            >
                <Files className="w-6 h-6" strokeWidth={1.5} />
            </button>

            <button
                onClick={() => onPanelChange(activePanel === "search" ? null : "search")}
                className={cn(
                    "p-2 mb-2 rounded transition-colors group relative",
                    activePanel === "search" ? "text-foreground border-l-2 border-primary -ml-[2px]" : "text-muted-foreground hover:text-foreground"
                )}
                title="Search (Ctrl+Shift+F)"
            >
                <Search className="w-6 h-6" strokeWidth={1.5} />
            </button>

            {/* spacer */}
            <div className="flex-1" />

            <button
                onClick={() => onPanelChange("settings")}
                className={cn(
                    "p-2 rounded transition-colors group relative",
                    isSettingsActive ? "text-foreground border-l-2 border-primary -ml-[2px] bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                title="Settings (Ctrl+,)"
            >
                <Settings className={cn("w-6 h-6 transition-transform hover:rotate-90 duration-300", isSettingsActive && "text-primary")} strokeWidth={1.5} />
            </button>
        </div>
    );
}
