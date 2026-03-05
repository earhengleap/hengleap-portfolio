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
import { Code, Terminal as TerminalIcon } from "lucide-react";
import Image from "next/image";
import { Terminal } from "@/components/layout/terminal";

const ALL_POSSIBLE_TABS = [
  { name: "home.tsx", path: "/" },
  { name: "about.ts", path: "/about" },
  { name: "projects.json", path: "/projects" },
  { name: "skills.md", path: "/skills" },
  { name: "contact.sh", path: "/contact" },
  { name: "settings.json", path: "/settings.json" },
];

const DEFAULT_TABS: { name: string, path: string }[] = [];

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>("explorer");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [globalContextMenu, setGlobalContextMenu] = useState<{ x: number, y: number } | null>(null);
  const [untitledCount, setUntitledCount] = useState(1);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const [openTabs, setOpenTabs] = useState<{ name: string, path: string }[]>([]);
  const userClosedTabRef = useRef<string | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      if (pathname === "/") {
        userClosedTabRef.current = "/";
        return; // Leave workspace empty on initial load of the home page
      }
    }

    // If we just clicked close on a tab and it was the active tab, userClosedTabRef will equal pathname
    if (userClosedTabRef.current === pathname) {
      return;
    }

    userClosedTabRef.current = null;

    let matchedTab = ALL_POSSIBLE_TABS.find(t => t.path === pathname);

    // If it's a dynamic file path (e.g. /files/components/button.tsx), generate a generic tab
    if (!matchedTab && pathname.startsWith("/files/")) {
      const parts = pathname.split("/");
      matchedTab = { name: parts[parts.length - 1], path: pathname };
    }

    if (matchedTab) {
      setOpenTabs(prev => {
        if (!prev.find(t => t.path === matchedTab!.path)) {
          return [...prev, matchedTab!];
        }
        return prev;
      });
    }
  }, [pathname]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl + , for Settings
      if (e.ctrlKey && e.key === ',') {
        e.preventDefault();
        router.push("/settings.json");
      }
      // Ctrl + P for Quick Open
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
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
      // Ctrl + ` for Terminal
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [openTabs, untitledCount]);

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

  const handleNewFile = () => {
    const fileName = `Untitled-${untitledCount}`;
    const filePath = `/Untitled-${untitledCount}`;

    setOpenTabs(prev => [...prev, { name: fileName, path: filePath }]);
    setUntitledCount(prev => prev + 1);
    router.push(filePath);
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
            onPanelChange={(panel) => {
              if (panel === "settings") {
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
          />
        </div>
        <div className="flex flex-col flex-1 h-full overflow-hidden w-full max-w-full min-w-0 bg-[#1e1e1e]/60">
          {openTabs.length > 0 && (
            <div className="no-global-context">
              <Topbar
                onMenuClick={handleMenuToggle}
                openTabs={openTabs}
                onCloseTab={handleCloseTab}
                onCloseAll={handleCloseAll}
                onCloseOthers={handleCloseOthers}
              />
            </div>
          )}
          <main className="flex-1 overflow-y-auto">
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, x: pathname === "/settings.json" ? -20 : 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: pathname === "/settings.json" ? -20 : 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="p-4 md:p-8 h-full"
                >
                  {pathname.startsWith("/Untitled-") ? (
                    <div className="w-full h-full flex flex-col font-mono text-sm animate-in fade-in duration-300">
                      <div className="flex items-center text-gray-400 mb-4 pb-2 border-b border-[#333]/50">
                        <Code className="w-4 h-4 mr-2 text-blue-400" />
                        <span className="text-gray-500 mr-2">{"{ }"}</span>
                        {pathname.replace("/", "")} (Virtual File)
                      </div>
                      <textarea
                        className="flex-1 bg-transparent border-none outline-none resize-none text-gray-300 leading-relaxed custom-scrollbar focus:ring-0"
                        placeholder="// Start typing your code here..."
                      />
                    </div>
                  ) : (
                    children
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>

      {/* Floating UI Elements */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        files={ALL_POSSIBLE_TABS}
        onSelect={(path: string) => router.push(path)}
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

      {/* Terminal View */}
      <div className={cn(
        "no-global-context",
        !isTerminalOpen && "hidden"
      )}>
        <Terminal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
        />
      </div>
    </div>
  );
};

export default RootLayout;
