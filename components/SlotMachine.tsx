"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

const SYMBOLS = ["7", "♠", "♦", "★", "♣"];
const SYMBOL_SIZE = 56;
const REEL_DURATIONS = [1.2, 1.6, 2.0];
const WIN_PROBABILITY = 0.1;
const INITIAL_DISPLAY = ["7", "♦", "★"];

function generateStrip(targetIndex: number, length: number): string[] {
  const strip: string[] = [];
  for (let i = 0; i < length; i++) {
    strip.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
  }
  strip.push(SYMBOLS[targetIndex]);
  return strip;
}

function getTargets(): [number, number, number] {
  if (Math.random() < WIN_PROBABILITY) return [0, 0, 0];
  let t: [number, number, number];
  do {
    t = [
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
      Math.floor(Math.random() * SYMBOLS.length),
    ];
  } while (t[0] === 0 && t[1] === 0 && t[2] === 0);
  return t;
}

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AC();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  lever() {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain).connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(150, t);
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    osc.start(t);
    osc.stop(t + 0.1);
  }

  tick() {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain).connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(600 + Math.random() * 400, t);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  stop() {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain).connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.setValueAtTime(200, t);
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  win() {
    const ctx = this.getCtx();
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain).connect(ctx.destination);
      osc.type = "sine";
      const start = t + i * 0.15;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, t);
      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  }
}

interface Props {
  onClose: () => void;
}

export default function SlotMachine({ onClose }: Props) {
  const [phase, setPhase] = useState<"idle" | "spinning" | "result">("idle");
  const [strips, setStrips] = useState<string[][]>([["7"], ["7"], ["7"]]);
  const [targets, setTargets] = useState<number[]>([0, 0, 0]);
  const [spinKey, setSpinKey] = useState(0);
  const [isWin, setIsWin] = useState(false);

  const soundRef = useRef<SoundEngine | null>(null);
  const leverControls = useAnimation();

  useEffect(() => {
    soundRef.current = new SoundEngine();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Decelerating tick sounds
  useEffect(() => {
    if (phase !== "spinning") return;
    let active = true;
    const maxMs = REEL_DURATIONS[2] * 1000;
    const start = Date.now();

    const tick = () => {
      if (!active) return;
      const elapsed = Date.now() - start;
      if (elapsed >= maxMs) return;
      soundRef.current?.tick();
      const progress = elapsed / maxMs;
      setTimeout(tick, 60 + progress * 200);
    };
    tick();

    return () => {
      active = false;
    };
  }, [phase, spinKey]);

  // Stop sounds + phase transition
  useEffect(() => {
    if (phase !== "spinning") return;

    const timeouts = REEL_DURATIONS.map((d) =>
      setTimeout(() => soundRef.current?.stop(), d * 1000)
    );

    const finalTimeout = setTimeout(() => {
      setPhase("result");
    }, REEL_DURATIONS[2] * 1000 + 200);

    return () => {
      timeouts.forEach(clearTimeout);
      clearTimeout(finalTimeout);
    };
  }, [phase, spinKey]);

  // Win effects
  useEffect(() => {
    if (phase !== "result" || !isWin) return;

    soundRef.current?.win();

    import("canvas-confetti").then(({ default: confetti }) => {
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.3 } });
      setTimeout(
        () =>
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.4, x: 0.3 },
          }),
        200
      );
      setTimeout(
        () =>
          confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.4, x: 0.7 },
          }),
        400
      );
    });
  }, [phase, isWin]);

  const handleSpin = useCallback(() => {
    if (phase === "spinning") return;

    const newTargets = getTargets();
    const win = newTargets.every((t) => t === 0);

    setTargets(newTargets);
    setIsWin(win);
    setStrips(newTargets.map((t, i) => generateStrip(t, 18 + i * 5)));
    setSpinKey((k) => k + 1);
    setPhase("spinning");

    soundRef.current?.lever();

    leverControls
      .start({ y: 30, transition: { duration: 0.15, ease: "easeIn" } })
      .then(() =>
        leverControls.start({
          y: 0,
          transition: { duration: 0.3, type: "spring", stiffness: 300 },
        })
      );
  }, [phase, leverControls]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: -10 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="absolute left-0 top-full z-50 mt-3 flex items-start gap-1"
    >
      {/* Machine body */}
      <div className="rounded-xl border-2 border-foreground/80 bg-background px-3 py-3 shadow-lg">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative h-14 w-12 overflow-hidden rounded-md border border-foreground/20 bg-foreground/[0.03]"
            >
              {phase === "idle" && spinKey === 0 ? (
                <div className="flex h-14 w-12 items-center justify-center font-mono text-2xl font-bold text-foreground">
                  {INITIAL_DISPLAY[i]}
                </div>
              ) : (
                <ReelStrip
                  key={`${spinKey}-${i}`}
                  strip={strips[i]}
                  duration={REEL_DURATIONS[i]}
                  highlight={phase === "result" && isWin}
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-background to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2 bg-gradient-to-t from-background to-transparent" />
            </div>
          ))}
        </div>

        <AnimatePresence>
          {phase === "result" && isWin && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [1, 1.1, 1],
              }}
              exit={{ opacity: 0 }}
              transition={{
                scale: { repeat: Infinity, duration: 0.6 },
              }}
              className="mt-2 text-center font-mono text-xs font-bold tracking-wider text-accent-green"
            >
              JACKPOT !
            </motion.p>
          )}
          {phase === "result" && !isWin && (
            <motion.p
              key="try-again"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-center font-mono text-xs text-foreground/40"
            >
              Encore ?
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Lever */}
      <div className="flex flex-col items-center pt-1">
        <motion.button
          animate={leverControls}
          onClick={handleSpin}
          disabled={phase === "spinning"}
          className="flex cursor-pointer flex-col items-center disabled:cursor-not-allowed disabled:opacity-50"
          whileHover={phase !== "spinning" ? { scale: 1.1 } : {}}
          aria-label="Tirer le levier"
        >
          <div className="h-4 w-4 rounded-full border-2 border-foreground bg-accent-green shadow-sm" />
          <div className="h-8 w-0.5 bg-foreground" />
        </motion.button>
        <div className="h-1 w-4 rounded-full bg-foreground" />
      </div>
    </motion.div>
  );
}

function ReelStrip({
  strip,
  duration,
  highlight,
}: {
  strip: string[];
  duration: number;
  highlight: boolean;
}) {
  const targetY = -(strip.length - 1) * SYMBOL_SIZE;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: targetY }}
      transition={{ duration, ease: [0.12, 0.8, 0.2, 1] }}
      className="flex flex-col"
    >
      {strip.map((symbol, i) => (
        <div
          key={i}
          className={`flex h-14 w-12 items-center justify-center font-mono text-2xl font-bold select-none ${
            i === strip.length - 1 && highlight
              ? "text-accent-green"
              : "text-foreground"
          }`}
        >
          {symbol}
        </div>
      ))}
    </motion.div>
  );
}
