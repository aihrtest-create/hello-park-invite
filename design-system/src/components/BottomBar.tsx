import React from "react";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { colors, shadows } from "../tokens";
import { formatPrice } from "../utils/formatPrice";

interface BottomBarProps {
  label: string;
  price?: number;
  caption?: string;
  disabled?: boolean;
  onClick: () => void;
  variant?: "primary" | "purple";
}

export function BottomBar({
  label,
  price,
  caption,
  disabled,
  onClick,
  variant = "primary",
}: BottomBarProps) {
  const bg     = variant === "purple" ? colors.purpleDeep : colors.orange;
  const shadow = variant === "purple" ? shadows.ctaPurp   : shadows.cta;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: "spring", damping: 24, stiffness: 280 }}
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none"
    >
      <div className="max-w-lg mx-auto px-4 pb-4 pt-2 pointer-events-auto">
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className="w-full rounded-full text-white flex items-center justify-between pl-6 pr-2 py-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          style={{ background: bg, boxShadow: disabled ? "none" : shadow, minHeight: 60 }}
        >
          <span className="flex flex-col items-start gap-0.5 leading-none">
            <span className="text-[16px] font-extrabold">{label}</span>
            {caption && (
              <span className="text-[11px] opacity-80 font-medium">{caption}</span>
            )}
          </span>
          <span className="flex items-center gap-2">
            {price !== undefined && price > 0 && (
              <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-[14px] font-extrabold tabular-nums">
                {formatPrice(price)}
              </span>
            )}
            <span
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <ChevronRight className="w-5 h-5" strokeWidth={3} />
            </span>
          </span>
        </button>
      </div>
    </motion.div>
  );
}
