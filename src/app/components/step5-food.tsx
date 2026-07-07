import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { Check, UtensilsCrossed, Minus, Plus, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { MEGA_FOOD_CATEGORIES, getMegaFoodTotal } from "../data/megaConfig";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

const KIDS_SET_ITEMS = [
  { name: "Пицца Маргарита", quantity: 2, emoji: "🍕" },
  { name: "Пицца Пепперони", quantity: 1, emoji: "🍕" },
  { name: "Пицца 4 сыра", quantity: 1, emoji: "🧀" },
  { name: "Наггетсы", quantity: 4, emoji: "🍗" },
  { name: "Картофель фри", quantity: 4, emoji: "🍟" },
  { name: "Овощной котёнок", quantity: 4, emoji: "🥗" },
  { name: "Фруктовый медвеж-к", quantity: 2, emoji: "🍉" },
  { name: "Морс клюквенный (1л)", quantity: 4, emoji: "🧃" },
  { name: "Вода б/г (1л)", quantity: 4, emoji: "💧" },
];

export function Step5Food() {
  return <MegaFoodStep />;
}


const getDetailEmoji = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("наггетс")) return "🍗";
  if (lower.includes("фри") || lower.includes("картофель")) return "🍟";
  if (lower.includes("кесадиль")) return "🌮";
  if (lower.includes("шашлыч")) return "🍢";
  if (lower.includes("фрукт")) return "🍊";
  if (lower.includes("пицц")) return "🍕";
  if (lower.includes("овощ")) return "🥗";
  if (lower.includes("морси") || lower.includes("морс")) return "🧃";
  if (lower.includes("вод")) return "💧";
  return "🍽️";
};

const getDrinkEmoji = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("морс")) return "🧃";
  if (lower.includes("кола")) return "🥤";
  if (lower.includes("сок")) return "🍎";
  if (lower.includes("вода")) return "💧";
  if (lower.includes("чай")) return "🍵";
  if (lower.includes("кофе") || lower.includes("американо") || lower.includes("капучино") || lower.includes("латте") || lower.includes("эспрессо")) return "☕";
  return "🥤";
};

