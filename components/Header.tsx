"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import NavLink from "./NavLink";
import Socials from "./Socials";

const navItems = [
  { label: "Projets", href: "/" },
  { label: "About", href: "/about" },
  { label: "Me Contacter", href: "/contact" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 pt-7 pb-6 md:px-0">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-[60px] md:flex">
          {navItems.map((item) => (
            <NavLink key={item.label} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Socials />
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Menu"
        >
          <motion.span
            className="block h-0.5 w-5 bg-foreground"
            animate={mobileMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-0.5 w-5 bg-foreground"
            animate={mobileMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-black/5 md:hidden"
          >
            <nav className="flex flex-col items-center gap-6 px-5 pb-6">
              {navItems.map((item) => (
                <NavLink key={item.label} href={item.href}>
                  {item.label}
                </NavLink>
              ))}
              <Socials />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
