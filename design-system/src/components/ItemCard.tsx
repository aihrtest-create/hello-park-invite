import React from "react";
import { Check } from "lucide-react";
import { colors } from "../tokens";
import { AddButton } from "./AddButton";
import { Pill } from "./Pill";
import { formatPrice } from "../utils/formatPrice";

export interface ItemCardProps {
  title: string;
  description?: string;
  imageSrc?: string;
  emoji?: string;
  price: number;
  priceLabel?: string;
  meta?: string;
  badge?: "hit" | "top" | "included";
  selected: boolean;
  onToggle: () => void;
  variant?: "row" | "tile";
  disabled?: boolean;
}

export function ItemCard({
  title,
  description,
  imageSrc,
  emoji,
  price,
  priceLabel,
  meta,
  badge,
  selected,
  onToggle,
  variant = "row",
  disabled,
}: ItemCardProps) {
  if (variant === "tile") {
    return (
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="text-left rounded-2xl overflow-hidden relative active:scale-[0.98] transition-transform disabled:opacity-50"
        style={{
          background: selected ? colors.lavender : "white",
          border: `1.5px solid ${selected ? colors.lavenderDeep : "#EFEAFA"}`,
        }}
      >
        <div
          className="relative aspect-square overflow-hidden flex items-center justify-center"
          style={{ background: "#F5F0FF" }}
        >
          {imageSrc ? (
            <img src={imageSrc} alt={title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <span className="text-5xl">{emoji}</span>
          )}
          {badge === "hit" && (
            <span className="absolute top-2 left-2">
              <Pill variant="hit">Хит!</Pill>
            </span>
          )}
          {badge === "top" && (
            <span className="absolute top-2 left-2">
              <Pill variant="top">Топ!</Pill>
            </span>
          )}
          {selected && (
            <span
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: colors.purpleDeep }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </span>
          )}
        </div>
        <div className="p-3">
          <div
            className="text-[13.5px] font-bold leading-tight line-clamp-2"
            style={{ color: colors.ink }}
          >
            {title}
          </div>
          <div className="mt-1.5 text-[12px] font-extrabold" style={{ color: colors.purpleDeep }}>
            {priceLabel ?? formatPrice(price)}
          </div>
        </div>
      </button>
    );
  }

  return (
    <div
      className="rounded-2xl flex items-stretch gap-3 p-2.5 transition-all"
      style={{
        background: selected ? colors.lavender : "white",
        border:     `1.5px solid ${selected ? colors.lavenderDeep : "#EFEAFA"}`,
        opacity:    disabled ? 0.6 : 1,
      }}
    >
      {/* Thumb */}
      <div
        className="w-[78px] h-[78px] rounded-xl shrink-0 flex items-center justify-center overflow-hidden"
        style={{ background: "#F5F0FF" }}
      >
        {imageSrc ? (
          <img src={imageSrc} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-3xl">{emoji}</span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0 flex flex-col py-0.5">
        <div className="flex items-start gap-1.5">
          <h4
            className="text-[14.5px] font-bold leading-tight flex-1 min-w-0"
            style={{ color: colors.ink }}
          >
            {title}
          </h4>
          {badge === "hit" && <Pill variant="hit">Хит</Pill>}
          {badge === "top" && <Pill variant="top">Топ</Pill>}
        </div>
        {description && (
          <p className="text-[12px] mt-1 leading-snug line-clamp-2" style={{ color: colors.inkSoft }}>
            {description}
          </p>
        )}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 min-w-0">
            <span
              className="text-[14px] font-extrabold whitespace-nowrap"
              style={{ color: badge === "included" ? colors.greenTagText : colors.purpleDeep }}
            >
              {priceLabel ?? (price > 0 ? formatPrice(price) : "Включено")}
            </span>
            {meta && (
              <span className="text-[11px] font-medium truncate" style={{ color: colors.inkSoft }}>
                · {meta}
              </span>
            )}
          </div>
          <AddButton active={selected} onClick={onToggle} />
        </div>
      </div>
    </div>
  );
}
