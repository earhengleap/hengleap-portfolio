"use client";

import React, { useEffect, useRef } from "react";
import { FilePlus, Search, Terminal } from "lucide-react";

interface GlobalContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
    onNewFile: () => void;
    onOpenFile: () => void;
    onNewTerminal: () => void;
}

export function GlobalContextMenu({
    x,
    y,
    onClose,
    onNewFile,
    onOpenFile,
    onNewTerminal,
}: GlobalContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="fixed z-[1000] w-64 bg-popover/90 text-popover-foreground border border-border rounded-md shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-100 backdrop-blur-xl"
            style={{ top: y, left: x }}
        >
            <button
                className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors group"
                onClick={() => {
                    onNewFile();
                    onClose();
                }}
            >
                <div className="flex items-center gap-3">
                    <FilePlus className="w-4 h-4" />
                    <span>New Text File</span>
                </div>
                <span className="text-xs opacity-50 font-mono group-hover:text-primary-foreground/70">Ctrl+N</span>
            </button>

            <button
                className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors group"
                onClick={() => {
                    onOpenFile();
                    onClose();
                }}
            >
                <div className="flex items-center gap-3">
                    <Search className="w-4 h-4" />
                    <span>Open File...</span>
                </div>
                <span className="text-xs opacity-50 font-mono group-hover:text-primary-foreground/70">Ctrl+P</span>
            </button>

            <div className="h-[1px] bg-border my-2 mx-2" />

            <button
                className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-primary hover:text-primary-foreground transition-colors group"
                onClick={() => {
                    onNewTerminal();
                    onClose();
                }}
            >
                <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4" />
                    <span>New Terminal</span>
                </div>
                <span className="text-xs opacity-50 font-mono group-hover:text-primary-foreground/70">Ctrl+`</span>
            </button>
        </div>
    );
}
