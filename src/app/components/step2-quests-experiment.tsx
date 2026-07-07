import React, { useState, useRef, useEffect } from "react";
import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Check, Users, Clock, Zap, Info } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoWithFallback } from "./figma/VideoWithFallback";
import { MEGA_ROOM_DETAILS } from "../data/megaConfig";
import { ANIMATORS, SECTION_CATEGORIES } from "./step3-animators";
import confetti from "canvas-confetti";

import rockyImg1 from "../../assets/rocky-quest-1.webp";
import rockyImg2 from "../../assets/rocky-quest-2.webp";
import rockyImg3 from "../../assets/rocky-quest-3.webp";
import rockyImg4 from "../../assets/rocky-quest-4.webp";
import rockyImg5 from "../../assets/rocky-quest-5.webp";
import rockyImg6 from "../../assets/rocky-quest-6.webp";
import rockyMascotImg from "../../assets/rocky-mascot.webp";

const ROCKY_PHOTOS = [rockyImg1, rockyImg2, rockyImg3, rockyImg4, rockyImg5, rockyImg6];

const BASE = (import.meta as any).env?.BASE_URL || "/";

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return BASE + path.replace(/^\//, "");
};

type QuestMedia = { type: "image" | "video"; url: string };

const PHYGITAL_QUESTS = [
  {
    id: "phygital_voxels" as const,
    title: "Мир Майнкрафт",
    subtitle: "Квест по спасению любимой игры!",
    emoji: "🟩",
    color: "#4CAF50",
    gradientFrom: "#4CAF50",
    gradientTo: "#2E7D32",
    duration: 60,
    maxKids: 10,
    animators: 1,
    description:
      "Лис Рокки приглашает детей в цифровой мир вокселей! Квест объединяет физические активности в парке с интерактивными проекциями — дети «добывают» ресурсы, строят конструкции и сражаются с боссами.",
    highlights: ["Интерактивные проекции", "Цифровые аватары", "Битва с Глитчем", "Поиск багов", "Спасение игр"],
    photos: ["/quests/voxels/03.webp", ...ROCKY_PHOTOS],
    media: [
      { type: "image" as const, url: "/quests/voxels/01.webp" },
      { type: "video" as const, url: "/quests/voxels/v1.mp4" },
      { type: "image" as const, url: "/quests/voxels/02.webp" },
      { type: "video" as const, url: "/quests/voxels/v2.mp4" },
      { type: "image" as const, url: "/quests/voxels/03.webp" },
      { type: "video" as const, url: "/quests/voxels/v3.mp4" },
    ],
    story: {
      legend:
        "Лис Рокки приглашает именинника и его друзей в цифровое приключение: они отправляются в мир вокселей (мир Майнкрафт). **Их ждёт квест по спасению игр в парке.** Для этого нужно пройти цифровые испытания в играх и победить главного злодея — Глитча, который запустил багов во все игры и сломал их.",
      whatHappened:
        "Рокки решил поиграть в свои любимые игры и постримить этот процесс. Но неожиданно все игры начали глючить и сломались. В этот момент на стрим залетает предводитель всех багов — Глитч и заявляет о том, что сломал все игры. Никакого стрима не будет! Рокки собирается бороться с багами и просит помощи у детей.",
      roles: [
        { role: "Лис Рокки", name: "Ведущий-навигатор", desc: "Отвечает за подачу сценария, дает подсказки и задания в играх.", icon: "🦊" },
        { role: "Команда Рокки", name: "Именинник и гости", desc: "Главные герои с цифровыми аватарами.", icon: "🟩" },
        { role: "Аниматор", name: "Координатор", desc: "Сопровождает детей, дает подводки и создает атмосферу праздника.", icon: "✨" },
        { role: "Глитч", name: "Главный злодей", desc: "Сломал все игры вместе со своими багами.", icon: "👾" },
        { role: "Баги", name: "Команда Глитча", desc: "Злые персонажи, ломающие игры. Олицетворяют системные ошибки.", icon: "🐛" },
      ],
    },
  },
  {
    id: "phygital_space" as const,
    title: "Космическое приключение",
    subtitle: "Межгалактическая вечеринка на Марсе!",
    emoji: "🚀",
    color: "#3B4DD4",
    gradientFrom: "#3B4DD4",
    gradientTo: "#1a1a7e",
    duration: 60,
    maxKids: 10,
    animators: 1,
    description:
      "Лис Рокки — капитан космического корабля! Дети отправляются в межгалактическую миссию: проходят испытания на невесомость, расшифровывают сигналы с других планет и спасают Вселенную.",
    highlights: ["Космические миссии", "Интерактивные проекции", "Цифровые аватары", "Битва с Глоргом", "Финальная дискотека"],
    photos: ["/quests/space/02.webp", ...ROCKY_PHOTOS.slice().reverse()],
    media: [
      { type: "image" as const, url: "/quests/space/04.webp" },
      { type: "video" as const, url: "/quests/space/v1.mp4" },
      { type: "image" as const, url: "/quests/space/01.webp" },
      { type: "video" as const, url: "/quests/space/v2.mp4" },
      { type: "image" as const, url: "/quests/space/02.webp" },
      { type: "image" as const, url: "/quests/space/05.webp" },
      { type: "image" as const, url: "/quests/space/03.webp" },
    ],
    story: {
      legend:
        "Лис Рокки приглашает именинника и его друзей в цифровое приключение: они отправляются в солнечную систему. **Их ждёт квест по организации межгалактической вечеринки на Марсе**. Для этого нужно пройти цифровые испытания в играх и победить злодея Глорга, который украл кристалл бесконечной энергии и хочет сорвать вечеринку.",
      whatHappened:
        "Глорг украл кристалл бесконечности, а без него организовать вечеринку и сделать про нее стрим не получится. Детям вместе с Рокки нужно отыскать этот кристалл и спасти вечеринку.",
      roles: [
        { role: "Лис Рокки", name: "Ведущий-навигатор", desc: "Отвечает за подачу сценария, дает подсказки и задания в играх.", icon: "🦊" },
        { role: "Команда Рокки", name: "Именинник и гости", desc: "Главные герои с цифровыми аватарами.", icon: "🧑‍🚀" },
        { role: "Аниматор", name: "Координатор", desc: "Сопровождает детей, дает подводки и создает атмосферу праздника.", icon: "✨" },
        { role: "Глорг", name: "Главный злодей", desc: "Хочет помешать вечеринке вместе со своей командой.", icon: "👾" },
      ],
    },
  },
];

