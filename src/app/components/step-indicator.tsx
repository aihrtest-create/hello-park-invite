import { useWizard } from "./wizard-context";
import { Check } from "lucide-react";
import { useEffect, useRef } from "react";

// Map stepNum (1-12) → label
const STEP_LABEL_MAP: Record<number, string> = {
  1: "Дата",
  2: "Пакет",
  3: "Формат",
  4: "Герои",
  5: "Патирум",
  6: "Взрослым",
  7: "Шоу",
  8: "МК",
  9: "Еда",
  10: "Торты",
  11: "Бонусы",
  12: "Заявка",
  13: "Активность",
  14: "Финал",
  15: "Активности",
  16: "Доп услуги",
  17: "Гости",
};

export function StepIndicator() {
  const { step, setStep, visibleSteps, state } = useWizard();
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentRef = useRef<HTMLButtonElement>(null);

  const stepsToRender = visibleSteps || [1, 2, 3, 4, 5, 7, 8, 13, 14, 6, 10, 11, 16, 9, 12];
  const currentIndex = stepsToRender.indexOf(step);

  // Auto-scroll current step into center
  useEffect(() => {
    if (currentRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = currentRef.current;
      const scrollLeft = el.offsetLeft - container.clientWidth / 2 + el.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [step]);

  return (
    <div className="w-full pt-2 pb-3 relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex items-start gap-1 overflow-x-auto px-5 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {stepsToRender.map((stepNum, i) => {
          const displayNum = i + 1;
          const label = STEP_LABEL_MAP[stepNum] || `${stepNum}`;
          const thisStepIndex = i;
          const isCompleted = state.hasReachedSummary || currentIndex > thisStepIndex;
          const isCurrent = step === stepNum;
          const canNavigate = state.hasReachedSummary || thisStepIndex <= currentIndex;

          return (
            <button
              key={stepNum}
              ref={isCurrent ? currentRef : undefined}
              onClick={() => canNavigate && setStep(stepNum)}
              disabled={!canNavigate}
              className="flex flex-col items-center flex-shrink-0 min-w-[48px] py-1 group"
            >
              {/* Circle */}
              <div
                className={`w-[34px] h-[34px] rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? isCompleted
                      ? "bg-[#FF6022] text-white ring-[2px] ring-[#FF6022] ring-offset-[2px] ring-offset-white"
                      : "bg-white text-[#FF6022] ring-[2.5px] ring-[#FF6022] shadow-[0_0_0_4px_rgba(255,96,34,0.1)]"
                    : isCompleted
                    ? "bg-[#FF6022] text-white shadow-sm"
                    : "bg-[#F0F0F0] text-[#ABABAB]"
                }`}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : isCompleted && isCurrent ? (
                  <span className="text-[12px] font-bold text-white">{displayNum}</span>
                ) : (
                  <span className={`text-[12px] font-bold ${isCurrent ? "text-[#FF6022]" : ""}`}>
                    {displayNum}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] mt-1.5 font-semibold whitespace-nowrap transition-colors ${
                  isCurrent
                    ? "text-[#FF6022]"
                    : isCompleted
                    ? "text-[#FF6022]/70"
                    : "text-[#ABABAB]"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
