"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FileJson,
    TerminalSquare,
    User,
    Briefcase,
    Settings,
    ChevronRight,
    FolderOpen
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { name: "home.tsx", path: "/", icon: TerminalSquare, color: "text-blue-400" },
    { name: "about.ts", path: "/about", icon: User, color: "text-yellow-400" },
    { name: "projects.json", path: "/projects", icon: FileJson, color: "text-green-400" },
    { name: "skills.md", path: "/skills", icon: Settings, color: "text-purple-400" },
    { name: "contact.sh", path: "/contact", icon: Briefcase, color: "text-orange-400" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 h-full bg-[#1e1e1e] border-r border-[#333] flex flex-col hidden md:flex shrink-0">
            {/* Explorer Header */}
            <div className="px-4 py-3 text-xs font-semibold text-gray-400 tracking-widest uppercase flex items-center">
                EXPLORER
            </div>

            {/* Workspace Folders */}
            <div className="px-2">
                <div className="flex items-center text-sm text-gray-300 font-semibold py-1 cursor-pointer hover:bg-[#2d2d2d] rounded px-2">
                    <ChevronRight className="w-4 h-4 mr-1 transition-transform rotate-90" />
                    <FolderOpen className="w-4 h-4 mr-2 text-blue-300" />
                    XING_PORTFOLIO
                </div>

                <div className="pl-6 mt-1 flex flex-col gap-[2px]">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "flex items-center text-sm py-[4px] px-2 rounded cursor-pointer transition-colors",
                                    isActive
                                        ? "bg-[#37373d] text-white"
                                        : "text-gray-400 hover:bg-[#2d2d2d] hover:text-gray-200"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4 mr-2", item.color)} />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
