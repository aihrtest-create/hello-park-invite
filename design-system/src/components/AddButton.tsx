import React from "react";
import { Minus, Plus } from "lucide-react";
import { colors } from "../tokens";

interface AddButtonProps {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: number;
}

export function AddButton({ active, onClick, size = 36 }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className="rounded-full flex items-center justify-center font-bold transition-all active:scale-90"
      style={{
        width: size,
        height: size,
        background: active ? colors.purpleDeep : "white",
        color:      active ? "white" : colors.purpleDeep,
        boxShadow:  active
          ? "0 4px 14px rgba(91, 46, 190, 0.35)"
          : "0 2px 8px rgba(0,0,0,0.10)",
        border: active ? "none" : "1.5px solid #E5DCF5",
      }}
      aria-label={active ? "Убрать" : "Добавить"}
    >
      {active
        ? <Minus className="w-4 h-4" strokeWidth={3} />
        : <Plus  className="w-4 h-4" strokeWidth={3} />}
    </button>
  );
}
