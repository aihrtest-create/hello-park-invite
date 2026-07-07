import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar,
  Clock,
  Users,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { ru } from "date-fns/locale";

// ─── Helpers ────────────────────────────────────────────────────────────────

const TIME_SLOTS = ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const WEEKDAY_NAMES = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function isWeekendDay(day: Date) {
  const d = day.getDay();
  return d === 0 || d === 6;
}

function useCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfDay(new Date());

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    let dow = getDay(start);
    dow = dow === 0 ? 6 : dow - 1;
    return [...Array(dow).fill(null), ...days];
  }, [currentMonth]);

  return { currentMonth, setCurrentMonth, calendarDays, today };
}

// ─── Shared label ────────────────────────────────────────────────────────────

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[#FF6022]">{icon}</span>
      <span className="text-[15px] font-bold text-[#1A1A1A]">{label}</span>
    </div>
  );
}

// ─── Counter ────────────────────────────────────────────────────────────────

function Counter({
  label,
  sublabel,
  value,
  min,
  onChange,
}: {
  label: string;
  sublabel: string;
  value: number;
  min: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between bg-white rounded-2xl p-5 border border-[#E5E5E5]">
      <div>
        <p className="text-[15px] font-semibold text-[#1A1A1A]">{label}</p>
        <p className="text-xs text-[#ABABAB]">{sublabel}</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="w-12 h-12 rounded-full bg-[#F5F5F5] flex items-center justify-center text-[#1A1A1A] hover:bg-[#E5E5E5] active:scale-95 transition-all"
        >
          <Minus className="w-5 h-5" />
        </button>
        <span className="text-2xl font-bold text-[#1A1A1A] w-8 text-center">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-12 h-12 rounded-full bg-[#FF6022] flex items-center justify-center text-white active:scale-95 transition-all shadow-md shadow-[#FF6022]/30"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// VARIANT A — Horizontal scroll date strip + big pill time buttons
// =============================================================================

function VariantA() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [children, setChildren] = useState(6);
  const [adults, setAdults] = useState(2);
  const scrollRef = useRef<HTMLDivElement>(null);

  const nextDays = useMemo(() => {
    const arr: Date[] = [];
    const d = startOfDay(new Date());
    for (let i = 0; i < 45; i++) {
      const day = new Date(d);
      day.setDate(d.getDate() + i);
      arr.push(day);
    }
    return arr;
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel icon={<Calendar className="w-5 h-5" />} label="Дата" />
          <div className="flex gap-1.5">
            <button
              onClick={() => scrollBy(-1)}
              className="w-8 h-8 rounded-xl bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-[#1A1A1A]" />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="w-8 h-8 rounded-xl bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] active:scale-95 transition-all"
            >
              <ChevronRight className="w-4 h-4 text-[#1A1A1A]" />
            </button>
          </div>
        </div>

        {/* scroll-auto + cursor-grab for desktop mouse drag feel */}
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-2 -mx-1 px-1 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none" }}
        >
          <div className="flex gap-2 w-max">
            {nextDays.map((day) => {
              const sel = selectedDate && isSameDay(day, selectedDate);
              const weekend = isWeekendDay(day);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-col items-center justify-center w-[62px] h-[76px] rounded-2xl border transition-all shrink-0 active:scale-95 ${
                    sel
                      ? "bg-[#FF6022] border-[#FF6022] text-white shadow-lg shadow-[#FF6022]/30"
                      : weekend
                      ? "bg-[#FFF3EE] border-[#FF6022]/20 text-[#FF6022]"
                      : "bg-white border-[#E5E5E5] text-[#1A1A1A]"
                  }`}
                >
                  <span className={`text-[11px] font-semibold mb-1 ${sel ? "text-white/80" : "text-[#ABABAB]"}`}>
                    {format(day, "EEE", { locale: ru })}
                  </span>
                  <span className="text-[22px] font-black leading-none">{format(day, "d")}</span>
                  <span className={`text-[10px] mt-1 ${sel ? "text-white/70" : "text-[#ABABAB]"}`}>
                    {format(day, "MMM", { locale: ru })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        {selectedDate && isWeekendDay(selectedDate) && (
          <p className="text-xs text-[#FF6022] mt-2 px-1">📅 Выходной — действуют выходные тарифы</p>
        )}
      </div>

      <div>
        <SectionLabel icon={<Clock className="w-5 h-5" />} label="Время начала" />
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((t) => {
            const sel = selectedTime === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`py-4 rounded-2xl text-base font-bold border transition-all active:scale-95 ${
                  sel
                    ? "bg-[#FF6022] border-[#FF6022] text-white shadow-lg shadow-[#FF6022]/30"
                    : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-[#FF6022]/30"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionLabel icon={<Users className="w-5 h-5" />} label="Гости" />
        <div className="space-y-2">
          <Counter label="Дети" sublabel="Именинник + друзья" value={children} min={1} onChange={setChildren} />
          <Counter label="Взрослые" sublabel="Родители и сопровождающие" value={adults} min={0} onChange={setAdults} />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// VARIANT B — Compact mini-calendar with bigger cells + time tiles with icon
// =============================================================================

function VariantB() {
  const { currentMonth, setCurrentMonth, calendarDays, today } = useCalendar();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [children, setChildren] = useState(6);
  const [adults, setAdults] = useState(2);

  return (
    <div className="space-y-5">
      <div>
        <SectionLabel icon={<Calendar className="w-5 h-5" />} label="Дата праздника" />
        <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0F0F0]">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] active:scale-95 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
            </button>
            <span className="text-[15px] font-bold text-[#1A1A1A] capitalize">
              {format(currentMonth, "LLLL yyyy", { locale: ru })}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center hover:bg-[#E5E5E5] active:scale-95 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-[#1A1A1A]" />
            </button>
          </div>

          <div className="p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAY_NAMES.map((d) => (
                <div key={d} className="text-center text-[11px] font-semibold text-[#ABABAB] py-1">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`pad-${i}`} />;
                const isPast = isBefore(day, today);
                const isSel = selectedDate && isSameDay(day, selectedDate);
                const isWe = isWeekendDay(day);
                return (
                  <button
                    key={day.toISOString()}
                    disabled={isPast}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square rounded-xl flex items-center justify-center text-[15px] font-semibold transition-all active:scale-90 ${
                      isSel
                        ? "bg-[#FF6022] text-white shadow-md"
                        : isPast
                        ? "text-[#D5D5D5] cursor-not-allowed"
                        : isWe
                        ? "text-[#FF6022] hover:bg-[#FFF3EE]"
                        : "text-[#1A1A1A] hover:bg-[#F5F5F5]"
                    }`}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && isWeekendDay(selectedDate) && (
            <div className="mx-3 mb-3 bg-[#FFF3EE] rounded-xl px-3 py-2 text-center border border-[#FF6022]/10">
              <p className="text-xs text-[#FF6022] font-semibold">Выходной — действуют выходные тарифы</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <SectionLabel icon={<Clock className="w-5 h-5" />} label="Время начала" />
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((t) => {
            const sel = selectedTime === t;
            return (
              <button
                key={t}
                onClick={() => setSelectedTime(t)}
                className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all active:scale-95 ${
                  sel
                    ? "bg-[#FF6022] border-[#FF6022] text-white shadow-lg shadow-[#FF6022]/30"
                    : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-[#FF6022]/30"
                }`}
              >
                <Clock className={`w-4 h-4 mb-1 ${sel ? "text-white" : "text-[#ABABAB]"}`} />
                <span className="text-[15px] font-bold">{t}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <SectionLabel icon={<Users className="w-5 h-5" />} label="Гости" />
        <div className="space-y-2">
          <Counter label="Дети" sublabel="Именинник + друзья" value={children} min={1} onChange={setChildren} />
          <Counter label="Взрослые" sublabel="Родители и сопровождающие" value={adults} min={0} onChange={setAdults} />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// VARIANT C — Full-width 7-day week navigator + two-row time + big steppers
// =============================================================================

function VariantC() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [children, setChildren] = useState(6);
  const [adults, setAdults] = useState(2);

  const today = startOfDay(new Date());

  const weekDays = useMemo(() => {
    const base = new Date(today);
    base.setDate(base.getDate() + weekOffset * 7);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, [weekOffset]);

  const TIME_ROWS = [TIME_SLOTS.slice(0, 4), TIME_SLOTS.slice(4)];

  return (
    <div className="space-y-5">
      <div>
        <SectionLabel icon={<Calendar className="w-5 h-5" />} label="Дата" />

        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
            disabled={weekOffset === 0}
            className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center disabled:opacity-30 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-[#1A1A1A]" />
          </button>
          <span className="text-[13px] font-semibold text-[#747474]">
            {format(weekDays[0], "d MMM", { locale: ru })} — {format(weekDays[6], "d MMM yyyy", { locale: ru })}
          </span>
          <button
            onClick={() => setWeekOffset(weekOffset + 1)}
            className="w-9 h-9 rounded-xl bg-[#F5F5F5] flex items-center justify-center active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5 text-[#1A1A1A]" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {weekDays.map((day) => {
            const isPast = isBefore(day, today);
            const isSel = selectedDate && isSameDay(day, selectedDate);
            const isWe = isWeekendDay(day);
            return (
              <button
                key={day.toISOString()}
                disabled={isPast}
                onClick={() => setSelectedDate(day)}
                className={`flex flex-col items-center py-3 rounded-2xl border-2 transition-all active:scale-95 ${
                  isSel
                    ? "bg-[#FF6022] border-[#FF6022] text-white shadow-lg shadow-[#FF6022]/30"
                    : isPast
                    ? "bg-[#FAFAFA] border-[#F0F0F0] text-[#D5D5D5] cursor-not-allowed"
                    : isWe
                    ? "bg-[#FFF3EE] border-[#FF6022]/20 text-[#FF6022]"
                    : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-[#FF6022]/30"
                }`}
              >
                <span className={`text-[10px] font-semibold mb-1 ${isSel ? "text-white/80" : isWe ? "text-[#FF6022]/70" : "text-[#ABABAB]"}`}>
                  {format(day, "EEE", { locale: ru })}
                </span>
                <span className="text-[18px] font-black leading-none">{format(day, "d")}</span>
                {isWe && !isSel && <span className="text-[8px] mt-1 text-[#FF6022]/60 font-bold">вых</span>}
                {isSel && <Check className="w-3 h-3 mt-1 text-white" />}
              </button>
            );
          })}
        </div>

        {selectedDate && isWeekendDay(selectedDate) && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 bg-[#FFF3EE] rounded-xl px-3 py-2.5 border border-[#FF6022]/10 flex items-center gap-2"
          >
            <span className="text-lg">🌅</span>
            <p className="text-xs text-[#FF6022] font-semibold">Выходной — действуют выходные тарифы</p>
          </motion.div>
        )}
      </div>

      <div>
        <SectionLabel icon={<Clock className="w-5 h-5" />} label="Время начала" />
        <div className="space-y-2">
          {TIME_ROWS.map((row, ri) => (
            <div key={ri} className="grid grid-cols-4 gap-2">
              {row.map((t) => {
                const sel = selectedTime === t;
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-4 rounded-2xl text-[16px] font-black border-2 transition-all active:scale-95 ${
                      sel
                        ? "bg-[#FF6022] border-[#FF6022] text-white shadow-lg shadow-[#FF6022]/30"
                        : "bg-white border-[#E5E5E5] text-[#1A1A1A] hover:border-[#FF6022]/30"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div>
        <SectionLabel icon={<Users className="w-5 h-5" />} label="Гости" />

        <div className="bg-gradient-to-br from-[#FFF3EE] to-white rounded-2xl p-5 border border-[#FF6022]/15 mb-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[16px] font-black text-[#1A1A1A]">Дети 🎂</p>
              <p className="text-xs text-[#ABABAB]">Именинник + друзья</p>
            </div>
            <span className="text-[32px] font-black text-[#FF6022] leading-none">{children}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChildren(Math.max(1, children - 1))}
              className="flex-1 py-3.5 rounded-xl bg-white border border-[#E5E5E5] font-bold text-[#1A1A1A] text-xl flex items-center justify-center active:scale-95 transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setChildren(children + 1)}
              className="flex-1 py-3.5 rounded-xl bg-[#FF6022] font-bold text-white text-xl flex items-center justify-center shadow-lg shadow-[#FF6022]/30 active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[16px] font-black text-[#1A1A1A]">Взрослые 👨‍👩‍👧</p>
              <p className="text-xs text-[#ABABAB]">Родители и сопровождающие</p>
            </div>
            <span className="text-[32px] font-black text-[#1A1A1A] leading-none">{adults}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAdults(Math.max(0, adults - 1))}
              className="flex-1 py-3.5 rounded-xl bg-[#F5F5F5] border border-[#E5E5E5] font-bold text-[#1A1A1A] text-xl flex items-center justify-center active:scale-95 transition-all"
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={() => setAdults(adults + 1)}
              className="flex-1 py-3.5 rounded-xl bg-[#1A1A1A] font-bold text-white text-xl flex items-center justify-center active:scale-95 transition-all"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN Lab Page
// =============================================================================

const VARIANTS = [
  {
    id: "A",
    label: "A — Горизонтальная лента дат",
    desc: "Скроллируемый ряд дат + крупные кнопки времени в 4 колонки",
    emoji: "📅",
    color: "#FF6022",
    component: VariantA,
  },
  {
    id: "B",
    label: "B — Компактный календарь",
    desc: "Мини-календарь с крупными ячейками + тайлы времени с иконкой",
    emoji: "🗓",
    color: "#6B3FD4",
    component: VariantB,
  },
  {
    id: "C",
    label: "C — Недельный навигатор",
    desc: "7 дней полной ширины + 2 ряда времени + крупные степперы гостей",
    emoji: "📆",
    color: "#0D8A5E",
    component: VariantC,
  },
];

export default function DateTimeLab() {
  const [active, setActive] = useState<string>("A");
  const variant = VARIANTS.find((v) => v.id === active)!;
  const Component = variant.component;

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      <div className="bg-white border-b border-[#E5E5E5] sticky top-0 z-40">
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-[22px] font-black text-[#1A1A1A] leading-tight">
            🧪 Дизайн-эксперимент
          </h1>
          <p className="text-[13px] text-[#747474] mt-0.5">Экран «Дата и время» — 3 варианта</p>
        </div>

        <div className="max-w-lg mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {VARIANTS.map((v) => (
            <button
              key={v.id}
              onClick={() => setActive(v.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap border-2 transition-all active:scale-95 ${
                active === v.id
                  ? "text-white border-transparent shadow-md"
                  : "bg-white text-[#747474] border-[#E5E5E5] hover:border-[#D5D5D5]"
              }`}
              style={active === v.id ? { background: v.color, borderColor: v.color } : {}}
            >
              <span>{v.emoji}</span>
              Вариант {v.id}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 pb-2">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 mb-5 border"
          style={{
            background: `${variant.color}10`,
            borderColor: `${variant.color}30`,
          }}
        >
          <p className="text-[13px] font-bold" style={{ color: variant.color }}>
            {variant.label}
          </p>
          <p className="text-[12px] text-[#747474] mt-0.5">{variant.desc}</p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.22 }}
          >
            <Component />
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-[11px] text-[#BABABA] mt-8 mb-6">
          Это изолированный лаб — данные не сохраняются
        </p>
      </div>
    </div>
  );
}
