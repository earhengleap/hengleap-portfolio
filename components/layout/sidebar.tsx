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
    Code2,
    Users,
    Edit2,
    Check,
    MousePointer2,
    Trophy,
    Target,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getFileIconAndColor } from "@/lib/file-icons";
import { motion, AnimatePresence } from "framer-motion";
import { useMonkeyTypeStore } from "@/hooks/use-monkeytype-store";

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
    onCancelRenameFolder,
    visitorName = "Visitor",
    setVisitorName,
    otherVisitors = [],
    onOpenTab
}: {
    isMobileOpen: boolean;
    isDesktopOpen: boolean;
    onMobileClose: () => void;
    activePanel?: "explorer" | "search" | "settings" | "visitors" | "monkeytype" | null;
    activeFile: string | null;
    virtualFiles?: { name: string; path: string; parentId?: string | null }[];
    virtualFolders?: { name: string; path: string; parentId?: string | null }[];
    onNewFile?: (name: string) => void;
    onNewFolder?: (name: string) => void;
    onItemContextMenu?: (e: React.MouseEvent, item: { path: string; name: string; isVirtual?: boolean; isFolder?: boolean }) => void;
    onExplorerContextMenu?: (e: React.MouseEvent) => void;
    isCreatingFileExt?: string | boolean;
    isCreatingFolderExt?: string | boolean;
    onCancelCreateFile?: () => void;
    onCancelCreateFolder?: () => void;
    renamingFileExt?: string | null;
    renamingFolderExt?: string | null;
    onRenameFile: (path: string, newName?: string) => void;
    onRenameFolder: (path: string, newName?: string) => void;
    onCancelRenameFile?: () => void;
    onCancelRenameFolder?: () => void;
    visitorName?: string;
    setVisitorName?: (name: string) => void;
    otherVisitors?: { id: string; name: string; color: string }[];
    onOpenTab?: (path: string) => void;
}) {
    const pathname = usePathname();
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(visitorName);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // MonkeyType Store
    const {
        mode, config, stats, history, isActive,
        setMode, setConfig, resetLiveState
    } = useMonkeyTypeStore();

    useEffect(() => {
        setTempName(visitorName);
    }, [visitorName]);

    const handleNameSubmit = () => {
        if (tempName.trim() && setVisitorName) {
            setVisitorName(tempName.trim());
        }
        setIsEditingName(false);
    };
    const [width, setWidth] = useState(256);
    const [isResizing, setIsResizing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isFolderOpen, setIsFolderOpen] = useState(true);

    // Sigma Hunt Mini-game State
    const [rizzScore, setRizzScore] = useState(0);
    const [targetPos, setTargetPos] = useState({ top: "50%", left: "50%" });
    const [isHunting, setIsHunting] = useState(false);

    const moveTarget = () => {
        const top = Math.floor(Math.random() * 80) + 10 + "%";
        const left = Math.floor(Math.random() * 80) + 10 + "%";
        setTargetPos({ top, left });
    };

    const handleTargetClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setRizzScore(prev => prev + 1);
        moveTarget();
    };

    const getRizzTitle = (score: number) => {
        if (score === 0) return "No Rizz";
        if (score < 10) return "Sigma Trainee";
        if (score < 20) return "Skibidi Rizzler";
        if (score < 50) return "Giga Chad";
        return "Rizz God 👑";
    };

    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Track which virtual folders are open
    const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());

    // Selection state for F2 rename
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<'file' | 'folder' | null>(null);

    // When all tabs are closed (activeFile = null), deselect everything in the explorer
    useEffect(() => {
        if (!activeFile) {
            setSelectedPath(null);
            setSelectedType(null);
        }
    }, [activeFile]);

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
                <div className="flex-1 flex flex-col w-full h-full min-w-[180px] overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {(!activePanel || activePanel === "explorer") && (
                            <motion.div
                                key="explorer"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex flex-col"
                            >
                                {/* Explorer Header */}
                                <div className="px-4 py-3 text-xs font-semibold text-muted-foreground tracking-widest uppercase flex items-center justify-between shrink-0">
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
                                            "flex items-center text-sm font-semibold py-1 cursor-pointer rounded px-2 select-none transition-colors relative group",
                                            selectedPath === '/' ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        {selectedPath === '/' && (
                                            <motion.div
                                                layoutId="sidebar-active-bg"
                                                className="absolute inset-0 bg-primary/20 rounded z-0"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                            />
                                        )}
                                        <ChevronRight className={cn("w-4 h-4 mr-1 transition-transform z-10", isFolderOpen && "rotate-90")} />
                                        <FolderOpen className="w-4 h-4 mr-2 text-blue-300 z-10" />
                                        <span className="truncate z-10 transition-transform duration-300 group-active:translate-x-1">XING_PORTFOLIO</span>
                                    </div>

                                    {isFolderOpen && (
                                        <div className="pl-6 mt-1 flex flex-col gap-[2px]">
                                            {NAV_ITEMS.map((item) => {
                                                // Use activeFile (from layout) not pathname, so cleared tabs clear the highlight
                                                const isActiveItem = activeFile === item.path || selectedPath === item.path;

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
                                                        onClick={(e) => {
                                                            setSelectedPath(item.path);
                                                            setSelectedType('file');
                                                            // When already at this path, router.push is a no-op
                                                            // so explicitly call onOpenTab to force the tab open
                                                            if (onOpenTab) onOpenTab(item.path);
                                                            if (window.innerWidth < 768) {
                                                                onMobileClose();
                                                            }
                                                        }}
                                                        className={cn(
                                                            "flex items-center text-sm py-[4px] px-2 rounded cursor-pointer transition-colors relative group",
                                                            isActiveItem
                                                                ? "text-accent-foreground"
                                                                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                        )}
                                                    >
                                                        {isActiveItem && (
                                                            <motion.div
                                                                layoutId="sidebar-active-bg"
                                                                className="absolute inset-0 bg-primary/20 rounded z-0"
                                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                            />
                                                        )}
                                                        <item.icon className={cn("w-4 h-4 mr-2 shrink-0 z-10", item.color)} />
                                                        <span className="truncate z-10 transition-transform duration-300 group-active:translate-x-1">{item.name}</span>
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
                                                        const isCurrentActive = item.path === activeFile || selectedPath === item.path;
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
                                                                        "flex items-center text-sm py-[4px] px-2 rounded cursor-pointer transition-colors relative group",
                                                                        isCurrentActive ? "text-accent-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                                    )}
                                                                >
                                                                    {isCurrentActive && (
                                                                        <motion.div
                                                                            layoutId="sidebar-active-bg"
                                                                            className="absolute inset-0 bg-primary/20 rounded z-0"
                                                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                                        />
                                                                    )}
                                                                    <ChevronRight className={cn("w-4 h-4 mr-1 transition-transform z-10", isOpen && "rotate-90")} />
                                                                    <FolderOpen className="w-4 h-4 mr-2 shrink-0 text-gray-300 z-10" />
                                                                    <span className="truncate italic z-10 transition-transform duration-300 group-active:translate-x-1">{item.name}</span>
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
                                                        const isCurrentActive = activeFile === item.path || selectedPath === item.path;
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
                                                                    "flex items-center text-sm py-[4px] px-2 rounded cursor-pointer transition-colors relative group",
                                                                    isCurrentActive
                                                                        ? "text-accent-foreground"
                                                                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                                )}
                                                            >
                                                                {isCurrentActive && (
                                                                    <motion.div
                                                                        layoutId="sidebar-active-bg"
                                                                        className="absolute inset-0 bg-primary/20 rounded z-0"
                                                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                                                    />
                                                                )}
                                                                <IconComponent className={cn("w-4 h-4 mr-2 shrink-0 z-10", color)} />
                                                                <span className="truncate italic z-10 transition-transform duration-300 group-active:translate-x-1">{item.name}</span>
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
                            </motion.div>
                        )}

                        {activePanel === "search" && (
                            <motion.div
                                key="search"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex flex-col p-4"
                            >
                                <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4 shrink-0">SEARCH</div>
                                <input
                                    id="global-search-input"
                                    type="text"
                                    placeholder="Search files and content..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-input border border-transparent focus:border-primary rounded px-2 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground mb-4 shrink-0 transition-all border-border/40"
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
                                                className="block p-2.5 rounded-lg cursor-pointer transition-all duration-300 border border-transparent hover:border-primary/20 hover:bg-primary/5 group relative overflow-hidden"
                                            >
                                                <div className="flex items-center gap-2 mb-1.5 relative z-10">
                                                    <FileJson className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                                                    <span className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate">
                                                        <HighlightedText text={result.title} query={searchQuery} />
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground leading-relaxed break-words relative z-10 line-clamp-2">
                                                    <HighlightedText text={result.description} query={searchQuery} />
                                                </p>

                                                <div className="text-[10px] text-primary/40 mt-1">Found in contents</div>
                                            </Link>
                                        ))}

                                        {searchQuery && searchResults.length === 0 && !isSearching && (
                                            <div className="text-xs text-gray-500 italic text-center py-4">
                                                No results found for "{searchQuery}"
                                            </div>
                                        )}

                                        {isSearching && (
                                            <div className="text-xs text-gray-500 italic text-center py-4">
                                                Searching workspace...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activePanel === "monkeytype" && (
                            <motion.div
                                key="monkeytype"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex flex-col p-4 overflow-y-auto"
                            >
                                <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4 shrink-0">MONKEYTYPE</div>

                                {/* Configuration */}
                                <div className="mb-6 space-y-4">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase px-1">Game Mode</div>
                                    <div className="flex bg-black/40 rounded-lg p-1 border border-border/50">
                                        <button
                                            onClick={() => { setMode("time"); resetLiveState(30); }}
                                            className={cn("flex-1 text-xs py-1.5 rounded-md transition-all", mode === "time" ? "bg-primary text-black font-semibold shadow" : "text-muted-foreground hover:text-foreground")}
                                        >
                                            Time
                                        </button>
                                        <button
                                            onClick={() => { setMode("words"); resetLiveState(30); }}
                                            className={cn("flex-1 text-xs py-1.5 rounded-md transition-all", mode === "words" ? "bg-primary text-black font-semibold shadow" : "text-muted-foreground hover:text-foreground")}
                                        >
                                            Words
                                        </button>
                                    </div>

                                    <div className="text-[10px] font-bold text-muted-foreground uppercase px-1 pt-2">
                                        {mode === "time" ? "Duration (Seconds)" : "Word Count"}
                                    </div>
                                    <div className="flex bg-black/40 rounded-lg p-1 border border-border/50 gap-1">
                                        {(mode === "time" ? [15, 30, 60, 120] : [10, 25, 50, 100]).map((val) => (
                                            <button
                                                key={val}
                                                // @ts-ignore
                                                onClick={() => { setConfig(val); resetLiveState(val); }}
                                                className={cn("flex-1 text-[10px] py-1 rounded transition-colors", config === val ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-white/5")}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Live Telemetry */}
                                <div className="mb-6 space-y-2">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase px-1 flex items-center justify-between">
                                        Live Telemetry
                                        {isActive && <span className="flex w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 flex flex-col items-center justify-center">
                                            <div className="text-2xl font-mono font-bold text-primary">{stats.wpm}</div>
                                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">WPM</div>
                                        </div>
                                        <div className="bg-accent/30 border border-border/50 rounded-lg p-3 flex flex-col items-center justify-center">
                                            <div className="text-2xl font-mono font-bold text-foreground">{stats.accuracy}%</div>
                                            <div className="text-[9px] text-muted-foreground uppercase tracking-widest mt-1">Accuracy</div>
                                        </div>
                                    </div>
                                </div>

                                {/* History */}
                                <div className="flex-1 flex flex-col min-h-0">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase px-1 mb-2">Recent Runs ({history.length})</div>
                                    <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                                        {history.length === 0 ? (
                                            <div className="text-xs text-muted-foreground italic px-3 py-4 border border-dashed border-border/50 rounded-md text-center">
                                                No runs completed yet.
                                            </div>
                                        ) : (
                                            history.map((run) => (
                                                <div key={run.id} className="text-xs flex items-center justify-between bg-black/20 p-2 rounded border border-white/5 group hover:bg-white/5 transition-colors">
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-medium text-foreground">{run.wpm} <span className="text-[10px] text-muted-foreground">WPM</span></span>
                                                        <span className="text-[10px] text-muted-foreground">{run.accuracy}% Acc</span>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-0.5">
                                                        <span className="text-[10px] text-primary/70 bg-primary/10 px-1.5 rounded">{run.mode === "time" ? `${run.config}s` : `${run.config}w`}</span>
                                                        <span className="text-[9px] text-muted-foreground">{new Date(run.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activePanel === "visitors" && (
                            <motion.div
                                key="visitors"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex flex-col p-4 overflow-y-auto"
                            >
                                <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4 shrink-0">VISITORS</div>

                                {/* User Profile */}
                                <div className="mb-8 p-3 rounded-lg bg-accent/30 border border-border/50">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Your Profile</div>
                                    <div className="flex items-center justify-between group">
                                        {isEditingName ? (
                                            <div className="flex items-center gap-2 w-full">
                                                <input
                                                    ref={nameInputRef}
                                                    type="text"
                                                    value={tempName}
                                                    onChange={(e) => setTempName(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                                                    onBlur={handleNameSubmit}
                                                    className="bg-input border-none outline-none text-sm py-0.5 px-1 w-full rounded focus:ring-1 ring-primary"
                                                    autoFocus
                                                />
                                                <button onClick={handleNameSubmit} className="text-primary hover:text-primary/80">
                                                    <Check className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] shrink-0" />
                                                    <span className="text-sm font-medium truncate">{visitorName}</span>
                                                </div>
                                                <button
                                                    onClick={() => setIsEditingName(true)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Active Visitors */}
                                <div className="flex-1 overflow-y-auto min-h-0">
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-3 px-1">Active Visitors ({otherVisitors.length})</div>
                                    <div className="space-y-1">
                                        {otherVisitors.length === 0 ? (
                                            <div className="text-xs text-muted-foreground italic px-3 py-2 border border-dashed border-border/50 rounded-md">
                                                No other visitors nearby...
                                            </div>
                                        ) : (
                                            otherVisitors.map((visitor) => (
                                                <div
                                                    key={visitor.id}
                                                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all duration-300 group cursor-default border border-transparent hover:border-border/50"
                                                >
                                                    <div className="relative">
                                                        <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(var(--primary),0.3)] shrink-0" style={{ backgroundColor: visitor.color }} />
                                                        <div className="absolute inset-0 w-2.5 h-2.5 rounded-full blur-[2px] opacity-40" style={{ backgroundColor: visitor.color }} />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">{visitor.name}</span>
                                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                            <MousePointer2 className="w-2.5 h-2.5 opacity-50" />
                                                            Live on workspace
                                                        </span>
                                                    </div>
                                                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Playground - Sigma Hunt */}
                                <div className="mb-8 p-3 rounded-lg bg-primary/5 border border-primary/20 overflow-hidden relative group/game">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-[10px] font-bold text-primary uppercase flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            Sigma Playground
                                        </div>
                                        <div className="text-[10px] font-mono text-primary/70">{rizzScore} Rizz</div>
                                    </div>

                                    <div className="h-28 bg-black/40 rounded border border-border/50 relative overflow-hidden cursor-crosshair">
                                        <button
                                            onClick={handleTargetClick}
                                            style={{ top: targetPos.top, left: targetPos.left }}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2 p-1.5 bg-primary/20 hover:bg-primary/40 rounded-full border border-primary/50 transition-all duration-300 hover:scale-110 active:scale-90 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                                        >
                                            <Target className="w-4 h-4 text-primary" />
                                        </button>

                                        {rizzScore === 0 && (
                                            <div className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground italic pointer-events-none">
                                                Hunt the target for Rizz points...
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-2 flex items-center justify-between">
                                        <div className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                                            <Trophy className="w-2.5 h-2.5 text-yellow-500" />
                                            {getRizzTitle(rizzScore)}
                                        </div>
                                        <button
                                            onClick={() => setRizzScore(0)}
                                            className="text-[9px] text-muted-foreground hover:text-foreground underline transition-colors"
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto p-3 bg-blue-500/5 rounded-md border border-blue-500/10">
                                    <p className="text-[10px] text-blue-400/70 leading-relaxed italic">
                                        // You can see other visitors' live cursors on the workspace!
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {activePanel === "settings" && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 flex flex-col p-4 overflow-y-auto"
                            >
                                <div className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-4 shrink-0">SETTINGS</div>
                                <div className="space-y-6">
                                    <section>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase mb-3 px-1">Configuration</div>
                                        <Link
                                            href="/settings.json"
                                            onClick={() => { if (window.innerWidth < 768) onMobileClose(); }}
                                            className="flex items-center text-sm py-[4px] px-2 rounded cursor-pointer transition-colors relative group text-muted-foreground hover:text-foreground"
                                        >
                                            <Settings className="w-4 h-4 mr-2 shrink-0 z-10 text-gray-400" />
                                            <span className="truncate z-10 transition-transform duration-300 group-active:translate-x-1">Open settings.json</span>
                                        </Link>
                                    </section>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
