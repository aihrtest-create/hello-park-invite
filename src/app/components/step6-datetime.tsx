import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Calendar, Clock, Users, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { format, isSameDay, isBefore, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";
import { isWeekendOrHoliday2026 } from "../data/holidays";

const TIME_SLOTS = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export function Step6DateTime() {
  const { state, updateState } = useWizard();
  const today = startOfDay(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Build 60-day forward strip (2 months ahead)
  const nextDays = useMemo(() => {
    const arr: Date[] = [];
    const d = startOfDay(new Date());
    for (let i = 0; i < 60; i++) {
      const day = new Date(d);
      day.setDate(d.getDate() + i);
      arr.push(day);
    }
    return arr;
  }, []);

  const scrollStrip = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      {/* ── Header ── */}
      <div className="text-center mb-7 px-4 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">📅</span>
          Дата и время
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">Когда состоится праздник?</p>
      </div>

      {/* ── Date strip ── */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#FF6022]" />
            <h3 className="text-[15px] font-bold text-[#1A1A1A]">Дата</h3>
          </div>
          {/* Scroll arrows — visible on all screen sizes */}
          <div className="flex gap-1.5">
            <button
              onClick={() => scrollStrip(-1)}
              aria-label="Назад"
              className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
            </button>
            <button
              onClick={() => scrollStrip(1)}
              aria-label="Вперёд"
              className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] active:scale-95 transition-all"
            >
              <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
            </button>
          </div>
        </div>

        {/* Horizontal scrollable strip — no scrollbar, cursor-grab on desktop */}
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-2 -mx-1 px-1 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          <div className="flex gap-2 w-max">
            {nextDays.map((day) => {
              const isPast = isBefore(day, today);
              const isSelected = state.date && isSameDay(day, state.date);
              const isWeekendDay = isWeekendOrHoliday2026(day);

              return (
                <button
                  key={day.toISOString()}
                  disabled={isPast}
                  onClick={() => updateState({ date: day, isWeekend: isWeekendDay })}
                  className={`
                    flex flex-col items-center justify-center
                    w-[60px] h-[76px]
                    rounded-2xl border transition-all shrink-0 active:scale-95
                    ${isSelected
                      ? "bg-[#FF6022] border-[#FF6022] text-white shadow-lg shadow-[#FF6022]/30"
                      : isPast
                      ? "bg-[#FAFAFA] border-[#F0F0F0] text-[#D5D5D5] cursor-not-allowed"
                      : isWeekendDay
                      ? "bg-[#FFF3EE] border-[#FF6022]/20 text-[#FF6022]"
                      : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-[#FF6022]/20"
                    }
                  `}
                >
                  <span className={`text-[11px] font-semibold mb-0.5 ${isSelected ? "text-white/80" : "text-[#ABABAB]"}`}>
                    {format(day, "EEE", { locale: ru })}
                  </span>
                  <span className="text-[22px] font-black leading-none">
                    {format(day, "d")}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${isSelected ? "text-white/70" : "text-[#ABABAB]"}`}>
                    {format(day, "MMM", { locale: ru })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {state.date && isWeekendOrHoliday2026(state.date) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-[#FFF3EE] rounded-xl px-3 py-2.5 border border-[#FF6022]/10 flex items-center gap-2"
          >
            <span className="text-base">🌅</span>
            <p className="text-xs text-[#FF6022] font-semibold">
              Выходной день — действуют выходные тарифы
            </p>
          </motion.div>
        )}
      </div>

      {/* ── Time slots ── */}
      <div id="time-section" className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[15px] font-bold text-[#1A1A1A]">Время начала</h3>
        </div>
        {/*
          7 кнопок: на узких (≤360px) — 4 колонки, остальное — тоже 4.
          Последний ряд (3 кнопки) центрируем через justify-start,
          сетка сама выравнивает. py-4 даёт большую зону тапа.
        */}
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((time) => (
            <button
              key={time}
              onClick={() => updateState({ time })}
              className={`
                py-4 rounded-2xl text-[15px] font-bold border-2 transition-all active:scale-95
                ${state.time === time
                  ? "bg-[#FF6022] border-[#FF6022] text-white shadow-lg shadow-[#FF6022]/30"
                  : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-[#FF6022]/20"
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* ── Guest count ── */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-[#FF6022]" />
          <h3 className="text-[15px] font-bold text-[#1A1A1A]">Количество гостей</h3>
        </div>

        <div className="space-y-3">
          {/* Children */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-5 border border-[#E5E5E5]">
            <div>
              <p className="text-[15px] font-semibold text-[#1A1A1A]">Дети</p>
              <p className="text-xs text-[#ABABAB]">Именинник + друзья</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateState({ childrenCount: Math.max(1, state.childrenCount - 1) })}
                className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E5E5] active:scale-95 transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-2xl font-bold text-[#1A1A1A] w-8 text-center">
                {state.childrenCount}
              </span>
              <button
                onClick={() => updateState({ childrenCount: state.childrenCount + 1 })}
                className="w-12 h-12 rounded-full bg-[#FF6022] flex items-center justify-center text-white active:scale-95 transition-all shadow-md shadow-[#FF6022]/30"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Adults */}
          <div className="flex items-center justify-between bg-white rounded-2xl p-5 border border-[#E5E5E5]">
            <div>
              <p className="text-[15px] font-semibold text-[#1A1A1A]">Взрослые</p>
              <p className="text-xs text-[#ABABAB]">Родители и сопровождающие</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => updateState({ adultsCount: Math.max(0, state.adultsCount - 1) })}
                className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E5E5] active:scale-95 transition-all"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-2xl font-bold text-[#1A1A1A] w-8 text-center">
                {state.adultsCount}
              </span>
              <button
                onClick={() => updateState({ adultsCount: state.adultsCount + 1 })}
                className="w-12 h-12 rounded-full bg-[#FF6022] flex items-center justify-center text-white active:scale-95 transition-all shadow-md shadow-[#FF6022]/30"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-[#ABABAB] mt-3 px-1 leading-relaxed">
          В пакеты включено 8 детей. Для более 8 детей условия проговариваются индивидуально с менеджером
        </p>
      </div>
    </motion.div>
  );
}
