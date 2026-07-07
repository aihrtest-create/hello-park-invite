import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Users, Minus, Plus } from "lucide-react";

export function StepCustomGuests() {
  const { state, updateState, nextStep } = useWizard();

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      <div className="text-center mb-8 px-4 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🎟️</span>
          Количество гостей
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          Укажите точное число участников
        </p>
      </div>

      <div className="mb-6">
        <div className="space-y-3">
          {/* Children */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm">
            <div>
              <p className="text-lg font-bold text-[#1A1A1A]">Дети</p>
              <p className="text-sm text-[#ABABAB]">Именинник + друзья</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  updateState({
                    childrenCount: Math.max(1, state.childrenCount - 1),
                  })
                }
                className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E5E5] active:scale-95 transition-transform"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-2xl font-bold text-[#1A1A1A] w-10 text-center">
                {state.childrenCount}
              </span>
              <button
                onClick={() =>
                  updateState({ childrenCount: state.childrenCount + 1 })
                }
                className="w-10 h-10 rounded-full bg-[#FF6022] flex items-center justify-center text-white active:scale-95 transition-transform shadow-md shadow-[#FF6022]/30"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Adults */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#E5E5E5] shadow-sm">
            <div>
              <p className="text-lg font-bold text-[#1A1A1A]">Взрослые</p>
              <p className="text-sm text-[#ABABAB]">Родители и сопровождающие</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  updateState({
                    adultsCount: Math.max(0, state.adultsCount - 1),
                  })
                }
                className="w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E5E5] active:scale-95 transition-transform"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-2xl font-bold text-[#1A1A1A] w-10 text-center">
                {state.adultsCount}
              </span>
              <button
                onClick={() =>
                  updateState({ adultsCount: state.adultsCount + 1 })
                }
                className="w-10 h-10 rounded-full bg-[#FF6022] flex items-center justify-center text-white active:scale-95 transition-transform shadow-md shadow-[#FF6022]/30"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#ABABAB] mt-3 px-1 leading-relaxed text-center">
          В тарифе «Соберу сам» каждый детский билет оплачивается отдельно (+1250 ₽ в будни / +1650 ₽ в выходные).
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <button
            onClick={nextStep}
            className="w-full py-4 rounded-2xl text-white text-[16px] font-bold transition-all duration-200 active:scale-[0.97]"
            style={{
              background: "#FF6022",
              boxShadow: "0 6px 24px rgba(255, 96, 34, 0.35)",
            }}
          >
            Продолжить
          </button>
        </div>
      </div>
    </motion.div>
  );
}