function MegaFoodStep() {
  const { state, updateState, isExp } = useWizard();
  const total = getMegaFoodTotal(state.megaFood);

  const updateMegaQty = (id: string, delta: number) => {
    const current = state.megaFood[id] || 0;
    const next = Math.max(0, current + delta);
    const newFood = { ...state.megaFood, [id]: next };
    const hasFood = Object.values(newFood).some(v => v > 0);
    updateState({
      megaFood: newFood,
      megaOwnCatering: hasFood ? false : state.megaOwnCatering
    });
  };

  const setMegaQty = (id: string, qty: number) => {
    const next = Math.max(0, qty);
    const newFood = { ...state.megaFood, [id]: next };
    const hasFood = Object.values(newFood).some(v => v > 0);
    updateState({
      megaFood: newFood,
      megaOwnCatering: hasFood ? false : state.megaOwnCatering
    });
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
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md">🍽️</span>
          Еда
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          Комбо-обеды рассчитаны на 8 детей. Количество сетов можно изменить.
        </p>
      </div>

      {/* Свой кейтеринг */}
      <button
        type="button"
        onClick={() => {
          const nextOwnCatering = !state.megaOwnCatering;
          updateState({
            megaOwnCatering: nextOwnCatering,
            megaFood: nextOwnCatering ? {} : state.megaFood
          });
        }}
        className={`w-full text-left rounded-[32px] border-2 p-6 mb-8 transition-all duration-300 relative overflow-hidden group ${
          state.megaOwnCatering
            ? "bg-gradient-to-br from-[#FFF5F2] to-[#FFF0EC] border-[#FF6022] shadow-xl shadow-[#FF6022]/10"
            : "bg-white border-[#E5E5E5] shadow-sm hover:shadow-md hover:border-gray-300"
        }`}
      >
        <div className="absolute right-[-10px] top-[-10px] text-7xl opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-300">
          🍓
        </div>
        <div className="flex items-start justify-between gap-4 relative z-10">
          <div className="flex-1">
            <div className={`text-xs font-black uppercase tracking-wider mb-1.5 ${
              state.megaOwnCatering ? "text-[#FF6022]" : "text-[#747474]"
            }`}>
              Без расчета в смете
            </div>
            <h3 className="text-xl font-black text-[#1A1A1A] mb-2">Свой кейтеринг</h3>
            <p className="text-sm font-semibold text-[#747474] leading-relaxed">
              Можно принести торт, фрукты, овощи и сладкие угощения. Соки и воды приобретаются в парке.
            </p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border transition-all ${
            state.megaOwnCatering
              ? "bg-[#FF6022] border-[#FF6022] text-white shadow-md shadow-[#FF6022]/30"
              : "bg-[#F5F5F5] border-[#E5E5E5] text-[#C4C4C4]"
          }`}>
            <Check className="w-5 h-5 stroke-[3px]" />
          </div>
        </div>
      </button>

      {/* Категории меню */}
      <div className="flex flex-col gap-10">
        {MEGA_FOOD_CATEGORIES.map((category) => {
          const isCombo = category.id === "udc" || category.id === "osterio";
          
          return (
            <section key={category.id} className="relative">
              <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-3">
                <span className="text-3xl filter drop-shadow-sm">{category.icon}</span>
                <div>
                  <h3 className="text-xl font-black text-[#1A1A1A] leading-tight">{category.title}</h3>
                  {category.note && (
                    <span className="inline-flex items-center mt-1 text-[11px] font-black uppercase tracking-wide bg-[#F5F5F5] text-[#747474] px-2.5 py-0.5 rounded-full">
                      {category.note}
                    </span>
                  )}
                </div>
              </div>

              {isCombo ? (
                // Рендеринг красивых карточек комбо-обедов
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.map((item) => {
                    const qty = state.megaFood[item.id] || 0;
                    const isSelected = qty > 0;
                    
                    if (isExp) {
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (qty === 0) {
                              setMegaQty(item.id, 1);
                            } else {
                              setMegaQty(item.id, 0);
                            }
                          }}
                          className={`group relative flex flex-col justify-between rounded-[32px] bg-white p-2.5 transition-all duration-300 cursor-pointer border ${
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
                          <div>
                            {item.image && (
                              <div className="relative w-full h-56 rounded-[24px] bg-[#F8F9FA] overflow-hidden flex items-center justify-center mb-4 transition-colors duration-300 shrink-0">
                                <img
                                  src={getPublicUrl(item.image)}
                                  alt={item.name}
                                  className="w-full h-full object-cover filter drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out"
                                />
                                {isSelected && (
                                  <div className="absolute top-3 right-3 bg-[#FF6022] text-white rounded-full p-1.5 shadow-md shadow-[#FF6022]/20">
                                    <Check className="w-4 h-4 stroke-[3px]" />
                                  </div>
                                )}
                              </div>
                            )}

                            <div className="px-2 pt-1">
                              <div className="flex items-start justify-between gap-3 mb-1">
                                <h4 className="text-lg font-black text-[#1A1A1A] leading-tight group-hover:text-[#FF6022] transition-colors">{item.name}</h4>
                                <p className="text-lg font-black text-[#FF6022] shrink-0">
                                  {item.price.toLocaleString("ru-RU")} ₽
                                </p>
                              </div>
                              {item.subtitle && (
                                <p className="text-xs text-[#747474] font-semibold mt-1 mb-3">{item.subtitle}</p>
                              )}
                            </div>
                          </div>

                          {item.details.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3 mb-5 px-2">
                              {item.details.map((detail) => (
                                <span
                                  key={detail}
                                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full border shadow-sm transition-all ${
                                    isSelected 
                                      ? "bg-white border-[#FF6022]/15 text-[#1A1A1A]" 
                                      : "bg-gray-50/60 border-gray-100 text-[#747474]"
                                  }`}
                                >
                                  <span>{getDetailEmoji(detail)}</span>
                                  <span className="leading-none">{detail}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto px-2 pb-2.5">
                            {qty === 0 ? (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMegaQty(item.id, 1);
                                }}
                                className="w-full py-3.5 rounded-2xl bg-white hover:bg-[#FF6022] text-[#FF6022] hover:text-white border border-[#FF6022]/20 hover:border-[#FF6022] text-sm font-black transition-all duration-200 shadow-sm active:scale-[0.98]"
                              >
                                Добавить в заказ
                              </button>
                            ) : (
                              <div 
                                className="flex items-center justify-between bg-white rounded-2xl p-1.5 border border-[#FF6022]/20 shadow-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); updateMegaQty(item.id, -1); }}
                                  className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-[#1A1A1A] font-bold transition-colors active:scale-90"
                                >
                                  <Minus className="w-4 h-4 stroke-[3px]" />
                                </button>
                                <span className="text-sm font-black text-[#1A1A1A] select-none">
                                  {qty} {qty === 1 ? "сет" : qty < 5 ? "сета" : "сетов"}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); updateMegaQty(item.id, 1); }}
                                  className="w-9 h-9 rounded-xl bg-[#FF6022] hover:bg-[#E05018] flex items-center justify-center text-white font-bold transition-colors shadow-sm active:scale-90"
                                >
                                  <Plus className="w-4 h-4 stroke-[3px]" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }

                    // Curated backgrounds for cafe styles
                    const bgStyle = category.id === "udc"
                      ? (qty > 0 ? "bg-gradient-to-br from-[#FFFBF8] to-[#FFF3EB] border-[#FF6022] shadow-lg shadow-[#FF6022]/5" : "bg-gradient-to-br from-[#FFFDFB] to-[#FFF9F5] border-[#FFE3CD] hover:border-[#FFD0B0]")
                      : (qty > 0 ? "bg-gradient-to-br from-[#FAFBF9] to-[#EFF5E9] border-[#FF6022] shadow-lg shadow-[#FF6022]/5" : "bg-gradient-to-br from-[#FCFDFB] to-[#F5F8F2] border-[#E4ECD9] hover:border-[#D1DEBF]");

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (qty === 0) {
                            setMegaQty(item.id, 1);
                          } else {
                            setMegaQty(item.id, 0);
                          }
                        }}
                        className={`group relative flex flex-col justify-between rounded-[32px] border-2 p-5 transition-all duration-300 cursor-pointer ${bgStyle}`}
                      >
                        <div>
                          {/* Картинка блюда с эффектом парения */}
                          {item.image && (
                            <div className="relative w-full h-56 rounded-2xl bg-white/80 overflow-hidden flex items-center justify-center mb-4 shadow-inner group-hover:bg-white transition-colors duration-300">
                              <img
                                src={getPublicUrl(item.image)}
                                alt={item.name}
                                className="w-full h-full object-cover filter drop-shadow-md group-hover:scale-105 group-hover:-translate-y-1.5 transition-transform duration-500 ease-out"
                              />
                              {qty > 0 && (
                                <div className="absolute top-3 right-3 bg-[#FF6022] text-white rounded-full p-1.5 shadow-md shadow-[#FF6022]/20 scale-100 animate-in fade-in zoom-in duration-200">
                                  <Check className="w-4 h-4 stroke-[3px]" />
                                </div>
                              )}
                            </div>
                          )}

                          <div className="px-1">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-lg font-black text-[#1A1A1A] leading-tight">{item.name}</h4>
                              <p className="text-lg font-black text-[#FF6022] shrink-0">
                                {item.price.toLocaleString("ru-RU")} ₽
                              </p>
                            </div>
                            {item.subtitle && (
                              <p className="text-xs font-bold text-[#747474] mb-3">{item.subtitle}</p>
                            )}
                          </div>
                        </div>

                        {/* Состав комбо в виде красивых тегов */}
                        {item.details.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3 mb-5 px-1">
                            {item.details.map((detail) => (
                              <span
                                key={detail}
                                className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/90 border border-black/5 text-[#404040] shadow-sm"
                              >
                                <span>{getDetailEmoji(detail)}</span>
                                <span className="leading-none">{detail}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Кнопка добавления / Счётчик порций */}
                        <div className="mt-auto px-1 pt-2">
                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setMegaQty(item.id, 1);
                              }}
                              className="w-full py-3 rounded-2xl bg-white hover:bg-[#FF6022] text-[#FF6022] hover:text-white border border-[#FF6022]/20 hover:border-[#FF6022] text-sm font-black transition-all duration-200 shadow-sm active:scale-[0.98]"
                            >
                              Добавить в заказ
                            </button>
                          ) : (
                            <div 
                              className="flex items-center justify-between bg-white rounded-2xl p-1.5 border border-[#FF6022]/20 shadow-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); updateMegaQty(item.id, -1); }}
                                className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-[#1A1A1A] font-bold transition-colors active:scale-90"
                              >
                                <Minus className="w-4 h-4 stroke-[3px]" />
                              </button>
                              <span className="text-sm font-black text-[#1A1A1A] select-none">
                                {qty} {qty === 1 ? "сет" : qty < 5 ? "сета" : "сетов"}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); updateMegaQty(item.id, 1); }}
                                className="w-9 h-9 rounded-xl bg-[#FF6022] hover:bg-[#E05018] flex items-center justify-center text-white font-bold transition-colors shadow-sm active:scale-90"
                              >
                                <Plus className="w-4 h-4 stroke-[3px]" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Рендеринг компактного списка напитков в виде плитки
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {category.items.map((item) => {
                    const qty = state.megaFood[item.id] || 0;
                    
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl border p-3 flex items-center justify-between gap-3 transition-all duration-200 ${
                          qty > 0
                            ? "bg-[#FFF5F2] border-[#FF6022]/40 shadow-sm"
                            : "bg-white border-[#E5E5E5] shadow-sm hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Круглая иконка напитка */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                            qty > 0 ? "bg-[#FF6022]/10" : "bg-[#F8F9FA]"
                          }`}>
                            {getDrinkEmoji(item.name)}
                          </div>
                          
                          <div className="min-w-0">
                            <h4 className="text-xs font-black text-[#1A1A1A] leading-tight truncate">
                              {item.name}
                            </h4>
                            {item.subtitle && (
                              <p className="text-[10px] font-bold text-[#747474] mt-0.5">{item.subtitle}</p>
                            )}
                            <p className="text-xs font-black text-[#FF6022] mt-1">
                              {item.price.toLocaleString("ru-RU")} ₽
                            </p>
                          </div>
                        </div>

                        {/* Контроль количества для напитков */}
                        <div className="shrink-0">
                          {qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => setMegaQty(item.id, 1)}
                              className="h-8 px-3 rounded-xl bg-gray-50 hover:bg-[#FF6022] text-[#1A1A1A] hover:text-white border border-gray-200 hover:border-[#FF6022] text-[11px] font-black transition-all active:scale-95"
                            >
                              + Добавить
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 bg-white px-1.5 py-1 rounded-xl border border-[#FF6022]/20 shadow-sm">
                              <button
                                type="button"
                                onClick={() => updateMegaQty(item.id, -1)}
                                className="w-6 h-6 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-[#1A1A1A] active:scale-90"
                              >
                                <Minus className="w-3 h-3 stroke-[3px]" />
                              </button>
                              <span className="text-xs font-black text-[#1A1A1A] min-w-[12px] text-center select-none">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateMegaQty(item.id, 1)}
                                className="w-6 h-6 rounded-lg bg-[#FF6022] hover:bg-[#E05018] flex items-center justify-center text-white active:scale-90"
                              >
                                <Plus className="w-3 h-3 stroke-[3px]" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Итоговая плашка питания в смете */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 rounded-[32px] bg-gradient-to-r from-[#1A1A1A] to-[#2E2E2E] text-white p-6 flex items-center justify-between shadow-xl relative overflow-hidden"
        >
          <div className="absolute left-[-20px] bottom-[-20px] text-8xl opacity-5 pointer-events-none">
            🍕
          </div>
          <div className="relative z-10">
            <span className="text-[11px] font-black uppercase tracking-wider text-white/50 block mb-0.5">
              Предварительный расчёт
            </span>
            <span className="text-sm font-bold text-white/80">Еда и напитки в смете</span>
          </div>
          <span className="text-3xl font-black text-white relative z-10">
            {total.toLocaleString("ru-RU")} ₽
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
