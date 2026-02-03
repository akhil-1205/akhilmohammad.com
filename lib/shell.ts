import { FSNode, getNodeAtPath, findChild, filesystem } from "./fs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface ShellContext {
  cwd: string[];
  setCwd: (path: string[]) => void;

  history: string[];
  setHistory: (fn: (prev: string[]) => string[]) => void;

  router: AppRouterInstance;
}

export type CommandFn = (args: string[], ctx: ShellContext) => void;

export const commands: Record<string, CommandFn> = {
  help(args, ctx) {
  ctx.setHistory((prev) => [
        ...prev,
        "Available commands:",
        "  help              show this message",
        "  pwd               print current directory",
        "  ls                list files and folders",
        "  cd <dir>           change directory",
        "  cd ..             go up one directory",
        "  cat <file>         print file contents",
        "  open <file>        open .site or .pdf in new tab",
        "  clear              clear the terminal",
        "  echo               print text to terminal",
        "  banner             show banner message"
    ]);
  },


  pwd(args, ctx) {
    ctx.setHistory((prev) => [...prev, ctx.cwd.join("/")]);
  },

  ls(args, ctx) {
    const node = getNodeAtPath(filesystem, ctx.cwd);
    if (!node || node.type !== "dir") return;

    const listing =
      node.children?.map((c) => c.name).join("\n") ?? "";

    ctx.setHistory((prev) => [...prev, listing]);
  },

  cd(args, ctx) {
    const target = args[0];
    if (!target) {
      ctx.setHistory((prev) => [...prev, "Usage: cd <dir>"]);
      return;
    }

    // cd ..
    if (target === "..") {
      if (ctx.cwd.length > 1) {
        ctx.setCwd(ctx.cwd.slice(0, -1));
      }
      return;
    }

    const node = getNodeAtPath(filesystem, ctx.cwd);
    if (!node || node.type !== "dir") return;

    const next = node.children?.find(
      (c) => c.type === "dir" && c.name === target
    );

    if (!next) {
      ctx.setHistory((prev) => [...prev, `cd: no such directory: ${target}`]);
      return;
    }

    ctx.setCwd([...ctx.cwd, target]);
  },

  cat(args, ctx) {
    const filename = args[0];
    if (!filename) {
      ctx.setHistory((prev) => [...prev, "Usage: cat <file>"]);
      return;
    }

    const node = getNodeAtPath(filesystem, ctx.cwd);
    if (!node || node.type !== "dir") return;

    const file = findChild(node, filename);

    if (!file || file.type !== "file") {
      ctx.setHistory((prev) => [...prev, `cat: ${filename}: No such file`]);
      return;
    }

    ctx.setHistory((prev) => [...prev, file.content ?? ""]);
  },

  open(args, ctx) {
    const filename = args[0];
    if (!filename) {
      ctx.setHistory((prev) => [...prev, "Usage: open <file>"]);
      return;
    }

    const node = getNodeAtPath(filesystem, ctx.cwd);
    if (!node || node.type !== "dir") return;

    const file = findChild(node, filename);
    if (!file || file.type !== "file") {
      ctx.setHistory((prev) => [...prev, `open: ${filename}: No such file`]);
      return;
    }

    if (filename.endsWith(".site")) {
      window.open(file.content, "_blank");
      return;
    }

    if (filename.endsWith(".pdf")) {
      window.open(file.content ?? "/resume.pdf", "_blank");
      return;
    }

    ctx.setHistory((prev) => [...prev, `open: unsupported type`]);
  },

  clear(args, ctx) {
    ctx.setHistory(() => []);
  },

  echo(args, ctx) {
    ctx.setHistory((prev) => [...prev, args.join(" ")]);
    return;
  },

  banner(args, ctx) {
    ctx.setHistory((prev) => [...prev,
        "Welcome to akhilmohammad.com",
        "Quick resume access? Type 'open resume.pdf'",
        "Type 'help' for list of available commands",
    ]);
    return;
  },
};
