import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, Info, X, Clock } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

const SERVICES = [
  {
    id: "tattoos",
    name: "Детские тату",
    price: 4000,
    duration: "60 мин",
    extra: "10 человек",
    desc: 'Классные детские мини-тату переводилки на руки и лицо. Модно, стильно и безопасно для кожи!',
    gradient: "from-[#fad0c4] to-[#ffd1ff]",
    image: "/activities/tattoos.png",
    imageClass: "object-cover object-[center_18%]",
  },
  {
    id: "photo",
    name: "Фотограф",
    price: 7000,
    duration: "60 мин",
    extra: "40–50 фото",
    desc: 'Профессиональный фотограф запечатлеет самые яркие моменты праздника. В комплект входит 40–50 обработанных фотографий, которые останутся на память навсегда.',
    gradient: "from-[#d4fc79] to-[#96e6a1]",
    image: "/activities/photographer.png",
  },
  {
    id: "aqua",
    name: "Аквагрим",
    price: 7000,
    duration: "60 мин",
    extra: "10 человек",
    desc: 'Профессиональный аквагримёр создаст яркие рисунки на лицах детей — бабочки, супергерои, тигры и всё что пожелает маленький гость.',
    gradient: "from-[#fbc2eb] to-[#a6c1ee]",
    image: "/activities/aquagrim.png",
  },
];

