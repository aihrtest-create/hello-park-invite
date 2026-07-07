import { useRef, useState, useEffect } from "react";
import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { MEGA_ROOM_DETAILS } from "../data/megaConfig";

/* ─── Package Data ─── */
const PACKAGES = [
  {
    id: "basic" as const,
    name: "Базовый",
    emoji: "✨",
    nameColor: "#ef5299",
    borderColor: "#ef5299",
    duration: "2,5 часа",
    weekdayOnly: true,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Пати-рум — 2,5 часа",
      "Квест на выбор — 60 мин.",
      "Мини-дискотека — 15 мин.",
      "Оформление шарами — 8 шт.",
      "WOW-поздравление Лиса Рокки",
      "Подарок имениннику",
      "Электронные пригласительные",
      "Торжественный вынос торта",
    ],
    weekdayPrice: 24900,
    weekendPrice: null,
    oldPrice: 32900,
  },
  {
    id: "premium" as const,
    name: "Премиум",
    emoji: "🎉",
    nameColor: "#ff7f00",
    borderColor: "#ff7f00",
    duration: "3 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Пати-рум — 3 часа",
      "Квест на выбор — 60 мин.",
      "Мастер-класс на выбор — 30 мин.",
      "Дискотека или треш-коробка — 20 мин.",
      "Оформление: шары + фонтан",
      "WOW-поздравление Лиса Рокки",
      "Шар-сюрприз",
      "Подарки всем гостям",
      "Детские обеды",
      "Подарок имениннику",
      "Электронные пригласительные",
      "Торжественный вынос торта",
    ],
    weekdayPrice: 47900,
    weekendPrice: 57900,
    oldPrice: 63990,
  },
  {
    id: "exclusive" as const,
    name: "Эксклюзив",
    emoji: "👑",
    nameColor: "#5b21cc",
    borderColor: "#5b21cc",
    duration: "4 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Пати-рум — 4 часа",
      "Квест на выбор — 60 мин.",
      "Мастер-класс на выбор — 30 мин.",
      "Дискотека или треш-коробка — 20 мин.",
      "Шоу-программа на выбор — 30 мин.",
      "Фотограф — 2 часа",
      "Оформление: шары + 2 фонтана",
      "WOW-поздравление Лиса Рокки",
      "Шар-сюрприз или Пиньята",
      "Шар-цифра",
      "Подарки всем гостям",
      "Детские обеды",
      "Подарок имениннику",
      "Электронные пригласительные",
      "Торжественный вынос торта",
    ],
    weekdayPrice: 79900,
    weekendPrice: 89900,
    oldPrice: 105990,
  }
];

const MEGA_PACKAGES = [
  {
    id: "basic" as const,
    name: "Базовый",
    emoji: "✨",
    nameColor: "#ef5299",
    borderColor: "#ef5299",
    duration: "2,5 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Фиджитал Патирум — 2,5 часа",
      "Фиджитал квест или Герой — 40 мин.",
      "Мини-дискотека — 15 мин.",
      "Оформление: шары + сервировка",
      "WOW-поздравление Лиса Рокки",
      "Вынос тортика аниматором",
      "Пригласительные для гостей",
      "Подарок имениннику",
    ],
    weekdayPrice: 24900,
    weekendPrice: 34900,
    oldPrice: null,
  },
  {
    id: "premium" as const,
    name: "Премиум",
    emoji: "🎉",
    nameColor: "#ff7f00",
    borderColor: "#ff7f00",
    duration: "2,5 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Фиджитал Патирум — 2,5 часа",
      "Фиджитал квест или Герой — на выбор",
      "Мастер-класс на выбор — 30 мин.",
      "Треш-коробка или дискотека — 20 мин.",
      "Оформление: шары + сервировка",
      "WOW-поздравление Лиса Рокки",
      "Шар-сюрприз с наполнением",
      "Подарки всем гостям",
      "Вынос тортика аниматором",
      "Пригласительные для гостей",
      "Супер-подарок имениннику",
    ],
    weekdayPrice: 39900,
    weekendPrice: 49900,
    oldPrice: null,
  },
  {
    id: "exclusive" as const,
    name: "Эксклюзив",
    emoji: "👑",
    nameColor: "#5b21cc",
    borderColor: "#5b21cc",
    duration: "3 часа",
    weekdayOnly: false,
    features: [
      "Безлимитные билеты — 8 шт.",
      "Фиджитал Патирум — 3 часа",
      "Фиджитал квест или Герой — на выбор",
      "Шоу-программа на выбор — 30 мин.",
      "Мастер-класс на выбор — 30 мин.",
      "Треш-коробка или дискотека — 20 мин.",
      "Оформление: шары + сервировка",
      "WOW-поздравление Лиса Рокки",
      "Шар-сюрприз или Пиньята",
      "Подарки всем гостям",
      "Вынос тортика аниматором",
      "Пригласительные для гостей",
      "Супер-подарок имениннику",
    ],
    weekdayPrice: 65900,
    weekendPrice: 69900,
    oldPrice: null,
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("ru-RU");
}

