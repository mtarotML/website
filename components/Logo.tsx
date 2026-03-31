"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SlotMachine from "./SlotMachine";

export default function Logo() {
  const [showSlot, setShowSlot] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowSlot((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2.5"
      >
        <span className="font-mono text-2xl font-bold leading-[1.32] text-foreground">
          martintarot.com
        </span>
      </button>

      <AnimatePresence>
        {showSlot && <SlotMachine onClose={() => setShowSlot(false)} />}
      </AnimatePresence>
    </div>
  );
}
