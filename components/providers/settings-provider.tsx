"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeType = "default" | "dracula" | "matrix" | "github-dark";
export type FontType = "jetbrains" | "fira" | "source-code" | "cascadia";
export type FontSizeType = "sm" | "md" | "lg";

interface SettingsContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    font: FontType;
    setFont: (font: FontType) => void;
    fontSize: FontSizeType;
    setFontSize: (size: FontSizeType) => void;
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

const FONT_SIZES: Record<FontSizeType, string> = {
    sm: "text-size-sm",
    md: "text-size-md",
    lg: "text-size-lg"
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    // Read from local storage if available, default to "default", "jetbrains", and "md"
    const [theme, setThemeState] = useState<ThemeType>("default");
    const [font, setFontState] = useState<FontType>("jetbrains");
    const [fontSize, setFontSizeState] = useState<FontSizeType>("md");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedTheme = localStorage.getItem("codex-theme") as ThemeType | null;
        const savedFont = localStorage.getItem("codex-font") as FontType | null;
        const savedFontSize = localStorage.getItem("codex-font-size") as FontSizeType | null;

        if (savedTheme && THEMES[savedTheme]) setThemeState(savedTheme);
        if (savedFont && FONTS[savedFont]) setFontState(savedFont);
        if (savedFontSize && FONT_SIZES[savedFontSize]) setFontSizeState(savedFontSize);
    }, []);

    const setTheme = (newTheme: ThemeType) => {
        setThemeState(newTheme);
        localStorage.setItem("codex-theme", newTheme);
    };

    const setFont = (newFont: FontType) => {
        setFontState(newFont);
        localStorage.setItem("codex-font", newFont);
    };

    const setFontSize = (newSize: FontSizeType) => {
        setFontSizeState(newSize);
        localStorage.setItem("codex-font-size", newSize);
    };

    useEffect(() => {
        if (!mounted) return;

        const html = document.documentElement;
        const body = document.body;

        // Apply theme and font to body
        Object.values(THEMES).forEach(t => body.classList.remove(t));
        body.classList.add(THEMES[theme]);

        Object.values(FONTS).forEach(f => body.classList.remove(f));
        body.classList.add(FONTS[font]);

        // Apply font size to HTML root (for rem scaling)
        Object.values(FONT_SIZES).forEach(fs => html.classList.remove(fs));
        html.classList.add(FONT_SIZES[fontSize]);

    }, [theme, font, fontSize, mounted]);

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }

    return (
        <SettingsContext.Provider value={{ theme, setTheme, font, setFont, fontSize, setFontSize }}>
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
