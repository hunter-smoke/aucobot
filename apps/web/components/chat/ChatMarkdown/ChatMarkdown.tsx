"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { isInternalAppHref } from "@/utils/chat/markdown-link";

import styles from "./ChatMarkdown.module.css";

export interface ChatMarkdownProps {
  content: string;
}

function MarkdownLink({
  href,
  children,
}: {
  href?: string;
  children?: ReactNode;
}) {
  if (!href) return <span>{children}</span>;

  if (isInternalAppHref(href)) {
    return <Link href={href}>{children}</Link>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

const MARKDOWN_COMPONENTS = {
  a: MarkdownLink,
};

export function ChatMarkdown({ content }: ChatMarkdownProps) {
  if (!content.trim()) return null;

  return (
    <div className={styles.markdown}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={MARKDOWN_COMPONENTS}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
