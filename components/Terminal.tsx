"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getCommands } from "../lib/commands";

export default function Terminal() {
  const router = useRouter();


  // Stores everything printed in the terminal
  const [history, setHistory] = useState<string[]>([
    "Welcome to akhilmohammad.com",
    "Type 'help' to see commands.",
  ]);

  // Stores what the user is currently typing
  const [input, setInput] = useState("");

  const commands = getCommands(router);


    function runCommand(raw: string) {

        if (!raw) return;

        if (raw === "clear") {
          setHistory([]);
          setInput("");
          return;
        }

        const tokens = raw.split(" ");
        const cmd = tokens[0];
        const args = tokens.slice(1);

        if (!(cmd in commands)) {
            setHistory((prev) => [
            ...prev,
            `> ${raw}`,
            `Command not found: ${cmd}`,
            ]);
            return;
        }

        const result = commands[cmd as keyof typeof commands](args);

        setHistory((prev) => [
            ...prev,
            `> ${raw}`,
            ...(result ? [result] : []),
        ]);
    }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] p-8">
      {/* Terminal window */}
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#300a24] p-6 shadow-xl font-mono text-sm text-gray-200">

        {/* Window bar */}
        <div className="mb-4 flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />

          <span className="ml-3 text-xs text-gray-400">
            akhil@ubuntu: ~
          </span>
        </div>

        {/* Terminal output */}
        <div className="space-y-1 leading-relaxed">
          {history.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        {/* Input prompt */}
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(input.trim());
            setInput("");
          }}
        >
          <div className="flex items-center flex-wrap">

            {/* Ubuntu prompt */}
            <span className="text-green-400">akhil</span>
            <span className="text-gray-300">@</span>
            <span className="text-green-400">ubuntu</span>
            <span className="mx-2 text-blue-400">~</span>
            <span className="text-gray-200">$</span>

            {/* Typed input */}
            <span className="ml-2">{input}</span>

            {/* Cursor */}
            <span className="ml-1 h-4 w-2 bg-gray-100 animate-pulse" />

            {/* Hidden input */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="absolute opacity-0"
              autoFocus
            />
          </div>
        </form>
      </div>
    </div>
  );


}