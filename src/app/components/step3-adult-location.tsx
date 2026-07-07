import React from "react";
import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Users, Check, Coffee, UtensilsCrossed, Armchair } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

const CAFE_OPTIONS = [
  {
    id: "cafe_round",
    name: "Круглый столик",
    subtitle: "Уютная зона с круглым столом",
    seats: 8,
    weekdayDeposit: 5000,
    weekendDeposit: 10000,
    thumbnail: "/locations/cafe/round.webp",
    description: "Уютная зона с большим круглым столом — идеальна для небольшой компании взрослых. Удобное расположение рядом с патирумами.",
  },
  {
    id: "cafe_small",
    name: "Маленький столик",
    subtitle: "Небольшой уютный столик",
    seats: 4,
    weekdayDeposit: 5000,
    weekendDeposit: 5000,
    thumbnail: "/locations/cafe/small.webp",
    description: "Компактный столик для небольшой компании родителей. Идеально для отдыха, пока дети играют.",
  },
  {
    id: "cafe_pink",
    name: "Столик за шторками",
    subtitle: "Зона за розовыми шторками",
    seats: 6,
    weekdayDeposit: 5000,
    weekendDeposit: 5000,
    thumbnail: "/locations/cafe/pink_single.webp",
    description: "Уединённая зона за розовыми шторками. Приватное пространство, где взрослые могут спокойно пообщаться, пока дети веселятся.",
    exclusiveWith: "cafe_pink_full" as const,
  },
  {
    id: "cafe_pink_full",
    name: "Вся зона за шторками",
    subtitle: "Аренда всей зоны целиком",
    seats: 20,
    weekdayDeposit: 10000,
    weekendDeposit: 20000,
    thumbnail: "/locations/cafe/pink_full.webp",
    description: "Вся приватная зона за шторками — для большой компании. Несколько столов, максимум пространства и комфорта для взрослых гостей.",
    exclusiveWith: "cafe_pink" as const,
    badge: "Вся зона",
  },
];

