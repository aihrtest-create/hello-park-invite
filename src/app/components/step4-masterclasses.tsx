import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Palette, Info, X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MEGA_MC_PRICE, PREMIUM_MASTER_CLASSES } from "../data/megaConfig";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

const MASTER_CLASSES = [
  { id: "elsa_tiara", name: "Диадема Эльзы", emoji: "👑", desc: "Дети создают собственную сверкающую диадему, вдохновлённую принцессой Эльзой.", gradient: "from-[#a1c4fd] to-[#c2e9fb]", image: "/masterclasses/elsa_tiara.webp" },
  { id: "slime", name: "Создание слайма", emoji: "🐾", desc: "Дети создают собственную игрушку-антистресс, используя безопасные материалы: клей-ПВА, пена, активатор. Также придают слайму индивидуальность - выбирают цвет, аромат, блёстки, разные украшения.", gradient: "from-[#84fab0] to-[#8fd3f4]", image: "/masterclasses/slime.webp" },
  { id: "mc_weapon", name: "Оружие из Майнкрафта", emoji: "⛏️", desc: "Дети создают свои оригинальные версии алмазных мечей, в основе которых - деревянная заготовка и детали для создания меча - разноцветные квадраты.", gradient: "from-[#d4fc79] to-[#96e6a1]", image: "/masterclasses/mc_weapon.webp" },
  { id: "sand_picture", name: "Песочная картина", emoji: "⏳", desc: "Дети создают свои уникальные картины с помощью разноцветного декоративного песка. Можно воспользоваться уже придуманной заготовкой с картинкой или создать свой собственный шедевр.", gradient: "from-[#e6b980] to-[#eacda3]", image: "/masterclasses/sand_picture.webp" },
  { id: "gingerbread", name: "Роспись пряников", emoji: "🍪", desc: "Дети самостоятельно расписывают пряники глазурью и кондитерскими украшениями (бусинами, красителями, кокосовой стружкой и тд). Сами пряники изготавливают вручную наши мастера накануне праздника.", gradient: "from-[#f6d365] to-[#fda085]", image: "/masterclasses/gingerbread.webp" },
  { id: "pinwheel", name: "Игрушка-ветерок", emoji: "🌬️", desc: "Дети создают красочную бумажную вертушку своими руками, украшая её по своему вкусу.", gradient: "from-[#ffecd2] to-[#fcb69f]", image: "/masterclasses/pinwheel.png" },
  { id: "twisting", name: "Твистинг", emoji: "🎈", desc: "Увлекательное моделирование из длинных воздушных шаров. Дети научатся скручивать различные фигуры животных, цветов и игрушек.", gradient: "from-[#fccb90] to-[#d57eeb]", image: "/masterclasses/twisting.png" }
];

