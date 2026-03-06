"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Terminal, Code2, Cpu, UserCircle, FolderGit2,
  Activity, GitBranch, Star, Globe, Zap, Coffee,
  ArrowRight, Clock, BookOpen
} from "lucide-react";

const BOOT_SEQUENCE = [
  "Initializing Codex Coder v1.0.0...",
  "Loading kernel modules...................[OK]",
  "Mounting root filesystem.................[OK]",
  "Starting network interface...............[OK]",
  "Connecting to HengLeap's neural net......[OK]",
  "Loading portfolio data...................[OK]",
  "SUCCESS: System Ready.",
];

const SKILLS = [
  { name: "TypeScript", level: 90, color: "#3178c6" },
  { name: "React / Next.js", level: 95, color: "#61dafb" },
  { name: "Node.js", level: 85, color: "#339933" },
  { name: "Tailwind CSS", level: 92, color: "#06b6d4" },
];

const RECENT_ACTIVITY = [
  { icon: GitBranch, text: "Pushed to codex branch", time: "2m ago", color: "text-green-400" },
  { icon: Star, text: "Starred react-query/tanstack", time: "1h ago", color: "text-yellow-400" },
  { icon: Code2, text: "Opened monkeytype.tsx", time: "3h ago", color: "text-blue-400" },
  { icon: BookOpen, text: "Read Next.js 15 docs", time: "5h ago", color: "text-purple-400" },
];

