import React from "react";
import { Minus, Plus } from "lucide-react";
import { colors } from "../tokens";

interface StepperProps {
  value: number;
  onDec: () => void;
  onInc: () => void;
  min?: number;
  max?: number;
  bg?: string;
  ink?: string;
}

export function Stepper({
  value,
  onDec,
  onInc,
  min,
  max,
  bg   = colors.lavender,
  ink  = colors.purpleDeep,
}: StepperProps) {
  const decDisabled = min !== undefined && value <= min;
  const incDisabled = max !== undefined && value >= max;

  return (
    <div
      className="inline-flex items-center rounded-full p-1 select-none"
      style={{ background: bg }}
    >
      <button
        type="button"
        onClick={onDec}
        disabled={decDisabled}
        className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform"
        style={{ color: ink }}
      >
        <Minus className="w-4 h-4" strokeWidth={3} />
      </button>
      <span
        className="min-w-10 text-center text-sm font-bold tabular-nums"
        style={{ color: ink }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onInc}
        disabled={incDisabled}
        className="w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-30 active:scale-95 transition-transform"
        style={{ color: ink }}
      >
        <Plus className="w-4 h-4" strokeWidth={3} />
      </button>
    </div>
  );
}
