"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function NavLink({ href, children }: NavLinkProps) {
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <MotionLink
      href={href}
      className="font-mono text-base font-bold leading-6 text-foreground"
      style={{
        fontStyle: hovered || isActive ? "italic" : "normal",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ duration: 0.15 }}
    >
      {children}
    </MotionLink>
  );
}
