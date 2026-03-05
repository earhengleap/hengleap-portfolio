import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Maximize, Minus, X, LayoutTemplate, Menu } from "lucide-react";

interface MenuProps {
    label: string;
    items: { label?: string, shortcut?: string, action?: () => void, divider?: boolean }[];
}

const MENUS: MenuProps[] = [
    {
        label: "File",
        items: [
            { label: "New Text File", shortcut: "Ctrl+N" },
            { label: "New File...", shortcut: "Ctrl+Alt+Windows+N" },
            { label: "New Window", shortcut: "Ctrl+Shift+N" },
            { divider: true },
            { label: "Open File...", shortcut: "Ctrl+O" },
            { label: "Open Folder...", shortcut: "Ctrl+K Ctrl+O" },
            { divider: true },
            { label: "Save", shortcut: "Ctrl+S" },
            { label: "Save As...", shortcut: "Ctrl+Shift+S" },
            { divider: true },
            { label: "Exit", shortcut: "Alt+F4" },
        ]
    },
    {
        label: "Edit",
        items: [
            { label: "Undo", shortcut: "Ctrl+Z" },
            { label: "Redo", shortcut: "Ctrl+Y" },
            { divider: true },
            { label: "Cut", shortcut: "Ctrl+X" },
            { label: "Copy", shortcut: "Ctrl+C" },
            { label: "Paste", shortcut: "Ctrl+V" },
            { divider: true },
            { label: "Find", shortcut: "Ctrl+F" },
            { label: "Replace", shortcut: "Ctrl+H" },
            { label: "Find in Files", shortcut: "Ctrl+Shift+F" }, // Will link this later if needed
        ]
    },
    {
        label: "Selection",
        items: [
            { label: "Select All", shortcut: "Ctrl+A" },
            { label: "Expand Selection", shortcut: "Shift+Alt+Right" },
            { label: "Shrink Selection", shortcut: "Shift+Alt+Left" },
            { divider: true },
            { label: "Copy Line Up", shortcut: "Shift+Alt+Up" },
            { label: "Copy Line Down", shortcut: "Shift+Alt+Down" },
            { label: "Move Line Up", shortcut: "Alt+Up" },
            { label: "Move Line Down", shortcut: "Alt+Down" },
        ]
    },
    {
        label: "View",
        items: [
            { label: "Command Palette...", shortcut: "Ctrl+Shift+P" },
            { label: "Open View..." },
            { divider: true },
            { label: "Appearance" },
            { label: "Editor Layout" },
            { divider: true },
            { label: "Explorer", shortcut: "Ctrl+Shift+E" },
            { label: "Search", shortcut: "Ctrl+Shift+F" },
            { label: "Extensions", shortcut: "Ctrl+Shift+X" },
        ]
    },
    {
        label: "Go",
        items: [
            { label: "Back", shortcut: "Alt+Left" },
            { label: "Forward", shortcut: "Alt+Right" },
            { divider: true },
            { label: "Go to File...", shortcut: "Ctrl+P" },
            { label: "Go to Symbol in Workspace...", shortcut: "Ctrl+T" },
            { divider: true },
            { label: "Go to Line/Column...", shortcut: "Ctrl+G" },
        ]
    },
    {
        label: "Run",
        items: [
            { label: "Start Debugging", shortcut: "F5" },
            { label: "Run Without Debugging", shortcut: "Ctrl+F5" },
            { divider: true },
            { label: "Add Configuration..." },
            { label: "Open Configurations" },
        ]
    },
    {
        label: "Terminal",
        items: [
            { label: "New Terminal", shortcut: "Ctrl+Shift+`" },
            { label: "Split Terminal", shortcut: "Ctrl+Shift+5" },
            { divider: true },
            { label: "Run Task..." },
            { label: "Run Build Task...", shortcut: "Ctrl+Shift+B" },
        ]
    },
    {
        label: "Help",
        items: [
            { label: "Welcome" },
            { label: "Show All Commands", shortcut: "Ctrl+Shift+P" },
            { label: "Documentation" },
            { divider: true },
            { label: "About Hengleap" },
        ]
    }
];

export function MenuBar({
    onMenuClick,
    onSearchClick
}: {
    onMenuClick?: (panel: string) => void;
    onSearchClick?: () => void;
}) {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenu(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleItemClick = (label: string) => {
        setActiveMenu(null);
        if (label === "Explorer" && onMenuClick) onMenuClick("explorer");
        if (label === "Search" && onSearchClick) onSearchClick();
        if (label === "Find in Files" && onSearchClick) onSearchClick();
    };

    return (
        <div className="relative z-[60] h-9 bg-background text-muted-foreground flex items-center justify-between px-2 text-[13px] select-none shrink-0 w-full border-b border-border" ref={menuRef}>
            <div className="flex items-center space-x-1 h-full">
                {/* Burger Menu / App Icon area */}
                <button
                    onClick={() => { if (onMenuClick) onMenuClick("menu"); }}
                    className="flex items-center justify-center w-8 h-full mr-1 text-muted-foreground hover:bg-accent hover:text-foreground rounded transition-colors"
                >
                    <Menu className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-center w-8 h-full mr-2 text-blue-400">
                    <LayoutTemplate size={16} />
                </div>

                {/* Menu Items */}
                <div className="hidden md:flex h-full py-1">
                    {MENUS.map((menu) => (
                        <div key={menu.label} className="relative h-full flex items-center">
                            <div
                                className={cn(
                                    "px-2 py-1 rounded cursor-pointer transition-colors duration-75",
                                    activeMenu === menu.label ? "bg-accent text-accent-foreground" : "hover:bg-muted text-foreground"
                                )}
                                onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
                                onMouseEnter={() => { if (activeMenu) setActiveMenu(menu.label); }} // Hover to switch menus once open
                            >
                                {menu.label}
                            </div>

                            {/* Dropdown menu */}
                            {activeMenu === menu.label && (
                                <div className="absolute top-[100%] left-0 z-50 mt-1 min-w-[240px] bg-popover text-popover-foreground border border-border rounded-md shadow-lg py-1">
                                    {menu.items.map((item, i) => (
                                        item.divider ? (
                                            <div key={`div-${i}`} className="h-[1px] bg-border my-1 mx-2" />
                                        ) : (
                                            <div
                                                key={item.label}
                                                className="flex items-center justify-between px-6 py-1 hover:bg-primary hover:text-primary-foreground cursor-pointer group"
                                                onClick={() => handleItemClick(item.label!)}
                                            >
                                                <span>{item.label}</span>
                                                {item.shortcut && (
                                                    <span className="text-gray-500 group-hover:text-gray-300">{item.shortcut}</span>
                                                )}
                                            </div>
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Search Input (Centered IDE Title style) */}
            <div
                className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-96 h-6 bg-input border border-border rounded-md items-center justify-center cursor-pointer hover:bg-muted transition-colors overflow-hidden px-3"
                onClick={() => { if (onSearchClick) onSearchClick(); }}
            >
                <span className="text-muted-foreground text-xs text-center w-full truncate">Hengleap&apos;s Workspace</span>
            </div>

            {/* Window Controls Simulator */}
            <div className="flex items-center h-full -mr-2">
                <div className="w-12 h-full flex items-center justify-center hover:bg-muted cursor-pointer">
                    <Minus size={14} />
                </div>
                <div className="w-12 h-full flex items-center justify-center hover:bg-muted cursor-pointer">
                    <Maximize size={12} />
                </div>
                <div className="w-12 h-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground cursor-pointer">
                    <X size={14} />
                </div>
            </div>
        </div>
    );
}
