"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { RotateCcw, Timer, Zap, Keyboard as KeyboardIcon, Type } from "lucide-react";
import { cn } from "@/lib/utils";

const WORD_POOL = [
    "function", "variable", "constant", "component", "interface", "generic", "promise", "async", "await", "callback",
    "closure", "hoisting", "recursion", "algorithm", "database", "frontend", "backend", "fullstack", "serverless",
    "container", "docker", "kubernetes", "typescript", "javascript", "react", "angular", "vue", "nextjs", "vite",
    "tailwind", "postcss", "eslint", "prettier", "git", "commit", "push", "pull", "merge", "branch", "conflict",
    "deployment", "continuous", "integration", "delivery", "pipeline", "automation", "testing", "jest", "cypress",
    "debugger", "console", "terminal", "workflow", "production", "staging", "development", "middleware", "package",
    "application", "framework", "library", "module", "export", "import", "class", "object", "array", "string",
    "number", "boolean", "null", "undefined", "symbol", "bigint", "operator", "expression", "statement", "loop",
    "condition", "switch", "case", "default", "try", "catch", "finally", "throw", "error", "event", "listener",
    "handler", "state", "props", "hook", "effect", "context", "reducer", "memo", "ref", "query", "mutation",
    "api", "endpoint", "request", "response", "json", "xml", "html", "css", "scss", "less", "stylus"
];

const KEYBOARD_ROWS = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
    ["space"]
];

import { useMonkeyTypeStore, GameMode, GameConfig } from "@/hooks/use-monkeytype-store";

