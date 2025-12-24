import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const CONTENT_DIR = path.join(process.cwd(), "content");

type MarkdownSection = {
  header?: string;
  html: string;
};

async function mdToHtml(markdown: string) {
  const processed = await remark().use(remarkHtml).process(markdown);
  return processed.toString();
}

export async function getAboutSection(): Promise<MarkdownSection> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, "about.md"), "utf8");
  const { data, content } = matter(raw);
  const html = await mdToHtml(content);
  return { header: data.header ? String(data.header) : undefined, html };
}

export type SocialItem = { label: string; href: string };

export async function getSocials(): Promise<{ header?: string; items: SocialItem[] }> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, "socials.md"), "utf8");
  const { data, content } = matter(raw);

  const items: SocialItem[] = content
    .split("\n")
    .map((l) => l.trim())
    .map((l) => {
      const m = l.match(/^-+\s*\[([^\]]+)\]\(([^)]+)\)\s*$/);
      if (!m) return null;
      return { label: m[1].trim(), href: m[2].trim() };
    })
    .filter(Boolean) as SocialItem[];

  return { header: data.header ? String(data.header) : undefined, items };
}

export type MiniPost = {
  date: string;
  type: string; 
  title: string;
  accent: string;
  bodyHtml: string;
};

export async function getMiniPosts(): Promise<MiniPost[]> {
  const postsDir = path.join(CONTENT_DIR, "posts");
  const files = (await fs.readdir(postsDir)).filter((f) => f.endsWith(".md"));

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(postsDir, file), "utf8");
      const { data, content } = matter(raw);

      const bodyHtml = await mdToHtml(content);

      return {
        date: data.date ? String(data.date) : "",
        type: data.type ? String(data.type) : "",
        title: data.title ? String(data.title) : "",
        accent: data.accent ? String(data.accent) : "cyan",
        bodyHtml,
      } satisfies MiniPost;
    })
  );

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  return posts;
}
