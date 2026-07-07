import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Star, Info, X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MEGA_SHOW_NAMES, MEGA_SHOW_PRICES } from "../data/megaConfig";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return ((import.meta as any).env?.BASE_URL || "/") + path.replace(/^\//, "");
};

export const SHOWS = [
  {
    id: "soap",
    name: "Шоу мыльных пузырей",
    price: 15000,
    surcharge: 0,
    emoji: "🫧",
    desc: "Самое популярное, незабываемое красочное шоу, вызывающее незабываемые впечатления у детей и взрослых! В ходе шоу гостей ожидает: • гусеница из пузырей • разноцветная радуга • погружение в гигнатский мыльный пузырь • целый рой из пузырей разного размера",
    gradient: "from-[#a1c4fd] to-[#c2e9fb]",
    image: "/shows/soap.png",
  },
  {
    id: "paper",
    name: "Бумажное шоу",
    price: 16000,
    surcharge: 0,
    emoji: "🎊",
    desc: "Невероятное шоу, которое превращает обычные танцы в безудержное веселье с огромным количеством бумаги. В ходе шоу гостей ожидает: • популярная музыка, воздушные пушки, целое море белой бумаги • интересные конкурсы и танцевальные баттлы • безудержное веселье • увлекательные игры",
    gradient: "from-[#ffecd2] to-[#fcb69f]",
    image: "/shows/paper.png",
  },
  {
    id: "tesla",
    name: "Тесла-шоу",
    price: 15000,
    surcharge: 0,
    emoji: "⚡",
    desc: "Увлекательное научное представление, где дети становятся настоящими учеными! В ходе шоу гостей ожидает: • зрелищные химические опыты • эксперименты с сухим льдом • создание искусственного снега • безопасные взрывы и море эмоций",
    gradient: "from-[#a18cd1] to-[#fbc2eb]",
    image: "/shows/science.png",
  },
  {
    id: "professor",
    name: "Чокнутый профессор",
    price: 18000,
    surcharge: 0,
    emoji: "🧪",
    desc: "Яркая и безопасная битва подушками, светящимися в темноте! В ходе шоу гостей ожидает: • неоновая дискотека с ультрафиолетовым освещением • сотни мягких светящихся подушек • веселые командные игры и эстафеты • незабываемые впечатления для детей и взрослых",
    gradient: "from-[#d4fc79] to-[#96e6a1]",
    image: "/shows/neon.png",
  },
];

export const PREMIUM_SHOWS = [
  {
    id: "neon_soap",
    name: "Шоу неоновых мыльных пузырей",
    price: 16000,
    surcharge: 4000,
    emoji: "🔮",
    desc: "Яркое неоновое шоу мыльных пузырей, светящихся в темноте. Волшебная атмосфера и потрясающие фотографии обеспечены!",
    gradient: "from-[#f857a6] to-[#ff5858]",
  },
  {
    id: "neon_paper",
    name: "Неоновое бумажное шоу",
    price: 18000,
    surcharge: 7000,
    emoji: "✨",
    desc: "Светящаяся в ультрафиолете бумага, зажигательная музыка и невероятные эмоции! Отличный выбор для крутой вечеринки.",
    gradient: "from-[#4facfe] to-[#00f2fe]",
  },
  {
    id: "ribbon",
    name: "Ленточное шоу",
    price: 18000,
    surcharge: 7000,
    emoji: "🎀",
    desc: "Километры ярких разноцветных лент, в которых можно купаться, прыгать и танцевать. Абсолютно безопасно и очень весело!",
    gradient: "from-[#fa709a] to-[#fee140]",
  },

  {
    id: "illusionist",
    name: "Фокусник-иллюзионист",
    price: 30000,
    surcharge: 16000,
    emoji: "🎩",
    desc: "Настоящая магия и необъяснимые иллюзии от профессионального фокусника. Захватывающее представление для всей семьи.",
    gradient: "from-[#667eea] to-[#764ba2]",
  },
  {
    id: "cryo",
    name: "Крио-шоу с мороженым",
    price: 20000,
    surcharge: 5000,
    emoji: "🍦",
    desc: "Эффектное шоу с жидким азотом, где каждый участник сможет попробовать вкуснейшее крио-мороженое, приготовленное прямо на его глазах!",
    gradient: "from-[#89f7fe] to-[#66a6ff]",
  },
];

export const ALL_SHOWS = [...SHOWS, ...PREMIUM_SHOWS];