export function Step3AdultLocation() {
  const { state, updateState, isExp } = useWizard();
  const handleToggleCafe = (opt: typeof CAFE_OPTIONS[0]) => {
    const current = [...state.cafeZones];
    const idx = current.indexOf(opt.id);

    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      if ((opt as any).exclusiveWith) {
        const exIdx = current.indexOf((opt as any).exclusiveWith);
        if (exIdx >= 0) current.splice(exIdx, 1);
      }
      current.push(opt.id);
    }

    updateState({ cafeZones: current });
  };

  const formatDeposit = (opt: typeof CAFE_OPTIONS[0]) => {
    const price = state.isWeekend ? opt.weekendDeposit : opt.weekdayDeposit;
    return price.toLocaleString("ru-RU") + " ₽";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      <div className="text-center mb-8 px-4 pt-2">
        {/* Дополнительные услуги label */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF6022]/10 to-[#FF8A00]/10 text-[#FF6022] text-[13px] font-bold px-4 py-2 rounded-full border border-[#FF6022]/20">
            <span>✨</span> Дополнительные услуги
          </div>
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🛋️</span>
          Стол для родителей
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">Выберите место для комфортного отдыха</p>
      </div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <Armchair className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A] font-medium">Стол для родителей</h3>
          <span className="ml-auto text-[10px] font-medium text-[#747474] bg-[#F0F0F0] px-2.5 py-1 rounded-full">
            По желанию
          </span>
        </div>
        <p className="text-xs text-[#747474] mb-1.5">
          Пока дети веселятся in патируме, взрослые могут расположиться за отдельным столом в зоне кафе.
        </p>
        <div className="flex items-center gap-1.5 mb-5">
          <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center">
            <UtensilsCrossed className="w-3 h-3 text-[#FF6022]" />
          </div>
          <p className="text-xs text-[#FF6022] font-semibold">
            Депозит можно тратить на блюда из меню
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {CAFE_OPTIONS.map((opt) => {
            const isSelected = state.cafeZones.includes(opt.id);
            
            if (isExp) {
              return (
                <motion.div
                  key={opt.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleToggleCafe(opt)}
                  className={`group relative rounded-[32px] bg-white p-2.5 transition-all duration-300 cursor-pointer border flex flex-col ${
                    isSelected
                      ? "scale-[1.01]"
                      : "border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                  }`}
                  style={{
                    borderColor: isSelected ? "#FF6022" : "rgba(0,0,0,0.04)",
                    borderWidth: isSelected ? "2px" : "1px",
                    boxShadow: isSelected 
                      ? "0 16px 36px rgba(255,96,34,0.12), 0 0 0 1px rgba(255,96,34,0.05)" 
                      : undefined
                  }}
                >
                  {/* Image container */}
                  <div className="relative aspect-[16/10] w-full rounded-[24px] overflow-hidden bg-gray-50 shrink-0 mb-3.5">
                    <ImageWithFallback
                      src={getPublicUrl(opt.thumbnail)}
                      alt={opt.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {opt.badge && (
                      <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#1A1A1A] text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl z-10 shadow-sm border border-black/5">
                        {opt.badge}
                      </div>
                    )}

                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 bg-[#FF6022] text-white rounded-full p-1.5 shadow-md shadow-[#FF6022]/20">
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </div>
                    )}
                  </div>

                  {/* Body Wrapper */}
                  <div className="px-2 pb-2 flex items-end justify-between w-full">
                    <div>
                      <h4 className="text-lg font-black text-[#1A1A1A] leading-tight group-hover:text-[#FF6022] transition-colors">{opt.name}</h4>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-2.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[#747474]">
                          <Users className="w-3.5 h-3.5 text-[#ABABAB]" />
                          <span>до {opt.seats} мест</span>
                        </span>
                        
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#FF6022]/5 border border-[#FF6022]/10 text-[#FF6022]">
                          <span>Депозит {formatDeposit(opt)}</span>
                          <span className="text-[9px] text-[#FF6022]/70 font-black uppercase tracking-wider ml-0.5">
                            {state.isWeekend ? "выходной" : "будни"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCafe(opt);
                      }}
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                        isSelected 
                          ? "bg-[#FF6022] border-[#FF6022] text-white shadow-md shadow-[#FF6022]/30" 
                          : "bg-gray-50 border-[#E5E5E5] text-[#C4C4C4] group-hover:bg-gray-100"
                      }`}
                    >
                      <Check className="w-5 h-5 stroke-[3px]" />
                    </button>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={opt.id}
                whileTap={{ scale: 0.98 }}
                className={`relative h-[440px] sm:h-[500px] rounded-[32px] overflow-hidden bg-white transition-all cursor-pointer group ${
                  isSelected ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
                onClick={() => handleToggleCafe(opt)}
              >
                <ImageWithFallback
                  src={getPublicUrl(opt.thumbnail)}
                  alt={opt.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                
                {(opt as any).badge && (
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md text-[#1A1A1A] text-[10px] font-bold uppercase tracking-wider px-4 py-2 rounded-full z-10 shadow-sm">
                    {(opt as any).badge}
                  </div>
                )}

                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[24px] p-5 shadow-2xl flex items-center justify-between border border-white/20">
                  <div>
                    <h4 className="text-lg font-bold text-[#1A1A1A]">{opt.name}</h4>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#ABABAB]" />
                        <span className="text-xs text-[#747474]">до {opt.seats} мест</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#FF6022]">
                          Депозит {formatDeposit(opt)}
                        </span>
                        <span className="text-[10px] text-[#ABABAB] font-semibold uppercase tracking-wider">
                          {state.isWeekend ? "выходной" : "будни"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? "bg-[#FF6022] text-white shadow-lg shadow-orange-500/30" : "bg-gray-50 text-[#D1D1D1] group-hover:bg-gray-100"
                    }`}
                  >
                    <Check className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </motion.div>
  );
}