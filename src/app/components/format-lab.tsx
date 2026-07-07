import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, ChevronRight, Sparkles } from "lucide-react";

// Standalone design lab to compare layouts for the "Квест vs Приключение" choice.
// Route: /mega/format-lab  (also ?view=format-lab)

const BASE = (import.meta as any).env?.BASE_URL || "/";
const url = (p: string) => (p.startsWith("http") ? p : BASE + p.replace(/^\//, ""));

const QUESTS = [
  { id: "voxels", emoji: "🟩", title: "Мир Майнкрафт", subtitle: "Спаси игры от Глитча", img: "/quests/voxels/03.webp", color: "#4CAF50" },
  { id: "space", emoji: "🚀", title: "Космическое", subtitle: "Вечеринка на Марсе", img: "/quests/space/02.webp", color: "#3B4DD4" },
];

const ADV_BULLETS = ["Любой герой на выбор", "Игра с инсталляциями", "40 минут веселья"];

/* ─────────── Shared bits ─────────── */

function PriceIncluded() {
  return (
    <span className="text-[11px]">
      <span className="line-through text-gray-400 font-semibold">20 000 ₽</span>{" "}
      <span className="text-[#4CAF50] font-black">Входит в пакет</span>
    </span>
  );
}

function QuestRow({ q, selected, onSelect }: { q: typeof QUESTS[number]; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      className={`flex items-center gap-3 p-2 rounded-[20px] bg-white text-left w-full transition-all ${
        selected ? "border-2 border-[#FF6022] shadow-md" : "border border-black/[0.06] shadow-sm"
      }`}
    >
      <img src={url(q.img)} alt={q.title} className="w-[72px] h-[72px] rounded-[14px] object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-black text-[15px] text-[#1A1A1A] truncate">{q.emoji} {q.title}</div>
        <div className="text-xs text-gray-500 truncate">{q.subtitle}</div>
        <div className="mt-1"><PriceIncluded /></div>
      </div>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${selected ? "bg-[#FF6022] text-white" : "bg-gray-100 text-gray-300"}`}>
        <Check className="w-4 h-4 stroke-[3]" />
      </div>
    </button>
  );
}

function AdventureThumb({ big = false }: { big?: boolean }) {
  return (
    <div className={`flex items-center justify-center ${big ? "h-44" : "h-full"}`} style={{ background: "linear-gradient(135deg,#FFE5D0,#FFD3E8)" }}>
      <span className={big ? "text-7xl" : "text-5xl"}>🎈</span>
    </div>
  );
}

/* ─────────── Variant 1 — Segmented toggle (one line) ─────────── */

function Variant1() {
  const [mode, setMode] = useState<"adventure" | "quest">("quest");
  const [quest, setQuest] = useState("voxels");

  return (
    <div>
      <h3 className="text-2xl font-black text-[#1A1A1A]">Главное приключение</h3>
      <p className="text-sm text-[#747474] mb-4">Что выберете для праздника?</p>

      {/* Segment */}
      <div className="relative flex bg-[#F0F0F0] rounded-full p-1 mb-5">
        <div
          className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow transition-transform duration-300 ease-out"
          style={{ transform: mode === "quest" ? "translateX(calc(100% + 8px))" : "translateX(0)" }}
        />
        <button onClick={() => setMode("adventure")} className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors ${mode === "adventure" ? "text-[#FF6022]" : "text-[#747474]"}`}>🎈 Приключение</button>
        <button onClick={() => setMode("quest")} className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors ${mode === "quest" ? "text-[#FF6022]" : "text-[#747474]"}`}>🎯 Квест</button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "adventure" ? (
          <motion.div key="adv" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <div className="rounded-[24px] overflow-hidden border border-black/[0.06] shadow-sm">
              <div className="h-32 relative"><AdventureThumb />
                <div className="absolute top-3 left-3 bg-[#4CAF50] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full">Входит в пакет</div>
              </div>
              <div className="p-4">
                <h4 className="text-[17px] font-black text-[#1A1A1A] mb-1">🎈 Фиджитал приключение</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">Любимый герой 40 минут играет с детьми с интерактивными инсталляциями — без сюжета. Отлично для самых маленьких.</p>
                <div className="flex flex-wrap gap-1.5">
                  {ADV_BULLETS.map((b) => <span key={b} className="text-[10px] font-bold text-gray-600 bg-gray-100 rounded-lg px-2 py-1">{b}</span>)}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="quest" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5b21cc] bg-[#5b21cc]/10 px-2.5 py-1 rounded-full mb-3">⭐ Рекомендуем — больше сюжета и движа</div>
            <div className="flex flex-col gap-2.5">
              {QUESTS.map((q) => <QuestRow key={q.id} q={q} selected={quest === q.id} onSelect={() => setQuest(q.id)} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── Variant 2 — Comparison cards (stacked, expandable) ─────────── */

function Variant2() {
  const [mode, setMode] = useState<"adventure" | "quest">("quest");
  const [quest, setQuest] = useState("voxels");

  return (
    <div>
      <h3 className="text-2xl font-black text-[#1A1A1A]">Главное приключение</h3>
      <p className="text-sm text-[#747474] mb-4">Выберите формат</p>

      <div className="flex flex-col gap-3">
        {/* Adventure */}
        <button
          onClick={() => setMode("adventure")}
          className={`flex items-stretch gap-3 p-2 rounded-[24px] bg-white text-left transition-all ${mode === "adventure" ? "border-2 border-[#FF6022] shadow-md" : "border border-black/[0.06] shadow-sm"}`}
        >
          <div className="w-24 rounded-[18px] overflow-hidden shrink-0"><AdventureThumb /></div>
          <div className="flex-1 min-w-0 py-1 pr-1">
            <div className="font-black text-[16px] text-[#1A1A1A]">🎈 Приключение</div>
            <div className="text-xs text-gray-500 mb-1.5">40 мин · без сюжета · для малышей</div>
            <PriceIncluded />
          </div>
          <div className={`self-center w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${mode === "adventure" ? "bg-[#FF6022] text-white" : "bg-gray-100 text-gray-300"}`}><Check className="w-4 h-4 stroke-[3]" /></div>
        </button>

        {/* Quest (recommended, expandable) */}
        <div className={`rounded-[24px] bg-white transition-all overflow-hidden ${mode === "quest" ? "border-2 border-[#FF6022] shadow-md" : "border border-black/[0.06] shadow-sm"}`}>
          <button onClick={() => setMode("quest")} className="flex items-stretch gap-3 p-2 text-left w-full relative">
            <div className="absolute top-0 right-0 bg-[#5b21cc] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-bl-[14px] rounded-tr-[22px] z-10">⭐ Рекомендуем</div>
            <div className="w-24 rounded-[18px] overflow-hidden shrink-0 relative bg-gray-100">
              <img src={url(QUESTS[0].img)} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0 py-1 pr-1">
              <div className="font-black text-[16px] text-[#1A1A1A]">🎯 Квест</div>
              <div className="text-xs text-gray-500 mb-1.5">Сюжет · Лис Рокки · WOW-финал</div>
              <PriceIncluded />
            </div>
            <div className={`self-center w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${mode === "quest" ? "bg-[#FF6022] text-white" : "bg-gray-100 text-gray-300"}`}><Check className="w-4 h-4 stroke-[3]" /></div>
          </button>

          <AnimatePresence>
            {mode === "quest" && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-3 pb-3 pt-1">
                  <div className="text-[11px] font-bold text-gray-400 mb-2">Выберите сюжет:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {QUESTS.map((q) => (
                      <button key={q.id} onClick={() => setQuest(q.id)} className={`relative rounded-[16px] overflow-hidden border text-left ${quest === q.id ? "border-2 border-[#FF6022]" : "border-black/[0.06]"}`}>
                        <img src={url(q.img)} alt={q.title} className="w-full h-16 object-cover" />
                        <div className="px-2 py-1.5 bg-white"><div className="text-[11px] font-black truncate">{q.emoji} {q.title}</div></div>
                        {quest === q.id && <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#FF6022] text-white flex items-center justify-center"><Check className="w-3 h-3 stroke-[3]" /></div>}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Variant 3 — Tabs + big preview ─────────── */

function Variant3() {
  const [tab, setTab] = useState<"adventure" | "quest">("quest");
  const [quest, setQuest] = useState("voxels");
  const active = QUESTS.find((q) => q.id === quest)!;

  return (
    <div>
      <h3 className="text-2xl font-black text-[#1A1A1A] mb-3">Главное приключение</h3>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200 mb-4">
        {(["adventure", "quest"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`relative pb-2.5 text-sm font-black transition-colors ${tab === t ? "text-[#1A1A1A]" : "text-gray-400"}`}>
            {t === "adventure" ? "🎈 Приключение" : "🎯 Квест"}
            {tab === t && <motion.div layoutId="lab3-underline" className="absolute -bottom-px left-0 right-0 h-[3px] bg-[#FF6022] rounded-full" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {tab === "adventure" ? (
          <motion.div key="adv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="rounded-[24px] overflow-hidden border border-black/[0.06] shadow-sm">
              <AdventureThumb big />
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[17px] font-black text-[#1A1A1A]">Фиджитал приключение</h4>
                  <PriceIncluded />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">Свободная игра с героем и инсталляциями, без сюжета — для самых маленьких. Активности на усмотрение аниматора.</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="quest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <div className="rounded-[24px] overflow-hidden border border-black/[0.06] shadow-sm mb-3">
              <div className="relative h-44">
                <img src={url(active.img)} alt={active.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-[#5b21cc] text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full">⭐ Рекомендуем</div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <div className="text-white font-black text-lg">{active.emoji} {active.title}</div>
                  <div className="text-white/80 text-xs">{active.subtitle}</div>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <PriceIncluded />
                <span className="text-[11px] text-[#FF6022] font-bold flex items-center gap-0.5">Подробнее <ChevronRight className="w-3.5 h-3.5" /></span>
              </div>
            </div>
            <div className="flex gap-2">
              {QUESTS.map((q) => (
                <button key={q.id} onClick={() => setQuest(q.id)} className={`flex-1 rounded-[14px] overflow-hidden border ${quest === q.id ? "border-2 border-[#FF6022]" : "border-black/[0.06]"}`}>
                  <img src={url(q.img)} alt={q.title} className="w-full h-12 object-cover" />
                  <div className="text-[10px] font-black py-1 bg-white truncate px-1">{q.emoji} {q.title}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────── Wrapper + page ─────────── */

function VariantWrap({ n, title, desc, children }: { n: number; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[420px]">
      <div className="mb-3">
        <span className="inline-flex items-center gap-2 bg-[#FF6022] text-white text-xs font-black px-3 py-1 rounded-full">Вариант {n}</span>
        <h2 className="text-lg font-black mt-2 text-[#1A1A1A]">{title}</h2>
        <p className="text-sm text-[#747474]">{desc}</p>
      </div>
      <div className="bg-white rounded-[28px] shadow-xl border border-black/5 p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[11px] font-bold text-[#5b21cc] bg-[#5b21cc]/10 px-2.5 py-1 rounded-full">Пакет: Премиум</span>
          <span className="text-[11px] text-gray-400">шаг 3 · Формат</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function FormatLab() {
  return (
    <div className="min-h-screen bg-[#ECECEC] py-10 px-4">
      <div className="max-w-[420px] mx-auto mb-10 text-center">
        <div className="inline-flex items-center gap-2 text-[11px] font-black text-[#6C4AED] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" /> Лаборатория дизайна
        </div>
        <h1 className="text-3xl font-black text-[#1A1A1A] mb-2">Выбор формата</h1>
        <p className="text-sm text-[#747474]">Квест или Приключение — 3 варианта подачи. Потыкай каждый и выбери, что понятнее.</p>
      </div>

      <div className="flex flex-col items-center gap-12">
        <VariantWrap n={1} title="Сегмент-переключатель" desc="Одна строка-тумблер вверху. Тап мгновенно показывает, что это за формат — без скролла.">
          <Variant1 />
        </VariantWrap>

        <VariantWrap n={2} title="Две карточки сравнения" desc="Приключение и Квест рядом. Квест помечен «Рекомендуем» и раскрывает выбор сюжета.">
          <Variant2 />
        </VariantWrap>

        <VariantWrap n={3} title="Табы + крупное превью" desc="Вкладки с подчёркиванием и большая картинка-превью. Медиа на первом плане.">
          <Variant3 />
        </VariantWrap>
      </div>

      <div className="text-center text-xs text-gray-400 mt-12">Демо-страница · реальные данные подключим после выбора варианта</div>
    </div>
  );
}
