"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type Sticker = {
  src: string;
  alt: string;
  className: string;
  strength?: number;
};

export default function StickersLayer() {

  const stickers: Sticker[] = useMemo(
    () => [
      {
        src: "/assets/oska.gif",
        alt: "Sticker 1",
        className:
          "left-[-18px] sm:left-[-26px] " +
          "top-[60px] sm:top-[60px] " +
          "md:top-[-22px] md:left-[-26px] " +
          "w-[78px] sm:w-[92px] md:w-[110px] lg:w-[130px] " +
          "rotate-[-10deg]",
        strength: 1.0,
      },
      {
        src: "/assets/ner3uk.gif",
        alt: "Sticker 2",
        className:
          "right-[-16px] sm:right-[-22px] " +
          "top-[70px] sm:top-[70px] " +
          "md:top-[10px] md:right-[-22px] " +
          "w-[70px] sm:w-[86px] md:w-[102px] lg:w-[120px] " +
          "rotate-[12deg]",
        strength: 0.8,
      },
      {
        src: "/assets/shadow.jpg",
        alt: "Sticker 3",
        className:
          "left-[-14px] sm:left-[-22px] " +
          "bottom-[-18px] sm:bottom-[-24px] " +
          "w-[88px] sm:w-[104px] md:w-[122px] lg:w-[144px] " +
          "rotate-[6deg]",
        strength: 1.15,
      },
    ],
    []
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      {stickers.map((s, i) => {
        const k = s.strength ?? 1;

        return (
          <div
            key={i}
            className={`absolute select-none ${s.className}`}
            aria-hidden="true"
          >
            <Image
              src={s.src}
              alt={s.alt}
              width={220}
              height={220}
              className="h-auto w-full"
              sizes="(max-width: 640px) 100px, (max-width: 1024px) 130px, 160px"
              priority={false}
            />
          </div>
        );
      })}
    </div>
  );
}