const CLASSIC_QUESTS = [
  {
    id: "classic_harry",
    name: "Гарри Поттер",
    emoji: "⚡",
    image: "/quests/transparent/new_classic_harry.png",
    gradient: "from-[#7B1FA2] to-[#4A148C]",
    description:
      "Участники оказываются в мире волшебства: их ждёт знакомство с легендой, викторина по истории Хогвартса, магические уроки, прохождение лабиринта и командные испытания, включая поиск философского камня и игру в квиддич.",
    highlights: ["Викторина по истории Хогвартса", "Магические уроки", "Прохождение лабиринта", "Поиск философского камня", "Игра в квиддич"],
  },
  {
    id: "classic_harley",
    name: "Харли Квин",
    emoji: "🃏",
    image: "/quests/transparent/new_classic_harley.png",
    gradient: "from-[#E53935] to-[#B71C1C]",
    description:
      "В этом безумном приключении ребята создадут собственный отряд антигероев, примут участие в весёлых эстафетах, сыграют в азартные игры, попробуют свои силы в квесте «из злодеев в герои» и снимут клип в стиле «новые антигерои».",
    highlights: ["Создание отряда антигероев", "Весёлые эстафеты", "Азартные игры", "Квест «из злодеев в герои»", "Клип в стиле «новые антигерои»"],
  },
  {
    id: "classic_fort",
    name: "Форт Боярд",
    emoji: "🏰",
    image: "/quests/transparent/new_classic_fort.png",
    gradient: "from-[#C8A97E] to-[#8B6914]",
    description:
      "Команды соревнуются, чтобы первыми добраться до форта и разгадать его тайны, преодолевая паутинные лабиринты, пробираясь к ключам сквозь препятствия, открывая сокровищницу и собирая зашифрованное финальное слово.",
    highlights: ["Разгадать тайны форта", "Паутинные лабиринты", "Пробраться к ключам", "Открыть сокровищницу", "Собрать финальное слово"],
  },
  {
    id: "classic_bloggers",
    name: "Блогеры",
    emoji: "📱",
    image: "/quests/transparent/new_classic_bloggers.png",
    gradient: "from-[#00BCD4] to-[#E91E63]",
    description:
      "Блогеры сталкиваются с угрозой удаления аккаунтов от таинственного Анонима и должны пройти череду заданий: искать подсказки, разгадывать пароли и выполнять необычные испытания, чтобы спасти свои соцсети и набрать лайки.",
    highlights: ["Найти подсказки", "Разгадать пароли", "Необычные испытания", "Спасти соцсети", "Набрать лайки"],
  },
];

type PhygitalId = (typeof PHYGITAL_QUESTS)[number]["id"];
type ClassicId = (typeof CLASSIC_QUESTS)[number]["id"];

// ─── Quest detail popup ───────────────────────────────────────────────────────

