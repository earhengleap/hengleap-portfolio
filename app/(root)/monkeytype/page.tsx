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

const KHMER_WORD_POOL = [
    "សួស្តី", "អរគុណ", "កម្ពុជា", "ភ្នំពេញ", "ស្រលាញ់", "បច្ចេកវិទ្យា", "កម្មវិធី", "កូដ", "ទូរស័ព្ទ", "កុំព្យូទ័រ",
    "ការងារ", "សាលា", "រៀន", "អាន", "សរសេរ", "និយាយ", "ស្តាប់", "យល់", "ដឹង", "ធ្វើ",
    "បាន", "មាន", "អត់", "មិន", "ល្អ", "ច្រើន", "តិច", "ធំ", "តូច", "វែង",
    "ខ្លី", "ថ្ងៃមិញ", "ថ្ងៃនេះ", "ថ្ងៃស្អែក", "ពេល", "ម៉ោង", "នាទី", "វិនាទី", "ប៉ុន្មាន", "ប្រហែល",
    "ប្រាកដ", "ច្បាស់", "ត្រឹមត្រូវ", "ខុស", "ត្រូវ", "ថ្មី", "ចាស់", "ស្អាត", "លឿន", "យឺត",
    "សប្បាយ", "ពិបាក", "ងាយ", "ស្រួល", "ជួយ", "សុំ", "ឲ្យ", "យក", "ទុក", "ចាំ",
    "ភ្លេច", "គិត", "ស្មាន", "ជឿ", "សង្ឃឹម", "ចង់", "ត្រូវការ", "អាច", "គួរ", "មុខ",
    "ក្រោយ", "លើ", "ក្រោម", "ក្នុង", "ក្រៅ", "ឆ្វេង", "ស្តាំ", "កណ្តាល", "គៀន", "ជិត",
    "ឆ្ងាយ", "ដើរ", "រត់", "ឈរ", "អង្គុយ", "ដេក", "ញ៉ាំ", "ផឹក", "មើល", "ឃើញ",
    "ទិញ", "លក់", "ចំណាយ", "ចំណេញ", "ខាត", "ថ្លៃ", "ថោក", "ប្រាក់", "លុយ", "ធនាគារ"
];

const KEYBOARD_ROWS = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift"],
    ["space"]
];

const KHMER_KEY_MAP: Record<string, { base: string, shift: string }> = {
    "1": { base: "១", shift: "!" }, "2": { base: "២", shift: "ៗ" }, "3": { base: "៣", shift: "\"" }, "4": { base: "៤", shift: "៛" }, "5": { base: "៥", shift: "%" }, "6": { base: "៦", shift: "៍" }, "7": { base: "៧", shift: "័" }, "8": { base: "៨", shift: "៏" }, "9": { base: "៩", shift: "(" }, "0": { base: "០", shift: ")" }, "-": { base: "ឥ", shift: "៌" }, "=": { base: "ឱ្យ", shift: "=" },
    "q": { base: "ឆ", shift: "ឈ" }, "w": { base: "ឹ", shift: "ឺ" }, "e": { base: "េ", shift: "ែ" }, "r": { base: "រ", shift: "ឬ" }, "t": { base: "ត", shift: "ទ" }, "y": { base: "យ", shift: "ួ" }, "u": { base: "ុ", shift: "ូ" }, "i": { base: "ិ", shift: "ី" }, "o": { base: "ោ", shift: "ៅ" }, "p": { base: "ផ", shift: "ភ" }, "[": { base: "ៀ", shift: "ឿ" }, "]": { base: "ឪ", shift: "ឧ" }, "\\": { base: "ឮ", shift: "ឭ" },
    "a": { base: "ា", shift: "ាំ" }, "s": { base: "ស", shift: "ៃ" }, "d": { base: "ដ", shift: "ឌ" }, "f": { base: "ថ", shift: "ធ" }, "g": { base: "ង", shift: "អ" }, "h": { base: "ហ", shift: "ះ" }, "j": { base: "្", shift: "ញ" }, "k": { base: "ក", shift: "គ" }, "l": { base: "ល", shift: "ឡ" }, ";": { base: "ើ", shift: "ោះ" }, "'": { base: "់", shift: "៉" },
    "z": { base: "ឋ", shift: "ឍ" }, "x": { base: "ខ", shift: "ឃ" }, "c": { base: "ច", shift: "ជ" }, "v": { base: "វ", shift: "េះ" }, "b": { base: "ប", shift: "ព" }, "n": { base: "ន", shift: "ណ" }, "m": { base: "ម", shift: "ំ" }, ",": { base: "ុំ", shift: "ុះ" }, ".": { base: "។", shift: "៕" }, "/": { base: "៊", shift: "?" }
};

