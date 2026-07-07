import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import confetti from "canvas-confetti";
import HParkLogo from "../../imports/HParkLogo";
import { 
  Globe, 
  Sparkles, 
  Calendar, 
  Clock, 
  Check, 
  Copy, 
  Share2, 
  CalendarPlus, 
  CheckCircle2,
  Heart,
  ArrowRight,
  MapPin,
  X,
  Users,
  Eye
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────────────────────
type Language = "ru" | "en" | "ar";
type TemplateId = "neon"; 

interface InvitationData {
  lang: Language;
  template: TemplateId;
  name: string;
  date: string;
  gatheringTime: string;
  location: string; // Storing the selected park ID (e.g., "mega_khimki")
  emoji: string;
}

interface ParkInfo {
  id: string;
  nameRu: string;
  nameEn: string;
  nameAr: string;
  addressRu: string;
  addressEn: string;
  addressAr: string;
  mapUrl: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static Park Data & Mapping
// ─────────────────────────────────────────────────────────────────────────────
const helloParks: ParkInfo[] = [
  {
    id: "mega_khimki",
    nameRu: "Hello Park ТРЦ МЕГА Химки",
    nameEn: "Hello Park Mega Khimki",
    nameAr: "هلو بارك ميجا خيمكي",
    addressRu: "Московская обл., г. Химки, микрорайон ИКЕА, к2, ТРЦ МЕГА Химки",
    addressEn: "Moscow region, Khimki, IKEA microdistrict, bld. 2, Mega Khimki Mall",
    addressAr: "منطقة موسكو، خيمكي، حي إيكيا، مبنى 2، مول ميجا خيمكي",
    mapUrl: "https://maps.google.com/?q=Hello+Park+MEGA+Khimki"
  },
  {
    id: "mega_teply_stan",
    nameRu: "Hello Park ТРЦ МЕГА Теплый Стан",
    nameEn: "Hello Park Mega Teply Stan",
    nameAr: "هلو بارك ميجا تيبلي ستان",
    addressRu: "г. Москва, п. Сосенское, Калужское ш., 21-й км, ТРЦ МЕГА Теплый Стан",
    addressEn: "Moscow, Sosenskoye, Kaluzhskoye sh., 21st km, Mega Teply Stan Mall",
    addressAr: "موسكو، سوسنسكوي، طريق كالوجسكويه، الكيلومتر 21، مول ميجا تيبلي ستان",
    mapUrl: "https://maps.google.com/?q=Hello+Park+MEGA+Teply+Stan"
  },
  {
    id: "mega_belaya_dacha",
    nameRu: "Hello Park ТРЦ МЕГА Белая Дача",
    nameEn: "Hello Park Mega Belaya Dacha",
    nameAr: "هلو بارك ميجا بيلايا دатشا",
    addressRu: "Московская обл., г. Котельники, 1-й Покровский пр-д, 5, ТРЦ МЕГА Белая Дача",
    addressEn: "Moscow region, Kotelniki, 1st Pokrovsky pr-d, 5, Mega Belaya Dacha Mall",
    addressAr: "منطقة موسكو، كوتيلنيكي، ممر بوكروفسكي الأول، 5، مول ميجا بيلايا داتشا",
    mapUrl: "https://maps.google.com/?q=Hello+Park+MEGA+Belaya+Dacha"
  },
  {
    id: "mega_dybenko",
    nameRu: "Hello Park ТРЦ МЕГА Дыбенко",
    nameEn: "Hello Park Mega Dybenko",
    nameAr: "هلو بارك ميجا ديبينكو",
    addressRu: "Ленинградская обл., Всеволожский р-н, Мурманское ш., 12-й км, ТРЦ МЕГА Дыбенко",
    addressEn: "Leningrad region, Vsevolozhsky district, Murmanskoye sh., 12th km, Mega Dybenko Mall",
    addressAr: "منطقة لينينغراد، فسيفولوزسكي، طريق مورمانسكويه، الكيلومتر 12، مول ميجا ديبينكو",
    mapUrl: "https://maps.google.com/?q=Hello+Park+MEGA+Dybenko"
  },
  {
    id: "avenue_north",
    nameRu: "Hello Park ТЦ Авеню-Север",
    nameEn: "Hello Park Avenue-Sever",
    nameAr: "هلو بارك أفينيو سيفير",
    addressRu: "Москва, Коровинское шоссе, дом 2, ТЦ Авеню-Север, 3 этаж.",
    addressEn: "Moscow, Korovinskoye shosse, 2, Avenue-Sever Mall, 3rd floor.",
    addressAr: "موسكو، كوروفينسكوي شوسيه، 2، مول أفينيو سيفير، الطابق 3",
    mapUrl: "https://yandex.com.tr/maps/-/CTqSYKP3"
  },
  {
    id: "oman",
    nameRu: "Hello Park Oman",
    nameEn: "Hello Park Oman",
    nameAr: "هلو بارك عمان",
    addressRu: "Active Oman, Маскат, Оман",
    addressEn: "Active Oman, Muscat, Oman",
    addressAr: "أكتيف عمان، مسقط، عمان",
    mapUrl: "https://www.google.com/maps/place/Active+Oman+Center+%D8%A3%D9%83%D8%AA%D9%8A%D9%81+%D8%B9%D9%85%D8%A7%D9%86+%D8%B3%D9%86%D8%AA%D8%B1%E2%80%AD/@23.5837078,58.3211374,892m/data=!3m2!1e3!4b1!4m6!3m5!1s0x3e8e01005d35b3b5:0xd13ff9bc88749617!8m2!3d23.5837078!4d58.3211374!16s%2Fg%2F11x7cs6565!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// Localization & Translations
// ─────────────────────────────────────────────────────────────────────────────
const translations = {
  ru: {
    title: "Создатель приглашений",
    subtitle: "Создайте интерактивное приглашение в Hello Park",
    selectLang: "Язык приглашения",
    childName: "Имя именинника",
    childNamePlaceholder: "Например: Вася",
    date: "Дата проведения",
    gatheringTime: "Сбор гостей",
    selectEmoji: "Выберите эмодзи",
    selectPark: "Выбор парка",
    generate: "Создать приглашение",
    readyTitle: "Приглашение готово! 🎉",
    readyDesc: "Скопируйте ссылку и отправьте гостям:",
    copyLink: "Скопировать ссылку",
    copied: "Ссылка скопирована! 📋",
    shareWa: "WhatsApp",
    shareTg: "Telegram",
    openEnvelope: "Тапните по конверту, чтобы открыть",
    backToEnvelope: "Закрыть в конверт",
    guestWillSee: "Предпросмотр приглашения:",
    rsvpTitle: "Вы придете на праздник?",
    rsvpYes: "Мы придем",
    rsvpNo: "Не сможем",
    rsvpYesToast: "До встречи! 🎉",
    rsvpNoToast: "Жаль, будем скучать! 🥺",
    rsvpFormTitle: "Ваше имя / семья",
    rsvpNamePlaceholder: "Например: Семья Ивановых",
    rsvpKids: "Детей",
    rsvpAdults: "Взрослых",
    rsvpConfirm: "Подтвердить",
    locationPreset: "Hello Park, ТРЦ МЕГА",
    calendarTitle: "День Рождения в Hello Park",
    calendarDesc: "Празднуем День Рождения! Ждем вас!",
    addToCalendar: "Календарь",
    openMap: "Адрес",
    tapEnvelopeLabel: "Вам прислали приглашение!",
    creatorLink: "Создать своё приглашение",
    gatheringLabel: "Сбор гостей",
    demoBtn: "Посмотреть пример",
    backToConfig: "Назад к созданию",
    parkInfoTitle: "Информация о парке",
    parkAddressLabel: "Адрес парка:",
    openInMapsBtn: "Открыть на картах",
    calendarChoiceTitle: "Добавить в календарь",
    googleCalendarBtn: "Google Календарь",
    appleCalendarBtn: "Apple / System (.ICS)",
    closeBtn: "Закрыть"
  },
  en: {
    title: "Invitation Creator",
    subtitle: "Create an interactive invitation to Hello Park",
    selectLang: "Invitation Language",
    childName: "Child's Name",
    childNamePlaceholder: "e.g. Leo",
    date: "Event Date",
    gatheringTime: "Gathering Time",
    selectEmoji: "Choose Emoji",
    selectPark: "Choose Park Location",
    generate: "Create Invitation",
    readyTitle: "Invitation is Ready! 🎉",
    readyDesc: "Copy the link and send it to your guests:",
    copyLink: "Copy Link",
    copied: "Link copied! 📋",
    shareWa: "WhatsApp",
    shareTg: "Telegram",
    openEnvelope: "Tap the envelope to open",
    backToEnvelope: "Put in envelope",
    guestWillSee: "Invitation preview:",
    rsvpTitle: "Will you attend?",
    rsvpYes: "We will come",
    rsvpNo: "Can't make it",
    rsvpYesToast: "See you there! 🎉",
    rsvpNoToast: "Sorry, we will miss you! 🥺",
    rsvpFormTitle: "Your name / family name",
    rsvpNamePlaceholder: "e.g. The Smiths",
    rsvpKids: "Kids",
    rsvpAdults: "Adults",
    rsvpConfirm: "Confirm RSVP",
    locationPreset: "Hello Park, Mega Mall",
    calendarTitle: "Birthday Party at Hello Park",
    calendarDesc: "Celebrating birthday! See you there!",
    addToCalendar: "Calendar",
    openMap: "Address",
    tapEnvelopeLabel: "You've received an invitation!",
    creatorLink: "Create Your Own Invitation",
    gatheringLabel: "Gathering",
    demoBtn: "View Example",
    backToConfig: "Back to creator",
    parkInfoTitle: "Park Details",
    parkAddressLabel: "Park Address:",
    openInMapsBtn: "Open in Maps",
    calendarChoiceTitle: "Add to Calendar",
    googleCalendarBtn: "Google Calendar",
    appleCalendarBtn: "Apple / System (.ICS)",
    closeBtn: "Close"
  },
  ar: {
    title: "صانع الدعوات",
    subtitle: "أنشئ دعوة تفاعلية لحفلة هلو بارك",
    selectLang: "لغة الدعوة",
    childName: "اسم الطفل",
    childNamePlaceholder: "مثال: أحمد",
    date: "تاريخ الحفل",
    gatheringTime: "تجمع الضيوف",
    selectEmoji: "اختر إيموجي",
    selectPark: "اختر موقع البارك",
    generate: "إنشاء الدعوة",
    readyTitle: "الدعوة جاهزة! 🎉",
    readyDesc: "انسخ الرابط وأرسله لضيوفك:",
    copyLink: "نسخ الرابط",
    copied: "تم النسخ! 📋",
    shareWa: "واتساب",
    shareTg: "تليجرام",
    openEnvelope: "اضغط على المغلف لفتحه",
    backToEnvelope: "إغلاق في المغلف",
    guestWillSee: "معاينة الدعوة:",
    rsvpTitle: "هل ستتمكن من الحضور؟",
    rsvpYes: "سنحضر بكل سرور",
    rsvpNo: "لا أستطيع الحضور",
    rsvpYesToast: "نراكم هناك! 🎉",
    rsvpNoToast: "يؤسفنا ذلك، سنفتقدك! 🥺",
    rsvpFormTitle: "اسمك / اسم العائلة",
    rsvpNamePlaceholder: "مثال: عائلة أحمد",
    rsvpKids: "أطفال",
    rsvpAdults: "بالغين",
    rsvpConfirm: "تأكيد الحضور",
    locationPreset: "هلو بارك، ميجا مول",
    calendarTitle: "حفلة عيد ميلاد في هلو بارك",
    calendarDesc: "نحتفل بعيد الميلاد! ننتظركم!",
    addToCalendar: "التقويم",
    openMap: "العنوان",
    tapEnvelopeLabel: "لقد تلقيت دعوة خاصة!",
    creatorLink: "أنشئ دعوتك الخاصة",
    gatheringLabel: "تجمع الضيوف",
    demoBtn: "مشاهدة مثال",
    backToConfig: "الرجوع للتعديل",
    parkInfoTitle: "تفاصيل الحفل",
    parkAddressLabel: "عنوان الحفل:",
    openInMapsBtn: "فتح في الخرائط",
    calendarChoiceTitle: "إضافة إلى التقويم",
    googleCalendarBtn: "تقويم Google",
    appleCalendarBtn: "تقويم Apple / System (.ICS)",
    closeBtn: "إغلاق"
  }
};

const emojiOptions = ["🎉", "🎂", "🎈", "🎁", "🚀", "🦊", "👾", "🦖", "🦄", "👑", "🍕", "🧁"];

// ─────────────────────────────────────────────────────────────────────────────
// Design Presets Configuration
// ─────────────────────────────────────────────────────────────────────────────
const designPresets = {
  neon: {
    id: "neon" as TemplateId,
    envelopeColor: "#FF6022", 
    envelopeLiner: "linear-gradient(135deg, #7B2CBF 0%, #FF007F 50%, #00F5FF 100%)", 
    sealColor: "#FF007F"
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Encoding & Decoding helpers for URL
// ─────────────────────────────────────────────────────────────────────────────
function encodeData(obj: InvitationData): string {
  const json = JSON.stringify(obj);
  const base64 = btoa(encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  }));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeData(str: string): InvitationData | null {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const decoded = atob(base64);
    const json = decodeURIComponent(Array.prototype.map.call(decoded, (c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode data:", e);
    return null;
  }
}

// Helper to construct messenger share messages internationally
const getShareMessage = (name: string, lang: Language, link: string) => {
  if (lang === "en") {
    return `${name} invites you to their Birthday Party at Hello Park! Open the magical envelope: ${link}`;
  }
  if (lang === "ar") {
    return `${name} يدعوكم لحفل عيد ميلاده في هلو بارك! افتح المغلف السحري: ${link}`;
  }
  return `${name} приглашает вас на свой День Рождения в Hello Park! Открой волшебный конверт: ${link}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// Main Component Definition
// ─────────────────────────────────────────────────────────────────────────────
export default function InvitationService() {
  // Configurator form state
  const [formData, setFormData] = useState<InvitationData>(() => {
    let initialLang: Language = "ru";
    try {
      if (typeof window !== "undefined") {
        const savedLang = localStorage.getItem("hello_park_invitation_lang");
        if (savedLang && (savedLang === "ru" || savedLang === "en" || savedLang === "ar")) {
          initialLang = savedLang as Language;
        }
      }
    } catch (e) {
      console.error("Local storage error:", e);
    }

    return {
      lang: initialLang,
      template: "neon",
      name: "",
      date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      gatheringTime: "15:00",
      location: initialLang === "ar" ? "oman" : "mega_khimki",
      emoji: "🎉"
    };
  });

  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Guest view states
  const [guestInvite, setGuestInvite] = useState<InvitationData | null>(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState<boolean>(false);
  const [isEnvelopeShaking, setIsEnvelopeShaking] = useState<boolean>(false);
  const [rsvpState, setRsvpState] = useState<"none" | "form" | "yes" | "no">("none");
  const [rsvpToast, setRsvpToast] = useState<string>("");
  const [guestName, setGuestName] = useState<string>("");
  const [kidsCount, setKidsCount] = useState<number>(1);
  const [adultsCount, setAdultsCount] = useState<number>(1);

  // Interactive Card Overlay States (Location Info / Calendar Picker Plashka)
  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);
  const [showCalendarPopup, setShowCalendarPopup] = useState<boolean>(false);

  // Load language from cache or detect URL parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.hash.substring(window.location.hash.indexOf('?')));
    const inviteKey = searchParams.get("invite") || hashParams.get("invite") || searchParams.get("view") || hashParams.get("view");
    
    if (inviteKey) {
      const decoded = decodeData(inviteKey);
      if (decoded) {
        setGuestInvite(decoded);
      }
    }
  }, []);

  const handleLangChange = (lang: Language) => {
    setFormData(prev => ({ 
      ...prev, 
      lang,
      location: lang === "ar" ? "oman" : (prev.location === "oman" ? "mega_khimki" : prev.location)
    }));
    try {
      localStorage.setItem("hello_park_invitation_lang", lang);
    } catch (e) {
      console.error("Failed to save language choice:", e);
    }
  };

  // Sound chord synthesizer
  const playOpenSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playNote = (freq: number, delay: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime + delay);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + duration);
      };
      playNote(523.25, 0, 0.4);
      playNote(659.25, 0.08, 0.4);
      playNote(783.99, 0.16, 0.4);
      playNote(1046.50, 0.24, 0.6);
    } catch {
      // Ignored
    }
  };

  const monthsShortRu = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const monthsShortEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Format date elegantly depending on locale
  const getFormattedDate = (dateStr: string, locale: Language) => {
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

  // RSVP Selection
  const handleRsvp = async (status: "form" | "yes" | "no") => {
    if (status === "form") {
      setRsvpState("form");
      return;
    }
    
    setRsvpState(status);
    const locale = guestInvite ? guestInvite.lang : formData.lang;
    const msg = status === "yes" ? translations[locale].rsvpYesToast : translations[locale].rsvpNoToast;
    setRsvpToast(msg);
    
    if (status === "yes") {
      confetti({
        particleCount: 130,
        spread: 75,
        origin: { y: 0.65 }
      });
    }

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.hash.substring(window.location.hash.indexOf('?')));
      const event_id = searchParams.get("invite") || hashParams.get("invite") || searchParams.get("view") || hashParams.get("view");
      
      if (event_id) {
        const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3002' : 'https://194-87-118-33.nip.io');
        await fetch(`${apiBaseUrl}/api/rsvps`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_id,
            guest_name: status === "no" ? "Отклонено гостем" : guestName,
            kids_count: status === "no" ? 0 : kidsCount,
            adults_count: status === "no" ? 0 : adultsCount,
            status
          })
        });
      }
    } catch (e) {
      console.error("Failed to save RSVP:", e);
    }

    setTimeout(() => {
      setRsvpToast("");
    }, 4000);
  };

  // Generate invite link
  const handleGenerate = () => {
    setIsSubmitting(true);
    const cleanData: InvitationData = {
      ...formData
    };

    const hash = encodeData(cleanData);
    
    // Determine the base path.
    // E.g., if pathname is "/mega/invite", "/mega/index.html", "/mega/invite-en.html", etc.
    let basePath = window.location.pathname;
    basePath = basePath.replace(/\/(invite|invite-en|invite-ar|index|invite-variants)\.html$/, "/");
    if (!basePath.endsWith("/")) {
      basePath += "/";
    }

    let filename = "invite.html";
    if (formData.lang === "en") {
      filename = "invite-en.html";
    } else if (formData.lang === "ar") {
      filename = "invite-ar.html";
    }

    const link = `${window.location.origin}${basePath}${filename}?invite=${hash}`;
    
    setGeneratedLink(link);
    setIsSubmitting(false);
  };

  // Copy raw link ONLY to clipboard (as requested in #2)
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    
    confetti({
      particleCount: 40,
      angle: 90,
      spread: 45,
      origin: { y: 0.8 }
    });
  };

  // Tap envelope opening sequence
  const handleEnvelopeTap = () => {
    if (isEnvelopeOpen) return;
    
    setIsEnvelopeShaking(true);
    playOpenSound();
    
    // Trigger physical haptic vibration for smartphones
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([60, 40, 60]);
    }
    
    setTimeout(() => {
      setIsEnvelopeOpen(true);
      setIsEnvelopeShaking(false);
      
      confetti({
        particleCount: 80,
        spread: 80,
        colors: ['#FF5C1A', '#FFB400', '#22C55E', '#3B82F6', '#EC4899'],
        origin: { y: 0.5 }
      });
    }, 400);
  };

  const handleCloseEnvelope = () => {
    setIsEnvelopeOpen(false);
    setShowLocationPopup(false);
    setShowCalendarPopup(false);
  };

  // Construct standard ICS file downloader
  const downloadIcsFile = (data: InvitationData, park: ParkInfo, t: any) => {
    const title = `${t.calendarTitle}: ${data.name}`;
    const desc = t.calendarDesc;
    
    // Format date from YYYY-MM-DD to YYYYMMDD
    const dateStr = data.date.replace(/-/g, '');
    // Format time from HH:MM to HHMMSS
    const timeStr = (data.gatheringTime || "15:00").replace(/:/g, '') + '00';
    
    // Event ends after 3 hours as default
    const startHour = parseInt((data.gatheringTime || "15:00").split(':')[0]);
    const startMin = parseInt((data.gatheringTime || "15:00").split(':')[1] || "00");
    let endHour = startHour + 3;
    if (endHour >= 24) endHour = 23;
    const endTimeStr = `${String(endHour).padStart(2, '0')}${String(startMin).padStart(2, '0')}00`;

    const locationName = park ? (formData.lang === "ru" ? park.nameRu : formData.lang === "en" ? park.nameEn : park.nameAr) : "Hello Park";
    const locationAddr = park ? (formData.lang === "ru" ? park.addressRu : formData.lang === "en" ? park.addressEn : park.addressAr) : "";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hello Park//NONSGML Invitation//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      `SUMMARY:${title}`,
      `DESCRIPTION:${desc}`,
      `LOCATION:${locationName} - ${locationAddr}`,
      `DTSTART:${dateStr}T${timeStr}`,
      `DTEND:${dateStr}T${endTimeStr}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `hellopark-birthday.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER GUEST VIEW (Immersive Envelope Site)
  // ─────────────────────────────────────────────────────────────────────────────
  if (guestInvite) {
    const data = guestInvite;
    const template = designPresets[data.template] || designPresets.neon;
    const locale = data.lang;
    const t = translations[locale];
    const isRtl = locale === "ar";

    // Resolve selected park info
    const currentPark = helloParks.find(p => p.id === data.location) || helloParks[0];
    const parkName = locale === "ru" ? currentPark.nameRu : locale === "en" ? currentPark.nameEn : locale === "ar" ? currentPark.nameAr : currentPark.nameRu;
    const parkAddress = locale === "ru" ? currentPark.addressRu : locale === "en" ? currentPark.addressEn : locale === "ar" ? currentPark.addressAr : currentPark.addressRu;

    const getCardTitle = () => {
      if (locale === "en") {
        return (
          <h2 className="gilroy-text">
            {data.name} invites you to their birthday party at the park of the future <br />
            <span className="gilroy-brand">Hello Park</span>
          </h2>
        );
      }
      if (locale === "ar") {
        return (
          <h2 className="gilroy-text" dir="rtl">
            {data.name} يدعوكم لحفل عيد ميلاده في منتزه المستقبل <br />
            <span className="gilroy-brand">هلو بارك</span>
          </h2>
        );
      }
      return (
        <h2 className="gilroy-text">
          {data.name} приглашает вас на свой день рождения в парк будущего <br />
          <span className="gilroy-brand">Hello Park</span>
        </h2>
      );
    };

    return (
      <div 
        className={`app-viewport p-6 overflow-hidden bg-[#f4fafd] font-sans ${isEnvelopeOpen ? "is-open" : ""}`}
        id="interaction-root"
        dir={isRtl ? "rtl" : "ltr"}
        style={{ minHeight: "100dvh" }}
      >
        <div className="fixed inset-0 pointer-events-none z-[110]" id="confetti-container" />

        {/* Ambient template specific blur graphics in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[5%] w-[250px] h-[250px] rounded-full bg-pink-500/10 blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[5%] w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
        </div>

        {/* Header containing HParkLogo with correct aspect ratio */}
        <header className="absolute top-8 w-full flex flex-col items-center gap-4 z-10 pointer-events-none" data-purpose="site-header">
          <div className="pointer-events-auto h-9 aspect-[1.75]">
            <HParkLogo />
          </div>
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 px-6 py-2 rounded-full shadow-sm pointer-events-auto">
            <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-800">
              {t.tapEnvelopeLabel}
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-col items-center justify-center relative z-10 my-auto">
          {/* Backdrop filter overlay dimming background inside main stacking context */}
          <div 
            id="overlay-backdrop" 
            onClick={handleCloseEnvelope}
            style={{ 
              display: isEnvelopeOpen ? "block" : "none", 
              opacity: isEnvelopeOpen ? 1 : 0 
            }}
          />

          {/* Envelope Wrapper with Shake Animation support */}
          <div 
            className={`envelope-container ${isEnvelopeShaking ? "animate-shake" : ""}`}
            id="envelope-wrapper"
          >
            {/* Envelope Base */}
            <div 
              className="envelope-base cursor-pointer relative"
              onClick={handleEnvelopeTap}
              style={{ backgroundColor: template.envelopeColor }}
            >
              {/* Top Flap */}
              <div 
                className="envelope-flap"
                style={{ 
                  backgroundColor: isEnvelopeOpen ? "transparent" : "#FF7433",
                  backgroundImage: isEnvelopeOpen ? template.envelopeLiner : "none"
                }}
              />

              {/* Pulsing GOLD Tap Indicator Overlay */}
              {!isEnvelopeOpen && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[7] flex flex-col items-center tap-indicator">
                  <div 
                    className="w-14 h-14 rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-bounce-slow"
                    style={{
                      background: `radial-gradient(circle, #FFE45C 0%, ${template.sealColor || "#FF6022"} 90%)`
                    }}
                  >
                    <Heart className="w-6 h-6 text-white animate-bounce drop-shadow" fill="white" />
                  </div>
                  <span className="mt-2 text-[10px] font-black text-white bg-black/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                    TAP
                  </span>
                </div>
              )}

              {/* Decoration vector lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-[4]" viewBox="0 0 288 192">
                <path d="M0 192 L144 96 L288 192" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Invitation Card modal POPUP - overflow-hidden REMOVED so emojis are NEVER cut off! */}
          <div 
            className="invitation-card flex flex-col items-center text-center bg-white text-slate-800 relative" 
            id="invitation-card"
            style={{ 
              boxShadow: "0 20px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)"
            }}
          >
            {/* Close 'X' Button */}
            <button 
              className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 z-10 transition-colors" 
              onClick={handleCloseEnvelope}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </button>

            {/* Overlapping template emoji - fully visible now! Added leading-none and overflow-visible to ensure no browser vertical clipping */}
            <div className="absolute -top-[70px] left-1/2 -translate-x-1/2 w-36 h-36 animate-float flex items-center justify-center text-[105px] leading-none overflow-visible drop-shadow-xl pointer-events-none z-10 select-none invitation-emoji">
              {data.emoji || "🎉"}
            </div>

            {/* Dynamic Card Header */}
            <div className="mt-14 mb-6 select-text">
              {getCardTitle()}
            </div>

            {/* Date and Time Row (Stitch Style) */}
            <div className="w-full grid grid-cols-2 border-t border-slate-100 pt-5 mb-6 relative select-text">
              {/* Date Column */}
              <div className="flex flex-col items-center">
                <span className="text-[#9CA3AF] font-bold uppercase text-[10px] sm:text-[11px] tracking-wider mb-1">
                  {t.date}
                </span>
                <span className="gilroy-text text-lg sm:text-xl font-black whitespace-nowrap">
                  {getFormattedDate(data.date, locale)}
                </span>
              </div>
              
              {/* Separator line */}
              <div className="absolute left-1/2 top-5 bottom-0 w-px bg-slate-200/80 -translate-x-1/2" />
              
              {/* Gathering Time Column */}
              <div className="flex flex-col items-center">
                <span className="text-[#9CA3AF] font-bold uppercase text-[10px] sm:text-[11px] tracking-wider mb-1">
                  {t.gatheringLabel}
                </span>
                <span className="gilroy-text text-lg sm:text-xl font-black">
                  {data.gatheringTime || "15:00"}
                </span>
              </div>
            </div>

            {/* RSVP Container */}
            <div className="w-full relative" id="rsvp-actions">
              <AnimatePresence mode="wait">
                {rsvpState === "none" && (
                  <motion.div 
                    key="none"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 w-full mb-4"
                  >
                    <button 
                      onClick={() => handleRsvp("form")}
                      className="bubble-btn flex-1 bg-white text-emerald-500 font-black py-3.5 rounded-xl border border-slate-100 shadow-md text-xs uppercase hover:bg-slate-50 transition-colors"
                    >
                      {t.rsvpYes}
                    </button>
                    <button 
                      onClick={() => handleRsvp("no")}
                      className="bubble-btn flex-1 bg-slate-50 text-rose-400 font-black py-3.5 rounded-xl shadow-md text-xs uppercase hover:bg-slate-100/70 transition-colors"
                    >
                      {t.rsvpNo}
                    </button>
                  </motion.div>
                )}

                {rsvpState === "form" && (
                  <motion.div 
                    key="form"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-4 text-start shadow-inner flex flex-col gap-3"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {t.rsvpFormTitle}
                      </label>
                      <input 
                        type="text" 
                        value={guestName}
                        onChange={(e) => setGuestName(e.target.value)}
                        placeholder={t.rsvpNamePlaceholder}
                        className="w-full py-2 px-3 rounded-lg bg-white border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 font-semibold outline-none text-xs"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">
                          {t.rsvpKids}
                        </label>
                        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg overflow-hidden">
                          <button onClick={() => setKidsCount(Math.max(0, kidsCount - 1))} className="px-3 py-1.5 text-slate-400 hover:bg-slate-50 font-black text-lg">-</button>
                          <span className="font-black text-slate-700">{kidsCount}</span>
                          <button onClick={() => setKidsCount(kidsCount + 1)} className="px-3 py-1.5 text-slate-400 hover:bg-slate-50 font-black text-lg">+</button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">
                          {t.rsvpAdults}
                        </label>
                        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg overflow-hidden">
                          <button onClick={() => setAdultsCount(Math.max(0, adultsCount - 1))} className="px-3 py-1.5 text-slate-400 hover:bg-slate-50 font-black text-lg">-</button>
                          <span className="font-black text-slate-700">{adultsCount}</span>
                          <button onClick={() => setAdultsCount(adultsCount + 1)} className="px-3 py-1.5 text-slate-400 hover:bg-slate-50 font-black text-lg">+</button>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRsvp("yes")}
                      disabled={!guestName}
                      className={`w-full mt-1 py-3 rounded-xl font-bold text-xs uppercase transition-all shadow-md ${guestName ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-slate-200 text-slate-400"}`}
                    >
                      {t.rsvpConfirm}
                    </button>
                  </motion.div>
                )}

                {(rsvpState === "yes" || rsvpState === "no") && (
                  <motion.div 
                    key="result"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full py-2 mb-4 text-center"
                  >
                    <p className={`gilroy-text text-lg sm:text-xl font-bold ${rsvpState === "yes" ? "text-emerald-500" : "text-rose-400"}`}>
                      {rsvpState === "yes" ? t.rsvpYesToast : t.rsvpNoToast}
                    </p>
                    <button
                      onClick={() => setRsvpState("none")}
                      className="mt-2 text-[10px] text-slate-400 underline font-medium hover:text-slate-600 transition-colors"
                    >
                      {locale === "en" ? "Change response" : locale === "ar" ? "تغيير الإجابة" : "Изменить выбор"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions: Calendar & Map popup trigger */}
            <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 z-10" id="card-footer-actions">
              <button 
                onClick={() => setShowCalendarPopup(true)}
                className="flex items-center justify-center gap-2 bg-slate-100/50 hover:bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-[10px] uppercase tracking-tight transition-colors"
              >
                <span className="text-base">📅</span>
                {t.addToCalendar}
              </button>
              <button 
                onClick={() => setShowLocationPopup(true)}
                className="flex items-center justify-center gap-2 bg-slate-100/50 hover:bg-slate-100 text-slate-700 py-3 rounded-xl font-bold text-[10px] uppercase tracking-tight transition-colors"
              >
                <span className="text-base">📍</span>
                {t.openMap}
              </button>
            </div>

            {/* LOCATION CARD POP-UP OVERLAY - rounded-b added to fit perfectly with the border radius */}
            <AnimatePresence>
              {showLocationPopup && (
                <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="absolute inset-x-0 bottom-0 top-[35%] bg-white/95 backdrop-blur border-t border-slate-200 p-5 flex flex-col justify-between z-30 rounded-t-3xl rounded-b-[1.5rem] shadow-[0_-15px_30px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex flex-col text-start h-full">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
                        <MapPin className="w-4 h-4 text-[#FF6022]" />
                        {t.parkInfoTitle}
                      </div>
                      <button 
                        onClick={() => setShowLocationPopup(false)}
                        className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-950 leading-tight">
                        {parkName}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-3.5 mb-1.5">
                        {t.parkAddressLabel}
                      </p>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-semibold">
                        {parkAddress}
                      </p>
                    </div>

                    <button 
                      onClick={() => window.open(currentPark.mapUrl, '_blank')}
                      className="w-full bg-[#FF6022] hover:bg-[#e0521b] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all mt-4 flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                    >
                      <span className="text-base">📍</span>
                      {t.openInMapsBtn}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* UNIVERSAL CALENDAR PICKER OVERLAY - rounded-b added to fit perfectly with the border radius */}
            <AnimatePresence>
              {showCalendarPopup && (
                <motion.div 
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 100 }}
                  className="absolute inset-x-0 bottom-0 top-[40%] bg-white/95 backdrop-blur border-t border-slate-200 p-5 flex flex-col justify-between z-30 rounded-t-3xl rounded-b-[1.5rem] shadow-[0_-15px_30px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex flex-col text-start h-full">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                      <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
                        <span>📅</span>
                        {t.calendarChoiceTitle}
                      </div>
                      <button 
                        onClick={() => setShowCalendarPopup(false)}
                        className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5 my-auto justify-center">
                      {/* Google Calendar Web Link */}
                      <button 
                        onClick={() => {
                          const calendarTitle = `${t.calendarTitle}: ${data.name}`;
                          const calendarDesc = t.calendarDesc;
                          const eventDate = data.date.replace(/-/g, '');
                          const cleanTime = (data.gatheringTime || "15:00").replace(/:/g, '') + '00';
                          const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarTitle)}&dates=${eventDate}T${cleanTime}/${eventDate}T${cleanTime}&details=${encodeURIComponent(calendarDesc)}&location=${encodeURIComponent(parkName + " - " + parkAddress)}`;
                          window.open(gcalUrl, '_blank');
                          setShowCalendarPopup(false);
                        }}
                        className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 py-3.5 rounded-xl font-extrabold text-xs uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span className="text-base">🌐</span>
                        {t.googleCalendarBtn}
                      </button>

                      {/* Apple / Universal ICS Downloader */}
                      <button 
                        onClick={() => {
                          downloadIcsFile(data, currentPark, t);
                          setShowCalendarPopup(false);
                        }}
                        className="w-full bg-[#FF6022] hover:bg-[#e0521b] text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <span className="text-base">📲</span>
                        {t.appleCalendarBtn}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Under-envelope Instruction notice */}
          <p 
            className={`absolute bottom-[-60px] text-slate-400 text-xs font-semibold text-center leading-relaxed w-[240px] transition-opacity duration-300 ${
              isEnvelopeOpen ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            id="instruction-text"
          >
            {t.openEnvelope}
          </p>
        </main>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER CREATOR (Single Screen Configurator)
  // ─────────────────────────────────────────────────────────────────────────────
  const activeTranslation = translations[formData.lang];
  const isRtl = formData.lang === "ar";

  // SCREEN 2: READY/SUCCESS EXPORT PAGE
  if (generatedLink) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col text-slate-800 pb-16 font-sans overflow-x-hidden relative" dir={isRtl ? "rtl" : "ltr"}>
        {/* Background glowing decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-orange-500/10 blur-[100px]" />
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
        </div>

        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 aspect-[1.75] sm:h-8">
              <HParkLogo />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400">| {activeTranslation.title}</span>
          </div>
        </header>

        {/* Main success content viewport */}
        <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col justify-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 text-start"
          >
            {/* SUCCESS READY EXPORT BLOCK */}
            <div className="text-center py-6">
              <div className="inline-block bg-white p-3 rounded-2xl shadow-sm mb-3">
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{activeTranslation.readyTitle}</h3>
            </div>

            <div className="space-y-4 w-full">
              {/* BLOCK 1: GUESTS */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 font-bold shrink-0">1</div>
                  <div>
                    <div className="font-bold text-slate-900">{formData.lang === 'en' ? 'For Guests' : formData.lang === 'ar' ? 'للضيوف' : 'Гостям'}</div>
                    <div className="text-xs text-slate-500">{formData.lang === 'en' ? 'Send this invitation' : formData.lang === 'ar' ? 'أرسل هذه الدعوة' : 'Отправьте это приглашение'}</div>
                  </div>
                </div>
                
                <div className="flex bg-slate-50 rounded-xl overflow-hidden border border-slate-100 mb-3" dir="ltr">
                  <div className="py-3 px-3 text-xs text-slate-500 truncate flex-1">{generatedLink}</div>
                  <button 
                    onClick={handleCopyLink}
                    className="bg-white border-l border-slate-100 px-4 text-blue-500 flex items-center hover:bg-slate-50 transition-colors shrink-0"
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={generatedLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-[2] bg-slate-100 text-slate-700 rounded-xl py-3 text-sm font-bold flex justify-center items-center hover:bg-slate-200 transition-colors"
                  >
                    {formData.lang === 'en' ? 'Open' : formData.lang === 'ar' ? 'فتح' : 'Открыть'}
                  </a>
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(generatedLink)}&text=${encodeURIComponent(getShareMessage(formData.name, formData.lang, "").replace(/:\s*$/, ""))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-[#0088cc]/10 text-[#0088cc] rounded-xl py-3 text-sm font-bold flex items-center justify-center gap-1 hover:bg-[#0088cc]/20 transition-colors"
                  >
                    <span>✈️ Telegram</span>
                  </a>
                </div>
              </div>

              {/* BLOCK 2: FOR YOU (RESULTS) */}
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500 font-bold shrink-0">2</div>
                  <div>
                    <div className="font-bold text-slate-900">{formData.lang === 'en' ? 'Results' : formData.lang === 'ar' ? 'النتائج' : 'Результаты'}</div>
                    <div className="text-xs text-slate-500">{formData.lang === 'en' ? 'Where to see guest answers' : formData.lang === 'ar' ? 'أين ترى إجابات الضيوف' : 'Где смотреть ответы гостей'}</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <a 
                    href={generatedLink.replace('?invite=', '?view=dashboard&id=')}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-[3] bg-orange-500 text-white rounded-xl py-3 text-sm font-bold flex justify-center items-center gap-2 shadow-sm shadow-orange-500/20 hover:bg-orange-600 transition-colors"
                  >
                    {formData.lang === 'en' ? 'Who is coming?' : formData.lang === 'ar' ? 'من سيأتي؟' : 'Кто придет?'}
                  </a>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(generatedLink.replace('?invite=', '?view=dashboard&id='));
                      confetti({ particleCount: 20, spread: 40, origin: { y: 0.8 } });
                    }}
                    className="flex-1 bg-orange-50 text-orange-600 rounded-xl py-3 text-sm font-bold flex justify-center items-center hover:bg-orange-100 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PREVIEW BLOCK */}
              <button 
                onClick={() => {
                  const hash = generatedLink.split("invite=")[1];
                  const decoded = decodeData(hash);
                  if (decoded) {
                    setGuestInvite(decoded);
                    setIsEnvelopeOpen(false);
                  }
                }}
                className="w-full bg-white text-slate-900 border border-slate-200 rounded-3xl py-4 shadow-sm font-bold text-sm flex justify-center items-center gap-2 hover:bg-slate-50 transition-colors"
              >
                <Eye className="w-5 h-5 text-slate-400" />
                {formData.lang === 'en' ? 'View Preview' : formData.lang === 'ar' ? 'عرض معاينة' : 'Посмотреть превью'}
              </button>
              
              <button 
                onClick={() => setGeneratedLink("")}
                className="w-full bg-transparent text-slate-500 py-4 text-xs font-semibold flex items-center justify-center gap-2 hover:text-slate-700 transition-colors"
              >
                <ArrowRight className={`w-4 h-4 ${formData.lang === 'ar' ? '' : 'rotate-180'}`} /> {activeTranslation.backToConfig || "Назад к созданию"}
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // SCREEN 1: CONFIGURATOR FORM
  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col text-slate-800 pb-16 font-sans overflow-x-hidden relative" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background glowing decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 aspect-[1.75] sm:h-8">
            <HParkLogo />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400">| {activeTranslation.title}</span>
        </div>
      </header>

      {/* Main viewport */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col justify-start">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl flex flex-col gap-5 text-start">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5.5 h-5.5 text-orange-500" />
              {activeTranslation.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {activeTranslation.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {/* Language Switcher */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-orange-500" />
                {activeTranslation.selectLang}
              </label>
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                {([
                  { id: "ru" as Language, label: "Рус" },
                  { id: "en" as Language, label: "Eng" },
                  { id: "ar" as Language, label: "عرب" }
                ]).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLangChange(item.id)}
                    className={`py-2 rounded-lg text-xs font-bold transition-all uppercase ${
                      formData.lang === item.id 
                        ? "bg-[#FF6022] text-white shadow-md" 
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Child Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {activeTranslation.childName} *
              </label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={activeTranslation.childNamePlaceholder}
                className="w-full max-w-full block py-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FF6022] focus:ring-1 focus:ring-[#FF6022] font-semibold outline-none text-xs sm:text-sm text-start"
              />
            </div>

            {/* Dynamic Park Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {activeTranslation.selectPark}
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full max-w-full block py-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FF6022] focus:ring-1 focus:ring-[#FF6022] font-semibold outline-none text-xs sm:text-sm text-start"
              >
                {helloParks.map(park => (
                  <option key={park.id} value={park.id}>
                    {formData.lang === "ru" ? park.nameRu : formData.lang === "en" ? park.nameEn : park.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {activeTranslation.date}
              </label>
              <input 
                type="date"
                dir="ltr"
                lang={formData.lang === 'ru' ? 'ru-RU' : formData.lang === 'ar' ? 'ar-AE' : 'en-US'}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full max-w-full block py-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FF6022] focus:ring-1 focus:ring-[#FF6022] font-semibold outline-none text-xs sm:text-sm box-border min-w-0 ${formData.lang === 'ar' ? 'text-right' : 'text-left'}`}
              />
            </div>

            {/* Gathering Time */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                {activeTranslation.gatheringTime}
              </label>
              <input 
                type="time" 
                dir="ltr"
                lang={formData.lang === 'ru' ? 'ru-RU' : formData.lang === 'ar' ? 'ar-AE' : 'en-US'}
                value={formData.gatheringTime}
                onChange={(e) => setFormData({ ...formData, gatheringTime: e.target.value })}
                className={`w-full max-w-full block py-2.5 px-3.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-[#FF6022] focus:ring-1 focus:ring-[#FF6022] font-semibold outline-none text-xs sm:text-sm box-border min-w-0 ${formData.lang === 'ar' ? 'text-right' : 'text-left'}`}
              />
            </div>

            {/* Emoji Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                {activeTranslation.selectEmoji}
              </label>
              <div className="grid grid-cols-6 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {emojiOptions.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, emoji })}
                    className={`h-11 rounded-lg text-2xl flex items-center justify-center transition-all ${
                      formData.emoji === emoji 
                        ? "bg-[#FF6022]/10 border-2 border-[#FF6022] scale-105" 
                        : "bg-white border border-slate-200 hover:border-slate-300 hover:scale-105"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={!formData.name}
            onClick={handleGenerate}
            className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all text-xs sm:text-sm ${
              formData.name
                ? "bg-[#FF6022] hover:bg-[#e0521b] text-white shadow-lg shadow-orange-500/25"
                : "bg-slate-200 text-slate-400 pointer-events-none"
            }`}
          >
            {activeTranslation.generate}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}
