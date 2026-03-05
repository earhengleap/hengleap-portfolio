"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    FileJson,
    TerminalSquare,
    User,
    Briefcase,
    Settings,
    ChevronRight,
    FolderOpen,
    Code2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getFileIconAndColor } from "@/lib/file-icons";

const NAV_ITEMS = [
    { name: "home.tsx", path: "/", icon: TerminalSquare, color: "text-blue-400" },
    { name: "about.ts", path: "/about", icon: User, color: "text-yellow-400" },
    { name: "projects.json", path: "/projects", icon: FileJson, color: "text-green-400" },
    { name: "skills.md", path: "/skills", icon: Settings, color: "text-purple-400" },
    { name: "contact.sh", path: "/contact", icon: Briefcase, color: "text-orange-400" },
    { name: "settings.json", path: "/settings.json", icon: Settings, color: "text-gray-400" },
];

interface SearchResult {
    title: string;
    path: string;
    description: string;
    content: string;
}

function HighlightedText({ text, query }: { text: string, query: string }) {
    if (!query) return <span>{text}</span>;

    // Split text on query term, keeping the term (using RegExp capture group)
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
        <span>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase()
                    ? <span key={i} className="bg-blue-500/40 text-blue-100 rounded-sm">{part}</span>
                    : <span key={i}>{part}</span>
            )}
        </span>
    );
}

