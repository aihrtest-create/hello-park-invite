import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import HParkLogo from "../../imports/HParkLogo";
import { 
  Calendar, 
  MapPin, 
  CalendarPlus, 
  Navigation,
  Sparkles,
  Smartphone,
  Monitor,
  Heart,
  Sliders,
  Check,
  RotateCcw,
  Languages
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Type Definitions
// ─────────────────────────────────────────────────────────────────────────────
type EmojiKey = "cake" | "popper" | "gift" | "balloon" | "dino";

interface CardVariant {
  id: string;
  name: string;
  emojiKey: EmojiKey;
  emojiPath: string;
  childName: string;
  age: string;
  date: string;
  time: string;
  rotated: boolean;
  hasBackdropShadow: boolean;
  hasBottomButtons: boolean;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Date formatting helper for multiple locales
// ─────────────────────────────────────────────────────────────────────────────
const monthsShortRu = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const monthsShortEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getFormattedDate = (dateStr: string, locale: "ru" | "en" | "ar") => {
  if (!dateStr) return "";
  try {
    let year = "", month = "", day = "";
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      year = parts[0];
      month = parts[1];
      day = parts[2];
    } else if (dateStr.includes(".")) {
      const parts = dateStr.split(".");
      day = parts[0];
      month = parts[1];
      year = parts[2];
    } else {
      return dateStr;
    }

    const y = parseInt(year);
    const m = parseInt(month);
    const d = parseInt(day);

    if (isNaN(y) || isNaN(m) || isNaN(d)) return dateStr;

    if (locale === "ru") {
      return `${d} ${monthsShortRu[m - 1] || ""} ${y}`;
    }
    if (locale === "en") {
      return `${monthsShortEn[m - 1] || ""} ${d}, ${y}`;
    }
    if (locale === "ar") {
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("ar-AE", { day: "numeric", month: "long", year: "numeric" });
    }
    return dateStr;
  } catch {
    return dateStr;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Component Definition
// ─────────────────────────────────────────────────────────────────────────────
export default function InvitationVariants() {
  // Demo cards definition
  const initialVariants: CardVariant[] = [
    {
      id: "var1",
      name: "Вариант 1: Праздничный торт (Классический)",
      emojiKey: "cake",
      emojiPath: "/images/3d_cake.png",
      childName: "Вася",
      age: "7 лет",
      date: "15.11.2026",
      time: "15:00",
      rotated: false,
      hasBackdropShadow: false,
      hasBottomButtons: false,
      description: "Прямая строгая карточка с сочным 3D-тортом, перекрывающим верхний край. Идеальный баланс минимализма и праздничной атмосферы."
    },
    {
      id: "var2",
      name: "Вариант 2: Взрывная хлопушка (Как на рефе)",
      emojiKey: "popper",
      emojiPath: "/images/3d_popper.png",
      childName: "Вася",
      age: "7 лет",
      date: "15.11.2026",
      time: "15:00",
      rotated: true,
      hasBackdropShadow: true,
      hasBottomButtons: true,
      description: "Слегка наклоненная карточка с оранжевой подложкой сзади, создающей 3D-объем. Включает в себя 3D-хлопушку и кнопки «Календарь» и «Карта» внизу."
    },
    {
      id: "var3",
      name: "Вариант 3: Подарочная коробка",
      emojiKey: "gift",
      emojiPath: "/images/3d_gift.png",
      childName: "Алиса",
      age: "6 лет",
      date: "20.12.2026",
      time: "14:00",
      rotated: false,
      hasBackdropShadow: true,
      hasBottomButtons: false,
      description: "Прямая карточка с оранжевой теневой подложкой и яркой подарочной 3D-коробкой с большим золотым бантом."
    },
    {
      id: "var4",
      name: "Вариант 4: Облако воздушных шаров",
      emojiKey: "balloon",
      emojiPath: "/images/3d_balloon.png",
      childName: "Миша",
      age: "8 лет",
      date: "05.09.2026",
      time: "16:30",
      rotated: true,
      hasBackdropShadow: false,
      hasBottomButtons: true,
      description: "Наклоненная карточка со связкой ярких 3D-шаров и дополнительными кнопками действий для полного интерактивного опыта."
    },
    {
      id: "var5",
      name: "Вариант 5: Дино-Приключение (Квестовый)",
      emojiKey: "dino",
      emojiPath: "/images/3d_dino.png",
      childName: "Тёма",
      age: "5 лет",
      date: "12.10.2026",
      time: "12:00",
      rotated: false,
      hasBackdropShadow: false,
      hasBottomButtons: false,
      description: "Вариант с милым 3D-динозавром для любителей фиджитал-квестов, активных игр и приключений в парках Hello Park."
    }
  ];

  // Component States
  const [variants, setVariants] = useState<CardVariant[]>(initialVariants);
  const [activeVariantId, setActiveVariantId] = useState<string>("var2");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  
  // Customizer inputs
  const [customName, setCustomName] = useState("Вася");
  const [customAge, setCustomAge] = useState("7 лет");
  const [customDate, setCustomDate] = useState("15.11.2026");
  const [customTime, setCustomTime] = useState("15:00");
  const [customText, setCustomText] = useState("приглашает вас на свой день рождения в парк будущего");
  const [customLanguage, setCustomLanguage] = useState<"ru" | "en" | "ar">("ru");

  // Status Toast State
  const [toastMessage, setToastMessage] = useState("");

  const activeVariant = variants.find(v => v.id === activeVariantId) || variants[0];

  const handleConfetti = (isSuccess: boolean) => {
    if (isSuccess) {
      setToastMessage("Ура! Ждем вас на празднике! 🎉");
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setToastMessage("Жаль, нам будет не хватать вас! 😢");
    }
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleCopyLink = () => {
    // Generate simple link simulator
    const params = new URLSearchParams();
    params.set("invite_preview", "true");
    params.set("name", customName);
    params.set("age", customAge);
    params.set("date", customDate);
    params.set("time", customTime);
    params.set("emoji", activeVariant.emojiKey);
    params.set("rotated", activeVariant.rotated ? "true" : "false");
    params.set("shadow", activeVariant.hasBackdropShadow ? "true" : "false");
    params.set("buttons", activeVariant.hasBottomButtons ? "true" : "false");

    const link = `${window.location.origin}/mega/invite?${params.toString()}`;
    navigator.clipboard.writeText(link);
    setToastMessage("Ссылка на дизайн скопирована! 📋");
    setTimeout(() => setToastMessage(""), 2000);
  };

  // Translations simulator
  const texts = {
    ru: {
      inviteLabel: "ВАМ ПРИСЛАЛИ ПРИГЛАШЕНИЕ!",
      invitesText: "приглашает вас на свой день рождения в парк будущего",
      dateLabel: "Дата",
      timeLabel: "Сбор гостей",
      btnYes: "Мы придем",
      btnNo: "Не сможем(",
      btnCalendar: "Добавить в календарь",
      btnMap: "Адрес"
    },
    en: {
      inviteLabel: "YOU'VE RECEIVED AN INVITATION!",
      invitesText: "invites you to their birthday party in the park of the future",
      dateLabel: "Date",
      timeLabel: "Gathering",
      btnYes: "We will come",
      btnNo: "Can't make it",
      btnCalendar: "Add to calendar",
      btnMap: "Address"
    },
    ar: {
      inviteLabel: "لقد تلقيت دعوة خاصة!",
      invitesText: "يدعوكم لحضور عيد ميلاده في مدينة ملاهي المستقبل",
      dateLabel: "التاريخ",
      timeLabel: "تجمع الضيوف",
      btnYes: "سنحضر بكل سرور",
      btnNo: "لا أستطيع الحضور",
      btnCalendar: "إضافة إلى التقويم",
      btnMap: "العنوان"
    }
  }[customLanguage];

  return (
    <div className="min-h-screen bg-[#121214] text-white flex flex-col font-sans selection:bg-[#FF6022]/30 selection:text-white">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#FF6022] text-white font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 border border-white/20"
          >
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Section */}
      <header className="border-b border-[#232329] bg-[#16161a] py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-8 aspect-[1.75] shrink-0 bg-white/5 p-1 rounded-lg">
              <HParkLogo />
            </div>
            <div className="h-6 w-px bg-[#232329]" />
            <div>
              <h1 className="text-lg font-black tracking-tight flex items-center gap-2">
                Согласование дизайна приглашений <span className="bg-[#FF6022] text-xs px-2.5 py-0.5 rounded-full">v2.0</span>
              </h1>
              <p className="text-xs text-[#8E8E93]">Интерактивная страница для проверки верстки, шрифтов и 3D-эмодзи</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            {/* Device Switcher */}
            <div className="bg-[#232329] p-0.5 rounded-full flex items-center border border-white/5">
              <button 
                onClick={() => setPreviewDevice("mobile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  previewDevice === "mobile" 
                    ? "bg-[#FF6022] text-white shadow-md" 
                    : "text-[#8E8E93] hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Мобилка
              </button>
              <button 
                onClick={() => setPreviewDevice("desktop")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  previewDevice === "desktop" 
                    ? "bg-[#FF6022] text-white shadow-md" 
                    : "text-[#8E8E93] hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Компьютер
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="bg-[#2E2E35] hover:bg-[#3A3A42] text-white px-4 py-2 rounded-full text-xs font-black transition-all flex items-center gap-1.5 border border-white/10 active:scale-[0.98]"
            >
              <Sliders className="w-3.5 h-3.5" />
              Тест-Ссылка
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Customizer & Selectors (4 cols) */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          {/* Card Selector Card */}
          <div className="bg-[#16161a] border border-[#232329] rounded-3xl p-5 shadow-lg">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#FF6022] mb-4 flex items-center gap-2">
              <span>1. Выберите вариант</span>
            </h2>
            <div className="flex flex-col gap-2.5">
              {variants.map((v) => {
                const isActive = v.id === activeVariantId;
                return (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveVariantId(v.id);
                      // Update inputs with preset defaults to show changes
                      if (v.id === "var3") {
                        setCustomName("Алиса");
                        setCustomAge("6 лет");
                        setCustomDate("20.12.2026");
                        setCustomTime("14:00");
                      } else if (v.id === "var4") {
                        setCustomName("Миша");
                        setCustomAge("8 лет");
                        setCustomDate("05.09.2026");
                        setCustomTime("16:30");
                      } else if (v.id === "var5") {
                        setCustomName("Тёма");
                        setCustomAge("5 лет");
                        setCustomDate("12.10.2026");
                        setCustomTime("12:00");
                      } else {
                        setCustomName("Вася");
                        setCustomAge("7 лет");
                        setCustomDate("15.11.2026");
                        setCustomTime("15:00");
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                      isActive 
                        ? "bg-[#2A201C] border-[#FF6022] shadow-[0_0_15px_rgba(255,96,34,0.15)] text-white" 
                        : "bg-[#1C1C21] border-[#2E2E35] hover:border-[#3A3A42] text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    <span className="text-2xl mt-0.5 shrink-0 select-none">
                      {v.emojiKey === "cake" && "🍰"}
                      {v.emojiKey === "popper" && "🎉"}
                      {v.emojiKey === "gift" && "🎁"}
                      {v.emojiKey === "balloon" && "🎈"}
                      {v.emojiKey === "dino" && "🦖"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-sm flex items-center justify-between gap-1">
                        <span className="truncate">{v.name}</span>
                        {isActive && <Check className="w-4 h-4 text-[#FF6022] shrink-0" />}
                      </div>
                      <p className="text-xs mt-1 text-[#8E8E93] font-medium leading-relaxed">
                        {v.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Live Customizer */}
          <div className="bg-[#16161a] border border-[#232329] rounded-3xl p-5 shadow-lg flex-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-[#FF6022] mb-4 flex items-center justify-between">
              <span>2. Редактор данных</span>
              <button 
                onClick={() => {
                  setCustomName("Вася");
                  setCustomAge("7 лет");
                  setCustomDate("15.11.2026");
                  setCustomTime("15:00");
                  setCustomText("приглашает вас на свой день рождения в парк будущего");
                  setCustomLanguage("ru");
                }}
                className="text-xs text-[#8E8E93] hover:text-white flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                Сброс
              </button>
            </h2>

            <div className="space-y-4">
              {/* Language Switcher */}
              <div>
                <label className="text-xs text-[#8E8E93] font-bold block mb-1.5 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  Язык приглашения
                </label>
                <div className="grid grid-cols-3 gap-2 bg-[#1C1C21] p-1 rounded-xl border border-[#2E2E35]">
                  {(["ru", "en", "ar"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setCustomLanguage(lang)}
                      className={`py-1.5 rounded-lg text-xs font-black uppercase transition-all ${
                        customLanguage === lang 
                          ? "bg-[#FF6022] text-white shadow-md" 
                          : "text-[#8E8E93] hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {lang === "ru" ? "Рус" : lang === "en" ? "Eng" : "عرب"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Age */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8E93] font-bold block mb-1">Имя именинника</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-[#1C1C21] border border-[#2E2E35] focus:border-[#FF6022] rounded-xl px-3 py-2 text-sm text-white font-bold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E8E93] font-bold block mb-1">Возраст / Подпись</label>
                  <input
                    type="text"
                    value={customAge}
                    onChange={(e) => setCustomAge(e.target.value)}
                    className="w-full bg-[#1C1C21] border border-[#2E2E35] focus:border-[#FF6022] rounded-xl px-3 py-2 text-sm text-white font-bold outline-none transition-all"
                  />
                </div>
              </div>

              {/* Invitation Text */}
              <div>
                <label className="text-xs text-[#8E8E93] font-bold block mb-1">Текст приглашения</label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1C1C21] border border-[#2E2E35] focus:border-[#FF6022] rounded-xl px-3 py-2 text-xs text-white font-medium outline-none transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#8E8E93] font-bold block mb-1">Дата праздника</label>
                  <input
                    type="text"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    className="w-full bg-[#1C1C21] border border-[#2E2E35] focus:border-[#FF6022] rounded-xl px-3 py-2 text-sm text-white font-bold outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#8E8E93] font-bold block mb-1">Сбор гостей</label>
                  <input
                    type="text"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full bg-[#1C1C21] border border-[#2E2E35] focus:border-[#FF6022] rounded-xl px-3 py-2 text-sm text-white font-bold outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#232329]">
              <div className="bg-[#1C1C21] rounded-2xl p-3.5 border border-[#2E2E35] text-xs text-[#8E8E93] leading-relaxed">
                <span className="font-black text-white block mb-1 flex items-center gap-1">
                  💡 Настройки верстки этого варианта:
                </span>
                <ul className="list-disc pl-4 space-y-1 mt-1 font-medium">
                  <li>Поворот карточки: <strong className="text-white">{activeVariant.rotated ? "Включен (-3°)" : "Выключен"}</strong></li>
                  <li>Оранжевая теневая подложка: <strong className="text-white">{activeVariant.hasBackdropShadow ? "Да" : "Нет"}</strong></li>
                  <li>Утилитарные кнопки внизу: <strong className="text-white">{activeVariant.hasBottomButtons ? "Показаны" : "Скрыты"}</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Right column: Interactive Live Sandbox Showcase (8 cols) */}
        <section className="lg:col-span-8 flex flex-col items-center justify-start min-h-[500px]">
          
          {/* Main Visual Arena */}
          <div className="w-full flex-1 bg-[#1A1A1E] border border-[#232329] rounded-[32px] p-6 flex items-center justify-center relative overflow-hidden shadow-inner">
            
            {/* Ambient Background Grid Pattern for professional design environment */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0F0F12] to-transparent pointer-events-none" />

            {/* Scale wrapper for simulating responsive viewport */}
            <div 
              className={`transition-all duration-500 ease-in-out flex items-center justify-center ${
                previewDevice === "mobile" 
                  ? "w-[390px] min-h-[640px] border-[8px] border-[#2A2A30] rounded-[48px] bg-white shadow-2xl p-4 relative" 
                  : "w-full min-h-[550px] bg-transparent p-2"
              }`}
              style={{
                boxShadow: previewDevice === "mobile" ? "0 25px 60px -15px rgba(0,0,0,0.8), inset 0 0 10px rgba(0,0,0,0.5)" : "none"
              }}
            >
              {/* Mobile Device Status Bar Simulator */}
              {previewDevice === "mobile" && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-[#2A2A30] rounded-full z-50 flex items-center justify-center">
                  <div className="w-12 h-1 bg-white/20 rounded-full" />
                </div>
              )}

              {/* RENDER EMBEDDED INVITATION PAGE SIMULATION */}
              <div 
                className={`w-full h-full flex flex-col items-center justify-between select-none ${
                  previewDevice === "mobile" 
                    ? "py-4 px-2" 
                    : "py-6 max-w-lg mx-auto"
                }`}
                style={{
                  fontFamily: "'Gilroy', 'Nunito', sans-serif"
                }}
                dir={customLanguage === "ar" ? "rtl" : "ltr"}
              >
                {/* 1. Header Logo & Badge */}
                <div className="w-full flex flex-col items-center mb-6 z-20">
                  <div className="h-9 aspect-[1.75] mb-4.5 transition-transform hover:scale-105">
                    <HParkLogo />
                  </div>
                  
                  {/* Badge */}
                  <div className="bg-[#EDEDED] text-[#1C1C1E] text-[10px] sm:text-xs font-black tracking-widest px-4.5 py-1.5 rounded-full uppercase border border-[#E5E5EA]">
                    {texts.inviteLabel}
                  </div>
                </div>

                {/* 2. Interactive Card Layout Container */}
                <div className="w-full flex flex-col items-center justify-center my-auto py-6 relative z-10">
                  
                  {/* Card Animation & Style Wrapper */}
                  <div 
                    className="relative w-full max-w-[328px] transition-transform duration-500"
                    style={{
                      transform: activeVariant.rotated ? "rotate(-3deg)" : "none"
                    }}
                  >
                    
                    {/* Behind-card Orange Layered Backdrop (Creates 3D card layout from Figma reference) */}
                    {activeVariant.hasBackdropShadow && (
                      <div 
                        className="absolute inset-0 bg-[#FF6022] rounded-[36px] translate-x-2.5 translate-y-3 z-0"
                        style={{
                          boxShadow: "0 15px 35px rgba(255,96,34,0.3)"
                        }}
                      />
                    )}

                    {/* Main Grey Card Frame */}
                    <div 
                      className="relative z-10 w-full bg-[#EDEDED] rounded-[36px] p-6 text-center border border-white/20 select-text"
                      style={{
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.08), inset 0 1.5px 0 rgba(255,255,255,0.4)"
                      }}
                    >
                      {/* Overlapping 3D Emoji Asset (Perfect Absolute Alignment) */}
                      <div className="absolute -top-[76px] left-1/2 -translate-x-1/2 w-[140px] h-[140px] z-30 pointer-events-none drop-shadow-[0_12px_20px_rgba(0,0,0,0.15)] select-none">
                        <img 
                          src={`${import.meta.env.BASE_URL || "/"}${activeVariant.emojiPath.replace(/^\//, "")}`} 
                          alt="3D Emoji"
                          className="w-full h-full object-contain animate-bounce"
                          style={{
                            animationDuration: "3s"
                          }}
                        />
                      </div>

                      {/* Spacer to push text below overlapping emoji */}
                      <div className="h-12" />

                      {/* Main Invitation Text Block */}
                      <div className="text-[#1A1A1A] px-1 select-text">
                        <span className="text-xl font-bold tracking-tight leading-snug">
                          <strong className="text-[26px] font-black tracking-tighter block mb-1.5">
                            {customName}
                          </strong>
                          {customText}{" "}
                          <span className="text-[#FF6022] font-black tracking-tight block mt-1 hover:scale-[1.02] transition-transform cursor-pointer">
                            Hello Park
                          </span>
                        </span>
                      </div>

                      {/* Divider */}
                      <div className="h-[1px] bg-black/10 my-5" />

                      {/* Event Details Grid */}
                      <div className="grid grid-cols-2 gap-4 text-center select-text">
                        {/* Date info block */}
                        <div className="flex flex-col items-center">
                          <span className="text-xs text-[#747474] font-bold tracking-wide uppercase mb-0.5">
                            {texts.dateLabel}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-black tracking-tight leading-none whitespace-nowrap">
                            {getFormattedDate(customDate, customLanguage)}
                          </span>
                        </div>

                        {/* Guest Time info block */}
                        <div className="flex flex-col items-center border-l border-black/10">
                          <span className="text-xs text-[#747474] font-bold tracking-wide uppercase mb-0.5">
                            {texts.timeLabel}
                          </span>
                          <span className="text-lg sm:text-xl font-black text-black tracking-tight leading-none">
                            {customTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Primary Interactive Action Buttons (RSVP) */}
                <div className="w-full max-w-[328px] grid grid-cols-2 gap-3.5 z-20 mb-4.5">
                  <button
                    onClick={() => handleConfetti(true)}
                    className="bg-[#EFEFEF] hover:bg-[#E5E5EA] active:bg-[#D1D1D6] text-[#2E7D32] text-sm sm:text-base font-extrabold py-3.5 px-2 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <Check className="w-4 h-4 shrink-0" />
                    {texts.btnYes}
                  </button>
                  
                  <button
                    onClick={() => handleConfetti(false)}
                    className="bg-[#EFEFEF] hover:bg-[#E5E5EA] active:bg-[#D1D1D6] text-[#C62828] text-sm sm:text-base font-extrabold py-3.5 px-2 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <span>{texts.btnNo}</span>
                  </button>
                </div>

                {/* 4. Secondary Action Buttons (Calendar & Maps) */}
                {activeVariant.hasBottomButtons && (
                  <div className="w-full max-w-[328px] grid grid-cols-2 gap-3 z-20">
                    <button
                      onClick={() => setToastMessage("Добавлено в ваш календарь! 📅")}
                      className="bg-[#EAEBED] hover:bg-[#E2E3E6] text-[#5856D6] text-[11px] sm:text-xs font-black py-3 px-1 rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CalendarPlus className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{texts.btnCalendar}</span>
                    </button>
                    
                    <button
                      onClick={() => setToastMessage("Локация открыта на картах! 🗺️")}
                      className="bg-[#EAEBED] hover:bg-[#E2E3E6] text-[#007AFF] text-[11px] sm:text-xs font-black py-3 px-1 rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Navigation className="w-3.5 h-3.5 shrink-0 rotate-45" />
                      <span className="truncate">{texts.btnMap}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick instructions / Help under showcase */}
          <div className="w-full mt-4 text-center">
            <p className="text-xs text-[#8E8E93] font-medium flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6022] animate-spin" style={{ animationDuration: '4s' }} />
              Нажмите кнопку <strong>«Мы придем»</strong> в симуляторе, чтобы проверить анимацию победного конфетти!
            </p>
          </div>
        </section>
      </main>

      {/* Footer bar */}
      <footer className="border-t border-[#232329] bg-[#16161a] py-4 px-6 text-center text-xs text-[#8E8E93]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 font-medium">
          <span>Разработано Antigravity для Hello Park • 2026</span>
          <div className="flex gap-4">
            <span className="hover:text-white transition-colors cursor-pointer">Руководство по дизайну</span>
            <span className="hover:text-white transition-colors cursor-pointer">Спецификация шрифтов</span>
            <span className="hover:text-white transition-colors cursor-pointer">Figma Sync</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
