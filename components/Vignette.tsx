"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface VignetteProps {
  title: string;
  description: string;
  accentColor: string;
  href?: string;
}

export default function Vignette({
  title,
  description,
  accentColor,
  href,
}: VignetteProps) {
  const content = (
    <motion.div
      className="flex w-full max-w-[251px] h-[139px] flex-col justify-center overflow-hidden rounded-[13px] bg-background cursor-pointer"
      whileHover={{
        boxShadow: "4px 4px 13px 0px rgba(0, 0, 0, 0.25)",
      }}
      initial={{ boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-[52px] bg-card-title p-2.5">
        <h3 className="font-sans text-lg font-bold leading-[1.56]">
          {title}
        </h3>
      </div>

      <div
        className="flex flex-1 items-center px-2.5"
        style={{ backgroundColor: accentColor }}
      >
        <p className="font-mono text-xs font-normal leading-[1.25] text-foreground whitespace-pre-line">
          {description}
        </p>
      </div>
    </motion.div>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
