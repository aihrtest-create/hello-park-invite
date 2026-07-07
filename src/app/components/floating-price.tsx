import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Send, ArrowLeft, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

export function FloatingPrice() {
  const { totalPrice, step, totalSteps, visibleSteps, state, nextStep, prevStep, submitted, setSubmitted, submitToAPI, clearCache, setStep, resetWizard } = useWizard();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Reset toast and shake when step changes
  useEffect(() => {
    setShowToast(false);
    setIsShaking(false);
  }, [step]);

  if (submitted || state.isQuestPopupOpen) return null;

  // ─── Optional steps: depends on mode ───
  // Custom mode: everything except date(1), package(2), and contact(12) is optional
  const isCustom = state.packageType === "custom";
  const isMegaOptionalStep =
    step === 9 ||
    (step === 8 && state.packageType === "basic") ||
    (step === 7 && state.packageType !== "exclusive");
  const isOptionalStep = isMegaOptionalStep || (isCustom
    ? step !== 1 && step !== 2 && step !== 12
    : step === 6 || step === 10 || step === 15 || step === 16);

  // ─── Mandatory validation ───
  const canProceed = (() => {
    // In custom mode, only date/package/contact are mandatory
    if (isCustom && step !== 1 && step !== 2 && step !== 12) return true;
    switch (step) {
      case 1: return !!state.date && !!state.time;
      case 2: return !!state.packageType;
      case 3: return !!state.questType;
      case 4: return (state.animators || []).length > 0;
      case 5: return state.packageType === "custom" ? true : !!state.patiroom;
      case 7: return state.packageType !== "exclusive" ? true : (state.shows || []).length > 0;
      case 8: return state.packageType === "basic" ? true : (state.masterClasses || []).length > 0;
      case 13: return !!state.discoChoice;
      case 14: return !!state.balloonChoice;
      case 12: {
        const phoneDigits = state.contactPhone ? state.contactPhone.replace(/\D/g, "") : "";
        return !!state.contactName && phoneDigits.length === 11;
      }
      default: return true;
    }
  })();

  // ─── Whether optional step has a selection ───
  const hasOptionalSelection = (() => {
    if (!isOptionalStep) return false;
    if (step === 3) return !!state.questType && state.questType !== "none";
    if (step === 4) return (state.animators || []).length > 0;
    if (step === 5) return !!state.patiroom;
    if (step === 6) return (state.cafeZones || []).length > 0;
    if (step === 7) return (state.shows || []).length > 0;
    if (step === 8) return (state.masterClasses || []).length > 0;
    if (step === 9) return state.megaOwnCatering || Object.values(state.megaFood).some(v => v > 0);
    if (step === 11) return true; // gifts step — always "selected" (just display)
    if (step === 15) return (state.additionalActivities || []).length > 0;
    if (step === 16) return (state.additionalServices || []).length > 0;
    return false;
  })();

  // ─── Validation messages ───
  const getValidationMessage = () => {
    switch (step) {
      case 1: {
        if (!state.date && !state.time) return "Выберите дату и время праздника";
        if (!state.date) return "Выберите дату праздника";
        return "Выберите время начала";
      }
      case 2: return "Выберите пакет для продолжения";
      case 3: return "Выберите квест для продолжения";
      case 4: return "Выберите героя для праздника";
      case 5: return "Выберите патирум для праздника";
      case 7: return "Выберите шоу-программу — 1 шоу уже включено в пакет";
      case 8: return "Выберите мастер-класс — 1 МК уже включён в пакет";
      case 13: return "Выберите диско или треш-коробку";
      case 14: return "Выберите шар-сюрприз или пиньяту";
      case 12: {
        if (!state.contactName) return "Укажите ваше имя";
        const phoneDigits = state.contactPhone ? state.contactPhone.replace(/\D/g, "") : "";
        if (phoneDigits.length < 11) return "Введите номер телефона полностью";
        return "Укажите номер телефона";
      }
      default: return "Сделайте выбор для продолжения";
    }
  };

  // ─── Handle navigation ───
  const handleNext = async () => {
    // Final step — submit
    if (step === 12) {
      const phoneDigits = state.contactPhone ? state.contactPhone.replace(/\D/g, "") : "";
      if (state.contactName && phoneDigits.length === 11) {
        setIsSubmitting(true);
        try {
          await submitToAPI(totalPrice);
        } catch {
          // Submit even if API fails — don't block the user
        }
        clearCache(); // Clear saved state after successful submission
        setSubmitted(true);
        setIsSubmitting(false);
      } else {
        // Trigger validation on final step too
        setIsShaking(true);
        setToastMessage(getValidationMessage());
        setShowToast(true);
        setTimeout(() => setIsShaking(false), 500);
        setTimeout(() => setShowToast(false), 2500);
      }
      return;
    }

    // Mandatory step without selection → shake + toast + scroll to missing element
    if (!canProceed && !isOptionalStep) {
      setIsShaking(true);
      setToastMessage(getValidationMessage());
      setShowToast(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setShowToast(false), 2500);

      // Smart scroll: target the specific missing element
      const scrollTarget = getScrollTarget();
      if (scrollTarget) {
        const el = document.getElementById(scrollTarget);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          // Pulse highlight effect
          el.classList.add("ring-2", "ring-[#FF6022]", "ring-offset-2", "transition-all");
          setTimeout(() => el.classList.remove("ring-2", "ring-[#FF6022]", "ring-offset-2", "transition-all"), 2000);
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Optional step or valid mandatory → proceed
    if (state.hasReachedSummary && step !== 12) {
      setStep(12);
    } else {
      nextStep();
    }
  };

  const currentDisplayStep = (visibleSteps || []).indexOf(step) + 1 || 1;
  const currentTotalSteps = (visibleSteps || []).length || totalSteps;

  // ─── Dynamic button styles ───
  const getButtonClasses = () => {
    const sizing = step > 1 ? "flex-[2]" : "w-full";
    const base = `${sizing} py-3.5 rounded-full shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2`;

    // Bonuses step — special gradient CTA
    if (step === 11) {
      return `${base} bg-gradient-to-r from-[#FF6022] to-[#FF8000] scale-[1.02] shadow-xl shadow-[#FF6022]/30 text-white font-bold`;
    }

    // Optional step without selection → outlined button
    if (isOptionalStep && !hasOptionalSelection) {
      return `${base} bg-white text-[#FF6022] border-2 border-[#FF6022] font-medium`;
    }

    // Mandatory step without selection → semi-transparent
    if (!canProceed && !isOptionalStep) {
      return `${base} bg-[#FF6022] text-white opacity-[0.45]`;
    }

    // Normal active state (valid selection or optional with selection)
    return `${base} bg-[#FF6022] text-white font-medium`;
  };

  const getNextButtonClasses = () => {
    const base = `h-[52px] rounded-full shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center px-6 whitespace-nowrap`;

    // Bonuses step — special gradient CTA
    if (step === 11) {
      return `${base} flex-1 bg-gradient-to-r from-[#FF6022] to-[#FF8000] scale-[1.02] shadow-xl shadow-[#FF6022]/30 text-white font-bold`;
    }

    // Optional step without selection → outlined button
    if (isOptionalStep && !hasOptionalSelection) {
      return `${base} bg-white text-[#FF6022] border border-[#FF6022] font-medium ${step === 1 ? 'flex-1' : ''}`;
    }

    // Mandatory step without selection → semi-transparent
    if (!canProceed && !isOptionalStep) {
      return `${base} bg-[#FF6022] text-white opacity-[0.45] ${step === 1 ? 'flex-1' : ''}`;
    }

    // Normal active state (valid selection or optional with selection)
    return `${base} bg-[#FF6022] text-white font-medium ${step === 1 ? 'flex-1' : ''}`;
  };

  return (
    <div 
      className="fixed left-3 right-3 z-50 max-w-lg mx-auto"
      style={{ bottom: 'calc(12px + env(safe-area-inset-bottom))' }}
    >
      <div className="relative p-[6px] flex flex-col gap-2 w-full">
        {/* Safari fix: isolate backdrop-filter into a separate absolute layer to prevent touch target offset bug */}
        <div 
          className="absolute inset-0 rounded-[40px] bg-white/65 backdrop-blur-[40px] saturate-[180%] border-[1.5px] border-white/85 pointer-events-none"
          style={{boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)', zIndex: -1}}
        />

        {/* ─── Validation Toast ─── */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ y: 10, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-[#1A1A1A] text-white text-[13px] font-medium px-5 py-3 rounded-2xl text-center shadow-xl"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Navigation & Price in one line ─── */}
        <div className="flex items-center gap-2">
          {/* Back Button */}
          {step > 1 && (
            <button
              onClick={prevStep}
              className="w-[48px] h-[48px] flex-shrink-0 bg-white/85 text-[#1A1A1A] rounded-full border border-white/90 shadow-sm flex items-center justify-center transition-all active:scale-[0.98]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Price Pill */}
          <AnimatePresence>
            {totalPrice > 0 && step !== 12 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="h-[48px] flex-1 bg-white/85 rounded-full border border-white/90 shadow-sm flex items-center px-2 gap-2 overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-[#FF6022] flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <span className="text-[9px] text-[#ABABAB] uppercase tracking-wider leading-none mb-0.5">Итого</span>
                  <span className="text-[14px] font-medium text-[#1A1A1A] leading-none truncate">
                    {totalPrice.toLocaleString("ru-RU")} ₽
                  </span>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#ABABAB] hover:text-[#FF6022] hover:bg-[#FF6022]/10 transition-colors flex-shrink-0 mr-1"
                  title="Очистить корзину"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next Button */}
          <motion.button
            onClick={handleNext}
            animate={isShaking ? { x: [0, -8, 8, -6, 6, -3, 3, 0] } : { x: 0 }}
            transition={isShaking ? { duration: 0.4, ease: "easeInOut" } : { duration: 0 }}
            className={getNextButtonClasses() + (totalPrice === 0 || step === 12 ? ' flex-1' : '')}
          >
            {step === 12 ? (
              isSubmitting ? (
                <>Отправляем...</>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>Оставить заявку</span>
                </div>
              )
            ) : step === 11 ? (
              <div className="flex items-center gap-2">
                <span className="text-lg animate-bounce">🎁</span>
                <span>Забрать подарки</span>
              </div>
            ) : state.hasReachedSummary ? (
              "Вернуться к итогам"
            ) : isOptionalStep && !hasOptionalSelection ? (
              "Пропустить"
            ) : (
              "Продолжить"
            )}
          </motion.button>
        </div>
      </div>

      {/* ─── Custom Reset Confirm Modal ─── */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-center text-[#1A1A1A] mb-2">Очистить корзину?</h3>
              <p className="text-sm text-center text-[#747474] mb-6">
                Вы уверены, что хотите удалить все выбранные услуги и начать заново?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-3 rounded-xl font-semibold bg-[#F5F5F5] text-[#1A1A1A] hover:bg-[#E5E5E5] transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => {
                    setShowResetConfirm(false);
                    resetWizard();
                  }}
                  className="flex-1 py-3 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
                >
                  Очистить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