import { useMonkeyTypeStore, GameMode, GameConfig, Language } from "@/hooks/use-monkeytype-store";

export default function MonkeyTypePage() {
    const {
        mode, config, language, stats, timeLeft, isActive, isFinished,
        setIsActive, setIsFinished, setTimeLeft, setStats, resetLiveState, addHistory,
        setMode, setConfig, setLanguage
    } = useMonkeyTypeStore();

    const [words, setWords] = useState<string[]>([]);
    const [userInput, setUserInput] = useState("");
    const [startTime, setStartTime] = useState<number | null>(null);

    const [caretPos, setCaretPos] = useState({ top: 0, left: 0 });
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [lineOffset, setLineOffset] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const wordsRef = useRef<HTMLDivElement>(null);
    const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const restartRef = useRef<HTMLButtonElement>(null);

    const generateWords = useCallback(() => {
        const count = mode === "words" ? (config as number) : 150;
        const generated: string[] = [];
        const pool = language === "khmer" ? KHMER_WORD_POOL : WORD_POOL;
        for (let i = 0; i < count; i++) {
            generated.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        setWords(generated);
    }, [mode, config, language]);

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
            config,
            language
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
            const originalKey = e.key;

            if (e.key === "Shift") setIsShiftPressed(true);

            if (key === " ") setActiveKey("space");
            else {
                let matchedQwerty = key;
                for (const [qKey, chars] of Object.entries(KHMER_KEY_MAP)) {
                    if (originalKey === chars.base || originalKey === chars.shift) {
                        matchedQwerty = qKey;
                        break;
                    }
                }
                setActiveKey(matchedQwerty);
            }

            if (document.activeElement !== inputRef.current && !["Tab", "Enter", "Escape", "Shift", "Control", "Alt", "Meta"].includes(e.key)) {
                inputRef.current?.focus();
            }
        };

        const handleGlobalKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Shift") setIsShiftPressed(false);
            setActiveKey(null);
        };

        window.addEventListener("keydown", handleGlobalKeyDown);
        window.addEventListener("keyup", handleGlobalKeyUp);
        return () => {
            window.removeEventListener("keydown", handleGlobalKeyDown);
            window.removeEventListener("keyup", handleGlobalKeyUp);
        };
    }, [resetTest]);

    // Caret and 3-Line Shifting Logic
    const targetText = useMemo(() => words.join(" "), [words]);

    // Split target text into visual grapheme clusters to avoid broken combining characters in Khmer
    const clusters = useMemo(() => {
        if (!targetText) return [];

        // Use Intl.Segmenter with a fallback/manual check for Khmer combining marks
        const segmenter = new Intl.Segmenter(language === 'khmer' ? 'km' : 'en', { granularity: 'grapheme' });
        const rawSegments = Array.from(segmenter.segment(targetText)).map(s => s.segment);

        if (language !== 'khmer') return rawSegments;

        // Manual re-clustering to ensure Khmer vowels and signs always attach to a preceding consonant
        const khmerClusters: string[] = [];
        for (const seg of rawSegments) {
            const firstChar = seg.charCodeAt(0);
            const isCombiningMark = (firstChar >= 0x17B4 && firstChar <= 0x17D3);

            if (isCombiningMark && khmerClusters.length > 0) {
                khmerClusters[khmerClusters.length - 1] += seg;
            } else if (khmerClusters.length > 0 && khmerClusters[khmerClusters.length - 1].endsWith('\u17D2')) {
                // If previous segment ended with Coeng sign, this consonant must be part of that cluster
                khmerClusters[khmerClusters.length - 1] += seg;
            } else {
                khmerClusters.push(seg);
            }
        }
        return khmerClusters;
    }, [targetText, language]);

    // Map each cluster to its starting index in the raw string so we can track exact codepoint typing
    const clusterIndexes = useMemo(() => {
        let currentIndex = 0;
        const indexes: number[] = [];
        for (const cluster of clusters) {
            indexes.push(currentIndex);
            currentIndex += cluster.length;
        }
        return indexes;
    }, [clusters]);

    useEffect(() => {
        // Find the active cluster based on the user's current input length
        let activeClusterIndex = 0;
        for (let i = 0; i < clusterIndexes.length; i++) {
            if (userInput.length >= clusterIndexes[i]) {
                activeClusterIndex = i;
            } else {
                break;
            }
        }

        const activeCharElement = charRefs.current[activeClusterIndex];
        if (activeCharElement && wordsRef.current) {
            const charRect = activeCharElement.getBoundingClientRect();
            const containerRect = wordsRef.current.getBoundingClientRect();

            setCaretPos({
                top: charRect.top - containerRect.top + lineOffset,
                left: charRect.left - containerRect.left
            });

            // 3-line scroll logic: if current char top is more than 2 lines down, shift
            const relativeTop = charRect.top - containerRect.top + lineOffset;
            if (relativeTop > 110) { // Approx 2 lines (58px line height * 2)
                setLineOffset(prev => prev - 58); // Shift by one full Khmer line height
            }
        } else if (activeClusterIndex === 0 && charRefs.current[0] && wordsRef.current) {
            const charRect = charRefs.current[0].getBoundingClientRect();
            const containerRect = wordsRef.current.getBoundingClientRect();
            setCaretPos({
                top: charRect.top - containerRect.top,
                left: charRect.left - containerRect.left
            });
        }
    }, [userInput, words, clusters, clusterIndexes, lineOffset]);

    return (
        <div className={cn("h-full flex flex-col items-center justify-start pt-16 max-w-6xl mx-auto px-8 bg-[#323437] text-[#646669] overflow-hidden select-none", language === "khmer" ? "font-sans font-medium" : "font-mono")} onClick={() => inputRef.current?.focus()}>
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

                            <div className="flex items-center gap-4 px-4 border-r border-[#646669]/20">
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

                            <div className="flex items-center gap-4 px-4">
                                <button onClick={() => { setLanguage("english"); resetTest(); }} className={cn("hover:text-[#d1d0c5] transition-all", language === "english" ? "text-[#e2b714]" : "")}>
                                    english
                                </button>
                                <button onClick={() => { setLanguage("khmer"); resetTest(); }} className={cn("hover:text-[#d1d0c5] transition-all", language === "khmer" ? "text-[#e2b714]" : "")}>
                                    khmer
                                </button>
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
                                {/* Caret: made slightly taller for Khmer stacks */}
                                <motion.div
                                    animate={{ top: caretPos.top, left: caretPos.left, opacity: [1, 0, 1] }}
                                    transition={{
                                        top: { type: "spring", stiffness: 400, damping: 35 },
                                        left: { type: "spring", stiffness: 400, damping: 35 },
                                        opacity: { repeat: Infinity, duration: 0.8 }
                                    }}
                                    className="absolute w-[2px] h-[34px] bg-[#e2b714] rounded-full z-10 pointer-events-none mt-[3px]"
                                />

                                {/* Words Grid */}
                                <div className={cn("flex flex-wrap w-full", language === "khmer" ? "leading-[1.8] text-[32px] font-hanuman" : "leading-[40px] text-3xl")}>
                                    {clusters.map((cluster, i) => {
                                        const startIndex = clusterIndexes[i];
                                        const endIndex = startIndex + cluster.length;

                                        let statusColor = "text-[#646669]";
                                        let underline = false;

                                        // If user hasn't typed out this entire cluster yet
                                        if (userInput.length > startIndex) {
                                            const typedPart = userInput.substring(startIndex, Math.min(userInput.length, endIndex));
                                            const targetPart = targetText.substring(startIndex, startIndex + typedPart.length);

                                            // Check if all typed parts match
                                            if (typedPart === targetPart) {
                                                if (userInput.length >= endIndex) {
                                                    // Fully typed and correct
                                                    statusColor = "text-[#d1d0c5]";
                                                } else {
                                                    // Partially typed but correct so far (yellow)
                                                    statusColor = "text-[#e2b714]";
                                                }
                                            } else {
                                                // Contains wrong characters
                                                statusColor = "text-[#ca4754]";
                                                underline = true;
                                            }
                                        }

                                        return (
                                            <span
                                                key={i}
                                                ref={el => { charRefs.current[i] = el; }}
                                                className={cn("transition-colors duration-100", statusColor, underline && "border-b-2 border-[#ca4754]")}
                                            >
                                                {cluster === " " ? "\u00A0" : cluster}
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
                        <div className="mt-8 flex flex-col gap-3 items-center opacity-40 hover:opacity-80 transition-all duration-500 transform hover:scale-[1.02] font-mono">
                            {KEYBOARD_ROWS.map((row, i) => (
                                <div key={i} className="flex gap-2">
                                    {row.map((qwertyKey, ki) => {
                                        const mapping = KHMER_KEY_MAP[qwertyKey];
                                        const remainingTarget = targetText.slice(userInput.length);
                                        const isShiftKey = qwertyKey === "shift";

                                        let isNext = false;
                                        if (qwertyKey === "space") {
                                            isNext = targetText[userInput.length] === " ";
                                        } else if (language === "khmer" && mapping) {
                                            isNext = remainingTarget.startsWith(mapping.base) || remainingTarget.startsWith(mapping.shift);
                                        } else if (language === "khmer" && isShiftKey) {
                                            // Highlight shift key if the next char is a shift character on any key, or if it's a visible space
                                            isNext = Object.values(KHMER_KEY_MAP).some(m => m.shift !== m.base && remainingTarget.startsWith(m.shift)) || remainingTarget.startsWith(" ");
                                        } else if (language === "english") {
                                            isNext = targetText[userInput.length]?.toLowerCase() === qwertyKey;
                                        }

                                        const isPressed = activeKey === qwertyKey || (isShiftKey && isShiftPressed);

                                        return (
                                            <motion.div
                                                key={`${qwertyKey}-${ki}`}
                                                animate={isPressed ? { scale: 0.9, y: 2 } : { scale: 1, y: 0 }}
                                                className={cn(
                                                    "h-11 px-3 flex items-center justify-center rounded-lg border-2 text-sm font-black transition-all duration-75 relative",
                                                    qwertyKey === "space" ? "w-72 uppercase" : (isShiftKey ? "min-w-[80px]" : "min-w-11"),
                                                    language === "khmer" ? "font-hanuman font-normal" : "uppercase",
                                                    isNext ? "border-[#e2b714] text-[#e2b714] shadow-[0_0_15px_rgba(226,183,20,0.2)] bg-[#e2b714]/5" : "border-[#2c2e31] bg-[#2c2e31]/40 text-[#646669]/50",
                                                    isPressed ? "bg-[#e2b714] border-[#e2b714] text-[#323437] shadow-[0_0_30px_rgba(226,183,20,0.4)]" : "shadow-[0_4px_0_rgba(0,0,0,0.3)]"
                                                )}
                                            >
                                                {qwertyKey !== "space" ? (
                                                    language === "khmer" && mapping ? (
                                                        <div className="flex flex-col items-center leading-tight">
                                                            <span className="text-[10px] opacity-40">{mapping.shift}</span>
                                                            <span className="text-base">{mapping.base}</span>
                                                        </div>
                                                    ) : qwertyKey
                                                ) : "space"}
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