// Use session-level cache so boot animation only runs once per page visit, not on tab remount
let bootDone = false;
let bootLines: string[] = [];

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [lines, setLines] = useState<string[]>([]);  // always start empty — matches server
  const [isBooted, setIsBooted] = useState(false);    // always start false — matches server
  const [currentTime, setCurrentTime] = useState("");
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Clock
    const tick = () => setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const interval = setInterval(tick, 1000);

    // Boot animation / cache restore — runs client-only after hydration.
    // Server always rendered lines=[] / isBooted=false (no mismatch).
    if (bootDone) {
      // Already animated (navigated back to home) — restore instantly
      setLines([...bootLines]);
      setIsBooted(true);
      return () => clearInterval(interval);
    }

    // Fresh boot sequence
    let delay = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    BOOT_SEQUENCE.forEach((line, index) => {
      delay += Math.random() * 200 + 150;
      const t = setTimeout(() => {
        bootLines = [...bootLines, line];
        setLines([...bootLines]);
        if (index === BOOT_SEQUENCE.length - 1) {
          const t2 = setTimeout(() => {
            bootDone = true;
            setIsBooted(true);
          }, 500);
          timeouts.push(t2);
        }
      }, delay);
      timeouts.push(t);
    });

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Render nothing on server / during hydration to prevent any mismatch.
  // The real content appears immediately after mount (no visible flash).
  if (!isMounted) return <div className="h-full" />;

  return (
    <div className="h-full flex flex-col font-mono text-sm overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto w-full px-4 py-6 space-y-6">

        {/* Top Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between text-[10px] text-muted-foreground border-b border-border/40 pb-3"
        >
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
              <span className="text-green-400 font-semibold">ONLINE</span>
            </span>
            <span>branch: <span className="text-blue-400">codex</span></span>
            <span>v1.0.0</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {currentTime}</span>
            <span className="flex items-center gap-1"><Coffee className="w-3 h-3 text-yellow-400" /> Fueled by coffee</span>
          </div>
        </motion.div>

        {/* Boot Sequence */}
        <div className="space-y-0.5">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={line.includes("SUCCESS") || line.includes("[OK]") ? "text-primary" : "text-gray-400"}
            >
              <span className="text-blue-400 mr-2">➜</span>
              {line}
            </motion.div>
          ))}
          {!isBooted && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-gray-400 ml-2 align-middle"
            />
          )}
        </div>

        {/* Main Welcome Block */}
        <AnimatePresence>
          {isBooted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-5"
            >
              {/* Hero Card */}
              <div className="border border-border/60 bg-card/60 rounded-xl overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="bg-[#2d2d2d]/80 px-4 py-2.5 border-b border-border/60 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <Terminal className="w-3.5 h-3.5 text-gray-400 ml-2" />
                  <span className="text-gray-300 font-semibold text-xs">Welcome to HengLeap&apos;s Workspace</span>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="text-muted-foreground text-xs mb-1">// developer profile</div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                          <span className="text-primary">const</span> developer{" "}
                          <span className="text-muted-foreground">=</span>{" "}
                          <span className="text-blue-400">&quot;HengLeap EAR&quot;</span>;
                        </h1>
                      </div>
                      <p className="text-gray-400 text-base">
                        Software Engineer <span className="text-primary/60">•</span> Problem Solver <span className="text-primary/60">•</span> Tech Enthusiast
                      </p>
                      <div className="text-xs text-muted-foreground font-mono space-y-0.5">
                        <div><span className="text-green-400">+</span> Building elegant solutions to complex problems</div>
                        <div><span className="text-green-400">+</span> Passionate about DX and developer tooling</div>
                        <div><span className="text-green-400">+</span> Open to meaningful collaborations</div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <QuickLink href="/about" icon={UserCircle} text="about.ts" color="text-yellow-400" />
                        <QuickLink href="/projects" icon={FolderGit2} text="projects.json" color="text-green-400" />
                        <QuickLink href="/skills" icon={Cpu} text="skills.md" color="text-purple-400" />
                        <QuickLink href="/contact" icon={Code2} text="contact.sh" color="text-orange-400" />
                      </div>
                    </div>

                    {/* ASCII Art */}
                    <div className="hidden md:flex bg-black/50 p-5 rounded-xl border border-primary/20 text-primary whitespace-pre font-mono text-xs shadow-inner shadow-primary/5 shrink-0">
                      {`   ____          __         
  / __/    __   / /_  ____  
 / /_     / /_ / __/ / __/  
/ /_/__  / __// /_  / /_    
\\____//_/\\__/ \\__/  \\__/   `}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats + Activity Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Skills Progress */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="border border-border/60 bg-card/40 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    Skills.proficiency
                  </div>
                  <div className="space-y-3">
                    {SKILLS.map((skill, i) => (
                      <div
                        key={i}
                        className="group cursor-default"
                        onMouseEnter={() => setActiveSkill(i)}
                        onMouseLeave={() => setActiveSkill(null)}
                      >
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className={activeSkill === i ? "text-foreground" : "text-muted-foreground"}
                            style={{ color: activeSkill === i ? skill.color : undefined }}>
                            {skill.name}
                          </span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 bg-border/40 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: skill.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border border-border/60 bg-card/40 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    Recent.activity
                  </div>
                  <div className="space-y-2.5">
                    {RECENT_ACTIVITY.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.08 }}
                        className="flex items-center gap-3 text-[11px] group"
                      >
                        <item.icon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
                        <span className="text-muted-foreground flex-1 truncate group-hover:text-foreground transition-colors">{item.text}</span>
                        <span className="text-muted-foreground/60 shrink-0">{item.time}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* CTA Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 border border-primary/15 bg-primary/5 rounded-xl px-5 py-4"
              >
                <div className="text-xs text-muted-foreground">
                  <span className="text-primary font-mono">// </span>
                  Open a file from the explorer to start exploring the workspace
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/projects"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-lg transition-all hover:scale-105 active:scale-95"
                  >
                    View Projects <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-all hover:scale-105 active:scale-95"
                  >
                    <Globe className="w-3 h-3" /> Get in Touch
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function QuickLink({ href, icon: Icon, text, color }: { href: string; icon: any; text: string; color: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 border border-border/60 rounded-lg hover:bg-accent/40 hover:border-primary/30 transition-all group hover:scale-105 active:scale-95"
    >
      <Icon className={`w-4 h-4 ${color} group-hover:scale-110 transition-transform`} />
      <span className="text-gray-300 group-hover:text-white transition-colors text-sm">{text}</span>
    </Link>
  );
}
