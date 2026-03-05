"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MenuBar } from "@/components/layout/menubar";
import { ActivityBar, PanelType } from "@/components/layout/activity-bar";
import { SettingsPanel } from "@/components/layout/settings-panel";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const ALL_POSSIBLE_TABS = [
  { name: "home.tsx", path: "/" },
  { name: "about.ts", path: "/about" },
  { name: "projects.json", path: "/projects" },
  { name: "skills.md", path: "/skills" },
  { name: "contact.sh", path: "/contact" },
];

const DEFAULT_TABS: { name: string, path: string }[] = [];

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelType>("explorer");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
        setIsSettingsOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Absolute Top IDE Menu Bar */}
      <MenuBar
        onMenuClick={(panel) => setActivePanel(panel as PanelType)}
        onSearchClick={() => setActivePanel("search")}
      />

      {isSettingsOpen && <SettingsPanel onClose={() => setIsSettingsOpen(false)} />}

      {/* Main IDE Body */}
      <div className="flex flex-1 w-full overflow-hidden">
        <ActivityBar
          activePanel={activePanel}
          onPanelChange={(panel) => {
            if (panel === "settings") {
              setIsSettingsOpen(true);
            } else {
              setActivePanel(panel);
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
        <div className="flex flex-col flex-1 h-full overflow-hidden w-full max-w-full min-w-0 bg-[#1e1e1e]/60">
          <Topbar
            onMenuClick={handleMenuToggle}
            openTabs={openTabs}
            onCloseTab={handleCloseTab}
          />
          <main className="flex-1 overflow-y-auto">
            {openTabs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-[#1e1e1e]">
                {/* Empty Workspace State */}
                <h1 className="text-4xl md:text-5xl font-light text-[#3c3c3c] mb-12 select-none">Hengleap</h1>

                <div className="grid grid-cols-[1fr_auto] gap-x-8 gap-y-3 text-sm">
                  <div className="text-right text-gray-400">Show Explorer</div>
                  <div className="text-left font-mono text-gray-600 font-semibold bg-[#2d2d2d] px-2 py-0.5 rounded">Ctrl+Shift+E</div>

                  <div className="text-right text-gray-400">Global Search</div>
                  <div className="text-left font-mono text-gray-600 font-semibold bg-[#2d2d2d] px-2 py-0.5 rounded">Ctrl+Shift+F</div>

                  <div className="text-right text-gray-400">Open Settings</div>
                  <div className="text-left font-mono text-gray-600 font-semibold bg-[#2d2d2d] px-2 py-0.5 rounded">Ctrl+,</div>
                </div>

                <div className="mt-16 text-xs text-blue-500/50 italic opacity-50 hover:opacity-100 transition-opacity user-select-none">
                      // Open a file from the explorer to begin
                </div>
              </div>
            ) : (
              <div className="p-4 md:p-8 h-full">
                {children}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default RootLayout;
