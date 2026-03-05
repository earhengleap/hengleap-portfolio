"use client";

import { motion } from "framer-motion";
import { MousePointer2 } from "lucide-react";

interface VisitorCursorProps {
    name: string;
    color: string;
    x: number;
    y: number;
}

export function VisitorCursor({ name, color, x, y }: VisitorCursorProps) {
    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9999] flex flex-col items-start gap-1"
            animate={{ x, y }}
            transition={{
                type: "spring",
                damping: 30,
                mass: 0.8,
                stiffness: 250
            }}
        >
            <div className="relative">
                <MousePointer2
                    className="w-5 h-5 drop-shadow-md"
                    style={{
                        color: color,
                        fill: color
                    }}
                />
                {/* Glow effect */}
                <div
                    className="absolute inset-0 w-5 h-5 blur-[4px] opacity-40"
                    style={{ backgroundColor: color }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white whitespace-nowrap shadow-lg flex items-center gap-1.5"
                style={{ backgroundColor: color }}
            >
                <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                {name}
            </motion.div>
        </motion.div>
    );
}
