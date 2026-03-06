"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MenuBar } from "@/components/layout/menubar";
import { ActivityBar, PanelType } from "@/components/layout/activity-bar";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { GlobalContextMenu } from "@/components/layout/global-context-menu";
import { CommandPalette } from "@/components/layout/command-palette";
import { ExplorerContextMenu } from "@/components/layout/explorer-context-menu";
import { ShortcutsModal } from "@/components/layout/shortcuts-modal";
import { Code, Terminal as TerminalIcon } from "lucide-react";
import Image from "next/image";
import { Terminal, TerminalTheme } from "@/components/layout/terminal";
import { useSettings, FontType } from "@/components/providers/settings-provider";
import { getRandomName, getRandomColor } from "@/lib/visitor-names";
import { VisitorCursor } from "@/components/layout/visitor-cursor";

const ALL_POSSIBLE_TABS = [
  { name: "home.tsx", path: "/" },
  { name: "about.ts", path: "/about" },
  { name: "projects.json", path: "/projects" },
  { name: "skills.md", path: "/skills" },
  { name: "contact.sh", path: "/contact" },
  { name: "settings.json", path: "/settings.json" },
  { name: "monkeytype.tsx", path: "/monkeytype" },
];

const DEFAULT_TABS: { name: string, path: string }[] = [];

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { setTheme, setFont } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteInitialQuery, setCommandPaletteInitialQuery] = useState("");
  const [globalContextMenu, setGlobalContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [explorerContextMenu, setExplorerContextMenu] = useState<{ x: number, y: number, item: { path: string; name: string; isVirtual?: boolean } | null } | null>(null);
  const [untitledCount, setUntitledCount] = useState(1);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalMaximized, setIsTerminalMaximized] = useState(false);
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>("vscode");
  const [terminalFont, setTerminalFont] = useState<FontType>("jetbrains");
  const [isCreatingFileExt, setIsCreatingFileExt] = useState<string | boolean>(false); // string is parentPath
  const [isCreatingFolderExt, setIsCreatingFolderExt] = useState<string | boolean>(false); // string is parentPath
  const [renamingFileExt, setRenamingFileExt] = useState<string | null>(null);
  const [renamingFolderExt, setRenamingFolderExt] = useState<string | null>(null);
  const [renameFileName, setRenameFileName] = useState("");
  const [renameFolderName, setRenameFolderName] = useState("");
  const [deleteConfirmPath, setDeleteConfirmPath] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Visitors State — use a ref so the ID is stable from first mount (no re-render cycle)
  const visitorIdRef = useRef<string>("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorColor, setVisitorColor] = useState("");
  const [otherVisitors, setOtherVisitors] = useState<{ id: string; name: string; color: string; x: number; y: number; lastUpdate: number }[]>([]);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const [openTabs, setOpenTabs] = useState<{ name: string, path: string }[]>([]);
  const userClosedTabRef = useRef<string | null>(null);
  const isInitialLoad = useRef(true);

  // Virtual Files & Folders State
  const [virtualFiles, setVirtualFiles] = useState<{ name: string; path: string; content: string; parentId?: string | null }[]>([]);
  const [virtualFolders, setVirtualFolders] = useState<{ name: string; path: string; parentId?: string | null }[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize Visitor ID immediately on client — use ref to avoid re-render cycles
    visitorIdRef.current = `v-${Math.random().toString(36).substr(2, 9)}`;

    const savedFiles = localStorage.getItem("hengleap-virtual-files");
    const savedFolders = localStorage.getItem("hengleap-virtual-folders");
    const savedTerminalTheme = localStorage.getItem("hengleap-terminal-theme") as TerminalTheme;
    const savedTerminalFont = localStorage.getItem("hengleap-terminal-font") as FontType;

    if (savedTerminalTheme) {
      setTerminalTheme(savedTerminalTheme);
    }

    if (savedTerminalFont) {
      setTerminalFont(savedTerminalFont);
    }

    if (savedFiles) {
      try {
        setVirtualFiles(JSON.parse(savedFiles));
      } catch (e) {
        console.error("Failed to parse virtual files from storage");
      }
    }

    if (savedFolders) {
      try {
        setVirtualFolders(JSON.parse(savedFolders));
      } catch (e) {
        console.error("Failed to parse virtual folders from storage");
      }
    }

    // Initialize Visitor
    const name = getRandomName();
    const color = getRandomColor();
    setVisitorName(name);
    setVisitorColor(color);

    // We don't save name/color to localStorage anymore to ensure uniqueness on return
    // but we can save the ID if we wanted to (currently visitorId is random per session)


    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && visitorName) {
      // Notify other tabs about name and presence
      try {
        broadcastChannelRef.current?.postMessage({
          type: 'update',
          id: visitorIdRef.current,
          name: visitorName,
          color: visitorColor,
          x: -100,
          y: -100
        });
      } catch (err) {
        // ignore
      }
    }
  }, [visitorName, isLoaded, visitorColor]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hengleap-terminal-theme", terminalTheme);
    }
  }, [terminalTheme, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hengleap-terminal-font", terminalFont);
    }
  }, [terminalFont, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hengleap-virtual-files", JSON.stringify(virtualFiles));
    }
  }, [virtualFiles, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hengleap-virtual-folders", JSON.stringify(virtualFolders));
    }
  }, [virtualFolders, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hengleap-terminal-theme", terminalTheme);
    }
  }, [terminalTheme, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hengleap-terminal-font", terminalFont);
    }
  }, [terminalFont, isLoaded]);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      // Initial panel sync (active icon in activity bar)
      if (pathname === "/monkeytype") {
        setActivePanel("monkeytype");
      } else if (pathname === "/settings.json") {
        setActivePanel("settings");
      } else if (pathname === "/") {
        setActivePanel("explorer");
        // Open home tab on the very first client load at "/"
        const homeTab = ALL_POSSIBLE_TABS.find(t => t.path === "/");
        if (homeTab) setOpenTabs([homeTab]);
      }
      return; // Skip the rest of the effect on initial load
    }

    // If we just clicked close on a tab and it was the active tab, userClosedTabRef will equal pathname
    if (userClosedTabRef.current === pathname) {
      return;
    }

    // Capture BEFORE clearing — non-null means system auto-navigated here after a tab close
    const wasClosedTabNavigation = userClosedTabRef.current;
    userClosedTabRef.current = null;

    let matchedTab = ALL_POSSIBLE_TABS.find(t => t.path === pathname || (pathname === "/settings.json" && t.path === "/settings.json"));

    // If it's a dynamic file path (e.g. /files/components/button.tsx), generate a generic tab
    if (!matchedTab && (pathname.startsWith("/files/") || pathname.startsWith("/virtual/") || pathname.startsWith("/Untitled-"))) {
      const existingVirtual = virtualFiles.find(f => f.path === pathname);
      if (existingVirtual) {
        matchedTab = { name: existingVirtual.name, path: pathname };
      } else {
        const parts = pathname.split("/");
        matchedTab = { name: parts[parts.length - 1], path: pathname };
      }
    }

    if (matchedTab && matchedTab.path !== "/") {
      // Any non-home tab: always add when navigated to
      setOpenTabs(prev => {
        if (!prev.find(t => t.path === matchedTab!.path)) {
          return [...prev, matchedTab!];
        }
        return prev;
      });
    } else if (matchedTab && matchedTab.path === "/") {
      // Home tab: only add if user explicitly navigated here (not auto-redirected after closing a tab)
      if (!wasClosedTabNavigation) {
        setOpenTabs(prev => {
          if (!prev.find(t => t.path === "/")) {
            return [...prev, matchedTab!];
          }
          return prev;
        });
      }
    }
  }, [pathname]);

  const toggleSettings = () => {
    if (pathname === "/settings.json") {
      // Toggle off: close settings and go back to last tab
      const newTabs = openTabs.filter(t => t.path !== "/settings.json");
      setOpenTabs(newTabs);
      userClosedTabRef.current = "/settings.json";

      if (newTabs.length > 0) {
        router.push(newTabs[newTabs.length - 1].path);
      } else {
        router.push("/");
      }
    } else {
      // Toggle on: open settings
      router.push("/settings.json");
    }

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileMenuOpen(false); // Close sidebar if open on mobile
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl + , for Settings
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        toggleSettings();
      }
      // Ctrl + P for Quick Open
      if (e.ctrlKey && !e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteInitialQuery("");
        setIsCommandPaletteOpen(true);
      }
      // Ctrl + Shift + P for Command Palette
      if (e.ctrlKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        setCommandPaletteInitialQuery(">");
        setIsCommandPaletteOpen(true);
      }
      // Ctrl + N for New File
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        handleNewFile();
      }
      // Ctrl + Shift + E for Explorer
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setActivePanel("explorer");
      }
      // Ctrl + Shift + F for Search
      if (e.ctrlKey && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setActivePanel("search");
      }
      // Ctrl + S for Saving/Renaming Virtual Files
      if (e.ctrlKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        if (pathname.startsWith("/virtual/") || pathname.startsWith("/Untitled-")) {
          const activeFile = virtualFiles.find(f => f.path === pathname);
          if (activeFile) {
            setRenamingFileExt(pathname);
            // Open the explorer tab if it isn't already so they can see the input
            setActivePanel("explorer");
          }
        }
      }
      // Ctrl + ` for Terminal
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }

      // Ctrl + / for Shortcuts Modal
      if (e.ctrlKey && (e.key === '/' || e.key === '?')) {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }

      // Escape to close active modals
      if (e.key === 'Escape') {
        if (showShortcuts) {
          e.preventDefault();
          setShowShortcuts(false);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [openTabs, untitledCount, pathname, router, virtualFiles, showShortcuts]);

  // Real-time Visitor Sync (BroadcastChannel)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const bc = new BroadcastChannel('portfolio-visitors');
    broadcastChannelRef.current = bc;

    bc.onmessage = (event) => {
      const { type, id, name, color, x, y } = event.data;

      if (id === visitorIdRef.current) return; // Ignore own messages

      if (type === 'update' || type === 'move') {
        setOtherVisitors(prev => {
          const index = prev.findIndex(v => v.id === id);
          const now = Date.now();
          if (index > -1) {
            const next = [...prev];
            next[index] = { ...next[index], name, color, x, y, lastUpdate: now };
            return next;
          } else {
            return [...prev, { id, name, color, x, y, lastUpdate: now }];
          }
        });
      }
    };

    // Periodically clean up inactive visitors
    const cleanup = setInterval(() => {
      const now = Date.now();
      setOtherVisitors(prev => prev.filter(v => now - v.lastUpdate < 3000));
    }, 2000);

    return () => {
      bc.close();
      if (broadcastChannelRef.current === bc) {
        broadcastChannelRef.current = null;
      }
      clearInterval(cleanup);
    };
  }, []); // Run once — visitorIdRef.current is always accessible via closure

  // Track and Broadcast mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!broadcastChannelRef.current || !visitorName) return;

      try {
        broadcastChannelRef.current.postMessage({
          type: 'move',
          id: visitorIdRef.current,
          name: visitorName,
          color: visitorColor,
          x: e.clientX,
          y: e.clientY
        });
      } catch (err) {
        // Channel might be closed during cleanup/HMR
        console.warn("BroadcastChannel postMessage failed:", err);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [visitorName, visitorColor]); // visitorIdRef is a ref, not state — no need to include

  const handleMenuToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    } else {
      setActivePanel(activePanel ? null : "explorer");
    }
  };



  const handleCloseTab = (e: React.MouseEvent, tabPath: string) => {
    e.preventDefault();
    e.stopPropagation();

    const closedIndex = openTabs.findIndex(t => t.path === tabPath);
    const newTabs = openTabs.filter(t => t.path !== tabPath);
    setOpenTabs(newTabs);

    // Remember that we just closed this tab so useEffect doesn't immediately re-add it 
    // before the router finishes navigating away.
    userClosedTabRef.current = tabPath;

    if (pathname === tabPath) {
      if (newTabs.length > 0) {
        // Navigate to the adjacent tab
        const nextTab = newTabs[Math.min(closedIndex, newTabs.length - 1)];
        router.push(nextTab.path);
      } else {
        router.push("/");
      }
    }
  };

  const handleCloseAll = () => {
    setOpenTabs([]);
    userClosedTabRef.current = pathname;
    router.push("/");
  };

  const handleCloseOthers = (tabPathToKeep: string) => {
    const tabToKeep = openTabs.find((t) => t.path === tabPathToKeep);
    if (tabToKeep) {
      setOpenTabs([tabToKeep]);
      if (pathname !== tabPathToKeep) {
        router.push(tabPathToKeep);
      }
    }
  };

  const getUniqueName = (name: string, type: 'file' | 'folder', ignorePath?: string, parentId?: string | null) => {
    // Replace all spaces with hyphens
    const sanitizedName = name.trim().replace(/\s+/g, '-');
    let finalName = sanitizedName;
    let counter = 1;

    // Split into base and extension (only matters for files)
    const dotIndex = type === 'file' ? sanitizedName.lastIndexOf('.') : -1;
    const base = dotIndex !== -1 ? sanitizedName.substring(0, dotIndex) : sanitizedName;
    const ext = dotIndex !== -1 ? sanitizedName.substring(dotIndex) : '';

    const isDuplicate = (checkName: string) => {
      if (type === 'file') {
        const parentFiles = virtualFiles.filter(f => (f.parentId || null) === (parentId || null));
        return parentFiles.some(f => f.name === checkName && f.path !== ignorePath) ||
          (parentId === null && ALL_POSSIBLE_TABS.some(t => t.name === checkName));
      } else {
        const parentFolders = virtualFolders.filter(f => (f.parentId || null) === (parentId || null));
        return parentFolders.some(f => f.name === checkName && f.path !== ignorePath);
      }
    };

    while (isDuplicate(finalName)) {
      finalName = `${base}-${counter}${ext}`;
      counter++;
    }
    return finalName;
  };

  const handleNewFile = (nameOrParent?: string) => {
    // If it's a string, it could be the name (from palette) or parentId (from right-click)
    // Actually, palette calls with name. Sidebar calls with parentId when isCreatingFileExt is true.

    if (nameOrParent === undefined || (typeof nameOrParent === 'string' && nameOrParent.startsWith('/'))) {
      // Trigger inline creation in the sidebar
      setIsCreatingFileExt(nameOrParent || true);
      return;
    }

    const parentId = typeof isCreatingFileExt === 'string' ? (isCreatingFileExt as string) : null;
    const newName = getUniqueName(nameOrParent, 'file', undefined, parentId);
    const filePath = `/virtual/${Date.now()}`;
    const newFile = { name: newName, path: filePath, content: "// Start typing your code here...\n", parentId };

    setVirtualFiles(prev => [...prev, newFile]);
    setOpenTabs(prev => [...prev, { name: newName, path: filePath }]);
    setUntitledCount(prev => prev + 1);
    router.push(filePath);
    setIsCreatingFileExt(false);
  };

  const handleNewFolder = (nameOrParent?: string) => {
    if (nameOrParent === undefined || (typeof nameOrParent === 'string' && nameOrParent.startsWith('/'))) {
      setIsCreatingFolderExt(nameOrParent || true);
      return;
    }

    const parentId = typeof isCreatingFolderExt === 'string' ? (isCreatingFolderExt as string) : null;
    const newName = getUniqueName(nameOrParent, 'folder', undefined, parentId);
    const folderPath = `/virtual-folder/${Date.now()}`;
    const newFolder = { name: newName, path: folderPath, parentId };

    setVirtualFolders(prev => [...prev, newFolder]);
    setIsCreatingFolderExt(false);
  };

  const handleRenameVirtualFile = (filePath: string, currentNameOrNewName?: string) => {
    // If we're triggering from context menu without a new name, enter rename mode
    if (currentNameOrNewName === undefined) {
      setRenamingFileExt(filePath);
      return;
    }

    // Actually perform the rename
    const newName = getUniqueName(currentNameOrNewName, 'file', filePath, virtualFiles.find(f => f.path === filePath)?.parentId);
    setVirtualFiles(prev => prev.map(f => f.path === filePath ? { ...f, name: newName } : f));
    setOpenTabs(prev => prev.map(t => t.path === filePath ? { ...t, name: newName } : t));
    setRenamingFileExt(null);
  };

  const handleRenameVirtualFolder = (folderPath: string, currentNameOrNewName?: string) => {
    if (currentNameOrNewName === undefined) {
      setRenamingFolderExt(folderPath);
      return;
    }

    const newName = getUniqueName(currentNameOrNewName, 'folder', folderPath, virtualFolders.find(f => f.path === folderPath)?.parentId);
    setVirtualFolders(prev => prev.map(f => f.path === folderPath ? { ...f, name: newName } : f));
    setRenamingFolderExt(null);
  };

  const handleDeleteVirtualItem = (path: string, isFolder?: boolean) => {
    setDeleteConfirmPath(path + (isFolder ? "?folder=true" : ""));
  };

  const confirmDeleteVirtualItem = () => {
    if (!deleteConfirmPath) return;

    const isFolder = deleteConfirmPath.endsWith("?folder=true");
    const path = deleteConfirmPath.replace("?folder=true", "");

    if (isFolder) {
      // Recursive delete
      const getAllChildFolders = (pId: string): string[] => {
        const children = virtualFolders.filter(f => f.parentId === pId).map(f => f.path);
        return [...children, ...children.flatMap(c => getAllChildFolders(c))];
      };

      const folderPathsToDelete = [path, ...getAllChildFolders(path)];

      // Find ALL files that are inside any of the folders being deleted
      const filePathsToDelete = virtualFiles
        .filter(f => f.parentId && folderPathsToDelete.includes(f.parentId))
        .map(f => f.path);

      setVirtualFolders(prev => prev.filter(f => !folderPathsToDelete.includes(f.path)));
      setVirtualFiles(prev => prev.filter(f => !f.parentId || !folderPathsToDelete.includes(f.parentId)));

      // Close tabs for all deleted files
      const remainingTabsAfterFolderDelete = openTabs.filter(t => !filePathsToDelete.includes(t.path));
      setOpenTabs(remainingTabsAfterFolderDelete);

      // If the current file is being deleted (it's in a deleted folder), redirect
      if (filePathsToDelete.includes(pathname)) {
        if (remainingTabsAfterFolderDelete.length > 0) {
          router.push(remainingTabsAfterFolderDelete[remainingTabsAfterFolderDelete.length - 1].path);
        } else {
          router.push("/");
        }
      }
    } else {
      setVirtualFiles(prev => prev.filter(f => f.path !== path));
      const newTabs = openTabs.filter(t => t.path !== path);
      setOpenTabs(newTabs);

      if (pathname === path) {
        if (newTabs.length > 0) {
          router.push(newTabs[newTabs.length - 1].path);
        } else {
          router.push("/");
        }
      }
    }
    setDeleteConfirmPath(null);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    // Only show global context menu if clicking on background, not on tabs/sidebar which handle their own
    const target = e.target as HTMLElement;
    if (target.closest('.no-global-context')) return;

    e.preventDefault();
    setGlobalContextMenu({ x: e.clientX, y: e.clientY });
  };

  return (
    <div
      className="flex flex-col h-screen w-full overflow-hidden"
      onContextMenu={handleContextMenu}
    >
      {/* Absolute Top IDE Menu Bar */}
      <div className="no-global-context">
        <MenuBar
          onMenuClick={(panel) => {
            if (panel === "menu") {
              handleMenuToggle();
            } else if (panel === "terminal") {
              setIsTerminalOpen(true);
            } else {
              setActivePanel(panel as PanelType);
            }
          }}
          onSearchClick={() => {
            setActivePanel("search");
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              setIsMobileMenuOpen(true);
            }
          }}
        />
      </div>

      {/* Main IDE Body */}
      <div className="flex flex-1 w-full overflow-hidden relative">
        <div className="no-global-context flex h-full">
          <ActivityBar
            activePanel={activePanel}
            visitorCount={otherVisitors.length}
            onPanelChange={(panel) => {
              if (panel === "settings") {
                toggleSettings();
              } else {
                setActivePanel(panel);
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  if (panel !== null) {
                    setIsMobileMenuOpen(true);
                  } else {
                    setIsMobileMenuOpen(false);
                  }
                }
              }
            }}
          />
          <Sidebar
            isMobileOpen={isMobileMenuOpen}
            isDesktopOpen={activePanel !== null}
            onMobileClose={() => setIsMobileMenuOpen(false)}
            activePanel={activePanel}
            activeFile={openTabs.length === 0 ? null : pathname}
            virtualFiles={virtualFiles}
            onNewFile={handleNewFile}
            onNewFolder={handleNewFolder}
            isCreatingFileExt={isCreatingFileExt}
            isCreatingFolderExt={isCreatingFolderExt}
            onCancelCreateFile={() => setIsCreatingFileExt(false)}
            onCancelCreateFolder={() => setIsCreatingFolderExt(false)}
            renamingFileExt={renamingFileExt}
            renamingFolderExt={renamingFolderExt}
            onRenameFile={handleRenameVirtualFile}
            onRenameFolder={handleRenameVirtualFolder}
            onCancelRenameFile={() => setRenamingFileExt(null)}
            onCancelRenameFolder={() => setRenamingFolderExt(null)}
            virtualFolders={virtualFolders}
            onItemContextMenu={(e, item) => setExplorerContextMenu({ x: e.clientX, y: e.clientY, item })}
            onExplorerContextMenu={(e) => setExplorerContextMenu({ x: e.clientX, y: e.clientY, item: null })}
            visitorName={visitorName}
            setVisitorName={setVisitorName}
            otherVisitors={otherVisitors}
            onOpenTab={(path) => {
              // Called when user clicks a file that's already the current route.
              // router.push is a no-op in that case, so we manually ensure the tab exists.
              const tab = ALL_POSSIBLE_TABS.find(t => t.path === path);
              if (tab) {
                setOpenTabs(prev => prev.find(t => t.path === path) ? prev : [...prev, tab]);
              }
            }}
          />
        </div>
        <div className="flex flex-col flex-1 h-full overflow-hidden w-full max-w-full min-w-0 bg-[#1e1e1e]/60 relative">
          {openTabs.length > 0 && (
            <div className="no-global-context relative z-10">
              <Topbar
                onMenuClick={handleMenuToggle}
                openTabs={openTabs}
                onCloseTab={handleCloseTab}
                onCloseAll={handleCloseAll}
                onCloseOthers={handleCloseOthers}
              />
            </div>
          )}
          {/* Wrap main content area with no-global-context to allow native right click for copy/paste */}
          <div className="flex-1 overflow-hidden relative w-full h-full no-global-context">
            <AnimatePresence initial={false}>
              {!(isTerminalOpen && isTerminalMaximized) && (
                <motion.main
                  initial={{ height: "100%", opacity: 1 }}
                  animate={{
                    height: "100%",
                    opacity: 1,
                    display: "block"
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: { duration: 0.3, ease: "easeInOut" }
                  }}
                  className="flex-1 overflow-y-auto relative z-0"
                >
                  {openTabs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-[#1e1e1e]">
                      {/* Empty Workspace State */}
                      <h1 className="text-4xl md:text-5xl font-light text-[#3c3c3c] mb-12 select-none">Hengleap EAR</h1>

                      <div className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-3 text-sm">
                        <div className="text-right text-gray-400 my-auto">Show Explorer</div>
                        <div className="text-left font-mono text-gray-600 font-semibold bg-[#2d2d2d] px-2 py-0.5 rounded w-max">Ctrl+Shift+E</div>

                        <div className="text-right text-gray-400 my-auto">Global Search</div>
                        <div className="text-left font-mono text-gray-600 font-semibold bg-[#2d2d2d] px-2 py-0.5 rounded w-max">Ctrl+Shift+F</div>

                        <div className="text-right text-gray-400 my-auto">Open Settings</div>
                        <div className="text-left font-mono text-gray-600 font-semibold bg-[#2d2d2d] px-2 py-0.5 rounded w-max">Ctrl+,</div>
                      </div>

                      <div className="mt-16 text-xs text-blue-500/50 italic opacity-50 hover:opacity-100 transition-opacity user-select-none">
                          // Open a file from the explorer to begin
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        key={pathname}
                        initial={{ opacity: 0, scale: pathname === "/settings.json" ? 0.95 : 1, y: pathname === "/settings.json" ? 0 : 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: pathname === "/settings.json" ? 0.95 : 1, y: pathname === "/settings.json" ? 0 : -10, transition: { duration: 0.15, ease: "easeIn" } }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="p-4 md:p-8 h-full"
                      >
                        {pathname.startsWith("/Untitled-") || pathname.startsWith("/virtual/") ? (
                          (() => {
                            const activeVirtualFile = virtualFiles.find(f => f.path === pathname);
                            const displayName = activeVirtualFile ? activeVirtualFile.name : pathname.replace("/", "");
                            return (
                              <div className="w-full h-full flex flex-col font-mono text-sm animate-in fade-in duration-300">
                                <div className="flex items-center text-gray-400 mb-4 pb-2 border-b border-[#333]/50 justify-between">
                                  <div className="flex items-center">
                                    <Code className="w-4 h-4 mr-2 text-blue-400" />
                                    <span className="text-gray-500 mr-2">{"{ }"}</span>
                                    {displayName} <span className="text-gray-600 ml-2 text-xs">(Virtual File)</span>
                                  </div>
                                  <div className="text-xs text-blue-400/50 flex gap-4">
                                    <span>Ctrl+S to save/rename</span>
                                  </div>
                                </div>
                                <textarea
                                  className="flex-1 bg-transparent border-none outline-none resize-none text-gray-300 leading-relaxed custom-scrollbar focus:ring-0"
                                  value={activeVirtualFile?.content || ""}
                                  onChange={(e) => {
                                    const newContent = e.target.value;
                                    setVirtualFiles(prev => prev.map(f => f.path === pathname ? { ...f, content: newContent } : f));
                                  }}
                                  placeholder="// Start typing your code here..."
                                  spellCheck={false}
                                />
                              </div>
                            )
                          })()
                        ) : (
                          children
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </motion.main>
              )}
            </AnimatePresence>

            {/* Terminal View */}
            <div className="no-global-context">
              <Terminal
                isOpen={isTerminalOpen}
                onClose={() => setIsTerminalOpen(false)}
                isMaximized={isTerminalMaximized}
                onToggleMaximize={() => setIsTerminalMaximized(!isTerminalMaximized)}
                theme={terminalTheme}
                onThemeChange={setTerminalTheme}
                font={terminalFont}
              />
            </div>
          </div>
        </div>

        {/* Floating UI Elements */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          files={[...ALL_POSSIBLE_TABS, ...virtualFiles]}
          onSelect={(path: string) => router.push(path)}
          initialQuery={commandPaletteInitialQuery}
          setTheme={setTheme}
          setFont={setFont}
          terminalTheme={terminalTheme}
          setTerminalTheme={setTerminalTheme}
          terminalFont={terminalFont}
          setTerminalFont={setTerminalFont}
        />

        {globalContextMenu && (
          <GlobalContextMenu
            x={globalContextMenu.x}
            y={globalContextMenu.y}
            onClose={() => setGlobalContextMenu(null)}
            onNewFile={handleNewFile}
            onOpenFile={() => setIsCommandPaletteOpen(true)}
            onNewTerminal={() => setIsTerminalOpen(true)}
          />
        )}

        {explorerContextMenu && (
          <ExplorerContextMenu
            x={explorerContextMenu.x}
            y={explorerContextMenu.y}
            itemRef={explorerContextMenu.item as any}
            onClose={() => setExplorerContextMenu(null)}
            onNewFile={handleNewFile}
            onNewFolder={handleNewFolder}
            onRename={(path, currentName) => {
              const isFolder = virtualFolders.some(f => f.path === path);
              if (isFolder) {
                setRenamingFolderExt(path);
                setRenameFolderName(currentName);
              } else {
                setRenamingFileExt(path);
                setRenameFileName(currentName);
              }
            }}
            onDelete={handleDeleteVirtualItem}
          />
        )}

        {/* Modals */}
        {deleteConfirmPath && (
          <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                Delete {deleteConfirmPath.includes("?folder=true") ? "Folder" : "File"}
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Are you sure you want to delete this {deleteConfirmPath.includes("?folder=true") ? "folder and all its contents" : "file"}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmPath(null)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteVirtualItem}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {alertMessage && (
          <div className="fixed inset-0 z-[2000] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">Notice</h3>
              <p className="text-sm text-gray-400 mb-6">{alertMessage}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setAlertMessage(null)}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Visitor Cursors Layer */}
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {otherVisitors.map(visitor => (
            <VisitorCursor
              key={visitor.id}
              name={visitor.name}
              color={visitor.color}
              x={visitor.x}
              y={visitor.y}
            />
          ))}
        </div>

        <ShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
        />
      </div>
    </div>
  );
};

export default MainLayout;
