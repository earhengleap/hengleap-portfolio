"use client";

import { Files, Search, Settings, Users, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export type PanelType = "explorer" | "search" | "settings" | "visitors" | "monkeytype" | null;

interface ActivityBarProps {
    activePanel: PanelType;
    onPanelChange: (panel: PanelType) => void;
    visitorCount?: number; // number of OTHER live visitors (excluding self)
}

export function ActivityBar({ activePanel, onPanelChange, visitorCount = 0 }: ActivityBarProps) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                onPanelChange(activePanel === "explorer" ? null : "explorer");
            }
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                onPanelChange(activePanel === "search" ? null : "search");
            }
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'v') {
                e.preventDefault();
                // Only open visitors panel if there are visitors
                if (visitorCount > 0) {
                    onPanelChange(activePanel === "visitors" ? null : "visitors");
                }
            }
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (activePanel === "monkeytype") {
                    onPanelChange(null);
                } else {
                    onPanelChange("monkeytype");
                    router.push("/monkeytype");
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [activePanel, onPanelChange, router, visitorCount]);

    const SideTab = ({
        id,
        icon: Icon,
        isActive,
        onClick,
        title
    }: {
        id: string,
        icon: any,
        isActive: boolean,
        onClick: () => void,
        title: string
    }) => (
        <button
            onClick={onClick}
            className={cn(
                "p-2 mb-2 rounded-lg transition-all duration-300 group relative flex items-center justify-center",
                isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
            title={title}
        >
            <Icon className={cn("w-6 h-6 z-10 transition-transform duration-300", isActive && "scale-110")} strokeWidth={1.5} />

            {isActive && (
                <div className="absolute inset-0 bg-primary/15 rounded-lg border border-primary/30 z-0" />
            )}

            {isActive && (
                <div className="absolute left-[-8px] w-1 h-8 bg-primary rounded-full z-20" />
            )}
        </button>
    );

    return (
        <div className="w-14 h-full bg-[#181818] border-r border-border/40 flex flex-col items-center pt-3 pb-4 z-50 shrink-0 shadow-xl">
            <SideTab
                id="explorer"
                icon={Files}
                isActive={activePanel === "explorer"}
                onClick={() => onPanelChange(activePanel === "explorer" ? null : "explorer")}
                title="Explorer (Ctrl+Shift+E)"
            />

            <SideTab
                id="search"
                icon={Search}
                isActive={activePanel === "search"}
                onClick={() => onPanelChange(activePanel === "search" ? null : "search")}
                title="Search (Ctrl+Shift+F)"
            />

            <SideTab
                id="monkeytype"
                icon={Keyboard}
                isActive={activePanel === "monkeytype"}
                onClick={() => {
                    if (activePanel === "monkeytype") {
                        onPanelChange(null);
                    } else {
                        onPanelChange("monkeytype");
                        router.push("/monkeytype");
                    }
                }}
                title="MonkeyType (Ctrl+Shift+K)"
            />

            <div className="flex-1" />

            {/* Visitor icon — only shown when there are live visitors */}
            <AnimatePresence>
                {visitorCount > 0 && (
                    <motion.div
                        key="visitor-icon"
                        initial={{ opacity: 0, scale: 0.5, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="relative mb-2"
                    >
                        <button
                            onClick={() => onPanelChange(activePanel === "visitors" ? null : "visitors")}
                            className={cn(
                                "p-2 rounded-lg transition-all duration-300 group relative flex items-center justify-center",
                                activePanel === "visitors" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                            title={`Live Visitors: ${visitorCount} (Ctrl+Shift+V)`}
                        >
                            <Users
                                className={cn("w-6 h-6 z-10 transition-transform duration-300", activePanel === "visitors" && "scale-110")}
                                strokeWidth={1.5}
                            />

                            {/* Live badge with count */}
                            <motion.span
                                key={visitorCount}
                                initial={{ scale: 1.5 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-green-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 z-20 shadow"
                            >
                                {visitorCount}
                            </motion.span>

                            {/* Pulsing ring when active */}
                            <motion.span
                                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500/40 z-10"
                                animate={{ scale: [1, 1.8, 1], opacity: [0.7, 0, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {activePanel === "visitors" && (
                                <div className="absolute inset-0 bg-primary/15 rounded-lg border border-primary/30 z-0" />
                            )}
                            {activePanel === "visitors" && (
                                <div className="absolute left-[-8px] w-1 h-8 bg-primary rounded-full z-20" />
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <SideTab
                id="settings"
                icon={Settings}
                isActive={activePanel === "settings"}
                onClick={() => onPanelChange(activePanel === "settings" ? null : "settings")}
                title="Settings (Ctrl+,)"
            />
        </div>
    );
}