export function Step4MasterClasses() {
  const { state, updateState, isExp } = useWizard();
  const isCustom = state.packageType === "custom";
  const mcPrice = MEGA_MC_PRICE;
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);
  const [surchargeMC, setSurchargeMC] = useState<string | null>(null);

  const toggleMC = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const current = state.masterClasses;
    if (current.includes(id)) {
      updateState({ masterClasses: current.filter((m) => m !== id) });
    } else {
      // In premium/exclusive: first MC is free, second+ needs confirmation
      const hasFreeSlot = (state.packageType === "premium" || state.packageType === "exclusive") && current.length >= 1;
      if (hasFreeSlot) {
        setSurchargeMC(id);
      } else {
        updateState({ masterClasses: [...current, id] });
      }
    }
  };

  const confirmMCSurcharge = () => {
    if (surchargeMC) {
      updateState({ masterClasses: [...state.masterClasses, surchargeMC] });
      setSurchargeMC(null);
    }
  };

  const selectedClassDetails = MASTER_CLASSES.find(mc => mc.id === selectedInfo) || PREMIUM_MASTER_CLASSES.find(mc => mc.id === selectedInfo);

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
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🎨</span>
          Мастер-классы
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          {isCustom || state.packageType === "basic"
            ? `Каждый мастер-класс — ${mcPrice.toLocaleString("ru-RU")} ₽`
            : "В ваш пакет входит 1 мастер-класс — выберите любой!"}
        </p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-[#FF6022]" />
        <h3 className="text-[#1A1A1A]">Доступные мастер-классы</h3>
      </div>

      {/* Grid of Master Classes */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {MASTER_CLASSES.map((mc) => {
          const isSelected = state.masterClasses.includes(mc.id);
          
          if (isExp) {
            return (
              <motion.div
                key={mc.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleMC(mc.id)}
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
                <div className={`relative aspect-[4/3.1] w-full rounded-[20px] overflow-hidden bg-gradient-to-br ${mc.gradient} flex items-center justify-center shrink-0`}>
                  {(mc as any).image ? (
                    <ImageWithFallback
                      src={getPublicUrl((mc as any).image)}
                      alt={mc.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                      {mc.emoji}
                    </span>
                  )}
                  
                  <button 
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/95 backdrop-blur-md text-gray-700 flex items-center justify-center z-10 transition-all hover:scale-110 active:scale-95 shadow-sm hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInfo(mc.id);
                    }}
                    title="Подробнее"
                  >
                    <Info className="w-3.5 h-3.5 text-gray-800" />
                  </button>
                </div>

                <div className="p-2 pt-2.5 flex flex-col flex-1">
                  <h4 className="text-[12px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#FF6022] transition-colors line-clamp-2 leading-snug flex-1">
                    {mc.name}
                  </h4>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 shrink-0">
                    <span className="text-[11px] text-[#FF6022] font-black">
                      {(state.packageType === "premium" || state.packageType === "exclusive") && (state.masterClasses.length === 0 || state.masterClasses[0] === mc.id) ? "Включено" : `${mcPrice.toLocaleString("ru-RU")} ₽`}
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
              key={mc.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleMC(mc.id)}
              className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                isSelected
                  ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                  : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              {/* Image / Gradient Placeholder */}
              <div className={`absolute inset-0 bg-gradient-to-br ${mc.gradient} flex items-center justify-center`}>
                {(mc as any).image ? (
                  <ImageWithFallback src={getPublicUrl((mc as any).image)} alt={mc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">{mc.emoji}</span>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              {/* Top details: Button + Checkmark */}
              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfo(mc.id);
                  }}
                  className="bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-[#FF6022]/40"
                >
                  <Info className="w-3.5 h-3.5" />
                  Подробнее
                </button>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                }`}>
                   <Check className="w-4 h-4" />
                </div>
              </div>

              {/* Bottom pill-like panel like location cards */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{mc.name}</h4>
                 <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                   {(state.packageType === "premium" || state.packageType === "exclusive") && (state.masterClasses.length === 0 || state.masterClasses[0] === mc.id) ? "Включено" : `${mcPrice.toLocaleString("ru-RU")} ₽`}
                 </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Premium Master Classes */}
      <div className="flex items-center gap-2 mb-4 mt-8">
        <Palette className="w-5 h-5 text-[#FF6022]" />
        <h3 className="text-[#1A1A1A]">Дополнительные мастер-классы</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {PREMIUM_MASTER_CLASSES.map((mc) => {
          const isSelected = state.masterClasses.includes(mc.id);
          const price = state.packageType === "exclusive" ? mc.excPrice : mc.price;
          
          if (isExp) {
            return (
              <motion.div
                key={mc.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleMC(mc.id)}
                className={`group relative rounded-[28px] bg-white p-2 transition-all duration-300 cursor-pointer border flex flex-col ${
                  isSelected
                    ? "scale-[1.02]"
                    : "border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                }`}
              >
                <div className={`relative aspect-square w-full rounded-[20px] mb-3 overflow-hidden bg-gradient-to-br ${mc.gradient} flex flex-col items-center justify-center p-4 text-center`}>
                  <div className="text-4xl filter drop-shadow-md pb-2 group-hover:scale-110 transition-transform duration-500">
                    {mc.emoji}
                  </div>
                  <div className="absolute top-2 right-2 z-10 flex gap-1">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedInfo(mc.id); }} className="w-7 h-7 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center text-[#1A1A1A] hover:bg-white transition-colors">
                      <Info className="w-4 h-4" />
                    </button>
                    {isSelected && (
                      <div className="w-7 h-7 rounded-full bg-[#FF6022] flex items-center justify-center text-white shadow-sm">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-2 pb-2 flex-1 flex flex-col">
                  <h4 className="text-[14px] font-bold text-[#1A1A1A] leading-tight mb-2 line-clamp-2">
                    {mc.name}
                  </h4>
                  <div className="mt-auto flex items-center justify-between">
                    <p className="text-[13px] font-black text-[#FF6022]">
                      +{price.toLocaleString("ru-RU")} ₽
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={mc.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleMC(mc.id)}
              className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                isSelected
                  ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]"
                  : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mc.gradient} flex items-center justify-center`}>
                <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">{mc.emoji}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfo(mc.id);
                  }}
                  className="bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-full flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md shadow-[#FF6022]/40"
                >
                  <Info className="w-3.5 h-3.5" />
                  Подробнее
                </button>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    isSelected ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                }`}>
                   <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">{mc.name}</h4>
                 <p className="text-[11px] text-[#FF6022] font-extrabold mt-0.5">
                   +{price.toLocaleString("ru-RU")} ₽
                 </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.masterClasses.length > 1 && (state.packageType === "premium" || state.packageType === "exclusive") && (
        <div className="bg-amber-50 rounded-2xl p-4 mb-6 text-center border border-amber-200">
          <p className="text-sm text-amber-700 font-medium">
            В пакет входит 1 мастер-класс. Дополнительные — 
            <span className="text-base font-bold">
              {" "}{((state.masterClasses.length - 1) * mcPrice).toLocaleString("ru-RU")} ₽
            </span>
          </p>
        </div>
      )}

      {state.masterClasses.length > 0 && (isCustom || state.packageType === "basic") && (
        <div className="bg-[#FF6022]/5 rounded-2xl p-4 mb-6 text-center border border-[#FF6022]/20">
          <p className="text-sm text-[#FF6022]">
            Выбрано: {state.masterClasses.length} МК ={" "}
            <span className="text-base font-semibold">
              {(state.masterClasses.length * mcPrice).toLocaleString("ru-RU")} ₽
            </span>
          </p>
        </div>
      )}

      {/* Info Popup Modal */}
      <AnimatePresence>
        {selectedInfo && selectedClassDetails && (
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
                <div className={`aspect-[4/5] max-h-[40vh] w-full bg-gradient-to-br ${selectedClassDetails.gradient} flex items-center justify-center`}>
                  {(selectedClassDetails as any).image ? (
                    <ImageWithFallback src={getPublicUrl((selectedClassDetails as any).image)} alt={selectedClassDetails.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-8xl sm:text-9xl filter drop-shadow-md">{selectedClassDetails.emoji}</span>
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
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{selectedClassDetails.name}</h3>
                <p className="text-[#747474] text-sm leading-relaxed mb-6">
                  {selectedClassDetails.desc}
                </p>
                
                <div className="flex gap-3">
                  <button
                     onClick={() => {
                        const isSelected = state.masterClasses.includes(selectedClassDetails.id);
                        if (!isSelected) {
                            toggleMC(selectedClassDetails.id);
                        }
                        setSelectedInfo(null);
                     }}
                     className={`flex-1 py-3.5 rounded-xl font-medium text-center transition-all ${
                         state.masterClasses.includes(selectedClassDetails.id)
                         ? "bg-[#F5F5F5] text-[#747474]"
                         : "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                     }`}
                  >
                    {state.masterClasses.includes(selectedClassDetails.id) ? "Добавлено" : "Добавить в праздник"}
                  </button>
                    
                  {state.masterClasses.includes(selectedClassDetails.id) && (
                     <button
                        onClick={() => {
                           updateState({ masterClasses: state.masterClasses.filter(id => id !== selectedClassDetails.id) });
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

      {/* Surcharge popup for additional MC */}
      <AnimatePresence>
        {surchargeMC && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setSurchargeMC(null)} />
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
                  <span className="text-3xl">🎨</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Дополнительный мастер-класс</h3>
                <p className="text-sm text-[#747474] leading-relaxed">
                  Один мастер-класс уже входит в пакет. За дополнительный нужно доплатить
                </p>
                <p className="text-2xl font-black text-[#FF6022] mt-2">
                  +{mcPrice.toLocaleString("ru-RU")} ₽
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSurchargeMC(null)}
                  className="flex-1 py-3.5 rounded-xl font-medium text-center bg-[#F5F5F5] text-[#747474] transition-all active:scale-[0.98]"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmMCSurcharge}
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
