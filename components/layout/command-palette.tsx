"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, File as FileIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    files: { name: string; path: string }[];
    onSelect: (path: string) => void;
}

export function CommandPalette({
    isOpen,
    onClose,
    files,
    onSelect,
}: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredFiles = files.filter((file) =>
        file.name.toLowerCase().includes(query.toLowerCase()) ||
        file.path.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 8);

    useEffect(() => {
        if (isOpen) {
            setQuery("");
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 10);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredFiles.length));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredFiles.length) % Math.max(1, filteredFiles.length));
            } else if (e.key === "Enter") {
                if (filteredFiles[selectedIndex]) {
                    onSelect(filteredFiles[selectedIndex].path);
                    onClose();
                }
            } else if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, filteredFiles, selectedIndex, onSelect, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md pointer-events-auto" onClick={onClose} />

            <div className="w-full max-w-2xl bg-popover border border-border rounded-lg shadow-2xl overflow-hidden pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="flex items-center px-4 py-2 border-b border-border bg-muted/30">
                    <Search className="w-4 h-4 mr-3 text-muted-foreground" />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 h-10 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
                        placeholder="Search files by name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        ESC
                    </kbd>
                </div>

                <div className="max-h-[350px] overflow-y-auto no-scrollbar py-2">
                    {filteredFiles.length > 0 ? (
                        filteredFiles.map((file, index) => (
                            <button
                                key={file.path}
                                className={cn(
                                    "w-full flex items-center px-4 py-2.5 text-sm transition-colors text-left",
                                    index === selectedIndex ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                                )}
                                onClick={() => {
                                    onSelect(file.path);
                                    onClose();
                                }}
                            >
                                <FileIcon className={cn("w-4 h-4 mr-3", index === selectedIndex ? "text-primary-foreground" : "text-muted-foreground")} />
                                <div className="flex flex-col">
                                    <span className="font-medium">{file.name}</span>
                                    <span className={cn("text-[10px]", index === selectedIndex ? "text-primary-foreground/70" : "text-muted-foreground/70")}>
                                        {file.path}
                                    </span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No files matching your search.
                        </div>
                    )}
                </div>

                <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1"><kbd className="border bg-muted px-1 rounded">↑↓</kbd> Navigate</span>
                        <span className="flex items-center gap-1"><kbd className="border bg-muted px-1 rounded">Enter</kbd> Open</span>
                    </div>
                    <span>{filteredFiles.length} result(s)</span>
                </div>
            </div>
        </div>
    );
}
