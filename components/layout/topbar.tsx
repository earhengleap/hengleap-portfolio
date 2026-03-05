"use client";

import { usePathname, useRouter } from "next/navigation";
import { X, Menu } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

const ALL_POSSIBLE_TABS = [
    { name: "home.tsx", path: "/" },
    { name: "about.ts", path: "/about" },
    { name: "projects.json", path: "/projects" },
    { name: "skills.md", path: "/skills" },
    { name: "contact.sh", path: "/contact" },
];

export function Topbar({
    onMenuClick,
    openTabs,
    onCloseTab
}: {
    onMenuClick: () => void;
    openTabs: { name: string, path: string }[];
    onCloseTab: (e: React.MouseEvent, path: string) => void;
}) {
    const pathname = usePathname();
    const router = useRouter();

    // Handled by parent.

    return (
        <div className="h-10 bg-card border-b border-border flex items-end overflow-x-auto no-scrollbar shrink-0 w-full relative">
            {/* File Tabs */}
            <div className="flex bg-card">
                {openTabs.map((tab) => {
                    const isActive = pathname === tab.path;

                    return (
                        <div
                            key={tab.path}
                            onClick={() => router.push(tab.path)}
                            className={cn(
                                "group flex shrink-0 items-center h-9 px-4 min-w-[120px] max-w-[200px] border-r border-border text-sm cursor-pointer select-none",
                                isActive
                                    ? "bg-background border-t border-t-primary text-foreground" // Active state matches editor bg
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            <span className="truncate mr-2 flex-1">{tab.name}</span>
                            <button
                                className={cn(
                                    "p-[2px] rounded-md transition-all opacity-0 group-hover:opacity-100",
                                    isActive && "opacity-100 hover:bg-accent hover:text-foreground"
                                )}
                                onClick={(e) => onCloseTab(e, tab.path)}
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Editor Breadcrumbs Area / Right Actions */}
            <div className="flex-1 flex justify-end items-center h-full px-4 text-xs text-muted-foreground">
                <span className="hidden md:inline-block">Codex Coder Workspace</span>
            </div>
        </div>
    );
}
