import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

export function StepDisco() {
  const { state, updateState, nextStep, isExp } = useWizard();

  const handleSelect = (choice: "disco" | "trash_box") => {
    updateState({ discoChoice: choice });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-16"
    >
      <div className="text-center mb-8 px-4 pt-2">
        <h1 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex flex-col items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md">🪩</span>
          Выберите активность
        </h1>
        <p className="text-base font-bold text-[#747474] leading-relaxed max-w-[280px] mx-auto">
          Мини дискотека или треш-коробка <span className="text-[#007AFF]">20 мин</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {isExp ? (
          <>
            {/* Карточка: Мини дискотека в стиле Додо */}
            <div
              onClick={() => handleSelect("disco")}
              className={`group relative rounded-[28px] bg-white p-2 transition-all duration-300 cursor-pointer border flex flex-col ${
                state.discoChoice === "disco"
                  ? "scale-[1.02]"
                  : "border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
              }`}
              style={{
                borderColor: state.discoChoice === "disco" ? "#FF6022" : "rgba(0,0,0,0.04)",
                borderWidth: state.discoChoice === "disco" ? "2px" : "1px",
                boxShadow: state.discoChoice === "disco" 
                  ? "0 16px 36px rgba(255,96,34,0.15), 0 0 0 1px rgba(255,96,34,0.1)" 
                  : undefined
              }}
            >
              <div className="relative aspect-[4/3.1] w-full rounded-[20px] overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                <ImageWithFallback src={getPublicUrl("/activities/mini_disco.webp")} alt="Мини дискотека" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                <div className="absolute top-2 left-2 bg-[#FF6022] text-white text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                  Входит!
                </div>
              </div>

              <div className="p-2 pt-2.5 flex flex-col flex-1">
                <h4 className="text-[12px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#FF6022] transition-colors line-clamp-2 leading-snug flex-1">
                  Мини дискотека
                </h4>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 shrink-0">
                  <span className="text-[10px] text-gray-400 font-semibold">20 минут</span>
                  
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      state.discoChoice === "disco" ? "bg-[#FF6022] text-white shadow-sm" : "bg-gray-50 text-[#D1D1D1]"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Карточка: Треш-коробка в стиле Додо */}
            <div
              onClick={() => handleSelect("trash_box")}
              className={`group relative rounded-[28px] bg-white p-2 transition-all duration-300 cursor-pointer border flex flex-col ${
                state.discoChoice === "trash_box"
                  ? "scale-[1.02]"
                  : "border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
              }`}
              style={{
                borderColor: state.discoChoice === "trash_box" ? "#FF6022" : "rgba(0,0,0,0.04)",
                borderWidth: state.discoChoice === "trash_box" ? "2px" : "1px",
                boxShadow: state.discoChoice === "trash_box" 
                  ? "0 16px 36px rgba(255,96,34,0.15), 0 0 0 1px rgba(255,96,34,0.1)" 
                  : undefined
              }}
            >
              <div className="relative aspect-[4/3.1] w-full rounded-[20px] overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                <ImageWithFallback src={getPublicUrl("/activities/trash_box.webp")} alt="Треш-коробка" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                <div className="absolute top-2 left-2 bg-[#FF6022] text-white text-[8px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
                  Входит!
                </div>
              </div>

              <div className="p-2 pt-2.5 flex flex-col flex-1">
                <h4 className="text-[12px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#FF6022] transition-colors line-clamp-2 leading-snug flex-1">
                  Трэш-коробка
                </h4>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50 shrink-0">
                  <span className="text-[10px] text-gray-400 font-semibold">20 минут</span>
                  
                  <div 
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      state.discoChoice === "trash_box" ? "bg-[#FF6022] text-white shadow-sm" : "bg-gray-50 text-[#D1D1D1]"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Карточка: Мини дискотека */}
            <div
              onClick={() => handleSelect("disco")}
              className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                state.discoChoice === "disco" ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb] flex items-center justify-center">
                <ImageWithFallback src={getPublicUrl("/activities/mini_disco.webp")} alt="Мини дискотека" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                   <span className="text-[10px] font-bold text-[#FF6022] uppercase tracking-wide">Входит в пакет</span>
                </div>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    state.discoChoice === "disco" ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                }`}>
                   <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">Мини дискотека</h4>
              </div>
            </div>

            {/* Карточка: Треш-коробка */}
            <div
              onClick={() => handleSelect("trash_box")}
              className={`relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden transition-all cursor-pointer group ${
                state.discoChoice === "trash_box" ? "ring-2 ring-[#FF6022] shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ffecd2] to-[#fcb69f] flex items-center justify-center">
                <ImageWithFallback src={getPublicUrl("/activities/trash_box.webp")} alt="Треш-коробка" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-2 left-2 right-2 flex justify-between items-start z-10">
                <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                   <span className="text-[10px] font-bold text-[#FF6022] uppercase tracking-wide">Входит в пакет</span>
                </div>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    state.discoChoice === "trash_box" ? "bg-[#FF6022] border-2 border-white text-white shadow-md shadow-[#FF6022]/40" : "bg-white/40 backdrop-blur-md border border-white/60 text-transparent"
                }`}>
                   <Check className="w-4 h-4" />
                </div>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                 <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-tight line-clamp-2">Треш-коробка</h4>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
