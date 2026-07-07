import React from "react";
import { colors } from "../tokens";

interface SectionTitleProps {
  children: React.ReactNode;
  caption?: string;
  id?: string;
}

export function SectionTitle({ children, caption, id }: SectionTitleProps) {
  return (
    <div id={id} className="px-5 pt-6 pb-3 scroll-mt-24">
      <h2
        className="text-[22px] font-extrabold leading-tight"
        style={{ color: colors.purpleDeep }}
      >
        {children}
      </h2>
      {caption && (
        <p className="text-[13px] mt-1" style={{ color: colors.inkSoft }}>
          {caption}
        </p>
      )}
    </div>
  );
}
