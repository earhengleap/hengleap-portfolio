"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeType = "default" | "dracula" | "matrix" | "github-dark";
export type FontType = "jetbrains" | "fira" | "source-code" | "cascadia";

interface SettingsContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    font: FontType;
    setFont: (font: FontType) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const THEMES: Record<ThemeType, string> = {
    default: "theme-default",
    dracula: "theme-dracula",
    matrix: "theme-matrix",
    "github-dark": "theme-github-dark"
};

const FONTS: Record<FontType, string> = {
    jetbrains: "font-jetbrains",
    fira: "font-fira",
    "source-code": "font-source-code",
    cascadia: "font-cascadia"
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    // Read from local storage if available, default to "default" and "jetbrains"
    const [theme, setThemeState] = useState<ThemeType>("default");
    const [font, setFontState] = useState<FontType>("jetbrains");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("codex-theme") as ThemeType | null;
        const savedFont = localStorage.getItem("codex-font") as FontType | null;

        if (savedTheme && THEMES[savedTheme]) setThemeState(savedTheme);
        if (savedFont && FONTS[savedFont]) setFontState(savedFont);
    }, []);

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
        localStorage.setItem("codex-theme", newTheme);
    };

    const setFont = (newFont: FontType) => {
        setFontState(newFont);
        localStorage.setItem("codex-font", newFont);
    };

    useEffect(() => {
        if (!mounted) return;

        const body = document.body;

        // Remove all old theme classes
        Object.values(THEMES).forEach(t => body.classList.remove(t));
        // Add current theme class
        body.classList.add(THEMES[theme]);

        // Remove all old font classes
        Object.values(FONTS).forEach(f => body.classList.remove(f));
        // Add current font class
        body.classList.add(FONTS[font]);

    }, [theme, font, mounted]);

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }

    return (
        <SettingsContext.Provider value={{ theme, setTheme, font, setFont }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
