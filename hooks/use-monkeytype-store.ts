import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type GameMode = "time" | "words";
export type GameConfig = 15 | 30 | 60 | 120 | 10 | 25 | 50 | 100;
export type Language = "english" | "khmer";

export interface TypingStats {
    wpm: number;
    accuracy: number;
    correctChars: number;
    totalChars: number;
}

export interface RunHistory {
    id: string;
    wpm: number;
    accuracy: number;
    mode: GameMode;
    config: number;
    language: Language;
    date: number;
}

interface MonkeyTypeState {
    // Config
    mode: GameMode;
    config: GameConfig;
    language: Language;
    setMode: (mode: GameMode) => void;
    setConfig: (config: GameConfig) => void;
    setLanguage: (language: Language) => void;

    // Live State
    isActive: boolean;
    isFinished: boolean;
    timeLeft: number;
    stats: TypingStats;

    setIsActive: (active: boolean) => void;
    setIsFinished: (finished: boolean) => void;
    setTimeLeft: (time: number) => void;
    setStats: (stats: TypingStats) => void;
    resetLiveState: (defaultTime?: number) => void;

    // History
    history: RunHistory[];
    addHistory: (run: Omit<RunHistory, "id" | "date">) => void;
    clearHistory: () => void;
}

export const useMonkeyTypeStore = create<MonkeyTypeState>()(
    persist(
        (set) => ({
            mode: "time",
            config: 30,
            language: "english",
            setMode: (mode) => set({ mode }),
            setConfig: (config) => set({ config }),
            setLanguage: (language) => set({ language }),

            isActive: false,
            isFinished: false,
            timeLeft: 30,
            stats: { wpm: 0, accuracy: 0, correctChars: 0, totalChars: 0 },

            setIsActive: (isActive) => set({ isActive }),
            setIsFinished: (isFinished) => set({ isFinished }),
            setTimeLeft: (timeLeft) => set({ timeLeft }),
            setStats: (stats) => set({ stats }),

            resetLiveState: (defaultTime = 30) => set({
                isActive: false,
                isFinished: false,
                timeLeft: defaultTime,
                stats: { wpm: 0, accuracy: 0, correctChars: 0, totalChars: 0 }
            }),

            history: [],
            addHistory: (run) => set((state) => {
                const newRun: RunHistory = {
                    ...run,
                    id: Math.random().toString(36).substring(2, 9),
                    date: Date.now(),
                };
                // Keep last 50 runs
                return { history: [newRun, ...state.history].slice(0, 50) };
            }),
            clearHistory: () => set({ history: [] }),
        }),
        {
            name: 'monkeytype-storage',
            partialize: (state) => ({
                mode: state.mode,
                config: state.config,
                language: state.language,
                history: state.history
            }), // Only persist config and history (live stats are volatile)
        }
    )
);
