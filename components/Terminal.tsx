"use client";

import { useState } from "react";
import { filesystem, getNodeAtPath, findChild } from "../lib/fs";
import { useRouter } from "next/navigation";


export default function Terminal() {
  // Terminal printed output
  const [history, setHistory] = useState<string[]>([
    "Welcome to akhilmohammad.com",
    "Type: ls, cd, pwd, clear",
  ]);

  // Current typed command
  const [input, setInput] = useState("");

  // Current working directory path
  const [cwd, setCwd] = useState<string[]>(["~"]);

  //router
  const router = useRouter();


  function runCommand(raw: string) {
    if (!raw) return;

    // --- clear ---
    if (raw === "clear") {
      setHistory([]);
      return;
    }

    const tokens = raw.split(" ");
    const cmd = tokens[0];
    const args = tokens.slice(1);

    // Resolve where we are in filesystem
    const currentNode = getNodeAtPath(filesystem, cwd);

    if (!currentNode || currentNode.type !== "dir") {
      setHistory((prev) => [...prev, `> ${raw}`, "Error: invalid directory"]);
      return;
    }

    // --- pwd ---
    if (cmd === "pwd") {
      setHistory((prev) => [...prev, `> ${raw}`, cwd.join("/")]);
      return;
    }

    // --- ls ---
    if (cmd === "ls") {
      const listing =
        currentNode.children?.map((c) => c.name).join("  ") ?? "";
      setHistory((prev) => [...prev, `> ${raw}`, listing]);
      return;
    }

    // --- cd ---
    if (cmd === "cd") {
      const target = args[0];

      if (!target) {
        setHistory((prev) => [...prev, `> ${raw}`, "Usage: cd <dir>"]);
        return;
      }

      // cd ..
      if (target === "..") {
        if (cwd.length > 1) {
          setCwd((prev) => prev.slice(0, -1));
        }
        setHistory((prev) => [...prev, `> ${raw}`]);
        return;
      }

      // Only allow directories
      const next = currentNode.children?.find(
        (c) => c.type === "dir" && c.name === target
      );

      if (!next) {
        setHistory((prev) => [
          ...prev,
          `> ${raw}`,
          `cd: no such directory: ${target}`,
        ]);
        return;
      }

      // Move into directory
      setCwd((prev) => [...prev, target]);
      setHistory((prev) => [...prev, `> ${raw}`]);
      return;
    }


    // --- cat ---
    if (cmd === "cat") {
      const filename = args[0];

      if (!filename) {
        setHistory((prev) => [...prev, `> ${raw}`, "Usage: cat <file>"]);
        return;
      }

      // Find the node in the current directory
      const node = findChild(currentNode, filename);

      if (!node || node.type !== "file") {
        setHistory((prev) => [
          ...prev,
          `> ${raw}`,
          `cat: ${filename}: No such file`,
        ]);
        return;
      }

      // Print file content
      setHistory((prev) => [
        ...prev,
        `> ${raw}`,
        node.content ?? "",
      ]);

      return;
    }

    // --- open ---
    if (cmd === "open") {
      const filename = args[0];

      if (!filename) {
        setHistory((prev) => [...prev, `> ${raw}`, "Usage: open <file>"]);
        return;
      }

      // Find file in current directory
      const node = findChild(currentNode, filename);

      if (!node || node.type !== "file") {
        setHistory((prev) => [
          ...prev,
          `> ${raw}`,
          `open: ${filename}: No such file`,
        ]);
        return;
      }

      // --- Case 1: .site links ---
      if (filename.endsWith(".site")) {
        window.open(node.content, "_blank");

        setHistory((prev) => [
          ...prev,
          `> ${raw}`,
          `Opening link: ${filename}...`,
        ]);
        return;
      }

      // --- Case 2: .pdf documents ---
      if (filename.endsWith(".pdf")) {
        // node.content stores internal route like "/resume"
        window.open(node.content ?? "/resume", "_blank");

        setHistory((prev) => [
          ...prev,
          `> ${raw}`,
          `Opening document: ${filename}...`,
        ]);
        return;
      }

      // --- Unsupported file type ---
      setHistory((prev) => [
        ...prev,
        `> ${raw}`,
        `open: cannot open '${filename}' (unsupported type)`,
      ]);
      return;
    }


    // Unknown command
    setHistory((prev) => [
      ...prev,
      `> ${raw}`,
      `Command not found: ${cmd}`,
    ]);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e1e] p-8">
      <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[#300a24] p-6 shadow-xl font-mono text-sm text-gray-200">
        {/* Output */}
        <div className="space-y-1">
          {history.map((line, i) => (
            <p key={i}>{line}</p>
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
            <span className="text-green-400 mr-2">
              akhil@ubuntu:{cwd.join("/")}$
            </span>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none"
              autoFocus
            />
          </div>
        </form>
      </div>
    </div>
  );
}