export function StepShows() {
  const { state, updateState, isExp } = useWizard();
  const isCustom = state.packageType === "custom";
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
  const [surchargeShow, setSurchargeShow] = useState<{
    id: string;
    price: number;
    isSecondShow?: boolean;
  } | null>(null);

  const getShowPrice = (showId: string) =>
    MEGA_SHOW_PRICES[showId] || ALL_SHOWS.find((s) => s.id === showId)?.price || 0;
  const getShowSurcharge = (showId: string) => {
    return ALL_SHOWS.find((s) => s.id === showId)?.surcharge || 0;
  };
  const getShowName = (show: (typeof SHOWS)[number]) =>
    MEGA_SHOW_NAMES[show.id] || show.name;

  const toggleShow = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const current = state.shows;
    if (current.includes(id)) {
      updateState({ shows: current.filter((m) => m !== id) });
    } else {
      // In exclusive: first show is free or needs surcharge, second+ needs full price confirmation
      if (state.packageType === "exclusive") {
        if (current.length >= 1) {
          // Additional show, pay full price
          setSurchargeShow({ id, price: getShowPrice(id), isSecondShow: true });
        } else {
          const surcharge = getShowSurcharge(id);
          if (surcharge > 0) {
            // First show but it's premium, confirm surcharge
            setSurchargeShow({ id, price: surcharge, isSecondShow: false });
          } else {
            // Standard show as first show
            updateState({ shows: [...current, id] });
          }
        }
      } else {
        updateState({ shows: [...current, id] });
      }
    }
  };

  const confirmShowSurcharge = () => {
    if (surchargeShow) {
      updateState({ shows: [...state.shows, surchargeShow.id] });
      setSurchargeShow(null);
    }
  };

  const selectedShowDetails = ALL_SHOWS.find((s) => s.id === selectedInfo);

  const getTotalShowsPrice = () => {
    let cost = state.shows.reduce((acc, showId) => {
      return acc + getShowPrice(showId);
    }, 0);
    if (state.packageType === "exclusive" && state.shows.length > 0) {
      const firstShowId = state.shows[0];
      cost = cost - getShowPrice(firstShowId) + getShowSurcharge(firstShowId);
    }
    return cost;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -30 }}
        transition={{ duration: 0.3 }}
        className="px-4 pb-6"
      >
        <div className="text-center mb-8 px-4 pt-2">
          <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
            <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">
              ✨
            </span>
            Шоу-программы
          </h2>
          <p className="text-base font-bold text-[#747474] leading-relaxed">
            {state.packageType === "exclusive"
              ? "Одна шоу-программа включена в пакет. Остальные за доп. плату"
              : "Выберите шоу-программы для вашего праздника"}
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A]">Доступные шоу</h3>
        </div>

        {/* Grid of Shows */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {SHOWS.map((show) => {
            const isSelected = state.shows.includes(show.id);
            
            if (isExp) {
              return (
                <motion.div
                  key={show.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleShow(show.id)}
                  className={`group relative rounded-[28px] bg-white p-2 transition-all duration-300 cursor-pointer border flex flex-col ${
                    isSelected
                      ? "scale-[1.02]"
                      : "border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                  }`}
                  style={{
                    borderColor: isSelected ? "#FF6022" : "rgba(0,0,0,0.04)",
                    borderWidth: isSelected ? "2px" : "1px",
                    boxShadow: isSelected 
                      ? "0 16px 36px rgba(255,96,34,0.15), 0 0 0 1px rgba(255,96,34,0.1)" 
                      : undefined
                  }}
                >
                  <div className={`relative aspect-[4/3.1] w-full rounded-[20px] overflow-hidden bg-gradient-to-br ${show.gradient} flex items-center justify-center shrink-0`}>
                    {(show as any).image ? (
                      <ImageWithFallback
                        src={getPublicUrl((show as any).image)}
                        alt={show.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                        {show.emoji}
                      </span>
                    )}
                    
                    <button 
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-md text-gray-700 flex items-center justify-center z-10 transition-all hover:scale-110 active:scale-95 shadow-sm hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInfo(show.id);
                      }}
                      title="Подробнее"
                    >
                      <Info className="w-3.5 h-3.5 text-gray-800" />
                    </button>
                  </div>

                  <div className="p-2 pt-2.5 flex flex-col flex-1">
                    <h4 className="text-[12px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#FF6022] transition-colors line-clamp-2 leading-snug flex-1">
                      {getShowName(show)}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 shrink-0">
                      <span className="text-[11px] text-[#FF6022] font-black">
                        {state.packageType === "exclusive" &&
                        (state.shows.length === 0 || state.shows[0] === show.id)
                          ? getShowSurcharge(show.id) > 0
                            ? `+${getShowSurcharge(show.id).toLocaleString("ru-RU")} ₽`
                            : "Входит"
                          : `${getShowPrice(show.id).toLocaleString("ru-RU")} ₽`}
                      </span>

                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "bg-[#FF6022] text-white shadow-sm" : "bg-gray-50 text-[#D1D1D1]"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={show.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleShow(show.id)}
                className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                  isSelected
                    ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                    : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
              >
                {/* Image / Gradient Placeholder */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${show.gradient} flex items-center justify-center`}
                >
                  {(show as any).image ? (
                    <ImageWithFallback
                      src={getPublicUrl((show as any).image)}
                      alt={show.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">
                      {show.emoji}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Top details: Button + Checkmark */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInfo(show.id);
                    }}
                    className="bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-[#FF6022]/40"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Подробнее
                  </button>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40"
                        : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom pill-like panel like location cards */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                  <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">
                    {getShowName(show)}
                  </h4>
                  <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                    {state.packageType === "exclusive" &&
                    (state.shows.length === 0 || state.shows[0] === show.id)
                      ? getShowSurcharge(show.id) > 0
                        ? `Доплата ${getShowSurcharge(show.id).toLocaleString("ru-RU")} ₽`
                        : "Включено"
                      : `${getShowPrice(show.id).toLocaleString("ru-RU")} ₽`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mb-4 mt-8">
          <Star className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[#1A1A1A]">Премиум-шоу</h3>
        </div>

        {/* Grid of Premium Shows */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {PREMIUM_SHOWS.map((show) => {
            const isSelected = state.shows.includes(show.id);
            
            if (isExp) {
              return (
                <motion.div
                  key={show.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleShow(show.id)}
                  className={`group relative rounded-[28px] bg-white p-2 transition-all duration-300 cursor-pointer border flex flex-col ${
                    isSelected
                      ? "scale-[1.02]"
                      : "border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                  }`}
                  style={{
                    borderColor: isSelected ? "#FF6022" : "rgba(0,0,0,0.04)",
                    borderWidth: isSelected ? "2px" : "1px",
                    boxShadow: isSelected 
                      ? "0 16px 36px rgba(255,96,34,0.15), 0 0 0 1px rgba(255,96,34,0.1)" 
                      : undefined
                  }}
                >
                  <div className={`relative aspect-[4/3.1] w-full rounded-[20px] overflow-hidden bg-gradient-to-br ${show.gradient} flex items-center justify-center shrink-0`}>
                    {(show as any).image ? (
                      <ImageWithFallback
                        src={getPublicUrl((show as any).image)}
                        alt={show.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                        {show.emoji}
                      </span>
                    )}
                    
                    <button 
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-md text-gray-700 flex items-center justify-center z-10 transition-all hover:scale-110 active:scale-95 shadow-sm hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInfo(show.id);
                      }}
                      title="Подробнее"
                    >
                      <Info className="w-3.5 h-3.5 text-gray-800" />
                    </button>
                  </div>

                  <div className="p-2 pt-2.5 flex flex-col flex-1">
                    <h4 className="text-[12px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#FF6022] transition-colors line-clamp-2 leading-snug flex-1">
                      {getShowName(show)}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 shrink-0">
                      <span className="text-[11px] text-[#FF6022] font-black">
                        {state.packageType === "exclusive" &&
                        (state.shows.length === 0 || state.shows[0] === show.id)
                          ? getShowSurcharge(show.id) > 0
                            ? `+${getShowSurcharge(show.id).toLocaleString("ru-RU")} ₽`
                            : "Входит"
                          : `${getShowPrice(show.id).toLocaleString("ru-RU")} ₽`}
                      </span>

                      <div 
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "bg-[#FF6022] text-white shadow-sm" : "bg-gray-50 text-[#D1D1D1]"
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={show.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleShow(show.id)}
                className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                  isSelected
                    ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                    : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
              >
                {/* Image / Gradient Placeholder */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${show.gradient} flex items-center justify-center`}
                >
                  {(show as any).image ? (
                    <ImageWithFallback
                      src={getPublicUrl((show as any).image)}
                      alt={show.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">
                      {show.emoji}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                {/* Top details: Button + Checkmark */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInfo(show.id);
                    }}
                    className="bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-[#FF6022]/40"
                  >
                    <Info className="w-3.5 h-3.5" />
                    Подробнее
                  </button>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40"
                        : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                  </div>
                </div>

                {/* Bottom pill-like panel like location cards */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                  <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">
                    {getShowName(show)}
                  </h4>
                  <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                    {state.packageType === "exclusive" &&
                    (state.shows.length === 0 || state.shows[0] === show.id)
                      ? getShowSurcharge(show.id) > 0
                        ? `Доплата ${getShowSurcharge(show.id).toLocaleString("ru-RU")} ₽`
                        : "Включено"
                      : `${getShowPrice(show.id).toLocaleString("ru-RU")} ₽`}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {state.shows.length > 0 &&
          (isCustom ||
            (state.packageType === "exclusive" && state.shows.length > 1)) && (
            <div className="bg-[#FF6022]/5 rounded-2xl p-4 mb-6 text-center border border-[#FF6022]/20">
              <p className="text-sm text-[#FF6022]">
                Выбрано платных:{" "}
                {isCustom ? state.shows.length : state.shows.length - 1} шоу ={" "}
                <span className="text-base font-semibold">
                  {getTotalShowsPrice().toLocaleString("ru-RU")} ₽
                </span>
              </p>
            </div>
          )}

        {/* Info Popup Modal */}
        <AnimatePresence>
          {selectedInfo && selectedShowDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-[-50vh] bottom-[-50vh] left-0 right-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
            >
              {/* Extended bounce cover backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-auto"
                onClick={() => setSelectedInfo(null)}
              />
              {/* Modal content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto relative z-10"
              >
                <div className="relative shrink-0 bg-black">
                  <div
                    className={`aspect-[4/5] max-h-[40vh] w-full bg-gradient-to-br ${selectedShowDetails.gradient} flex items-center justify-center`}
                  >
                    {(selectedShowDetails as any).image ? (
                      <ImageWithFallback
                        src={getPublicUrl((selectedShowDetails as any).image)}
                        alt={selectedShowDetails.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-8xl sm:text-9xl filter drop-shadow-md">
                        {selectedShowDetails.emoji}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedInfo(null)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full text-[#1A1A1A] transition-colors hover:bg-white z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto overscroll-contain">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">
                    {getShowName(selectedShowDetails)}
                  </h3>
                  <p className="text-[#747474] text-sm leading-relaxed mb-6 whitespace-pre-line">
                    {selectedShowDetails.desc.replace(/ • /g, "\n• ")}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        const isSelected = state.shows.includes(
                          selectedShowDetails.id,
                        );
                        if (!isSelected) {
                          toggleShow(selectedShowDetails.id);
                        }
                        setSelectedInfo(null);
                      }}
                      className={`flex-1 py-3.5 rounded-xl font-medium text-center transition-all ${
                        state.shows.includes(selectedShowDetails.id)
                          ? "bg-[#F5F5F5] text-[#747474]"
                          : "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                      }`}
                    >
                      {state.shows.includes(selectedShowDetails.id)
                        ? "Добавлено"
                        : "Добавить в праздник"}
                    </button>

                    {state.shows.includes(selectedShowDetails.id) && (
                      <button
                        onClick={() => {
                          updateState({
                            shows: state.shows.filter(
                              (id) => id !== selectedShowDetails.id,
                            ),
                          });
                          setSelectedInfo(null);
                        }}
                        className="py-3.5 px-4 rounded-xl font-medium text-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      >
                        Убрать
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Surcharge popup for additional show */}
      <AnimatePresence>
        {surchargeShow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6"
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-md"
              onClick={() => setSurchargeShow(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-[#FF6022]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✨</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">
                  {surchargeShow.isSecondShow
                    ? "Дополнительное шоу"
                    : "Премиум-шоу"}
                </h3>
                <p className="text-sm text-[#747474] leading-relaxed">
                  {surchargeShow.isSecondShow
                    ? "Одно шоу уже входит в пакет. За дополнительное нужно доплатить"
                    : "Это премиум-шоу, поэтому к базовой стоимости пакета потребуется небольшая доплата"}
                </p>
                <p className="text-2xl font-black text-[#FF6022] mt-2">
                  +{surchargeShow.price.toLocaleString("ru-RU")} ₽
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSurchargeShow(null)}
                  className="flex-1 py-3.5 rounded-xl font-medium text-center bg-[#F5F5F5] text-[#747474] transition-all active:scale-[0.98]"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmShowSurcharge}
                  className="flex-1 py-3.5 rounded-xl font-medium text-center bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                >
                  Добавить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