export function Sidebar({
    isMobileOpen,
    isDesktopOpen,
    onMobileClose,
    activePanel,
    activeFile,
    virtualFiles = [],
    virtualFolders = [],
    onNewFile,
    onNewFolder,
    onItemContextMenu,
    onExplorerContextMenu,
    isCreatingFileExt,
    isCreatingFolderExt,
    onCancelCreateFile,
    onCancelCreateFolder,
    renamingFileExt,
    renamingFolderExt,
    onRenameFile,
    onRenameFolder,
    onCancelRenameFile,
    onCancelRenameFolder
}: {
    isMobileOpen: boolean;
    isDesktopOpen: boolean;
    onMobileClose: () => void;
    activePanel?: "explorer" | "search" | "settings" | null;
    activeFile: string | null;
    virtualFiles?: { name: string; path: string; parentId?: string | null }[];
    virtualFolders?: { name: string; path: string; parentId?: string | null }[];
    onNewFile?: (name: string) => void;
    onNewFolder?: (name: string) => void;
    onItemContextMenu?: (e: React.MouseEvent, item: { path: string; name: string; isVirtual?: boolean; isFolder?: boolean }) => void;
    onExplorerContextMenu?: (e: React.MouseEvent) => void;

    // Controlled from layout if right click from global context menu happens
    isCreatingFileExt?: string | boolean;
    isCreatingFolderExt?: string | boolean;
    onCancelCreateFile?: () => void;
    onCancelCreateFolder?: () => void;

    // Controlled from layout for renaming
    renamingFileExt?: string | null;
    renamingFolderExt?: string | null;
    onRenameFile: (path: string, newName?: string) => void;
    onRenameFolder: (path: string, newName?: string) => void;
    onCancelRenameFile?: () => void;
    onCancelRenameFolder?: () => void;
}) {
    const pathname = usePathname();
    const [width, setWidth] = useState(256);
    const [isResizing, setIsResizing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFolderOpen, setIsFolderOpen] = useState(true);

    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Track which virtual folders are open
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

    // Selection state for F2 rename
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'file' | 'folder' | null>(null);

    const toggleFolder = (path: string) => {
        setOpenFolders(prev => {
            const next = new Set(prev);
            if (next.has(path)) {
                next.delete(path);
            } else {
                next.add(path);
            }
            return next;
        });
    };

    // Global shortcut listener
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is already typing in an input
            if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
                return;
            }

            if (e.key === "F2") {
                if (selectedPath && (selectedPath.startsWith("/virtual") || selectedPath.startsWith("/virtual-folder"))) {
                    e.preventDefault();
                    if (selectedType === 'file') {
                        onRenameFile(selectedPath);
                    } else if (selectedType === 'folder') {
                        onRenameFolder(selectedPath);
                    }
                }
            }
        };
        window.addEventListener("keydown", handleGlobalKeyDown);
        return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }, [selectedPath, selectedType, onRenameFile, onRenameFolder]);

    // Inline File Creation State
    const [isCreatingFile, setIsCreatingFile] = useState(false);
    const [newFileName, setNewFileName] = useState("");
    const newFileInputRef = useRef<HTMLInputElement>(null);

    // Inline Folder Creation State
    const [isCreatingFolder, setIsCreatingFolder] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const newFolderInputRef = useRef<HTMLInputElement>(null);

    // Inline File Rename State
    const [renameFileName, setRenameFileName] = useState("");
    const renameFileInputRef = useRef<HTMLInputElement>(null);

    // Inline Folder Rename State
    const [renameFolderName, setRenameFolderName] = useState("");
    const renameFolderInputRef = useRef<HTMLInputElement>(null);

    // Sync external trigger for files
    useEffect(() => {
        if (isCreatingFileExt) {
            setIsCreatingFile(true);
            if (typeof isCreatingFileExt === 'string') {
                setOpenFolders(prev => new Set(prev).add(isCreatingFileExt));
            }
        } else {
            setIsCreatingFile(false);
        }
    }, [isCreatingFileExt]);

    // Sync external trigger for folders
    useEffect(() => {
        if (isCreatingFolderExt) {
            setIsCreatingFolder(true);
            if (typeof isCreatingFolderExt === 'string') {
                setOpenFolders(prev => new Set(prev).add(isCreatingFolderExt));
            }
        } else {
            setIsCreatingFolder(false);
        }
    }, [isCreatingFolderExt]);

    useEffect(() => {
        if (renamingFileExt) {
            const file = virtualFiles.find(f => f.path === renamingFileExt);
            if (file) {
                setRenameFileName(file.name);
            }
        }
    }, [renamingFileExt, virtualFiles]);

    useEffect(() => {
        if (renamingFolderExt) {
            const folder = virtualFolders.find(f => f.path === renamingFolderExt);
            if (folder) {
                setRenameFolderName(folder.name);
            }
        }
    }, [renamingFolderExt, virtualFolders]);

    useEffect(() => {
        if (isCreatingFile && newFileInputRef.current) {
            newFileInputRef.current.focus();
        }
    }, [isCreatingFile]);

    useEffect(() => {
        if (isCreatingFolder && newFolderInputRef.current) {
            newFolderInputRef.current.focus();
        }
    }, [isCreatingFolder]);

    useEffect(() => {
        if (renamingFileExt && renameFileInputRef.current) {
            renameFileInputRef.current.focus();
            // Optional: select all text excluding extension
            const dotIndex = renameFileName.lastIndexOf('.');
            if (dotIndex > 0) {
                renameFileInputRef.current.setSelectionRange(0, dotIndex);
            } else {
                renameFileInputRef.current.select();
            }
        }
    }, [renamingFileExt]); // Delay selection slightly until value is set

    useEffect(() => {
        if (renamingFolderExt && renameFolderInputRef.current) {
            renameFolderInputRef.current.focus();
            renameFolderInputRef.current.select();
        }
    }, [renamingFolderExt]);

    const handleCreateFileSubmit = () => {
        if (newFileName.trim()) {
            if (onNewFile) onNewFile(newFileName.trim());
        } else {
            if (onCancelCreateFile) onCancelCreateFile();
        }
        setIsCreatingFile(false);
        setNewFileName("");
    };

    const handleCreateFileKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCreateFileSubmit();
        } else if (e.key === "Escape") {
            setIsCreatingFile(false);
            setNewFileName("");
            if (onCancelCreateFile) onCancelCreateFile();
        }
    };

    const handleCreateFolderSubmit = () => {
        if (newFolderName.trim()) {
            if (onNewFolder) onNewFolder(newFolderName.trim());
        } else {
            if (onCancelCreateFolder) onCancelCreateFolder();
        }
        setIsCreatingFolder(false);
        setNewFolderName("");
    };

    const handleCreateFolderKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleCreateFolderSubmit();
        } else if (e.key === "Escape") {
            setIsCreatingFolder(false);
            setNewFolderName("");
            if (onCancelCreateFolder) onCancelCreateFolder();
        }
    };

    const handleRenameFileSubmit = (path: string) => {
        if (renameFileName.trim() && onRenameFile) {
            onRenameFile(path, renameFileName.trim());
        } else if (onCancelRenameFile) {
            onCancelRenameFile(); // Fallback if empty
        }
    };

    const handleRenameFileKeyDown = (e: React.KeyboardEvent, path: string) => {
        if (e.key === "Enter") {
            handleRenameFileSubmit(path);
        } else if (e.key === "Escape") {
            if (onCancelRenameFile) onCancelRenameFile();
        }
    };

    const handleRenameFolderSubmit = (path: string) => {
        if (renameFolderName.trim() && onRenameFolder) {
            onRenameFolder(path, renameFolderName.trim());
        } else if (onCancelRenameFolder) {
            onCancelRenameFolder(); // Fallback if empty
        }
    };

    const handleRenameFolderKeyDown = (e: React.KeyboardEvent, path: string) => {
        if (e.key === "Enter") {
            handleRenameFolderSubmit(path);
        } else if (e.key === "Escape") {
            if (onCancelRenameFolder) onCancelRenameFolder();
        }
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setIsSearching(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            // Activity bar is ~48px
            let newWidth = e.clientX - 48;
            if (newWidth < 180) newWidth = 180;
            if (newWidth > 600) newWidth = 600;
            setWidth(newWidth);
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    useEffect(() => {
        if (activePanel === "search") {
            setTimeout(() => {
                document.getElementById("global-search-input")?.focus();
            }, 50);
        }
    }, [activePanel]);

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onMobileClose}
                />
            )}

            <div className={cn(
                "fixed inset-y-0 left-12 md:left-0 z-[45] md:z-0 h-full bg-card border-border flex flex-col shrink-0 md:relative group",
                !isResizing && "transition-transform duration-300 ease-in-out md:transition-all",
                // Mobile layout (starts at left-12 so it's next to the activity bar)
                isMobileOpen ? "translate-x-0 w-64 border-r" : "-translate-x-full w-64 border-r",
                // Desktop layout
                isDesktopOpen ? "md:translate-x-0 md:w-[var(--sidebar-width)] md:border-r" : "md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden md:opacity-0"
            )}
                style={{ '--sidebar-width': `${width}px` } as React.CSSProperties}
            >
                <div className="flex-1 flex flex-col w-full h-full min-w-[180px] overflow-hidden">
                    {(!activePanel || activePanel === "explorer") && (
                        <>
                            {/* Explorer Header */}
                            <div className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-widest uppercase flex items-center justify-between">
                                EXPLORER
                            </div>

                            {/* Workspace Folders */}
                            <div
                                className="px-2 pb-4 flex-1 overflow-y-auto"
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (onExplorerContextMenu) {
                                        onExplorerContextMenu(e);
                                    } else {
                                        setIsCreatingFile(true);
                                        setIsFolderOpen(true);
                                    }
                                }}
                            >
                                <div
                                    onClick={() => {
                                        setIsFolderOpen(!isFolderOpen);
                                        setSelectedPath('/');
                                        setSelectedType('folder');
                                    }}
                                    onContextMenu={(e) => {
                                        if (onItemContextMenu) {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onItemContextMenu(e, { path: '/', name: 'XING_PORTFOLIO', isVirtual: false, isFolder: true });
                                        }
                                    }}
                                    className={cn(
                                        "flex items-center text-sm font-semibold py-1 cursor-pointer hover:bg-muted rounded px-2 select-none transition-colors",
                                        selectedPath === '/' ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <ChevronRight className={cn("w-4 h-4 mr-1 transition-transform", isFolderOpen && "rotate-90")} />
                                    <FolderOpen className="w-4 h-4 mr-2 text-blue-300" />
                                    <span className="truncate">XING_PORTFOLIO</span>
                                </div>

                                {isFolderOpen && (
                                    <div className="pl-6 mt-1 flex flex-col gap-[2px] overflow-y-auto">
                                        {NAV_ITEMS.map((item) => {
                                            const isActive = activeFile === item.path;

                                            return (
                                                <Link
                                                    key={item.path}
                                                    href={item.path}
                                                    onContextMenu={(e) => {
                                                        if (onItemContextMenu) {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            onItemContextMenu(e, { path: item.path, name: item.name, isVirtual: false });
                                                        }
                                                    }}
                                                    onClick={() => {
                                                        setSelectedPath(item.path);
                                                        setSelectedType('file');
                                                        if (window.innerWidth < 768) {
                                                            onMobileClose();
                                                        }
                                                    }}
                                                    className={cn(
                                                        "flex items-center text-sm py-[4px] px-2 rounded cursor-pointer transition-colors",
                                                        pathname === item.path || selectedPath === item.path
                                                            ? "bg-accent text-accent-foreground"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    <item.icon className={cn("w-4 h-4 mr-2 shrink-0", item.color)} />
                                                    <span className="truncate">{item.name}</span>
                                                </Link>
                                            )
                                        })}

                                    </div>
                                )}

                                {/* Recursive Virtual Item Rendering */}
                                {(() => {
                                    const renderTree = (parentId: string | null = null, level: number = 0) => {
                                        const folders = virtualFolders.filter(f => (f.parentId || null) === (parentId || null));
                                        const files = virtualFiles.filter(f => (f.parentId || null) === (parentId || null));
                                        const isCreatingFolderAtThisLevel = isCreatingFolderExt === (parentId || true);
                                        const isCreatingFileAtThisLevel = isCreatingFileExt === (parentId || true);

                                        return (
                                            <div className={cn("flex flex-col gap-[2px]", level > 0 && "pl-4")}>
                                                {folders.map((item) => {
                                                    const isActive = activeFile === item.path;
                                                    const isRenaming = renamingFolderExt === item.path;
                                                    const isOpen = openFolders.has(item.path);

                                                    if (isRenaming) {
                                                        return (
                                                            <div key={item.path} className="flex items-center text-sm py-[2px] px-2 rounded bg-accent/50 border border-blue-500/50">
                                                                <FolderOpen className="w-4 h-4 mr-2 shrink-0 text-gray-300" />
                                                                <input
                                                                    ref={renameFolderInputRef}
                                                                    type="text"
                                                                    value={renameFolderName}
                                                                    onChange={(e) => setRenameFolderName(e.target.value)}
                                                                    onKeyDown={(e) => handleRenameFolderKeyDown(e, item.path)}
                                                                    onBlur={() => handleRenameFolderSubmit(item.path)}
                                                                    className="w-full bg-transparent border-none outline-none text-foreground text-sm"
                                                                />
                                                            </div>
                                                        )
                                                    }

                                                    return (
                                                        <div key={item.path}>
                                                            <div
                                                                onClick={() => {
                                                                    toggleFolder(item.path);
                                                                    setSelectedPath(item.path);
                                                                    setSelectedType('folder');
                                                                }}
                                                                onContextMenu={(e) => {
                                                                    if (onItemContextMenu) {
                                                                        e.preventDefault();
                                                                        e.stopPropagation();
                                                                        onItemContextMenu(e, { path: item.path, name: item.name, isVirtual: true, isFolder: true });
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "flex items-center text-sm py-[4px] px-2 rounded cursor-pointer transition-colors",
                                                                    item.path === activeFile || selectedPath === item.path
                                                                        ? "bg-accent text-accent-foreground"
                                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                                )}
                                                            >
                                                                <ChevronRight className={cn("w-4 h-4 mr-1 transition-transform", isOpen && "rotate-90")} />
                                                                <FolderOpen className="w-4 h-4 mr-2 shrink-0 text-gray-300" />
                                                                <span className="truncate italic">{item.name}</span>
                                                            </div>
                                                            {/* Render Children */}
                                                            {isOpen && renderTree(item.path, level + 1)}
                                                        </div>
                                                    )
                                                })}

                                                {/* Inline Folder Creation */}
                                                {(isCreatingFolderAtThisLevel || (isCreatingFolder && !parentId && isCreatingFolderExt === true)) && (
                                                    <div className="flex items-center text-sm py-[2px] px-2 rounded bg-accent/50 border border-blue-500/50">
                                                        <FolderOpen className="w-4 h-4 mr-2 shrink-0 text-gray-300" />
                                                        <input
                                                            ref={newFolderInputRef}
                                                            type="text"
                                                            value={newFolderName}
                                                            onChange={(e) => setNewFolderName(e.target.value)}
                                                            onKeyDown={handleCreateFolderKeyDown}
                                                            onBlur={handleCreateFolderSubmit}
                                                            placeholder="new-folder..."
                                                            className="w-full bg-transparent border-none outline-none text-foreground text-sm"
                                                        />
                                                    </div>
                                                )}

                                                {files.map((item) => {
                                                    const isActive = activeFile === item.path;
                                                    const { icon: IconComponent, color } = getFileIconAndColor(item.name);
                                                    const isRenaming = renamingFileExt === item.path;

                                                    if (isRenaming) {
                                                        return (
                                                            <div key={item.path} className="flex items-center text-sm py-[2px] px-2 rounded bg-accent/50 border border-blue-500/50">
                                                                <IconComponent className={cn("w-4 h-4 mr-2 shrink-0", color)} />
                                                                <input
                                                                    ref={renameFileInputRef}
                                                                    type="text"
                                                                    value={renameFileName}
                                                                    onChange={(e) => setRenameFileName(e.target.value)}
                                                                    onKeyDown={(e) => handleRenameFileKeyDown(e, item.path)}
                                                                    onBlur={() => handleRenameFileSubmit(item.path)}
                                                                    className="w-full bg-transparent border-none outline-none text-foreground text-sm"
                                                                />
                                                            </div>
                                                        )
                                                    }

                                                    return (
                                                        <Link
                                                            key={item.path}
                                                            href={item.path}
                                                            onContextMenu={(e) => {
                                                                if (onItemContextMenu) {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    onItemContextMenu(e, { path: item.path, name: item.name, isVirtual: true });
                                                                }
                                                            }}
                                                            onClick={() => {
                                                                setSelectedPath(item.path);
                                                                setSelectedType('file');
                                                                if (window.innerWidth < 768) {
                                                                    onMobileClose();
                                                                }
                                                            }}
                                                            className={cn(
                                                                "flex items-center text-sm py-[4px] px-2 rounded cursor-pointer transition-colors",
                                                                isActive || selectedPath === item.path
                                                                    ? "bg-accent text-accent-foreground"
                                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                            )}
                                                        >
                                                            <IconComponent className={cn("w-4 h-4 mr-2 shrink-0", color)} />
                                                            <span className="truncate italic">{item.name}</span>
                                                        </Link>
                                                    )
                                                })}

                                                {/* Inline File Creation */}
                                                {(isCreatingFileAtThisLevel || (isCreatingFile && !parentId && isCreatingFileExt === true)) && (
                                                    <div className="flex items-center text-sm py-[2px] px-2 rounded bg-accent/50 border border-blue-500/50">
                                                        <FileJson className="w-4 h-4 mr-2 shrink-0 text-blue-400" />
                                                        <input
                                                            ref={newFileInputRef}
                                                            type="text"
                                                            value={newFileName}
                                                            onChange={(e) => setNewFileName(e.target.value)}
                                                            onKeyDown={handleCreateFileKeyDown}
                                                            onBlur={handleCreateFileSubmit}
                                                            className="w-full bg-transparent border-none outline-none text-foreground text-sm"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    };

                                    return renderTree();
                                })()}
                            </div>
                        </>
                    )}

                    {activePanel === "search" && (
                        <div className="p-4 flex flex-col h-full overflow-hidden">
                            <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4 shrink-0">SEARCH</div>
                            <input
                                id="global-search-input"
                                type="text"
                                placeholder="Search files and content..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-input border border-[transparent] focus:border-primary rounded px-2 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground mb-4 shrink-0"
                            />

                            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                                {searchQuery && (
                                    <div className="text-xs text-muted-foreground mb-2">
                                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                    </div>
                                )}

                                <div className="space-y-3">
                                    {searchResults.map((result, i) => (
                                        <Link
                                            key={i}
                                            href={result.path}
                                            onClick={() => {
                                                if (window.innerWidth < 768) onMobileClose();
                                            }}
                                            className="block p-2 hover:bg-[#2d2d2d] rounded cursor-pointer transition-colors border border-transparent hover:border-[#444]"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <FileJson className="w-3 h-3 text-muted-foreground shrink-0" />
                                                <span className="text-sm text-primary hover:underline truncate">
                                                    <HighlightedText text={result.title} query={searchQuery} />
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground break-words">
                                                <HighlightedText text={result.description} query={searchQuery} />
                                            </p>
                                        </Link>
                                    ))}

                                    {searchQuery && searchResults.length === 0 && !isSearching && (
                                        <div className="text-xs text-gray-500 italic text-center py-4">
                                            No results found for "{searchQuery}"
                                        </div>
                                    )}

                                    {isSearching && (
                                        <div className="text-xs text-gray-500 italic text-center py-4 animate-pulse">
                                            Searching workspace...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* System Status / Git Info */}
                <div className="p-4 border-t border-border mt-auto">
                    <div className="text-xs font-semibold text-muted-foreground mb-3 tracking-widest uppercase">GIT STATUS</div>
                    <div className="text-xs font-mono space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-green-400">branch</span>
                            <span className="text-blue-400">codex</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-green-400">version</span>
                            <span className="text-yellow-400">v1.0.0</span>
                        </div>
                        <div className="pt-2 border-t border-border/50">
                            <span className="text-muted-foreground block mb-1">latest_commit:</span>
                            <span className="text-foreground">"Refactor portfolio UI to Codex Coder aesthetic"</span>
                        </div>
                        <div className="pt-2 border-t border-border/50">
                            <span className="text-muted-foreground block mb-1">build_plan:</span>
                            <span className="text-purple-400">Phase 5: Polish & Testing</span>
                        </div>
                    </div>
                </div>

                {/* Resize Handle (Desktop Only) */}
                <div
                    className={cn(
                        "absolute top-0 right-[-2px] w-[4px] h-full cursor-col-resize z-50 transition-colors hidden md:block",
                        isResizing ? "bg-primary" : "group-hover:bg-muted hover:!bg-primary/50"
                    )}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        setIsResizing(true);
                    }}
                />
            </div>
        </>
    );
}