function QuestPopup({
  quest,
  onClose,
  onSelect,
  isSelected,
}: {
  quest: (typeof PHYGITAL_QUESTS)[number];
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const { state } = useWizard();
  const isCustom = state.packageType === "custom";
  const isBasic = state.packageType === "basic";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => scrollRef.current?.scrollTo({ top: 130, behavior: "smooth" }), 800);
    return () => clearTimeout(timer);
  }, []);

  const renderBold = (text: string) =>
    text.split("**").map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-bold text-[#1A1A1A]">{part}</strong> : part
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <motion.div
        initial={{ y: "100%", scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: "100%", scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden h-[90vh] sm:h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white z-50 hover:bg-black/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div ref={scrollRef} className="overflow-y-auto flex-1 overscroll-contain pb-32 hide-scrollbar">
          <div className="px-6 pt-8 pb-4">
            <div className="inline-flex items-center gap-2 bg-[#F5F5F5] rounded-full px-3 py-1.5 mb-4">
              <span className="text-xl">{quest.emoji}</span>
              <span className="text-sm font-semibold text-[#1A1A1A]">{quest.title}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] leading-tight mb-2">{quest.subtitle}</h2>
          </div>

          <div className="mb-8 relative">
            <div
              className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-6 pb-4"
              onTouchStart={() => setShowSwipeHint(false)}
              onPointerDown={() => setShowSwipeHint(false)}
              onScroll={() => setShowSwipeHint(false)}
            >
              {quest.media?.map((item, i) => (
                <div key={i} className="snap-center shrink-0 w-[85%] sm:w-[70%] aspect-[4/5] sm:aspect-video rounded-[24px] overflow-hidden shadow-lg relative bg-[#1A1A1A]">
                  {item.type === "video" ? (
                    <VideoWithFallback src={getPublicUrl(item.url)} autoPlay loop muted playsInline className="w-full h-full object-cover" />
                  ) : (
                    <img src={getPublicUrl(item.url)} className="w-full h-full object-cover" alt="" />
                  )}
                  {item.type === "video" && (
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-[10px] font-bold tracking-wider uppercase">
                      <Play className="w-3 h-3 fill-current" /> Видео
                    </div>
                  )}
                </div>
              ))}
            </div>
            <AnimatePresence>
              {showSwipeHint && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10"
                >
                  <div className="flex items-center gap-2.5 bg-black/65 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl whitespace-nowrap">
                    <motion.span className="text-base leading-none select-none" animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}>👈</motion.span>
                    Листай фото и видео
                    <motion.span className="text-base leading-none select-none" animate={{ x: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 1.0, ease: "easeInOut" }}>👉</motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-6 flex flex-col gap-8">
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-[#F5F5F5] rounded-xl px-3 py-2">
                <Clock className="w-4 h-4 text-[#747474]" />
                <span className="text-sm font-medium text-[#1A1A1A]">{quest.duration} мин.</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F5F5F5] rounded-xl px-3 py-2">
                <Users className="w-4 h-4 text-[#747474]" />
                <span className="text-sm font-medium text-[#1A1A1A]">до {quest.maxKids} детей</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F5F5F5] rounded-xl px-3 py-2">
                <Zap className="w-4 h-4 text-[#747474]" />
                <span className="text-sm font-medium text-[#1A1A1A]">{quest.animators} аниматор</span>
              </div>
              <div className="flex items-center gap-2 bg-[#FF6022]/10 border border-[#FF6022]/20 rounded-xl px-3 py-2">
                <span className="text-xs text-[#ABABAB] line-through font-medium">20 000 ₽</span>
                <span className="text-sm font-bold text-[#FF6022]">
                  {isCustom ? "Акция: 12 000 ₽" : isBasic ? "Входит в пакет Премиум" : "Акция: Входит в пакет!"}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#5b21cc] to-[#7b3fe4] rounded-[24px] p-5 relative overflow-hidden flex shadow-lg">
              <div className="relative z-10 w-[60%] sm:w-[65%]">
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  <strong className="font-extrabold">Фиджитал квест</strong> — это инновационный формат дня рождения с масштабными интерактивными инсталляциями! Дети отправятся в увлекательное приключение с Героем, а их главным проводником станет наш маскот <strong className="text-[#FFB74D] font-black">Лис Рокки</strong>.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-[42%] sm:w-[35%] h-[100%] pointer-events-none">
                <img src={rockyMascotImg} alt="Лис Рокки" className="w-full h-full object-contain object-bottom drop-shadow-2xl" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">Легенда</h3>
                <p className="text-[#3A3A3A] text-base leading-relaxed">
                  {renderBold(quest.story?.legend as string || quest.description)}
                </p>
              </div>
              {quest.story?.whatHappened && (
                <div className="bg-red-50 border border-red-100 rounded-[24px] p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-2 -translate-y-4">
                    <span className="text-8xl">🚨</span>
                  </div>
                  <h3 className="text-red-600 font-bold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Что случилось?
                  </h3>
                  <p className="text-red-900/80 text-sm leading-relaxed relative z-10">{quest.story.whatHappened}</p>
                </div>
              )}
            </div>

            {quest.story?.roles && (
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Нарративные роли</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quest.story.roles.map((r, i) => (
                    <div key={i} className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-[20px] p-4 flex gap-4 items-start">
                      <div className="text-3xl bg-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-[#E5E5E5]">{r.icon}</div>
                      <div>
                        <div className="font-bold text-[#1A1A1A] text-base mb-0.5">{r.role}</div>
                        <div className="text-xs font-semibold mb-1" style={{ color: quest.color }}>{r.name}</div>
                        <div className="text-xs text-[#747474] leading-relaxed">{r.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">В программе:</h3>
              <div className="flex flex-wrap gap-2">
                {quest.highlights.map((h, i) => (
                  <div key={i} className="bg-[#F5F5F5] rounded-xl px-3.5 py-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: quest.color }} />
                    <span className="text-sm font-medium text-[#1A1A1A]">{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-[#E5E5E5] pb-8 sm:pb-5 z-20">
          <button
            onClick={() => { onSelect(); onClose(); }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl"
            style={{
              background: isSelected ? "#22C55E" : `linear-gradient(to right, ${quest.gradientFrom}, ${quest.gradientTo})`,
              boxShadow: isSelected ? "0 10px 25px -5px rgba(34, 197, 94, 0.4)" : `0 10px 25px -5px ${quest.color}66`,
            }}
          >
            {isSelected ? (
              <><Check className="w-6 h-6" /> Квест выбран</>
            ) : isBasic ? (
              "Повысить до Премиум"
            ) : (
              "Выбрать этот квест"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Step2Quests() {
  const { state, updateState, isMega } = useWizard();
  const [openQuest, setOpenQuest] = useState<(typeof PHYGITAL_QUESTS)[number] | null>(null);
  const [classicQuestInfo, setClassicQuestInfo] = useState<string | null>(null);
  const [surchargePopup, setSurchargePopup] = useState<{ questId: string; amount: number } | null>(null);
  const [upgradePopup, setUpgradePopup] = useState<string | null>(null);
  const selectedClassicQuest = CLASSIC_QUESTS.find((q) => q.id === classicQuestInfo);

  const isCustom = state.packageType === "custom";
  const isBasic = state.packageType === "basic";
  const isPremiumOrExclusive = state.packageType === "premium" || state.packageType === "exclusive";

  // Format mode: adventure (animator) vs quest
  const [formatMode, setFormatMode] = useState<"adventure" | "quest">(() => {
    if (state.questType === "animator" || isBasic) return "adventure";
    return "quest";
  });

  // Animator category tabs
  const [activeCategory, setActiveCategory] = useState<string>("princesses");
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isScrollingToRef = useRef(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const timer = setTimeout(() => {
      SECTION_CATEGORIES.forEach((cat) => {
        const el = sectionRefs.current[cat.id];
        if (!el) return;
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && !isScrollingToRef.current) {
                setActiveCategory(cat.id);
                const btn = tabButtonRefs.current[cat.id];
                const container = tabsRef.current;
                if (btn && container) {
                  const btnRect = btn.getBoundingClientRect();
                  const containerRect = container.getBoundingClientRect();
                  container.scrollTo({
                    left: container.scrollLeft + (btnRect.left - containerRect.left) - containerRect.width / 2 + btnRect.width / 2,
                    behavior: "smooth",
                  });
                }
              }
            });
          },
          { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
        );
        observer.observe(el);
        observers.push(observer);
      });
    }, 150);
    return () => { clearTimeout(timer); observers.forEach((o) => o.disconnect()); };
  }, [formatMode]);

  const scrollToSection = (catId: string) => {
    setActiveCategory(catId);
    const btn = tabButtonRefs.current[catId];
    const container = tabsRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      container.scrollTo({ left: container.scrollLeft + (btnRect.left - containerRect.left) - containerRect.width / 2 + btnRect.width / 2, behavior: "smooth" });
    }
    const el = sectionRefs.current[catId];
    if (el) {
      isScrollingToRef.current = true;
      const y = el.getBoundingClientRect().top + window.scrollY - 210;
      window.scrollTo({ top: y, behavior: "smooth" });
      setTimeout(() => { isScrollingToRef.current = false; }, 600);
    }
  };

  // Format switching
  const handleAdventureClick = () => {
    setFormatMode("adventure");
    updateState({ questType: "animator" });
  };

  const handleQuestClick = () => {
    if (isBasic) {
      setUpgradePopup(PHYGITAL_QUESTS[0].id);
    } else {
      setFormatMode("quest");
      if (state.questType === "animator") updateState({ questType: null });
    }
  };

  // Upgrade to Premium
  const confirmUpgrade = () => {
    if (!upgradePopup) return;
    const room = MEGA_ROOM_DETAILS.premium;
    updateState({ packageType: "premium", questType: upgradePopup as any, patiroom: "mega_room", patiroomDetails: room.label, patiroomHours: room.hours });
    setUpgradePopup(null);
    setFormatMode("quest");
    
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#5b21cc', '#7b3fe4', '#FF6022', '#4CAF50', '#FFB74D']
    });
  };

  // Quest selection
  const togglePhygital = (id: PhygitalId) => {
    updateState({ questType: state.questType === id ? null : id, isQuestPopupOpen: false });
    setOpenQuest(null);
  };

  const selectPhygital = (id: PhygitalId) => {
    updateState({ questType: id, isQuestPopupOpen: false });
    setOpenQuest(null);
  };

  const handleClassicSelect = (id: ClassicId) => {
    if (state.questType === id) { updateState({ questType: null }); return; }
    const amount = (state.packageType === "exclusive" || state.packageType === "premium") ? 9000 : 16000;
    if (isCustom) { updateState({ questType: id }); return; }
    setSurchargePopup({ questId: id, amount });
  };

  const confirmSurcharge = () => {
    if (surchargePopup) { updateState({ questType: surchargePopup.questId as any }); setSurchargePopup(null); }
  };

  // Animator selection in adventure mode (single pick)
  const selectAnimatorHero = (id: string) => {
    const already = state.animators.includes(id);
    updateState({ animators: already ? [] : [id], questType: "animator" });
  };

  const showFormatSwitcher = isMega && !!state.packageType;

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
            <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">🎉</span>
            Развлечения
          </h2>
          <p className="text-sm font-bold text-[#747474] mt-2 px-6 max-w-sm mx-auto">
            {showFormatSwitcher ? "Квест с сюжетом или Герой" : "Выберите квест для праздника"}
          </p>
        </div>

        {/* ── Segment switcher ── */}
        {showFormatSwitcher && (
          <div className="relative flex bg-[#F0F0F0] rounded-full p-1 mb-6">
            <motion.div
              className="absolute inset-y-1 rounded-full bg-white shadow"
              animate={{ x: formatMode === "adventure" ? 0 : "100%", width: "calc(50% - 4px)" }}
              style={{ left: 4 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            />
            <button
              onClick={handleAdventureClick}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors ${formatMode === "adventure" ? "text-[#FF6022]" : "text-[#747474]"}`}
            >
              🎈 Герой
            </button>
            <button
              onClick={handleQuestClick}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors ${formatMode === "quest" ? "text-[#FF6022]" : "text-[#747474]"}`}
            >
              🎯 Квест
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ── ПРИКЛЮЧЕНИЕ: animator grid ── */}
          {showFormatSwitcher && formatMode === "adventure" ? (
            <motion.div
              key="adventure"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm font-semibold text-[#1A1A1A] mb-3">
                Выберите любимого героя, с которым дети могут играть в парке
              </p>

              {/* Category tabs */}
              <div
                className="sticky top-[88px] z-30 pt-1.5 pb-2 mb-3 rounded-2xl"
                style={{ background: "rgba(247,247,247,0.8)", backdropFilter: "blur(16px)" }}
              >
                <div ref={tabsRef} className="flex gap-1.5 overflow-x-auto hide-scrollbar px-1">
                  {SECTION_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      ref={(el) => { tabButtonRefs.current[cat.id] = el; }}
                      onClick={() => scrollToSection(cat.id)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                        activeCategory === cat.id ? "bg-[#1A1A1A] text-white shadow-sm" : "bg-white text-[#747474] ring-1 ring-[#E5E5E5]"
                      }`}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animator sections */}
              <div>
                {SECTION_CATEGORIES.map((cat) => {
                  const animators = ANIMATORS.filter((a) => a.category === cat.id);
                  return (
                    <div key={cat.id} ref={(el) => { sectionRefs.current[cat.id] = el; }} className="mb-6">
                      <div className="flex items-center gap-2 mb-3 pt-1">
                        <span className="text-xl">{cat.emoji}</span>
                        <h3 className="text-[17px] font-bold text-[#1A1A1A]">{cat.label}</h3>
                        <span className="text-xs text-[#ABABAB] font-medium ml-1">{animators.length}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {animators.map((anim) => {
                          const isSelected = state.animators.includes(anim.id);
                          return (
                            <button
                              key={anim.id}
                              onClick={() => selectAnimatorHero(anim.id)}
                              className={`group relative rounded-[28px] bg-white p-2 transition-all duration-300 cursor-pointer border flex flex-col text-left ${
                                isSelected ? "scale-[1.02]" : "border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                              }`}
                              style={{
                                borderColor: isSelected ? "#FF6022" : "rgba(0,0,0,0.04)",
                                borderWidth: isSelected ? "2px" : "1px",
                                boxShadow: isSelected ? "0 16px 36px rgba(255,96,34,0.15), 0 0 0 1px rgba(255,96,34,0.1)" : undefined,
                              }}
                            >
                              <div className="relative aspect-[4/3.5] w-full rounded-[20px] overflow-hidden bg-white border border-[#F0F0F0] flex items-center justify-center shrink-0">
                                <img
                                  src={`${BASE}${anim.image.startsWith("/") ? anim.image.slice(1) : anim.image}`}
                                  alt={anim.name}
                                  className="w-full h-full object-contain object-bottom pt-4 px-2.5 transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                              <div className="p-2 pt-2.5 flex flex-col flex-1 text-center justify-between items-center w-full">
                                <h4 className="text-[12px] font-black text-[#1A1A1A] tracking-tight leading-snug line-clamp-2 flex items-center justify-center min-h-[34px] w-full group-hover:text-[#FF6022] transition-colors">
                                  {anim.name}
                                </h4>
                                <div className="flex items-center justify-between w-full mt-2 pt-1.5 border-t border-gray-50 shrink-0">
                                  <span className="text-[11px] text-[#FF6022] font-black">
                                    {isSelected ? "Выбран" : "Добавить"}
                                  </span>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${isSelected ? "bg-[#FF6022] text-white shadow-sm" : "bg-gray-50 text-[#D1D1D1]"}`}>
                                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                  </div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* ── КВЕСТ: phygital + classic cards ── */
            <motion.div
              key="quest"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Phygital section */}
              <div className="mb-6">
                <div className="flex flex-col items-center gap-2 mb-8">
                  <div className="bg-[#5b21cc] text-white text-[19px] sm:text-[22px] font-black tracking-[-0.3px] px-[28px] py-[10px] rounded-[16px] transform rotate-[-2deg] shadow-lg shadow-[#5b21cc]/30">
                    Фиджитал квесты
                  </div>
                  {isBasic && <p className="text-xs text-[#5b21cc] font-bold text-center">Квест с сюжетом входит в пакет Премиум</p>}
                  {isPremiumOrExclusive && <p className="text-xs text-[#747474] font-bold text-center mt-1">К фиджитал квесту можно выбрать любого героя на следующем шаге</p>}
                </div>

                <div className="flex flex-col gap-7">
                  {PHYGITAL_QUESTS.map((quest, i) => {
                    const isSelected = state.questType === quest.id;
                    return (
                      <motion.div key={quest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div
                          className={`group relative rounded-[32px] bg-white p-2.5 transition-all duration-300 cursor-pointer border ${
                            isSelected ? "scale-[1.02] shadow-2xl" : "border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
                          }`}
                          style={{
                            borderColor: isSelected ? quest.color : "rgba(0,0,0,0.04)",
                            borderWidth: isSelected ? "2.5px" : "1px",
                            boxShadow: isSelected ? `0 20px 40px -10px ${quest.color}25, 0 0 0 1px ${quest.color}20` : undefined,
                          }}
                          onClick={() => { setOpenQuest(quest); updateState({ isQuestPopupOpen: true }); }}
                        >
                          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-[24px] overflow-hidden bg-gray-50">
                            <img src={getPublicUrl(quest.photos[0])} alt={quest.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className={`absolute top-3 left-3 z-10 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm ${isBasic ? "bg-[#5b21cc]" : isCustom ? "bg-[#FF6022]" : "bg-[#FF6022]"}`}>
                              {isBasic ? "🔒 Премиум" : isCustom ? "🔥 Акция" : "⭐ Рекомендуем"}
                            </div>
                            <button
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md text-gray-700 flex items-center justify-center z-10 transition-all hover:scale-110 active:scale-95 shadow-md hover:bg-white"
                              onClick={(e) => { e.stopPropagation(); setOpenQuest(quest); updateState({ isQuestPopupOpen: true }); }}
                            >
                              <Info className="w-4 h-4 text-gray-800" />
                            </button>
                          </div>
                          <div className="p-4 pt-3 flex flex-col">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xl leading-none">{quest.emoji}</span>
                              <h4 className="text-[17px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#FF6022] transition-colors">{quest.title}</h4>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed font-medium mb-3 truncate">{quest.subtitle}</p>
                            <div className="flex flex-wrap items-center gap-1.5 mb-4">
                              <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1">
                                <Clock className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-[10px] text-gray-700 font-bold">{quest.duration} мин</span>
                              </div>
                              <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1">
                                <Users className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-[10px] text-gray-700 font-bold">до {quest.maxKids} детей</span>
                              </div>
                            </div>
                            <div className="w-full h-px bg-gray-100 mb-3.5" />
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                {isCustom ? (
                                  <>
                                    <span className="text-xs text-[#ABABAB] line-through font-semibold leading-none mb-0.5">20 000 ₽</span>
                                    <span className="text-base font-black text-[#FF6022] leading-none">12 000 ₽</span>
                                  </>
                                ) : isBasic ? (
                                  <>
                                    <span className="text-xs text-[#ABABAB] line-through font-semibold leading-none mb-0.5">20 000 ₽</span>
                                    <span className="text-sm font-black text-[#5b21cc] leading-none">Входит в Премиум</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-xs text-[#ABABAB] line-through font-semibold leading-none mb-0.5">20 000 ₽</span>
                                    <span className="text-sm font-black text-[#4CAF50] leading-none">Входит в пакет!</span>
                                  </>
                                )}
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isBasic) setUpgradePopup(quest.id); else togglePhygital(quest.id);
                                }}
                                className={`px-5 py-2.5 rounded-[16px] text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${
                                  isBasic ? "bg-[#5b21cc]/10 text-[#5b21cc] hover:bg-[#5b21cc]/20 shadow-none"
                                    : isSelected ? "bg-[#22C55E] text-white shadow-[#22C55E]/20"
                                    : "bg-[#FF6022]/10 text-[#FF6022] hover:bg-[#FF6022]/20 shadow-none"
                                }`}
                              >
                                {isBasic ? "Повысить пакет" : isSelected ? <><Check className="w-3.5 h-3.5" /> Выбрано</> : "Выбрать"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Classic quests section */}
              <div className="mb-6">
                <div className="mb-5 mt-4">
                  <h2 className="text-[24px] tracking-[-0.5px] font-black text-[#1A1A1A] leading-tight mb-1.5">Или классические квесты</h2>
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-[#747474] font-medium">2 аниматора · до 20 детей · 60 мин.</span>
                    {isCustom && <span className="font-semibold text-[#FF6022] bg-[#FF6022]/10 px-2.5 py-0.5 rounded-md">16 000 ₽</span>}
                    {state.packageType === "basic" && <span className="font-semibold text-[#FF6022] bg-[#FF6022]/10 px-2.5 py-0.5 rounded-md">+16 000 ₽</span>}
                    {state.packageType === "premium" && <span className="font-semibold text-[#FF6022] bg-[#FF6022]/10 px-2.5 py-0.5 rounded-md">+16 000 ₽</span>}
                    {state.packageType === "exclusive" && <span className="font-semibold text-[#FF6022] bg-[#FF6022]/10 px-2.5 py-0.5 rounded-md">+9 000 ₽</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-7">
                  {CLASSIC_QUESTS.map((quest, i) => {
                    const isSelected = state.questType === quest.id;
                    return (
                      <motion.div key={quest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                        <div
                          className={`group relative rounded-[32px] bg-white p-2.5 transition-all duration-300 cursor-pointer border ${
                            isSelected ? "scale-[1.02] shadow-2xl" : "border-black/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
                          }`}
                          style={{
                            borderColor: isSelected ? "#FF6022" : "rgba(0,0,0,0.04)",
                            borderWidth: isSelected ? "2.5px" : "1px",
                            boxShadow: isSelected ? "0 20px 40px -10px rgba(255,96,34,0.15), 0 0 0 1px rgba(255,96,34,0.1)" : undefined,
                          }}
                          onClick={() => handleClassicSelect(quest.id as ClassicId)}
                        >
                          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-[24px] overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                            {quest.image ? (
                              <ImageWithFallback src={getPublicUrl(quest.image)} alt={quest.name} className="w-[85%] h-[85%] object-contain drop-shadow-lg scale-[1.2] group-hover:scale-[1.3] transition-transform duration-700" />
                            ) : (
                              <span className="text-6xl filter drop-shadow-md group-hover:scale-110 transition-transform duration-500">{quest.emoji}</span>
                            )}
                            <button
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center z-10 transition-all hover:scale-110 active:scale-95 shadow-md"
                              onClick={(e) => { e.stopPropagation(); setClassicQuestInfo(quest.id); }}
                            >
                              <Info className="w-4 h-4 text-gray-800" />
                            </button>
                          </div>
                          <div className="p-4 pt-3 flex flex-col">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="text-xl leading-none">{quest.emoji}</span>
                              <h4 className="text-[17px] font-black text-[#1A1A1A] tracking-tight group-hover:text-[#FF6022] transition-colors">{quest.name}</h4>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed font-medium mb-3">Классическая сюжетно-анимационная игра с ведущими-аниматорами.</p>
                            <div className="flex flex-wrap items-center gap-1.5 mb-4">
                              <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1">
                                <Clock className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-[10px] text-gray-700 font-bold">60 мин</span>
                              </div>
                              <div className="flex items-center gap-1 bg-gray-100 rounded-lg px-2.5 py-1">
                                <Users className="w-3.5 h-3.5 text-gray-500" />
                                <span className="text-[10px] text-gray-700 font-bold">до 20 детей</span>
                              </div>
                            </div>
                            <div className="w-full h-px bg-gray-100 mb-3.5" />
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-[11px] text-gray-400 font-semibold leading-none mb-0.5">Стоимость:</span>
                                <span className="text-base font-black text-[#FF6022] leading-none">
                                  {isCustom && "16 000 ₽"}
                                  {state.packageType === "basic" && "+16 000 ₽"}
                                  {state.packageType === "premium" && "+16 000 ₽"}
                                  {state.packageType === "exclusive" && "+9 000 ₽"}
                                </span>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleClassicSelect(quest.id as ClassicId); }}
                                className={`px-5 py-2.5 rounded-[16px] text-xs font-black transition-all flex items-center gap-1.5 active:scale-95 shadow-sm ${
                                  isSelected ? "bg-[#22C55E] text-white shadow-[#22C55E]/20" : "bg-[#FF6022]/10 text-[#FF6022] hover:bg-[#FF6022]/20 shadow-none"
                                }`}
                              >
                                {isSelected ? <><Check className="w-3.5 h-3.5" /> Выбрано</> : "Выбрать"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quest popup */}
      <AnimatePresence>
        {openQuest && (
          <QuestPopup
            quest={openQuest}
            onClose={() => { setOpenQuest(null); updateState({ isQuestPopupOpen: false }); }}
            onSelect={() => { if (isBasic) setUpgradePopup(openQuest.id); else selectPhygital(openQuest.id); }}
            isSelected={state.questType === openQuest.id}
          />
        )}
      </AnimatePresence>

      {/* Classic Quest Info Popup */}
      <AnimatePresence>
        {classicQuestInfo && selectedClassicQuest && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed top-[-50vh] bottom-[-50vh] left-0 right-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-auto" onClick={() => setClassicQuestInfo(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto relative z-10"
            >
              <div className="relative shrink-0 bg-black">
                <div className="aspect-[4/3] w-full bg-[#F8F8F8] flex items-center justify-center">
                  {selectedClassicQuest.image ? (
                    <ImageWithFallback src={getPublicUrl(selectedClassicQuest.image)} alt={selectedClassicQuest.name} className="w-full h-full object-contain object-bottom pt-8 px-4 scale-[1.5]" />
                  ) : (
                    <span className="text-8xl filter drop-shadow-md">{selectedClassicQuest.emoji}</span>
                  )}
                </div>
                <button onClick={() => setClassicQuestInfo(null)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full text-[#1A1A1A] z-10">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto overscroll-contain">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">{selectedClassicQuest.emoji} {selectedClassicQuest.name}</h3>
                <div className="text-xs text-[#747474] mb-4">2 аниматора · до 20 детей · 60 мин.</div>
                <p className="text-[#747474] text-sm leading-relaxed mb-5">{selectedClassicQuest.description}</p>
                {selectedClassicQuest.highlights.length > 0 && (
                  <div className="mb-5">
                    <div className="text-sm font-semibold text-[#1A1A1A] mb-2">Что ждёт ребят:</div>
                    <div className="flex flex-col gap-1.5">
                      {selectedClassicQuest.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 bg-[#F8F8F8] rounded-xl px-3 py-2">
                          <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#FF6022]" />
                          <span className="text-xs text-[#3A3A3A]">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => { if (state.questType !== selectedClassicQuest.id) handleClassicSelect(selectedClassicQuest.id as ClassicId); setClassicQuestInfo(null); }}
                  className={`w-full py-3.5 rounded-xl font-medium text-center transition-all ${
                    state.questType === selectedClassicQuest.id ? "bg-[#F5F5F5] text-[#747474]" : "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                  }`}
                >
                  {state.questType === selectedClassicQuest.id ? "Выбрано ✓" : "Выбрать этот квест"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surcharge popup */}
      <AnimatePresence>
        {surchargePopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setSurchargePopup(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-[#FF6022]/10 rounded-full flex items-center justify-center mx-auto mb-4"><span className="text-3xl">🎭</span></div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Доплата за квест</h3>
                <p className="text-sm text-[#747474] leading-relaxed">За классический квест в вашем пакете нужно доплатить</p>
                <p className="text-2xl font-black text-[#FF6022] mt-2">+{surchargePopup.amount.toLocaleString("ru-RU")} ₽</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setSurchargePopup(null)} className="flex-1 py-3.5 rounded-xl font-medium text-center bg-[#F5F5F5] text-[#747474] active:scale-[0.98]">Отмена</button>
                <button onClick={confirmSurcharge} className="flex-1 py-3.5 rounded-xl font-medium text-center bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]">Добавить</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upgrade to Premium popup */}
      <AnimatePresence>
        {upgradePopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setUpgradePopup(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <button
                onClick={() => setUpgradePopup(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors z-50"
              >
                <X className="w-4 h-4" />
              </button>
              {(() => {
                const upgradeQuest = PHYGITAL_QUESTS.find(q => q.id === upgradePopup) || PHYGITAL_QUESTS[0];
                const images = upgradeQuest.media.filter(m => m.type === 'image').map(m => m.url);
                return (
                  <>
                    <div className="text-center mb-6 mt-2">
                      <div className="flex justify-center items-center -space-x-4 mb-6 pt-2">
                        <div className="w-20 h-24 rounded-[16px] overflow-hidden shadow-md transform -rotate-12 translate-y-2 border-[3px] border-white">
                          <img src={getPublicUrl(images[1] || images[0])} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-24 h-32 rounded-[20px] overflow-hidden shadow-xl z-10 border-[3px] border-white">
                          <img src={getPublicUrl(images[0])} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-20 h-24 rounded-[16px] overflow-hidden shadow-md transform rotate-12 translate-y-2 border-[3px] border-white">
                          <img src={getPublicUrl(images[2] || images[0])} alt="" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-black text-[#1A1A1A] mb-3 leading-tight">Заберите квест <br/> в пакете Премиум</h3>
                      <p className="text-[14px] text-[#747474] leading-relaxed px-2">
                        Фиджитал-квест с погружением в инсталляции, Лисом Рокки и WOW-финалом доступен в пакете <span className="font-bold text-[#5b21cc]">Премиум</span>
                      </p>
                    </div>
                    <button
                      onClick={confirmUpgrade}
                      className="w-full py-4 rounded-2xl font-black text-white text-[17px] transition-transform active:scale-[0.98] shadow-xl"
                      style={{ background: "linear-gradient(to right, #5b21cc, #7b3fe4)", boxShadow: "0 10px 25px -5px rgba(91,33,204,0.4)" }}
                    >
                      Повысить пакет
                    </button>
                    <button
                      onClick={() => setUpgradePopup(null)}
                      className="w-full mt-2 py-3 rounded-2xl font-bold text-[#A0A0A0] transition-colors hover:bg-gray-50 hover:text-[#1A1A1A]"
                    >
                      Остаться на базовом
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
