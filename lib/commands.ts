import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const targets: Record<
  string,
  {
    type: "internal" | "external";
    value: string;
    preview: string;
  }
> = {
  projects: {
    type: "internal",
    value: "/projects",
    preview: "Project case studies: DRDO SAR, Radar ML, Hopfield demo.",
  },

  resume: {
    type: "internal",
    value: "/resume",
    preview: "Resume: CS + Economics @ BITS Pilani, ML for Radar/SAR.",
  },

  github: {
    type: "external",
    value: "https://github.com/Akhil-1205",
    preview: "GitHub: github.com/Akhil-1205",
  },

  linkedin: {
    type: "external",
    value: "https://www.linkedin.com/in/akhil-mohammad",
    preview: "LinkedIn: linkedin.com/in/akhil-mohammad",
  },
};


export function getCommands(router: AppRouterInstance) {
  return {
    help: () => "Commands: help, ls, open <target>, cat <target>, echo <string>, clear",

    ls: () => Object.keys(targets).join("  "),

    open: (args: string[]) => {
      const name = args[0];
      if (!name) return "Usage: open <target>";

      const target = targets[name];
      if (!target) return `open: unknown target '${name}'`;

      if (target.type === "internal") {
        router.push(target.value);
        return `Opening ${target.value}...`;
      }

      // External link
      window.open(target.value, "_blank");
      return `Opening ${name} in a new tab...`;
    },

    cat: (args: string[]) => {
      const file = args[0];
      if (!file) return "Usage: cat <file>";

      const target = targets[file];

      if (!target) return `cat: ${file}: No such file`;

      return target.preview;
    
    },

    cd: (args: string[]) => {
      const dir = args[0];

      if (!dir) return "Usage: cd <directory>";
      if (dir === "..") {
        router.push("/");
        return null;
      }

      const target = targets[dir];

      if (!target || target.type !== "internal") {
        return `cd: no such directory: ${dir}`;
      }

      router.push(target.value);
      return null;
    },


    echo: (args: string[]) => {
        return args.join(" ");
    }
  };
}