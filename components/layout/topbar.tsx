"use client";

import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS = [
    { name: "home.tsx", path: "/" },
    { name: "about.ts", path: "/about" },
    { name: "projects.json", path: "/projects" },
    { name: "skills.md", path: "/skills" },
    { name: "contact.sh", path: "/contact" },
];

export function Topbar() {
    const pathname = usePathname();

    // Find the exact opened tab or default to empty
    const activeTab = TABS.find((t) => t.path === pathname);

    return (
        <div className="h-10 bg-[#1e1e1e] border-b border-[#333] flex items-end px-2 overflow-x-auto no-scrollbar shrink-0">
            {/* File Tabs */}
            <div className="flex bg-[#1e1e1e]">
                {TABS.map((tab) => {
                    const isActive = pathname === tab.path;

                    return (
                        <Link
                            href={tab.path}
                            key={tab.path}
                            className={cn(
                                "group flex items-center h-9 px-4 min-w-[120px] max-w-[200px] border-r border-[#333] text-sm cursor-pointer select-none",
                                isActive
                                    ? "bg-[#1e1e1e]/60 border-t border-t-blue-500 text-white" // Active state matches editor bg
                                    : "bg-[#2d2d2d] text-gray-400 hover:bg-[#2d2d2d]/80"
                            )}
                        >
                            <span className="truncate mr-2 flex-1">{tab.name}</span>
                            <div
                                className={cn(
                                    "p-[2px] rounded-md transition-opacity opacity-0 group-hover:opacity-100",
                                    isActive && "opacity-100 hover:bg-[#333] hover:text-white"
                                )}
                                onClick={(e: React.MouseEvent) => {
                                    e.preventDefault();
                                    // In a real editor, this would close the tab. Here we just prevent propagation.
                                    // For a portfolio, maybe redirect to home if closing the active tab?
                                }}
                            >
                                <X className="w-3 h-3" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Editor Breadcrumbs Area / Right Actions */}
            <div className="flex-1 flex justify-end items-center h-full px-4 text-xs text-gray-500">
                <span className="hidden md:inline-block">Codex Coder Workspace</span>
            </div>
        </div>
    );
}