export default function MonkeyTypePage() {
    const {
        mode, config, stats, timeLeft, isActive, isFinished,
        setIsActive, setIsFinished, setTimeLeft, setStats, resetLiveState, addHistory,
        setMode, setConfig
    } = useMonkeyTypeStore();

    const [words, setWords] = useState<string[]>([]);
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);

    const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [lineOffset, setLineOffset] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const wordsRef = useRef<HTMLDivElement>(null);
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const restartRef = useRef<HTMLButtonElement>(null);

    const generateWords = useCallback(() => {
        const count = mode === "words" ? (config as number) : 150;
        const generated: string[] = [];
        for (let i = 0; i < count; i++) {
            generated.push(WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]);
        }
        setWords(generated);
    }, [mode, config]);

    useEffect(() => {
        generateWords();
    }, [generateWords]);

    useEffect(() => {
        let interval: any;
        if (isActive && mode === "time" && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (mode === "time" && timeLeft === 0) {
            finishTest();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, mode]);

    const startTest = () => {
        setIsActive(true);
        setStartTime(Date.now());
    };

    const finishTest = () => {
        setIsActive(false);
        setIsFinished(true);
        addHistory({
            wpm: stats.wpm,
            accuracy: stats.accuracy,
            mode,
            config
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isActive && !isFinished && value.length > 0) startTest();
        if (isFinished) return;

        setUserInput(value);

        // Calculate live stats
        const targetText = words.join(" ");
        let correct = 0;
        for (let i = 0; i < value.length; i++) {
            if (value[i] === targetText[i]) correct++;
        }

        setStats({
            ...stats,
            correctChars: correct,
            totalChars: value.length,
            wpm: calculateWPM(correct, Date.now() - (startTime || Date.now())),
            accuracy: value.length > 0 ? Math.round((correct / value.length) * 100) : 100
        });

        if (mode === "words" && value.length >= targetText.length) {
            finishTest();
        }
    };

    const calculateWPM = (correctChars: number, timeMs: number) => {
        const minutes = timeMs / 60000;
        if (minutes <= 0) return 0;
        return Math.round((correctChars / 5) / minutes);
    };

    const resetTest = useCallback(() => {
        generateWords();
        setUserInput("");
        setStartTime(null);
        resetLiveState(mode === "time" ? (config as number) : 30);
        setLineOffset(0);
        setTimeout(() => inputRef.current?.focus(), 50);
    }, [generateWords, mode, config, resetLiveState]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Tab") {
                e.preventDefault();
                restartRef.current?.focus();
                return;
            }
            if (e.key === "Escape") {
                e.preventDefault();
                resetTest();
                return;
            }

            const key = e.key.toLowerCase();
            if (key === " ") setActiveKey("space");
            else setActiveKey(key);

            if (document.activeElement !== inputRef.current && !["Tab", "Enter", "Escape", "Shift", "Control", "Alt", "Meta"].includes(e.key)) {
                inputRef.current?.focus();
            }
        };

        const handleGlobalKeyUp = () => setActiveKey(null);

        window.addEventListener("keydown", handleGlobalKeyDown);
        window.addEventListener("keyup", handleGlobalKeyUp);
        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
            window.removeEventListener("keyup", handleGlobalKeyUp);
        };
    }, [resetTest]);

    // Caret and 3-Line Shifting Logic
    useEffect(() => {
        const activeCharIndex = userInput.length;
        const activeCharElement = charRefs.current[activeCharIndex];
        if (activeCharElement && wordsRef.current) {
            const charRect = activeCharElement.getBoundingClientRect();
            const containerRect = wordsRef.current.getBoundingClientRect();

            setCaretPos({
                top: charRect.top - containerRect.top + lineOffset,
                left: charRect.left - containerRect.left
            });

            // 3-line scroll logic: if current char top is more than 2 lines down, shift
            const relativeTop = charRect.top - containerRect.top + lineOffset;
            if (relativeTop > 80) { // Approx 2.5 lines (32px line height * 2.5)
                setLineOffset(prev => prev - 40); // Shift by one line height
            }
        } else if (activeCharIndex === 0 && charRefs.current[0] && wordsRef.current) {
            const charRect = charRefs.current[0].getBoundingClientRect();
            const containerRect = wordsRef.current.getBoundingClientRect();
            setCaretPos({
                top: charRect.top - containerRect.top,
                left: charRect.left - containerRect.left
            });
        }
    }, [userInput, words]);

    const targetChars = useMemo(() => words.join(" ").split(""), [words]);

    return (
        <div className="h-full flex flex-col items-center justify-start pt-16 font-mono max-w-6xl mx-auto px-8 bg-[#323437] text-[#646669] overflow-hidden select-none" onClick={() => inputRef.current?.focus()}>
            <AnimatePresence mode="wait">
                {!isFinished ? (
                    <motion.div
                        key="game"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full flex flex-col gap-12"
                    >
                        {/* Mode Selector Config Bar */}
                        <div className="flex items-center justify-center gap-6 bg-[#2c2e31] p-1.5 rounded-xl self-center text-xs font-bold shadow-2xl">
                            <div className="flex items-center gap-4 px-4 border-r border-[#646669]/20">
                                <button onClick={() => { setMode("time"); setConfig(30); resetTest(); }} className={cn("flex items-center gap-1.5 hover:text-[#d1d0c5] transition-all", mode === "time" ? "text-[#e2b714]" : "")}>
                                    <Timer className="w-3.5 h-3.5" /> time
                                </button>
                                <button onClick={() => { setMode("words"); setConfig(25); resetTest(); }} className={cn("flex items-center gap-1.5 hover:text-[#d1d0c5] transition-all", mode === "words" ? "text-[#e2b714]" : "")}>
                                    <Type className="w-3.5 h-3.5" /> words
                                </button>
                            </div>

                            <div className="flex items-center gap-4 px-4">
                                {mode === "time" ? (
                                    [15, 30, 60, 120].map(t => (
                                        <button key={t} onClick={() => { setConfig(t as GameConfig); resetTest(); }} className={cn("hover:text-[#d1d0c5] transition-all", config === t ? "text-[#e2b714]" : "")}>
                                            {t}
                                        </button>
                                    ))
                                ) : (
                                    [10, 25, 50, 100].map(w => (
                                        <button key={w} onClick={() => { setConfig(w as GameConfig); resetTest(); }} className={cn("hover:text-[#d1d0c5] transition-all", config === w ? "text-[#e2b714]" : "")}>
                                            {w}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="h-8 flex justify-center items-center">
                            {isActive && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl text-[#e2b714] font-bold">
                                    {mode === "time" ? timeLeft : `${userInput.split(" ").length - 1}/${config}`}
                                </motion.div>
                            )}
                        </div>

                        {/* 3-Line Typing Window */}
                        <div className="relative h-[120px] overflow-hidden w-full px-4" style={{ WebkitMaskImage: "linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)" }}>
                            <motion.div
                                animate={{ y: lineOffset }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                ref={wordsRef}
                                className="relative text-3xl leading-[40px] tracking-tight"
                            >
                                {/* Caret */}
                                <motion.div
                                    animate={{ top: caretPos.top, left: caretPos.left, opacity: [1, 0, 1] }}
                                    transition={{
                                        top: { type: "spring", stiffness: 400, damping: 35 },
                                        left: { type: "spring", stiffness: 400, damping: 35 },
                                        opacity: { repeat: Infinity, duration: 0.8 }
                                    }}
                                    className="absolute w-[2px] h-[30px] bg-[#e2b714] rounded-full z-10 pointer-events-none mt-[5px]"
                                />

                                {/* Words Grid */}
                                <div className="flex flex-wrap w-full">
                                    {targetChars.map((char, i) => {
                                        let statusColor = "text-[#646669]";
                                        let underline = false;

                                        if (i < userInput.length) {
                                            if (userInput[i] === char) statusColor = "text-[#d1d0c5]";
                                            else { statusColor = "text-[#ca4754]"; underline = true; }
                                        }

                                        return (
                                            <span
                                                key={i}
                                                ref={el => { charRefs.current[i] = el; }}
                                                className={cn("transition-colors duration-100", statusColor, underline && "border-b-2 border-[#ca4754]")}
                                            >
                                                {char === " " ? "\u00A0" : char}
                                            </span>
                                        );
                                    })}
                                </div>
                            </motion.div>

                            <input
                                ref={inputRef}
                                type="text"
                                value={userInput}
                                onChange={handleInputChange}
                                className="absolute inset-0 w-full h-full opacity-0 outline-none cursor-default"
                                autoFocus
                                spellCheck={false}
                                autoComplete="off"
                            />
                        </div>

                        {/* Premium Mechanical Keyboard Visualizer */}
                        <div className="mt-8 flex flex-col gap-3 items-center opacity-40 hover:opacity-80 transition-all duration-500 transform hover:scale-[1.02]">
                            {KEYBOARD_ROWS.map((row, i) => (
                                <div key={i} className="flex gap-2">
                                    {row.map(key => {
                                        const isNext = targetChars[userInput.length]?.toLowerCase() === key || (targetChars[userInput.length] === " " && key === "space");
                                        const isPressed = activeKey === key;

                                        return (
                                            <motion.div
                                                key={key}
                                                animate={isPressed ? { scale: 0.9, y: 2 } : { scale: 1, y: 0 }}
                                                className={cn(
                                                    "h-11 px-3 flex items-center justify-center rounded-lg border-2 text-sm font-black uppercase transition-all duration-75 relative",
                                                    key === "space" ? "w-72" : "w-11",
                                                    isNext ? "border-[#e2b714] text-[#e2b714] shadow-[0_0_15px_rgba(226,183,20,0.2)] bg-[#e2b714]/5" : "border-[#2c2e31] bg-[#2c2e31]/40 text-[#646669]/50",
                                                    isPressed ? "bg-[#e2b714] border-[#e2b714] text-[#323437] shadow-[0_0_30px_rgba(226,183,20,0.4)]" : "shadow-[0_4px_0_rgba(0,0,0,0.3)]"
                                                )}
                                            >
                                                {key !== "space" && key}
                                                {isNext && !isPressed && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#e2b714] rounded-full animate-ping" />}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-6 mt-4">
                            <div className="text-[10px] text-[#646669]/30 tracking-[0.2em] uppercase flex gap-8">
                                <span><span className="text-[#e2b714]/60 font-bold px-1.5 py-0.5 rounded bg-[#2c2e31] mr-1">Tab</span> + <span className="text-[#e2b714]/60 font-bold px-1.5 py-0.5 rounded bg-[#2c2e31] ml-1">Enter</span> Restart</span>
                                <span><span className="text-[#e2b714]/60 font-bold px-1.5 py-0.5 rounded bg-[#2c2e31] mr-1">Esc</span> Quick Reset</span>
                            </div>

                            <button
                                ref={restartRef}
                                onClick={resetTest}
                                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); resetTest(); } }}
                                className="p-5 rounded-full hover:bg-[#2c2e31] text-[#646669] hover:text-[#d1d0c5] transition-all transform hover:rotate-180 duration-500 focus:outline-none focus:bg-[#2c2e31] focus:text-[#e2b714]"
                            >
                                <RotateCcw className="w-8 h-8" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-16 py-12"
                    >
                        <div className="flex gap-32">
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-[#646669]">wpm</span>
                                <span className="text-9xl font-bold text-[#e2b714] tracking-tighter">{stats.wpm}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-bold text-[#646669]">acc</span>
                                <span className="text-9xl font-bold text-[#d1d0c5] tracking-tighter">{stats.accuracy}%</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            onClick={resetTest}
                            className="p-8 rounded-full bg-[#2c2e31] text-[#d1d0c5] hover:text-[#e2b714] shadow-2xl"
                        >
                            <RotateCcw className="w-10 h-10" />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-6 right-6 text-[10px] text-[#646669]/20 font-bold tracking-[0.3em] uppercase opacity-50">
                MonkeyType // Codex Edition 1.0
            </div>
        </div>
    );
}
