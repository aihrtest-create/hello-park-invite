import { useState, useRef, useEffect } from "react";
import { useWizard } from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { X, Play, Check, ChevronLeft, ChevronRight, Users, Clock, Zap, Info } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoWithFallback } from "./figma/VideoWithFallback";

import rockyImg1 from "../../assets/rocky-quest-1.webp";
import rockyImg2 from "../../assets/rocky-quest-2.webp";
import rockyImg3 from "../../assets/rocky-quest-3.webp";
import rockyImg4 from "../../assets/rocky-quest-4.webp";
import rockyImg5 from "../../assets/rocky-quest-5.webp";
import rockyImg6 from "../../assets/rocky-quest-6.webp";
import spaceImg from "../../assets/space-quest.webp";
import rockyMascotImg from "../../assets/rocky-mascot.webp";

const ROCKY_PHOTOS = [rockyImg1, rockyImg2, rockyImg3, rockyImg4, rockyImg5, rockyImg6];

const getPublicUrl = (path: string) => {
  if (!path) return path;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  return ((import.meta as any).env?.BASE_URL || '/') + path.replace(/^\//, '');
};

type QuestMedia = { type: 'image' | 'video'; url: string; };
type QuestStory = {
  legend: string | React.ReactNode;
  whatHappened?: string;
  roles?: { role: string; name: string; desc: string; icon: string; }[];
};

const PHYGITAL_QUESTS = [
  {
    id: "phygital_voxels" as const,
    title: "Мир Майнкрафт",
    subtitle: "Квест по спасению любимой игры!",
    emoji: "🟩",
    color: "#4CAF50",
    gradientFrom: "#4CAF50",
    gradientTo: "#2E7D32",
    addonPrice: 2000,
    duration: 60,
    maxKids: 10,
    animators: 1,
    description: "Лис Рокки приглашает детей в цифровой мир вокселей! Квест объединяет физические активности в парке с интерактивными проекциями — дети «добывают» ресурсы, строят конструкции и сражаются с боссами.",
    highlights: ["Интерактивные проекции", "Цифровые аватары", "Битва с Глитчем", "Поиск багов", "Спасение игр"],
    photos: ['/quests/voxels/03.webp', ...ROCKY_PHOTOS],
    media: [
      { type: 'image' as const, url: '/quests/voxels/01.webp' },
      { type: 'video' as const, url: '/quests/voxels/v1.mp4' },
      { type: 'image' as const, url: '/quests/voxels/02.webp' },
      { type: 'video' as const, url: '/quests/voxels/v2.mp4' },
      { type: 'image' as const, url: '/quests/voxels/03.webp' },
      { type: 'video' as const, url: '/quests/voxels/v3.mp4' },
    ],
    story: {
      legend: "Лис Рокки приглашает именинника и его друзей в цифровое приключение: они отправляются в мир вокселей (мир Майнкрафт). **Их ждёт квест по спасению игр в парке.** Для этого нужно пройти цифровые испытания в играх и победить главного злодея — Глитча, который запустил багов во все игры и сломал их.",
      whatHappened: "Рокки решил поиграть в свои любимые игры и постримить этот процесс. Но неожиданно все игры начали глючить и сломались. В этот момент на стрим залетает предводитель всех багов — Глитч и заявляет о том, что сломал все игры. Никакого стрима не будет! Рокки собирается бороться с багами и просит помощи у детей.",
      roles: [
        { role: "Лис Рокки", name: "Ведущий-навигатор", desc: "Отвечает за подачу сценария, дает подсказки и задания в играх.", icon: "🦊" },
        { role: "Команда Рокки", name: "Именинник и гости", desc: "Главные герои с цифровыми аватарами.", icon: "🟩" },
        { role: "Аниматор", name: "Координатор", desc: "Сопровождает детей, дает подводки и создает атмосферу праздника.", icon: "✨" },
        { role: "Глитч", name: "Главный злодей", desc: "Сломал все игры вместе со своими багами.", icon: "👾" },
        { role: "Баги", name: "Команда Глитча", desc: "Злые персонажи, ломающие игры. Олицетворяют системные ошибки.", icon: "🐛" },
      ]
    }
  },
  {
    id: "phygital_space" as const,
    title: "Космическое приключение",
    subtitle: "Межгалактическая вечеринка на Марсе!",
    emoji: "🚀",
    color: "#3B4DD4",
    gradientFrom: "#3B4DD4",
    gradientTo: "#1a1a7e",
    addonPrice: 2000,
    duration: 60,
    maxKids: 10,
    animators: 1,
    description:
      "Лис Рокки — капитан космического корабля! Дети отправляются в межгалактическую миссию: проходят испытания на невесомость, расшифровывают сигналы с других планет и спасают Вселенную. Цифровые технологии делают каждое задание магически реальным.",
    highlights: ["Космические миссии", "Интерактивные проекции", "Цифровые аватары", "Битва с Глоргом", "Финальная дискотека"],
    photos: ['/quests/space/02.webp', ...ROCKY_PHOTOS.slice().reverse()],
    media: [
      { type: 'image' as const, url: '/quests/space/04.webp' },
      { type: 'video' as const, url: '/quests/space/v1.mp4' },
      { type: 'image' as const, url: '/quests/space/01.webp' },
      { type: 'video' as const, url: '/quests/space/v2.mp4' },
      { type: 'image' as const, url: '/quests/space/02.webp' },
      { type: 'image' as const, url: '/quests/space/05.webp' },
      { type: 'image' as const, url: '/quests/space/03.webp' },
    ],
    story: {
      legend: "Лис Рокки приглашает именинника и его друзей в цифровое приключение: они отправляются в солнечную систему. **Их ждёт квест по организации межгалактической вечеринки на Марсе**. Для этого нужно пройти цифровые испытания в играх и победить злодея Глорга, который украл кристалл бесконечной энергии и хочет сорвать вечеринку. В финале Рокки и дети устроят грандиозную вечеринку на всю солнечную систему.",
      whatHappened: "Глорг украл кристалл бесконечности, а без него организовать вечеринку и сделать про нее стрим не получится. Детям вместе с Рокки нужно отыскать этот кристалл и спасти вечеринку.",
      roles: [
        { role: "Лис Рокки", name: "Ведущий-навигатор", desc: "Отвечает за подачу сценария, дает подсказки и задания в играх.", icon: "🦊" },
        { role: "Команда Рокки", name: "Именинник и гости", desc: "Главные герои с цифровыми аватарами.", icon: "🧑‍🚀" },
        { role: "Аниматор", name: "Координатор", desc: "Сопровождает детей, дает подводки и создает атмосферу праздника.", icon: "✨" },
        { role: "Глорг", name: "Главный злодей", desc: "Хочет помешать вечеринке вместе со своей командой.", icon: "👾" },
      ]
    }
  },
];

const CLASSIC_QUESTS = [
  {
    id: "classic_harry",
    name: "Гарри Поттер",
    emoji: "⚡",
    image: "/quests/transparent/new_classic_harry.png",
    gradient: "from-[#7B1FA2] to-[#4A148C]",
    description: "Участники оказываются в мире волшебства: их ждёт знакомство с легендой, викторина по истории Хогвартса, магические уроки, прохождение лабиринта и командные испытания, включая поиск философского камня и игру в квиддич.",
    highlights: ["Викторина по истории Хогвартса", "Магические уроки", "Прохождение лабиринта", "Поиск философского камня", "Игра в квиддич"],
  },
  {
    id: "classic_harley",
    name: "Харли Квин",
    emoji: "🃏",
    image: "/quests/transparent/new_classic_harley.png",
    gradient: "from-[#E53935] to-[#B71C1C]",
    description: "В этом безумном приключении ребята создадут собственный отряд антигероев, примут участие в весёлых эстафетах, сыграют в азартные игры, попробуют свои силы в квесте «из злодеев в герои» и снимут клип в стиле «новые антигерои».",
    highlights: ["Создание отряда антигероев", "Весёлые эстафеты", "Азартные игры", "Квест «из злодеев в герои»", "Клип в стиле «новые антигерои»"],
  },
  {
    id: "classic_fort",
    name: "Форт Боярд",
    emoji: "🏰",
    image: "/quests/transparent/new_classic_fort.png",
    gradient: "from-[#C8A97E] to-[#8B6914]",
    description: "Команды соревнуются, чтобы первыми добраться до форта и разгадать его тайны, преодолевая паутинные лабиринты, пробираясь к ключам сквозь препятствия, открывая сокровищницу и собирая зашифрованное финальное слово.",
    highlights: ["Разгадать тайны форта", "Паутинные лабиринты", "Пробраться к ключам", "Открыть сокровищницу", "Собрать финальное слово"],
  },
  {
    id: "classic_bloggers",
    name: "Блогеры",
    emoji: "📱",
    image: "/quests/transparent/new_classic_bloggers.png",
    gradient: "from-[#00BCD4] to-[#E91E63]",
    description: "Блогеры сталкиваются с угрозой удаления аккаунтов от таинственного Анонима и должны пройти череду заданий: искать подсказки, разгадывать пароли и выполнять необычные испытания, чтобы спасти свои соцсети и набрать лайки.",
    highlights: ["Найти подсказки", "Разгадать пароли", "Необычные испытания", "Спасти соцсети", "Набрать лайки"],
  },
];

type PhygitalId = typeof PHYGITAL_QUESTS[number]["id"];
type ClassicId = typeof CLASSIC_QUESTS[number]["id"];

function QuestPopup({
  quest,
  onClose,
  onSelect,
  isSelected,
}: {
  quest: typeof PHYGITAL_QUESTS[number];
  onClose: () => void;
  onSelect: () => void;
  isSelected: boolean;
}) {
  const { state, isMega } = useWizard();
  const isCustom = state.packageType === "custom";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Auto-scroll down after popup settles, to hint there's content below
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ top: 130, behavior: 'smooth' });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleGalleryInteraction = () => setShowSwipeHint(false);

  const renderBold = (text: string) => {
    return text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i} className="font-bold text-[#1A1A1A]">{part}</strong> : part);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    >
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose}
      />

      <motion.div
        initial={{ y: "100%", scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: "100%", scale: 0.95 }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white rounded-t-[32px] sm:rounded-[32px] overflow-hidden h-[90vh] sm:h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white z-50 hover:bg-black/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Scroll Area */}
        <div ref={scrollRef} className="overflow-y-auto flex-1 overscroll-contain pb-32 hide-scrollbar">
          
          {/* Header Area */}
          <div className="px-6 pt-8 pb-4">
            <div className="inline-flex items-center gap-2 bg-[#F5F5F5] rounded-full px-3 py-1.5 mb-4">
              <span className="text-xl">{quest.emoji}</span>
              <span className="text-sm font-semibold text-[#1A1A1A]">{quest.title}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1A1A1A] leading-tight mb-2">
              {quest.subtitle}
            </h2>
          </div>

          {/* Media Section */}
          <div className="mb-8 relative">
            <div
              className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-6 pb-4"
              onTouchStart={handleGalleryInteraction}
              onPointerDown={handleGalleryInteraction}
              onScroll={handleGalleryInteraction}
            >
              {quest.media?.map((item, i) => (
                <div key={i} className="snap-center shrink-0 w-[85%] sm:w-[70%] aspect-[4/5] sm:aspect-video rounded-[24px] overflow-hidden shadow-lg relative bg-[#1A1A1A]">
                  {item.type === 'video' ? (
                    <VideoWithFallback 
                      src={getPublicUrl(item.url)} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img src={getPublicUrl(item.url)} className="w-full h-full object-cover" alt="" />
                  )}
                  {item.type === 'video' && (
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 text-white text-[10px] font-bold tracking-wider uppercase">
                      <Play className="w-3 h-3 fill-current" /> Видео
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Swipe hint — disappears on first gallery touch */}
            <AnimatePresence>
              {showSwipeHint && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-10"
                >
                  <div className="flex items-center gap-2.5 bg-black/65 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl whitespace-nowrap">
                    <motion.span
                      className="text-base leading-none select-none"
                      animate={{ x: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
                    >
                      👈
                    </motion.span>
                    Листай фото и видео
                    <motion.span
                      className="text-base leading-none select-none"
                      animate={{ x: [5, -5, 5] }}
                      transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
                    >
                      👉
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="px-6 flex flex-col gap-8">
            
            {/* Stats */}
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
                  {isCustom ? "Акция: 12 000 ₽" : "Акция: Входит в пакет!"}
                </span>
              </div>
            </div>

            {/* Phygital Mascot Banner */}
            <div className="bg-gradient-to-r from-[#5b21cc] to-[#7b3fe4] rounded-[24px] p-5 sm:p-6 relative overflow-hidden flex shadow-lg">
              <div className="relative z-10 w-[60%] sm:w-[65%]">
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  <strong className="font-extrabold">Фиджитал квест</strong> — это инновационный формат дня рождения с масштабными интерактивными инсталляциями! Дети отправятся в увлекательное приключение с Героем, а их главным проводником станет наш маскот <strong className="text-[#FFB74D] font-black">Лис Рокки</strong>.
                </p>
              </div>
              <div className="absolute right-0 bottom-0 w-[42%] sm:w-[35%] h-[130%] pointer-events-none">
                <img 
                  src={rockyMascotImg} 
                  alt="Лис Рокки" 
                  className="w-full h-full object-contain object-bottom drop-shadow-2xl" 
                />
              </div>
            </div>

            {/* Legend & What Happened */}
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
                  <p className="text-red-900/80 text-sm leading-relaxed relative z-10">
                    {quest.story.whatHappened}
                  </p>
                </div>
              )}
            </div>

            {/* Narrative Roles */}
            {quest.story?.roles && (
              <div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">Нарративные роли</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {quest.story.roles.map((r, i) => (
                    <div key={i} className="bg-[#F8F8F8] border border-[#E5E5E5] rounded-[20px] p-4 flex gap-4 items-start">
                      <div className="text-3xl bg-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-[#E5E5E5]">
                        {r.icon}
                      </div>
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

            {/* Highlights */}
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

        {/* Fixed Footer CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-[#E5E5E5] pb-8 sm:pb-5 z-20">
          <button
            onClick={() => {
              onSelect();
              onClose();
            }}
            className="w-full py-4 rounded-2xl text-white font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-xl"
            style={{ 
              background: isSelected ? "#22C55E" : `linear-gradient(to right, ${quest.gradientFrom}, ${quest.gradientTo})`,
              boxShadow: isSelected ? "0 10px 25px -5px rgba(34, 197, 94, 0.4)" : `0 10px 25px -5px ${quest.color}66`
            }}
          >
            {isSelected ? (
              <>
                <Check className="w-6 h-6" />
                Квест выбран
              </>
            ) : (
              `Выбрать этот квест`
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Step2Quests() {
  const { state, updateState, isMega } = useWizard();
  const [openQuest, setOpenQuest] = useState<typeof PHYGITAL_QUESTS[number] | null>(null);
  const [classicQuestInfo, setClassicQuestInfo] = useState<string | null>(null);
  const [surchargePopup, setSurchargePopup] = useState<{ questId: string; amount: number } | null>(null);
  const selectedClassicQuest = CLASSIC_QUESTS.find(q => q.id === classicQuestInfo);

  const togglePhygital = (id: PhygitalId) => {
    if (state.questType === id) {
      updateState({ questType: null, isQuestPopupOpen: false });
    } else {
      updateState({ questType: id, isQuestPopupOpen: false });
    }
    setOpenQuest(null);
  };

  const selectPhygital = (id: PhygitalId) => {
    updateState({ questType: id, isQuestPopupOpen: false });
    setOpenQuest(null);
  };

  const handleClassicSelect = (id: ClassicId) => {
    // Already selected → deselect
    if (state.questType === id) {
      updateState({ questType: null });
      return;
    }
    // Determine surcharge
    if (state.packageType === "basic") {
      setSurchargePopup({ questId: id, amount: 16000 });
    } else if (state.packageType === "premium") {
      setSurchargePopup({ questId: id, amount: 9000 });
    } else if (state.packageType === "exclusive") {
      setSurchargePopup({ questId: id, amount: 9000 });
    } else {
      // custom = price shown on card
      updateState({ questType: id });
    }
  };

  const confirmSurcharge = () => {
    if (surchargePopup) {
      updateState({ questType: surchargePopup.questId as any });
      setSurchargePopup(null);
    }
  };

  const isPhygitalSelected = state.questType?.startsWith("phygital_");
  const isClassicSelected = state.questType?.startsWith("classic_");
  const isCustom = state.packageType === "custom";

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
            Выберите квест
          </h2>
          <p className="text-base font-bold text-[#747474] leading-relaxed">
            Главное приключение дня рождения
          </p>
        </div>

        {/* Phygital section — FLAGSHIP */}
        <div className="mb-6 mt-4">
          {/* Section label */}
          <div className="flex justify-center mb-[32px]">
            <div className="bg-[#5b21cc] text-white text-[19px] sm:text-[22px] font-black tracking-[-0.3px] px-[28px] py-[10px] rounded-[16px] transform rotate-[-2deg] shadow-lg shadow-[#5b21cc]/30">
              Фиджитал квесты
            </div>
          </div>

          {/* Phygital quest cards */}
          <div className="flex flex-col gap-[28px]">
            {PHYGITAL_QUESTS.map((quest, i) => {
              const isSelected = state.questType === quest.id;

              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div
                    className={`relative h-[300px] sm:h-[350px] rounded-[32px] overflow-hidden bg-white transition-all cursor-pointer group ${
                      isSelected ? "ring-4 shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
                    }`}
                    style={isSelected ? { boxShadow: `0 0 0 4px ${quest.color}, 0 0 24px ${quest.color}40, 0 12px 40px ${quest.color}20` } : {}}
                    onClick={() => {
                      setOpenQuest(quest);
                      updateState({ isQuestPopupOpen: true });
                    }}
                  >
                      <img
                        src={getPublicUrl(quest.photos[0])}
                        alt={quest.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#FF6022] to-[#FF8A00] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-2xl shadow-lg shadow-[#FF6022]/30 flex items-center gap-1 border border-white/20">
                      🔥 Хит · Акция
                    </div>

                    <button 
                      className="absolute top-4 right-4 bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-2 z-10 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6022]/40"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenQuest(quest);
                        updateState({ isQuestPopupOpen: true });
                      }}
                    >
                      <Info className="w-4 h-4" />Подробнее
                    </button>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[24px] p-4 shadow-2xl flex items-center justify-between border border-white/20">
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-xl leading-none">{quest.emoji}</span>
                          <h4 className="text-[15px] font-bold text-[#1A1A1A] truncate">{quest.title}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md px-2 py-1">
                            <Clock className="w-3 h-3 text-[#747474]" />
                            <span className="text-[10px] text-[#1A1A1A] font-medium">{quest.duration} мин</span>
                          </div>
                          <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md px-2 py-1">
                            <Users className="w-3 h-3 text-[#747474]" />
                            <span className="text-[10px] text-[#1A1A1A] font-medium">до {quest.maxKids} детей</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          {isCustom ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-[#ABABAB] line-through">20 000 ₽</span>
                              <span className="text-[12px] text-[#FF6022] font-black">12 000 ₽</span>
                              <span className="text-[9px] font-extrabold text-white bg-gradient-to-r from-[#FF6022] to-[#FF8A00] px-1.5 py-0.5 rounded-full shadow-sm">
                                -40% Акция
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-[#ABABAB] line-through">20 000 ₽</span>
                                <span className="text-[11px] text-[#4CAF50] font-extrabold">Входит в пакет!</span>
                              </div>
                              <span className="text-[9px] text-[#2E7D32] bg-[#E8F5E9] border border-[#C8E6C9] font-bold px-1.5 py-0.5 rounded-md self-start">
                                🔥 Акция до конца месяца
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "text-white shadow-lg" : "bg-gray-50 text-[#D1D1D1] group-hover:bg-gray-100"
                        }`}
                        style={isSelected ? { backgroundColor: quest.color, boxShadow: `0 10px 15px -3px ${quest.color}4d` } : {}}
                      >
                        <Check className="w-5 h-5 flex-shrink-0" />
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
          <div className="mb-[20px] mt-[16px]">
            <h2 className="text-[24px] tracking-[-0.5px] font-black text-[#1A1A1A] leading-tight mb-1.5">
              Или классические квесты
            </h2>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[#747474] font-medium">2 аниматора · до 20 детей · 60 мин.</span>
              {isCustom && (
                <span className="font-semibold text-[#FF6022] bg-[#FF6022]/10 px-2.5 py-0.5 rounded-md">16 000 ₽</span>
              )}
              {state.packageType === "basic" && (
                <span className="font-semibold text-[#FF6022] bg-[#FF6022]/10 px-2.5 py-0.5 rounded-md">+16 000 ₽</span>
              )}
              {state.packageType === "premium" && (
                <span className="font-semibold text-[#FF6022] bg-[#FF6022]/10 px-2.5 py-0.5 rounded-md">+16 000 ₽</span>
              )}
              {state.packageType === "exclusive" && (
                <span className="font-semibold text-[#FF6022] bg-[#FF6022]/10 px-2.5 py-0.5 rounded-md">+9 000 ₽</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[28px] mb-6">
            {CLASSIC_QUESTS.map((quest, i) => {
              const isSelected = state.questType === quest.id;
              return (
                <motion.div
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div
                    className={`relative h-[300px] sm:h-[350px] rounded-[32px] overflow-hidden bg-white transition-all cursor-pointer group ${
                      isSelected ? "ring-4 shadow-xl scale-[1.01]" : "ring-1 ring-[#E5E5E5] shadow-sm"
                    }`}
                    style={isSelected ? { boxShadow: `0 0 0 4px #FF6022, 0 0 24px #FF602240, 0 12px 40px #FF602220` } : {}}
                    onClick={() => handleClassicSelect(quest.id as ClassicId)}
                  >
                    <div className="absolute inset-0 bg-[#F8F8F8] flex items-center justify-center">
                      {quest.image ? (
                        <ImageWithFallback src={getPublicUrl(quest.image)} alt={quest.name} className="w-full h-full object-contain object-center pt-8 pb-[100px] drop-shadow-xl scale-[1.5] group-hover:scale-[1.65] transition-transform duration-700" />
                      ) : (
                        <span className="text-6xl sm:text-7xl filter drop-shadow-md pb-[100px] group-hover:scale-110 transition-transform duration-500">{quest.emoji}</span>
                      )}
                    </div>

                    <button 
                      className="absolute top-4 right-4 bg-gradient-to-tr from-[#FF6022] to-[#FF8A00] text-white text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-2 z-10 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-[#FF6022]/40"
                      onClick={(e) => {
                        e.stopPropagation();
                        setClassicQuestInfo(quest.id);
                      }}
                    >
                      <Info className="w-4 h-4" />Подробнее
                    </button>

                    <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-white/95 backdrop-blur-xl rounded-[24px] p-4 shadow-2xl flex items-center justify-between border border-white/20">
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-xl leading-none">{quest.emoji}</span>
                          <h4 className="text-[15px] font-bold text-[#1A1A1A] truncate">{quest.name}</h4>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md px-2 py-1">
                            <Clock className="w-3 h-3 text-[#747474]" />
                            <span className="text-[10px] text-[#1A1A1A] font-medium">60 мин</span>
                          </div>
                          <div className="flex items-center gap-1 bg-[#F5F5F5] rounded-md px-2 py-1">
                            <Users className="w-3 h-3 text-[#747474]" />
                            <span className="text-[10px] text-[#1A1A1A] font-medium">до 20 детей</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#FF6022] font-extrabold mt-1">
                          {isCustom && "16 000 ₽"}
                          {state.packageType === "basic" && "+16 000 ₽"}
                          {state.packageType === "premium" && "+16 000 ₽"}
                          {state.packageType === "exclusive" && "+9 000 ₽"}
                        </p>
                      </div>

                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "text-white shadow-lg bg-[#FF6022]" : "bg-gray-50 text-[#D1D1D1] group-hover:bg-gray-100"
                        }`}
                        style={isSelected ? { boxShadow: `0 10px 15px -3px #FF60224d` } : {}}
                      >
                        <Check className="w-5 h-5 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Quest popup */}
      <AnimatePresence>
        {openQuest && (
          <QuestPopup
            quest={openQuest}
            onClose={() => {
              setOpenQuest(null);
              updateState({ isQuestPopupOpen: false });
            }}
            onSelect={() => selectPhygital(openQuest.id)}
            isSelected={state.questType === openQuest.id}
          />
        )}
      </AnimatePresence>

      {/* Classic Quest Info Popup */}
      <AnimatePresence>
        {classicQuestInfo && selectedClassicQuest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-[-50vh] bottom-[-50vh] left-0 right-0 z-[100] flex items-center justify-center p-4 pointer-events-none"
          >
            {/* Extended bounce cover backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-auto"
              onClick={() => setClassicQuestInfo(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] pointer-events-auto relative z-10"
            >
              <div className="relative shrink-0 bg-black">
                <div className="aspect-[4/3] w-full bg-[#F8F8F8] flex items-center justify-center">
                  {selectedClassicQuest.image ? (
                    <ImageWithFallback src={getPublicUrl(selectedClassicQuest.image)} alt={selectedClassicQuest.name} className="w-full h-full object-contain object-bottom pt-8 px-4 scale-[1.5]" />
                  ) : (
                    <span className="text-8xl sm:text-9xl filter drop-shadow-md">{selectedClassicQuest.emoji}</span>
                  )}
                </div>
                <button
                  onClick={() => setClassicQuestInfo(null)}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-full text-[#1A1A1A] transition-colors hover:bg-white z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto overscroll-contain">
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-1">{selectedClassicQuest.emoji} {selectedClassicQuest.name}</h3>
                <div className="text-xs text-[#747474] mb-4">2 аниматора · до 20 детей · 60 мин.</div>
                <p className="text-[#747474] text-sm leading-relaxed mb-5">
                  {selectedClassicQuest.description}
                </p>

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

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      const isSelected = state.questType === selectedClassicQuest.id;
                      if (!isSelected) {
                        handleClassicSelect(selectedClassicQuest.id as ClassicId);
                      }
                      setClassicQuestInfo(null);
                    }}
                    className={`flex-1 py-3.5 rounded-xl font-medium text-center transition-all ${
                      state.questType === selectedClassicQuest.id
                        ? "bg-[#F5F5F5] text-[#747474]"
                        : "bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                    }`}
                  >
                    {state.questType === selectedClassicQuest.id ? "Выбрано ✓" : "Выбрать этот квест"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Surcharge Confirmation Popup */}
      <AnimatePresence>
        {surchargePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={() => setSurchargePopup(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="w-16 h-16 bg-[#FF6022]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎭</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Доплата за квест</h3>
                <p className="text-sm text-[#747474] leading-relaxed">
                  За классический квест в вашем пакете нужно доплатить
                </p>
                <p className="text-2xl font-black text-[#FF6022] mt-2">
                  +{surchargePopup.amount.toLocaleString("ru-RU")} ₽
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSurchargePopup(null)}
                  className="flex-1 py-3.5 rounded-xl font-medium text-center bg-[#F5F5F5] text-[#747474] transition-all active:scale-[0.98]"
                >
                  Отмена
                </button>
                <button
                  onClick={confirmSurcharge}
                  className="flex-1 py-3.5 rounded-xl font-medium text-center bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                >
                  Добавить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
