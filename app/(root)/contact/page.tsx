"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type TerminalLine = {
  type: 'system' | 'input' | 'error' | 'success';
  text: string;
};

export default function ContactPage() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', text: 'Initializing secure connection...' },
    { type: 'system', text: 'Establishing handshake...' },
    { type: 'system', text: 'Connection encrypted. Waiting for input.' },
    { type: 'system', text: '----------------------------------------' },
    { type: 'system', text: 'To send a message, please provide the requested details.' }
  ]);

  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [currentInput, setCurrentInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, currentInput]);

  useEffect(() => {
    // Keep focus on input
    const handleClick = () => inputRef.current?.focus();
    document.addEventListener("click", handleClick);
    inputRef.current?.focus();
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleInputSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !currentInput.trim()) return;

    const val = currentInput.trim();
    setCurrentInput("");

    if (step === 0) {
      setLines(p => [...p, { type: 'input', text: `> Name: ${val}` }]);
      setName(val);
      setStep(1);
    } else if (step === 1) {
      setLines(p => [...p, { type: 'input', text: `> Email: ${val}` }]);
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        setEmail(val);
        setStep(2);
      } else {
        setLines(p => [...p, { type: 'error', text: 'Invalid email format. Try again.' }]);
      }
    } else if (step === 2) {
      setLines(p => [...p, { type: 'input', text: `> Subject: ${val}` }]);
      setSubject(val);
      setStep(3);
    } else if (step === 3) {
      setLines(p => [...p, { type: 'input', text: `> Message: ${val}` }]);
      setMessage(val);
      setStep(4);

      // Auto submit
      submitForm(name, email, subject, val);
    }
  };

  const submitForm = async (n: string, e: string, s: string, m: string) => {
    setIsSubmitting(true);
    setLines(p => [...p, { type: 'system', text: 'Encrypting payload...' }, { type: 'system', text: 'Transmitting data...' }]);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: n, email: e, subject: s, message: m }),
      });

      if (response.ok) {
        setLines(p => [...p, { type: 'success', text: 'Transmission successful. Message delivered.' }]);
        toast.success("Message sent securely!");
      } else {
        setLines(p => [...p, { type: 'error', text: 'Transmission failed. Destination unreachable.' }]);
        toast.error("Failed to send message.");
      }
    } catch (err) {
      setLines(p => [...p, { type: 'error', text: 'Critical error during transmission.' }]);
      toast.error("An error occurred.");
    }

    setIsSubmitting(false);
    // Reset to let them send another message if desired
    setTimeout(() => {
      setLines(p => [...p, { type: 'system', text: '----------------------------------------' }, { type: 'system', text: 'Session reset. Ready for new input.' }]);
      setStep(0);
      setName(""); setEmail(""); setSubject(""); setMessage("");
    }, 2000);
  };

  const getPrompt = () => {
    switch (step) {
      case 0: return "> Name: ";
      case 1: return "> Email: ";
      case 2: return "> Subject: ";
      case 3: return "> Message: ";
      default: return "> ";
    }
  };

  return (
    <div className="h-full flex flex-col font-mono text-sm max-w-4xl mx-auto py-8">
      <div className="flex-1 bg-black rounded-lg border border-[#333] overflow-hidden shadow-2xl flex flex-col">
        {/* Terminal Header */}
        <div className="bg-[#1a1b26] px-4 py-2 border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="ml-2 font-semibold">secure_shell.exe</span>
          </div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            CONNECTED
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 overflow-auto flex-1 text-green-500" onClick={() => inputRef.current?.focus()}>
          {lines.map((line, i) => (
            <div key={i} className={`mb-2 leading-relaxed tracking-wider ${line.type === 'error' ? 'text-red-500' :
              line.type === 'success' ? 'text-blue-400 font-bold' :
                line.type === 'input' ? 'text-white' : 'text-green-500'
              }`}>
              {line.text}
            </div>
          ))}

          {step < 4 && !isSubmitting && (
            <form onSubmit={handleInputSubmit} className="flex relative items-center text-white mt-4">
              <span className="mr-2 text-green-500">{getPrompt()}</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="flex-1 bg-transparent outline-none border-none text-white caret-transparent"
                autoFocus
                autoComplete="off"
                spellCheck="false"
              />
              <span
                className="w-2.5 h-5 bg-green-500 inline-block animate-[pulse_1s_infinite] absolute"
                style={{
                  left: `calc(${getPrompt().length}ch + ${currentInput.length}ch + 0.5rem)`,
                }}
              ></span>
            </form>
          )}

          {isSubmitting && (
            <div className="mt-4 flex items-center gap-2 text-green-500">
              <span>Processing</span>
              <span className="flex gap-1">
                <span className="animate-bounce delay-75">.</span>
                <span className="animate-bounce delay-150">.</span>
                <span className="animate-bounce delay-300">.</span>
              </span>
            </div>
          )}

          <div ref={endOfTerminalRef} className="h-4" />
        </div>
      </div>
    </div>
  );
}
