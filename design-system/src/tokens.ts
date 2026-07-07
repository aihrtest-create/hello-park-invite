// ─── Hello Park · DR Constructor — Design Tokens ──────────────────────────
// Single source of truth for all design values used across projects.

export const colors = {
  // Brand
  orange:        "#FF6022",  // primary CTA
  orangeBright:  "#FF8A1C",  // softer accent
  orangeDeep:    "#FF5000",  // gilroy brand color
  yellowSun:     "#FFB81C",  // "Базовый" pill / yellow accents
  pinkHit:       "#FF5C8A",  // "Премиум · ХИТ ПРОДАЖ" pill
  purpleDeep:    "#5B2EBE",  // main heading / "Эксклюзив"
  purpleSoft:    "#A48BF5",  // soft gradient
  lavender:      "#E9DEFF",  // soft card background
  lavenderDeep:  "#C9B6FF",  // accent fills / selected borders
  cream:         "#FFF7E5",  // page warm tint
  greenTag:      "#7DEAA0",  // "Хит!" / "Топ!" tag bg
  greenTagText:  "#0E5C2D",  // "Хит!" / "Топ!" tag text

  // Surfaces
  bg:            "#F7F7F7",  // page background
  bgWhite:       "#FFFFFF",  // card background
  bgWarm:        "#FFF5E0",  // hero warm background
  bgPurple:      "#3F1E94",  // dark "park razvlecheniy" background
  bgMuted:       "#F5F5F5",  // muted/secondary background

  // Ink
  ink:           "#1A1A1A",  // primary text
  inkSoft:       "#5C5170",  // secondary text
  inkMuted:      "#8E889E",  // placeholder / tertiary
  inkFaint:      "#747474",  // muted-foreground

  // Semantic
  border:        "#E5E5E5",
  borderLight:   "#EFEAFA",  // card borders
  destructive:   "#D4183D",
  primary:       "#FF6022",  // alias
  accent:        "#6C4AED",  // legacy accent

  // Envelope / invitation
  envelopeBase:  "#FF5C1A",
  envelopeFlap:  "#FF7433",
} as const;

export const packageTints = {
  basic:     { fill: "#FFE9A8", ink: "#7A4A00", chip: colors.yellowSun },
  premium:   { fill: "#FFD3DF", ink: "#7A0F2A", chip: colors.pinkHit },
  exclusive: { fill: "#E1D2FF", ink: "#3D1F8C", chip: colors.purpleDeep },
  individual:{ fill: "#F1ECFF", ink: colors.purpleDeep, chip: colors.purpleSoft },
} as const;

export const shadows = {
  card:    "0 8px 24px rgba(91, 46, 190, 0.10)",
  soft:    "0 4px 16px rgba(0,0,0,0.06)",
  cta:     "0 12px 28px rgba(255, 96, 34, 0.32)",
  ctaPurp: "0 12px 28px rgba(91, 46, 190, 0.35)",
  item:    "0 2px 8px rgba(0,0,0,0.10)",
  bubble:  "0 4px 0 rgba(0,0,0,0.05)",
} as const;

export const radius = {
  sm:   "6px",   // calc(var(--radius) - 4px)
  md:   "8px",   // calc(var(--radius) - 2px)
  lg:   "10px",  // var(--radius)
  xl:   "14px",  // calc(var(--radius) + 4px)
  full: "9999px",
  card: "16px",  // rounded-2xl
  hero: "20px",  // invitation card
} as const;

export const fonts = {
  primary: "'Gilroy', 'Nunito', sans-serif",
  weight: {
    normal:    400,
    medium:    600,
    bold:      700,
    extrabold: 800,
  },
} as const;

export const animation = {
  spring: { type: "spring", damping: 24, stiffness: 280 },
  shake:  "dynamic-shake 0.6s cubic-bezier(.36,.07,.19,.97) both",
  float:  "float 4s ease-in-out infinite",
} as const;

// Convenience alias — legacy v3 shape (for backward compat)
export const v3 = {
  orange:       colors.orange,
  orangeBright: colors.orangeBright,
  yellowSun:    colors.yellowSun,
  pinkHit:      colors.pinkHit,
  purpleDeep:   colors.purpleDeep,
  purpleSoft:   colors.purpleSoft,
  lavender:     colors.lavender,
  lavenderDeep: colors.lavenderDeep,
  cream:        colors.cream,
  greenTag:     colors.greenTag,
  greenTagText: colors.greenTagText,
  bg:           colors.bgWhite,
  bgWarm:       colors.bgWarm,
  bgPurple:     colors.bgPurple,
  ink:          colors.ink,
  inkSoft:      colors.inkSoft,
  inkMuted:     colors.inkMuted,
  shadow:       shadows.card,
  shadowSoft:   shadows.soft,
  shadowCta:    shadows.cta,
} as const;
