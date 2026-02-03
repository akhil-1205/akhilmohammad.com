// lib/fs.ts

// Only two node types: directories and files
export type NodeType = "dir" | "file";

// Node in the virtual filesystem
export interface FSNode {
  type: NodeType;
  name: string;

  // Directories contain children
  children?: FSNode[];

  // Files contain content (text, URLs, etc.)
  content?: string;
}

/*
Filesystem tree:

~/
  projects/
    drdo.txt
    radar.txt
  about.txt
  resume.pdf
  github.site
  linkedin.site
*/
export const filesystem: FSNode = {
  type: "dir",
  name: "~",
  children: [
    {
      type: "dir",
      name: "projects",
      children: [
        {
          type: "file",
          name: "drdo.txt",
          content: "DRDO SAR dataset prep + YOLO training work.",
        },
        {
          type: "file",
          name: "radar.txt",
          content: "Radar ML notes: range-Doppler, spectrograms, etc.",
        },
      ],
    },

    {
      type: "file",
      name: "about.txt",
      content: "Akhil Mohammad — CS + Econ, Radar/SAR ML, systems.",
    },

    {
      type: "file",
      name: "resume.pdf",
      content: "/resume.pdf",
    },

    {
      type: "file",
      name: "github.site",
      content: "https://github.com/Akhil-1205",
    },

    {
      type: "file",
      name: "linkedin.site",
      content: "https://www.linkedin.com/in/akhil-mohammad",
    },
  ],
};

/*
Resolve a path like ["~", "projects"] into the node.
*/
export function getNodeAtPath(root: FSNode, path: string[]) {
  let current: FSNode = root;

  // Start at index 1 because index 0 is "~"
  for (let i = 1; i < path.length; i++) {
    if (current.type !== "dir") return null;

    const next = current.children?.find(
      (child) => child.name === path[i]
    );

    if (!next) return null;
    current = next;
  }

  return current;
}

// Find a child node by name inside a directory
export function findChild(dir: FSNode, name: string) {
  if (dir.type !== "dir") return null;
  return dir.children?.find((c) => c.name === name) ?? null;
}