export function StepAdditionalServices() {
  const { state, updateState, isExp } = useWizard();
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null);

  const selectedDetails = SERVICES.find(s => s.id === selectedInfo);

  const toggleService = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const current = state.additionalServices;
    if (current.includes(id)) {
      updateState({ additionalServices: current.filter((m) => m !== id) });
    } else {
      updateState({ additionalServices: [...current, id] });
    }
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
      {/* Header */}
      <div className="text-center mb-6 px-4 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">📸</span>
          Дополнительные услуги
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          Выберите дополнительные услуги для праздника
        </p>
      </div>

      {/* Grid of Services — Stacked vertically like phygital quests */}
      <div className="flex flex-col gap-[28px] mb-8">
        {SERVICES.map((service, i) => {
          const isSelected = state.additionalServices.includes(service.id);
          const serviceName = service.name;
          
          if (isExp) {
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <div
                  className={`group relative rounded-[32px] bg-white p-2.5 transition-all duration-300 cursor-pointer border ${
                    isSelected 
                      ? "scale-[1.02] shadow-2xl" 
                      : "border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
                  }`}
                  style={{ 
                    borderColor: isSelected ? "#FF6022" : "rgba(0,0,0,0.04)",
                    borderWidth: isSelected ? "2.5px" : "1px",
                    boxShadow: isSelected 
                      ? `0 20px 40px -10px rgba(255,96,34,0.15), 0 0 0 1px rgba(255,96,34,0.1)` 
                      : undefined 
                  }}
                  onClick={() => toggleService(service.id)}
                >
                  {/* Image container (Dodo Style) */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-[24px] overflow-hidden bg-gray-50">
                    <img
                      src={getPublicUrl(service.image)}
                      alt={service.name}
                      className={`w-full h-full ${service.imageClass || 'object-cover'} transition-transform duration-700 group-hover:scale-105`}
                    />
                    
                    {/* Elegant overlay elements on image */}
                    <div className="absolute top-3 left-3 z-10 bg-[#FF6022] text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm border border-white/10">
                      ⭐ Популярно
                    </div>

                    {/* Top right info pill (Yandex Market Style) */}
                    <button 
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-gray-700 flex items-center justify-center z-10 transition-all hover:scale-110 active:scale-95 shadow-md hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedInfo(service.id);
                      }}
                      title="Подробнее"
                    >
                      <Info className="w-4 h-4 text-gray-800" />
                    </button>
                  </div>

                  {/* Content details strictly BELOW the image (Dodo / Yandex.Market) */}
                  <div className="p-4 pt-3 flex flex-col">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-xl leading-none">{service.id === 'photo' ? '📸' : '🎨'}</span>
                      <h4 className="text-[17px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#FF6022] transition-colors">{serviceName}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mb-4">
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1">
                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-[10px] text-gray-700 font-bold">{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1">
                        <span className="text-[10px] text-gray-700 font-bold">{service.extra}</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="w-full h-px bg-gray-100 mb-3.5" />

                    {/* Price & Selection CTA Panel (Dodo style) */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-400 font-semibold leading-none mb-0.5">Стоимость:</span>
                        <span className="text-base font-black text-[#FF6022] leading-none">
                          {service.price.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleService(service.id);
                        }}
                        className={`px-5 py-2.5 rounded-[16px] text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${
                          isSelected
                            ? "bg-[#22C55E] text-white shadow-[#22C55E]/20"
                            : "bg-[#FF6022]/10 text-[#FF6022] hover:bg-[#FF6022]/20 shadow-none"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Выбрано
                          </>
                        ) : (
                          "Выбрать"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <div
                className={`relative h-[300px] sm:h-[350px] rounded-[32px] overflow-hidden bg-white transition-all cursor-pointer group ${
                  isSelected ? "ring-4 shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
                }`}
                style={isSelected ? { boxShadow: `0 0 0 4px #FF6022, 0 0 24px #FF602240, 0 12px 40px #FF602220` } : {}}
                onClick={() => toggleService(service.id)}
              >
                <ImageWithFallback
                  src={getPublicUrl(service.image)}
                  alt={service.name}
                  className={`w-full h-full ${service.imageClass || 'object-cover'} transition-transform duration-700 group-hover:scale-110`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                {/* Top Left Badge */}
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#FF6022] to-[#FF8A00] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-2xl shadow-lg shadow-[#FF6022]/30 flex items-center gap-1 border border-white/20">
                  ⭐ Популярно
                </div>

                {/* Top Right Info Button */}
                <button
                  className="absolute top-4 right-4 bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-2 z-10 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6022]/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInfo(service.id);
                  }}
                >
                  <Info className="w-4 h-4" />Подробнее
                </button>

                {/* Bottom White Panel Overlay (Pill) */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[24px] p-4 shadow-2xl flex items-center justify-between border border-white/20">
                  <div className="flex-1 min-w-0 pr-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="text-xl leading-none">{service.id === 'photo' ? '📸' : '🎨'}</span>
                      <h4 className="text-[15px] font-bold text-[#1A1A1A] truncate">{serviceName}</h4>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md px-2 py-1">
                        <Clock className="w-3 h-3 text-[#747474]" />
                        <span className="text-[10px] text-[#1A1A1A] font-medium">{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md px-2 py-1">
                        <span className="text-[10px] text-[#1A1A1A] font-medium">{service.extra}</span>
                      </div>
                    </div>

                    <div className="mt-2.5">
                      <span className="text-[14px] text-[#FF6022] font-black">
                        {service.price.toLocaleString("ru-RU")} ₽
                      </span>
                    </div>
                  </div>

                  {/* Selection Checkbox */}
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? "text-white shadow-lg bg-[#FF6022]" : "bg-gray-50 text-[#D1D1D1] group-hover:bg-gray-100"
                    }`}
                    style={isSelected ? { boxShadow: `0 10px 15px -3px #FF60224d` } : {}}
                  >
                    <Check className="w-5 h-5 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {state.additionalServices.length > 0 && (
        <div className="bg-[#FF6022]/5 rounded-[24px] p-4 mb-6 text-center border border-[#FF6022]/20">
          <p className="text-sm text-[#FF6022] font-medium">
            Выбрано: {state.additionalServices.length} услуги ={" "}
            <span className="text-base font-extrabold">
              {state.additionalServices.reduce((acc, id) => {
                const s = SERVICES.find(x => x.id === id);
                return acc + (s?.price || 0);
              }, 0).toLocaleString("ru-RU")} ₽
            </span>
          </p>
        </div>
      )}

      {/* Info Popup Modal */}
      <AnimatePresence>
        {selectedInfo && selectedDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setSelectedInfo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh] relative z-10"
            >
              <div className="relative shrink-0">
                <div className={`aspect-[16/10] w-full bg-gradient-to-br ${selectedDetails.gradient} flex items-center justify-center`}>
                  <ImageWithFallback src={getPublicUrl(selectedDetails.image)} alt={selectedDetails.name} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => setSelectedInfo(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full text-[#1A1A1A] transition-colors hover:bg-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto overscroll-contain">
                <h3 className="text-2xl font-black text-[#1A1A1A] mb-1">{selectedDetails.name}</h3>
                <p className="text-[13px] text-[#FF6022] font-black mb-3">{selectedDetails.duration} · {selectedDetails.extra}</p>
                <p className="text-[#747474] text-sm leading-relaxed mb-6 font-medium">{selectedDetails.desc}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const isSelected = state.additionalServices.includes(selectedDetails.id);
                      if (!isSelected) {
                        updateState({ additionalServices: [...state.additionalServices, selectedDetails.id] });
                      }
                      setSelectedInfo(null);
                    }}
                    className={`flex-1 py-3.5 rounded-2xl font-bold text-center transition-all ${
                      state.additionalServices.includes(selectedDetails.id)
                        ? "bg-[#F5F5F5] text-[#747474]"
                        : "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                    }`}
                  >
                    {state.additionalServices.includes(selectedDetails.id) ? "Добавлено" : "Добавить в праздник"}
                  </button>

                  {state.additionalServices.includes(selectedDetails.id) && (
                    <button
                      onClick={() => {
                        updateState({ additionalServices: state.additionalServices.filter(id => id !== selectedDetails.id) });
                        setSelectedInfo(null);
                      }}
                      className="py-3.5 px-4 rounded-2xl font-bold text-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
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
    </>
  );
}
