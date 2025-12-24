"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type RetroBootLoaderProps = {
  children: React.ReactNode;
  audioSrc?: string;
  completeGifSrc?: string;
  barSeconds?: number;
  switchSeconds?: number;
  totalSeconds?: number;
  segments?: number;
  lockScroll?: boolean;
  mountChildrenAfterDone?: boolean;
};

export default function RetroBootLoader({
  children,
  audioSrc = "/assets/boot.mp3",
  completeGifSrc = "/assets/loading_complete.gif",
  barSeconds = 5,
  switchSeconds = 6,
  totalSeconds = 15,
  segments = 10,
  lockScroll = true,
  mountChildrenAfterDone = true,
}: RetroBootLoaderProps) {
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [exiting, setExiting] = useState(false);

  const [systemOpen, setSystemOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedRef = useRef(false);
  const elapsedRef = useRef(0);

  const phase = elapsed >= switchSeconds ? "dove" : "desktop";

  const progress = useMemo(() => {
    if (!systemOpen) return 0;
    if (phase !== "desktop") return 1;
    const p = elapsed / barSeconds;
    return Math.max(0, Math.min(1, p));
  }, [elapsed, barSeconds, phase, systemOpen]);

  const filledSegments = useMemo(() => Math.floor(progress * segments), [progress, segments]);

  const stopLoop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const finish = () => {
    setExiting(true);
    stopLoop();
    window.setTimeout(() => setDone(true), 350);
  };

  const start = async () => {
    if (startedRef.current) {
      if (audioRef.current && audioRef.current.paused) {
        try {
          await audioRef.current.play();
        } catch {}
      }
      return;
    }

    startedRef.current = true;

    const audio = new Audio(audioSrc);
    audio.preload = "auto";
    audio.volume = 0.1;
    audioRef.current = audio;

    try {
      await audio.play();
    } catch {
    }

    const loop = () => {
      const a = audioRef.current;

      const next =
        a && !Number.isNaN(a.currentTime) && a.currentTime > 0
          ? a.currentTime
          : elapsedRef.current + 1 / 60;

      const clamped = Math.min(next, totalSeconds);

      elapsedRef.current = clamped;
      setElapsed(clamped);

      if (clamped >= totalSeconds) {
        finish();
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
  };

  const openSystemAndStart = () => {
    if (done) return;
    setSystemOpen(true);
    start();
  };

  useEffect(() => {
    let prevOverflow = "";
    if (lockScroll) {
      prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }

    return () => {
      stopLoop();

      const a = audioRef.current;
      if (a) {
        try {
          a.pause();
          a.src = "";
        } catch {}
      }
      audioRef.current = null;

      if (lockScroll) document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!done) return;
    if (!lockScroll) return;
    document.body.style.overflow = "";
  }, [done, lockScroll]);

  if (mountChildrenAfterDone) {
    return (
      <>
        {!done && (
          <Overlay
            systemOpen={systemOpen}
            phase={phase}
            filledSegments={filledSegments}
            segments={segments}
            elapsed={elapsed}
            switchSeconds={switchSeconds}
            totalSeconds={totalSeconds}
            doveGifSrc={completeGifSrc}
            exiting={exiting}
            onOpenSystem={openSystemAndStart}
          />
        )}
        {done ? children : null}
      </>
    );
  }

  return (
    <>
      <div style={{ opacity: done ? 1 : 0, pointerEvents: done ? "auto" : "none" }}>{children}</div>
      {!done && (
        <Overlay
          systemOpen={systemOpen}
          phase={phase}
          filledSegments={filledSegments}
          segments={segments}
          elapsed={elapsed}
          switchSeconds={switchSeconds}
          totalSeconds={totalSeconds}
          doveGifSrc={completeGifSrc}
          exiting={exiting}
          onOpenSystem={openSystemAndStart}
        />
      )}
    </>
  );
}

function Overlay({
  systemOpen,
  phase,
  filledSegments,
  segments,
  elapsed,
  switchSeconds,
  totalSeconds,
  doveGifSrc,
  exiting,
  onOpenSystem,
}: {
  systemOpen: boolean;
  phase: "desktop" | "dove";
  filledSegments: number;
  segments: number;
  elapsed: number;
  switchSeconds: number;
  totalSeconds: number;
  doveGifSrc: string;
  exiting: boolean;
  onOpenSystem: () => void;
}) {
  const iconLabel = "noirediego";

  const [selected, setSelected] = useState(false);
  const lastClickAtRef = useRef<number>(0);
  const clearSelectTimerRef = useRef<number | null>(null);

  const DOUBLE_CLICK_MS = 320;

  const clearSelectSoon = () => {
    if (clearSelectTimerRef.current) window.clearTimeout(clearSelectTimerRef.current);
    clearSelectTimerRef.current = window.setTimeout(() => setSelected(false), 1600);
  };

  const handleIconClick = () => {
    const now = Date.now();
    const delta = now - lastClickAtRef.current;
    lastClickAtRef.current = now;

    setSelected(true);
    clearSelectSoon();

    if (delta > 0 && delta < DOUBLE_CLICK_MS) {
      if (!systemOpen) onOpenSystem();
    }
  };

  const handleDesktopMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest("[data-desktop-icon='1']")) return;
    setSelected(false);
  };

  useEffect(() => {
    return () => {
      if (clearSelectTimerRef.current) window.clearTimeout(clearSelectTimerRef.current);
    };
  }, []);

  const doveOpacity = useMemo(() => {
    if (phase !== "dove") return 0;

    const fadeIn = 5;
    const fadeOut = 5;

    if (elapsed < switchSeconds + fadeIn) {
      return Math.max(0, Math.min(1, (elapsed - switchSeconds) / fadeIn));
    }

    if (elapsed > totalSeconds - fadeOut) {
      return Math.max(0, Math.min(1, (totalSeconds - elapsed) / fadeOut));
    }

    return 1;
  }, [elapsed, phase, switchSeconds, totalSeconds]);

  const doveScale = useMemo(() => {
    return 0.98 + doveOpacity * 0.02;
  }, [doveOpacity]);

  return (
    <div
      onMouseDown={handleDesktopMouseDown}
      className={[
        "fixed inset-0 z-[9999]",
        "transition-opacity duration-300",
        exiting ? "opacity-0" : "opacity-100",
      ].join(" ")}
      style={{
        background:
          phase === "dove"
            ? "#000000"
            : "linear-gradient(180deg, #1a6a6a 0%, #0f5b5b 100%)",
      }}
    >
      {phase === "dove" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="relative w-[280px] h-[160px] md:w-[360px] md:h-[200px]"
            style={{
              opacity: doveOpacity,
              transform: `scale(${doveScale})`,
              transition: "opacity 120ms linear, transform 120ms linear",
              imageRendering: "pixelated" as any,
            }}
          >
            <Image src={doveGifSrc} alt="dove" fill className="object-contain" unoptimized />
          </div>
        </div>
      )}

      {phase === "desktop" && (
        <>
          <div
            className="absolute left-6 top-6 flex flex-col items-center gap-2 select-none"
            data-desktop-icon="1"
          >
            <button
              type="button"
              onClick={handleIconClick}
              className="w-16 h-16 grid place-items-center"
              aria-label="Desktop icon"
              style={{
                outline: selected ? "1px dotted rgba(255,255,255,0.9)" : "none",
                outlineOffset: 2,
              }}
            >
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/desktop_icon.svg"
                  alt="Desktop Icon"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </button>

            <button
              type="button"
              onClick={handleIconClick}
              className="text-[12px] px-1"
              style={{
                fontFamily: "Tahoma, Arial, sans-serif",
                maxWidth: 90,
                color: "#ffffff",
                background: selected ? "#0000aa" : "transparent",
                boxShadow: selected ? "0 0 0 1px rgba(0,0,0,0.15)" : "none",
                textShadow: selected ? "none" : "0 1px 0 rgba(0,0,0,0.75)",
                lineHeight: "14px",
              }}
            >
              {iconLabel}
            </button>

            {!systemOpen && (
              <div
                className="mt-1 px-2 py-1 text-[11px] text-black bg-[#ffffe1]"
                style={{
                  fontFamily: "Tahoma, Arial, sans-serif",
                  boxShadow:
                    "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #000000, inset 2px 2px 0 #dfdfdf, inset -2px -2px 0 #808080",
                }}
              >
                double-click dont be shy
              </div>
            )}
          </div>

          {systemOpen && (
            <div className="absolute inset-0 flex items-center justify-center px-4">
              <div
                className="w-[92vw] max-w-[520px] bg-[#c0c0c0] p-1"
                style={{
                  boxShadow:
                    "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #000000, inset 2px 2px 0 #dfdfdf, inset -2px -2px 0 #808080",
                }}
              >
                {/* title bar */}
                <div
                  className="flex items-center justify-between px-2 py-1 mb-3"
                  style={{
                    background:
                      "linear-gradient(90deg, #000000 0%, #000000 17%, #00137f 67%, #00137f 100%)",
                    boxShadow: "inset 1px 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <span
                    className="text-white text-[12px] tracking-wide"
                    style={{
                      fontFamily: "Tahoma, Arial, sans-serif",
                      textShadow: "0 1px 0 rgba(0,0,0,0.85)",
                    }}
                  >
                    SYSTEM
                  </span>

                  <div className="flex gap-1">
                    <div
                      className="w-3 h-3 bg-[#c0c0c0]"
                      style={{ boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #000" }}
                    />
                    <div
                      className="w-3 h-3 bg-[#c0c0c0]"
                      style={{ boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #000" }}
                    />
                    <div
                      className="w-3 h-3 bg-[#c0c0c0]"
                      style={{ boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #000" }}
                    />
                  </div>
                </div>

                <div className="px-2 pb-2" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
                  <div className="text-[12px] text-black mb-2">LOADING</div>
                  <ProgressBar filled={filledSegments} total={segments} />
                </div>
              </div>
            </div>
          )}

          <div
            className="absolute left-0 right-0 bottom-0 h-12 bg-[#c0c0c0] px-2 flex items-center gap-2"
            style={{
              boxShadow: "inset 0 1px 0 #ffffff, inset 0 -1px 0 #000000",
            }}
          >
            <button
              type="button"
              className="h-8 px-3 text-[12px] text-black bg-[#c0c0c0] flex items-center gap-2"
              style={{
                fontFamily: "Tahoma, Arial, sans-serif",
                boxShadow:
                  "inset 1px 1px 0 #ffffff, inset -1px -1px 0 #000000, inset 2px 2px 0 #dfdfdf, inset -2px -2px 0 #808080",
              }}
            >
              <span className="inline-block w-3 h-3 bg-[#00137f]" />
              Start
            </button>

            <div className="h-8 w-[2px]" style={{ background: "#808080", boxShadow: "1px 0 0 #ffffff" }} />

            <div
              className="h-8 flex-1 px-2 flex items-center text-[12px] text-black"
              style={{
                fontFamily: "Tahoma, Arial, sans-serif",
                boxShadow: "inset 1px 1px 0 #000000, inset -1px -1px 0 #ffffff",
                background: "#bdbdbd",
              }}
            >
              {systemOpen ? "SYSTEM" : "Desktop"}
            </div>

            <div
              className="h-8 px-2 flex items-center text-[12px] text-black"
              style={{
                fontFamily: "Tahoma, Arial, sans-serif",
                boxShadow: "inset 1px 1px 0 #000000, inset -1px -1px 0 #ffffff",
                background: "#bdbdbd",
              }}
            >
              12:00
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ProgressBar({ filled, total }: { filled: number; total: number }) {
  return (
    <div
      className="w-full h-6 bg-[#c0c0c0] p-1"
      style={{
        boxShadow: "inset 1px 1px 0 #000000, inset -1px -1px 0 #ffffff",
      }}
    >
      <div className="w-full h-full flex gap-[3px]">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-full"
            style={{
              background: i < filled ? "#0000aa" : "transparent",
              border: i < filled ? "1px solid rgba(0,0,0,0.15)" : "1px solid transparent",
            }}
          />
        ))}
      </div>
    </div>
  );
}
