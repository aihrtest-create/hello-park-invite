import React from "react";
import { cn } from "../utils/cn";
import { colors } from "../tokens";

interface PillProps {
  children: React.ReactNode;
  bg?: string;
  color?: string;
  className?: string;
  variant?: "hit" | "top" | "included" | "premium" | "exclusive" | "basic";
}

const PILL_VARIANTS: Record<NonNullable<PillProps["variant"]>, { bg: string; color: string }> = {
  hit:       { bg: colors.greenTag,    color: colors.greenTagText },
  top:       { bg: "#7DD3FC",          color: "#0C4A6E" },
  included:  { bg: "#D1FAE5",          color: "#065F46" },
  basic:     { bg: "#FFE9A8",          color: "#7A4A00" },
  premium:   { bg: colors.pinkHit,     color: "#ffffff" },
  exclusive: { bg: colors.lavenderDeep,color: colors.purpleDeep },
};

export function Pill({ children, bg, color, className, variant }: PillProps) {
  const resolved = variant ? PILL_VARIANTS[variant] : null;
  const bgColor  = bg    ?? resolved?.bg    ?? colors.greenTag;
  const txtColor = color ?? resolved?.color ?? colors.greenTagText;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide",
        className,
      )}
      style={{ background: bgColor, color: txtColor }}
    >
      {children}
    </span>
  );
}
