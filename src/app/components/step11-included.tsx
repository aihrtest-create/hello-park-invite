import { useWizard, getCustomGifts } from "./wizard-context";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Check } from "lucide-react";

// The mapping of packages to their display names
const PACKAGE_NAMES: Record<string, string> = {
  basic: "Базовый",
  premium: "Премиум",
  exclusive: "Эксклюзив",
};

// All possible included extras
const ALL_EXTRAS = [
  {
    id: "photographer",
    name: "Фотограф 2 часа",
    gradient: "from-[#ffd194] to-[#70e1f5]",
    emoji: "📸",
    packages: ["exclusive"]
  },
  {
    id: "wow",
    name: "WOW поздравление",
    gradient: "from-[#a1c4fd] to-[#c2e9fb]",
    emoji: "🎉",
    packages: ["basic", "premium", "exclusive"]
  },
  {
    id: "gift",
    name: "Подарок имениннику",
    gradient: "from-[#a18cd1] to-[#fbc2eb]",
    emoji: "🎁",
    packages: ["basic", "premium", "exclusive"]
  },
  {
    id: "invite",
    name: "Электронные пригласительные",
    gradient: "from-[#d4fc79] to-[#96e6a1]",
    emoji: "✉️",
    packages: ["basic", "premium", "exclusive"]
  },
  {
    id: "balloon_decor",
    name: "Украшение шарами",
    gradient: "from-[#fbc2eb] to-[#a6c1ee]",
    emoji: "🎈",
    packages: ["basic", "premium", "exclusive"]
  },
  {
    id: "balloon",
    name: "Шар-сюрприз",
    gradient: "from-[#ffecd2] to-[#fcb69f]",
    emoji: "🎊",
    packages: ["premium", "exclusive"]
  },
  {
    id: "pinata",
    name: "Пиньята / Шар-цифра",
    gradient: "from-[#ff9a9e] to-[#fecfef]",
    emoji: "🪅",
    packages: ["exclusive"]
  },
  {
    id: "gifts_all",
    name: "Подарки всем гостям",
    gradient: "from-[#84fab0] to-[#8fd3f4]",
    emoji: "🛍️",
    packages: ["premium", "exclusive"]
  }
];

export function Step11Included() {
  const { state, isExp } = useWizard();

  const isCustom = state.packageType === "custom";
  const customGifts = isCustom ? getCustomGifts(state) : [];

  useEffect(() => {
    if (isCustom && customGifts.length === 0) return;
    
    // Add canvas-confetti dynamically
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js";
    script.onload = () => {
      if ((window as any).confetti) {
        (window as any).confetti({ 
            particleCount: 120, 
            spread: 80, 
            origin: { y: 0.6 },
            colors: ['#FF6022', '#6C4AED', '#FFD700', '#FF8A50']
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [state.packageType]);

  const packageName = state.packageType ? PACKAGE_NAMES[state.packageType] || "" : "";
  const displayExtras = isCustom ? customGifts : ALL_EXTRAS.filter(extra => state.packageType && extra.packages.includes(state.packageType));

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6 pt-10" // Added pt-10 so the bounce emoji isn't cut off by the header
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center text-6xl mb-5 animate-bounce hover:scale-110 transition-transform cursor-pointer drop-shadow-md">
            🎁
        </div>
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight">Приятные бонусы!</h2>
        <p className="text-sm text-[#747474] leading-relaxed">
          {isCustom ? (
            <>Вот что вы получите в подарок!</>
          ) : (
            <>А ещё в пакет <strong className="text-[#FF6022] uppercase tracking-wide bg-[#FF6022]/10 px-2 py-0.5 rounded-md mx-1">{packageName}</strong> уже включены эти подарки:</>
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {displayExtras.map((item, index) => {
          if (isExp) {
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-[28px] bg-white p-2 border border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all duration-300 flex flex-col"
              >
                <div className={`relative aspect-[4/3.1] w-full rounded-[20px] overflow-hidden bg-gradient-to-br ${item.gradient} flex items-center justify-center shrink-0`}>
                  <span className="text-4xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">
                    {item.emoji}
                  </span>
                </div>

                <div className="p-2 pt-3 flex flex-col flex-1 text-center justify-between items-center">
                  <h4 className="text-[12px] font-black text-[#1A1A1A] tracking-tight leading-snug line-clamp-2 flex items-center justify-center min-h-[34px] w-full">
                    {typeof item.name === "string" && item.name.includes("2 часа") ? (
                      <>Фотограф <span className="text-[#FF6022] ml-1">2 часа</span></>
                    ) : (
                      item.name
                    )}
                  </h4>
                  <div className="mt-2.5 inline-flex items-center gap-1 bg-[#FF6022]/10 px-2.5 py-1 rounded-full shadow-sm">
                    <Check className="w-3 h-3 text-[#FF6022] stroke-[3px]" />
                    <span className="text-[10px] font-extrabold text-[#FF6022] uppercase tracking-wider">Включено</span>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative aspect-[4/5] sm:h-[280px] rounded-[24px] overflow-hidden group shadow-md border border-[#E5E5E5]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                  <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-6 group-hover:scale-110 transition-transform duration-500">{item.emoji}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-2 left-2 right-2 flex justify-end z-10">
                <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                   <Check className="w-3 h-3 text-[#FF6022]" />
                   <span className="text-[10px] font-bold text-[#FF6022] uppercase tracking-wide">Включено</span>
                </div>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[18px] p-2.5 shadow-lg flex flex-col justify-center border border-white/30 text-center min-h-[50px]">
                 <h4 className="text-[12px] font-bold text-[#1A1A1A] leading-tight mb-1">
                   {typeof item.name === "string" && item.name.includes("2 часа") ? (
                     <>Фотограф <span className="text-[#FF6022]">2 часа</span></>
                   ) : (
                     item.name
                   )}
                 </h4>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
