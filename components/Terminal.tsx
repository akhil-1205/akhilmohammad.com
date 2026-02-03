"use client";

import { useState } from "react";
import { filesystem, getNodeAtPath, findChild } from "../lib/fs";
import { useRouter } from "next/navigation";
import { commands } from "../lib/shell";



export default function Terminal() {
  // Terminal printed output
  const [history, setHistory] = useState<string[]>([
    "Welcome to akhilmohammad.com",
    "Quick resume access? Type 'open resume.pdf'",
    "Type 'help' for list of available commands",
  ]);

  // Current typed command
  const [input, setInput] = useState("");

  // Current working directory path
  const [cwd, setCwd] = useState<string[]>(["~"]);

  //router
  const router = useRouter();


  function runCommand(raw: string) {
    if (!raw) return;

    const tokens = raw.split(" ");
    const cmd = tokens[0];
    const args = tokens.slice(1);

    // Always print the prompt line
    setHistory((prev) => [...prev, `> ${raw}`]);

    const fn = commands[cmd];

    if (!fn) {
      setHistory((prev) => [...prev, `Command not found: ${cmd}`]);
      return;
    }

    fn(args, {
      cwd,
      setCwd,
      history,
      setHistory,
      router,
    });
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] p-8">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#300a24] p-6 shadow-xl font-mono text-sm text-gray-200">

        {/* Window header */}
        <div className="mb-4 grid grid-cols-3 items-center">
          {/* Left circles */}
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>

          {/* True center title */}
          <div className="text-center text-xs text-gray-400">
            Terminal — akhilmohammad.com
          </div>

          {/* Right empty column (balances layout) */}
          <div />
        </div>


        {/* Output */}
        <div className="space-y-1">
          {history.map((line, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {line}
            </p>
          ))}
        </div>

        {/* Prompt */}
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault();
            runCommand(input.trim());
            setInput("");
          }}
        >
          <div className="flex items-center">
            <span className="text-green-400">akhil@ubuntu</span>
            <span className="text-gray-300">:</span>
            <span className="text-blue-400 ml-1">{cwd.join("/")}</span>
            <span className="text-gray-200 ml-1">$</span>


            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="ml-2 flex-1 bg-transparent outline-none"
              autoFocus
            />
          </div>
        </form>
      </div>
    </div>
  );
}