export function Step1Format() {
  const { state, updateState } = useWizard();
  const packages = MEGA_PACKAGES;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const allCards = [
    ...packages,
    {
      id: "custom" as const,
      name: "Собери сам",
      emoji: "🧩",
      nameColor: "#ff6022",
      borderColor: "#ff6022",
      duration: "Любое",
      weekdayOnly: false,
      features: [
        "Любой квест на ваш выбор",
        "Любые герои и аниматоры",
        "Только нужные вам опции",
        "Свободный выбор времени",
      ],
      weekdayPrice: 0,
      weekendPrice: 0,
      oldPrice: null,
    }
  ];

  const handleSelect = (id: typeof PACKAGES[number]["id"] | "custom") => {
    if (state.packageType === id) return;

    const megaRoom = id !== "custom" ? MEGA_ROOM_DETAILS[id] : null;
    updateState({
      packageType: id,
      questType: id === "basic" ? "animator" : null,
      patiroom: megaRoom ? "mega_room" : null,
      patiroomDetails: megaRoom?.label || null,
      patiroomHours: megaRoom?.hours || 3,
      cafeZones: [],
      animators: [],
      shows: [],
      masterClasses: [],
      megaOwnCatering: false,
      megaFood: {},
      hasReachedSummary: false,
      discoChoice: null,
      balloonChoice: null
    });
  };

  /* Scroll tracking */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const scrollLeft = el.scrollLeft;
      const cardWidth = el.offsetWidth * 0.85; // 85% width
      const gap = 16;
      const idx = Math.round(scrollLeft / (cardWidth + gap));
      setActiveIndex(Math.min(Math.max(idx, 0), allCards.length - 1));
    };
    el.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, [allCards.length]);

  const scrollToCard = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = cardRefs.current[idx];
    if (!target) return;
    const containerRect = el.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const scrollLeft = el.scrollLeft + (targetRect.left - containerRect.left) - 20;
    el.scrollTo({ left: scrollLeft, behavior: "smooth" });
  };

  const renderFeature = (text: string) => {
    // Dynamically look for " — " to extract values into highlighted pills
    if (text.includes(" — ")) {
      const parts = text.split(" — ");
      const value = parts.pop()!;
      const label = parts.join(" — ");
      
      // Determine pill color: orange for counts (шт), purple for times (мин/часа)
      const isOrange = value.includes("шт") || value.includes("шт.");
      const pillBgColor = isOrange ? "#ff6022" : "#5b21cc";
      
      return (
        <span className="font-medium text-[#101011] text-[16px] leading-[22.4px] flex items-center flex-wrap">
          {label} —{" "}
          <span 
            className="text-white font-bold px-[10px] py-[2px] rounded-[13px] ml-[4px] leading-none inline-flex items-center" 
            style={{ backgroundColor: pillBgColor, height: '24px' }}
          >
            {value}
          </span>
        </span>
      );
    }

    // For plain features like "Шар-сюрприз"
    return (
      <span className="font-medium text-[#101011] text-[16px] leading-[22.4px]">
        {text}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="pb-16 overflow-x-hidden"
    >
      {/* Header */}
      <div className="text-center mb-4 px-4 pt-2">
        <h1 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🎉</span>
          Выберите пакет
        </h1>
        <p className="text-base font-bold text-[#747474] leading-relaxed mb-4">
          {"День рождения в Hello Park МЕГА"}
        </p>

        {/* Navigation controls moved to top */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={() => scrollToCard(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            className="w-10 h-10 shrink-0 rounded-full border-[1.5px] border-[#E5E5E5] bg-white flex items-center justify-center transition-all hover:border-[#ABABAB] disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-[#3A3A3A]" />
          </button>
          
          <div className="flex justify-center gap-1.5">
            {allCards.map((pkg, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className="transition-all duration-300 rounded-full shrink-0"
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  backgroundColor: i === activeIndex ? pkg.borderColor : "#D5D5D5",
                }}
              />
            ))}
          </div>

          <button
            onClick={() => scrollToCard(Math.min(allCards.length - 1, activeIndex + 1))}
            disabled={activeIndex === allCards.length - 1}
            className="w-10 h-10 shrink-0 rounded-full border-[1.5px] border-[#E5E5E5] bg-white flex items-center justify-center transition-all hover:border-[#ABABAB] disabled:opacity-30 disabled:pointer-events-none active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-[#3A3A3A]" />
          </button>
        </div>
      </div>

      <AnimatePresence>
      </AnimatePresence>

      {/* ─── Horizontal Scroll Cards ─── */}
      <div
        ref={scrollRef}
        className="flex items-start gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 px-5 pt-5"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          scrollPaddingLeft: "20px",
          scrollPaddingRight: "20px",
        }}
      >
        {allCards.map((pkg, i) => {
          const isSelected = state.packageType === pkg.id;
          const isDisabled = pkg.weekdayOnly && state.isWeekend;
          const isCustom = pkg.id === "custom";
          const displayPrice = state.isWeekend ? (pkg.weekendPrice ?? pkg.weekdayPrice) : pkg.weekdayPrice;

          return (
            <motion.div
              key={pkg.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isDisabled ? 0.45 : 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="snap-start shrink-0 relative pr-1 animate-gpu"
              style={{ width: "85%" }}
            >
              {/* Duration Badge (Top Right Rotated) */}
              <div className="absolute right-0 top-[-16px] rotate-[-5deg] z-20 flex items-center justify-center pointer-events-none origin-bottom-right">
                <div 
                  className={`flex items-center justify-center shadow-md transition-colors ${
                    pkg.id === "premium" 
                      ? "px-[32px] rounded-[20px] min-w-[130px] h-[58px]" 
                      : "px-[24px] rounded-[15px] min-w-[110px] h-[46px]"
                  }`}
                  style={{ backgroundColor: isCustom ? "#747474" : (pkg.id === "premium" ? "#ff3b30" : "#5b21cc") }}
                >
                  <span className={`font-black text-white tracking-[-0.5px] leading-none mt-[-2px] ${
                    pkg.id === "premium" ? "text-[32px]" : "text-[24px]"
                  }`}>
                    {pkg.id === "premium" ? "ХИТ" : pkg.duration}
                  </span>
                </div>
              </div>

              <div
                onClick={() => !isDisabled && handleSelect(pkg.id)}
                className={`bg-white rounded-[24px] w-full relative transition-all duration-300 cursor-pointer overflow-hidden ${
                  isDisabled ? "pointer-events-none" : "hover:shadow-md"
                }`}
                style={{
                  boxShadow: isSelected
                    ? `0 12px 40px ${pkg.borderColor}30, 0 4px 12px rgba(0,0,0,0.05)`
                    : "0 4px 20px rgba(0,0,0,0.06)",
                }}
              >
                {/* Border effect based on selection */}
                <div 
                  className="absolute inset-0 rounded-[24px] pointer-events-none transition-all duration-300"
                  style={{ 
                    border: isCustom 
                      ? `2.5px dashed ${isSelected ? '#ff6022' : '#C4C4C4'}`
                      : `2.5px solid ${isSelected ? pkg.borderColor : '#E5E5E5'}`,
                  }}
                />

                <div className="flex flex-col px-[24px] pt-[28px] pb-[28px] relative z-0">
                  <div>
                    {/* Header */}
                    <div className="mb-[24px] pr-[100px]">
                      <h2 className="text-[32px] tracking-[-0.5px] leading-[1] flex items-center gap-1.5 flex-wrap">
                        <span className="font-black text-[#101011]">{pkg.emoji}</span>
                        <span className="font-black" style={{ color: pkg.nameColor }}>{pkg.name}</span>
                      </h2>
                    </div>

                    {/* Features */}
                    <div className="flex flex-col gap-[12px] mb-[24px]">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex gap-[12px] items-start relative">
                          <div 
                            className="rounded-full size-[8px] mt-[8px] shrink-0 bg-[#ff6022]" 
                          />
                          {renderFeature(feature)}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {/* Free entry badge for non-custom cards */}
                    {!isCustom && (
                      <div className="mb-[28px] ml-[-4px]">
                        <div className="bg-[#5b21cc] rounded-[13px] inline-flex items-center justify-center px-[20px] py-[6px] shadow-sm">
                          <span className="font-semibold text-white text-[15px]">
                            Взрослым вход бесплатный
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex flex-col items-center gap-[2px] mb-[20px]">
                      {isCustom ? (
                        <p className="text-[#ff6022] text-[20px] font-black leading-none my-[10px]">
                          Своя цена
                        </p>
                      ) : (
                        <>
                          {pkg.oldPrice && (
                            <p className="text-[#999490] text-[16px] line-through font-semibold leading-none">
                              {formatPrice(pkg.oldPrice)} ₽
                            </p>
                          )}
                          <p className="text-[#ff6022] text-[32px] tracking-[-0.5px] font-black leading-none mt-[4px]">
                            {formatPrice(displayPrice)} ₽
                          </p>
                          {pkg.weekendPrice && !state.isWeekend && (
                            <span className="text-xs text-[#ABABAB] mt-2">
                              {formatPrice(pkg.weekendPrice)} ₽ в выходные
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* CTA */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) handleSelect(pkg.id);
                      }}
                      className="w-full mt-[4px] py-[16px] rounded-full active:scale-[0.97] transition-all duration-300"
                      style={{
                        backgroundColor: isSelected ? pkg.borderColor : '#ff6022',
                        boxShadow: isSelected ? `0 6px 20px ${pkg.borderColor}40` : 'none'
                      }}
                    >
                      <span className="text-white text-[17px] flex items-center justify-center gap-2" style={{ fontWeight: 700 }}>
                        {isSelected ? (
                          <>
                            <Check className="w-5 h-5" />
                            Выбрано
                          </>
                        ) : (
                          isCustom ? "Собрать праздник" : "Выбрать пакет"
                        )}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation arrows moved to the top */}
    </motion.div>
  );
}
