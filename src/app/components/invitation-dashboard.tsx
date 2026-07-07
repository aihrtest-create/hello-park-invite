import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Check, Users, UserX, Clock, CalendarDays, ArrowRight, AlertTriangle } from "lucide-react";
import HParkLogo from "../../imports/HParkLogo";

interface RsvpStats {
  total_responses: number;
  total_coming: number;
  total_not_coming: number;
  total_kids: number;
  total_adults: number;
}

interface RsvpEntry {
  id: number;
  guest_name: string;
  kids_count: number;
  adults_count: number;
  status: string;
  created_at: string;
}

const translations = {
  ru: {
    notFoundTitle: "Ссылка не найдена",
    notFoundDesc: "Убедитесь, что вы перешли по правильной ссылке на дашборд.",
    headerTitle: "Дашборд Организатора",
    guestLinkTitle: "Ссылка для гостей",
    guestLinkDesc: "Скопируйте и отправьте друзьям",
    copyLink: "Скопировать ссылку",
    copied: "Скопировано",
    totalComing: "Всего придут",
    kids: "Детей",
    adults: "Взр",
    cantCome: "Не смогут",
    declines: "Отказы",
    syncBadge: "Данные синхронизированы с Hello Park",
    responsesList: "Список ответов",
    responsesCount: "ответов",
    noResponsesYet: "Пока нет ответов",
    sendLinkToCollect: "Отправьте ссылку гостям, чтобы собрать подтверждения",
    coming: "Придут",
    notComing: "Не придут",
    kidSingle: "ребенок",
    kidsPlural: "детей",
    adultSingle: "взрослый",
    adultsPlural: "взрослых",
    minAgo: "мин назад",
    hrAgo: "ч назад",
    daysAgo: "дн назад",
  },
  en: {
    notFoundTitle: "Link not found",
    notFoundDesc: "Make sure you used the correct dashboard link.",
    headerTitle: "Organizer Dashboard",
    guestLinkTitle: "Guest Link",
    guestLinkDesc: "Copy and send to friends",
    copyLink: "Copy Link",
    copied: "Copied",
    totalComing: "Total Coming",
    kids: "Kids",
    adults: "Adults",
    cantCome: "Can't Come",
    declines: "Declined",
    syncBadge: "Data synced with Hello Park",
    responsesList: "Guest Responses",
    responsesCount: "responses",
    noResponsesYet: "No responses yet",
    sendLinkToCollect: "Send the link to guests to collect RSVPs",
    coming: "Coming",
    notComing: "Not coming",
    kidSingle: "kid",
    kidsPlural: "kids",
    adultSingle: "adult",
    adultsPlural: "adults",
    minAgo: "min ago",
    hrAgo: "hr ago",
    daysAgo: "days ago",
  },
  ar: {
    notFoundTitle: "الرابط غير موجود",
    notFoundDesc: "تأكد من استخدام رابط لوحة التحكم الصحيح.",
    headerTitle: "لوحة تحكم المنظم",
    guestLinkTitle: "رابط الضيف",
    guestLinkDesc: "انسخ وأرسل للأصدقاء",
    copyLink: "نسخ الرابط",
    copied: "تم النسخ",
    totalComing: "إجمالي الحضور",
    kids: "الأطفال",
    adults: "البالغين",
    cantCome: "لن يحضروا",
    declines: "المعتذرين",
    syncBadge: "تمت مزامنة البيانات مع هيلو بارك",
    responsesList: "إجابات الضيوف",
    responsesCount: "إجابات",
    noResponsesYet: "لا توجد إجابات بعد",
    sendLinkToCollect: "أرسل الرابط للضيوف لجمع التأكيدات",
    coming: "سيحضر",
    notComing: "لن يحضر",
    kidSingle: "طفل",
    kidsPlural: "أطفال",
    adultSingle: "بالغ",
    adultsPlural: "بالغين",
    minAgo: "دقيقة مضت",
    hrAgo: "ساعة مضت",
    daysAgo: "أيام مضت",
  }
};

export default function InvitationDashboard() {
  const [stats, setStats] = useState<RsvpStats | null>(null);
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [lang, setLang] = useState<"ru" | "en" | "ar">("ru");

  useEffect(() => {
    // Extract event ID from URL
    const searchParams = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1] || window.location.hash.substring(window.location.hash.indexOf('?')));
    const id = searchParams.get("id") || hashParams.get("id");
    
    let interval: any;

    if (id) {
      setEventId(id);
      fetchDashboardData(id);
      
      // Auto-update every 5 seconds
      interval = setInterval(() => {
        fetchDashboardData(id);
      }, 5000);
    } else {
      setLoading(false);
    }

    // Determine language from URL path
    const path = window.location.pathname;
    const urlLang = searchParams.get("lang") || hashParams.get("lang");
    
    if (urlLang && (urlLang === "ru" || urlLang === "en" || urlLang === "ar")) {
      setLang(urlLang as "ru" | "en" | "ar");
    } else if (path.includes("-en.html")) {
      setLang("en");
    } else if (path.includes("-ar.html")) {
      setLang("ar");
    } else {
      // Fallback to localStorage
      const savedLang = localStorage.getItem("hello_park_invitation_lang");
      if (savedLang && (savedLang === "ru" || savedLang === "en" || savedLang === "ar")) {
        setLang(savedLang as "ru" | "en" | "ar");
      }
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const fetchDashboardData = async (id: string) => {
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3002' : 'https://194-87-118-33.nip.io');
      const [statsRes, rsvpsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/api/rsvps/${id}/stats`),
        fetch(`${apiBaseUrl}/api/rsvps/${id}`)
      ]);
      
      if (statsRes.ok && rsvpsRes.ok) {
        const statsData = await statsRes.json();
        const rsvpsData = await rsvpsRes.json();
        setStats(statsData);
        setRsvps(rsvpsData);
      }
    } catch (e) {
      console.error("Failed to load dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    const origin = window.location.origin;
    let basePath = window.location.pathname;
    basePath = basePath.replace(/\/(invite|invite-dashboard|dashboard|index)\.html$/, "/");
    if (!basePath.endsWith("/")) basePath += "/";
    
    const filename = lang === "en" ? "invite-en.html" : lang === "ar" ? "invite-ar.html" : "invite.html";
    const guestLink = `${origin}${basePath}${filename}?invite=${eventId}`;
    
    navigator.clipboard.writeText(guestLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const t = translations[lang] || translations.ru;

  const formatTimeAgo = (dateStr: string) => {
    const diff = new Date().getTime() - new Date(dateStr).getTime() + (new Date().getTimezoneOffset() * 60000);
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${Math.max(1, minutes)} ${t.minAgo}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${t.hrAgo}`;
    return `${Math.floor(hours / 24)} ${t.daysAgo}`;
  };

  const isRtl = lang === "ar";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#FF6022] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!eventId) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-6 text-center" dir={isRtl ? "rtl" : "ltr"}>
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t.notFoundTitle}</h2>
          <p className="text-sm text-slate-500">{t.notFoundDesc}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col text-slate-800 pb-16 font-sans overflow-x-hidden relative" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-orange-500/10 blur-[100px]" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-7 aspect-[1.75] sm:h-8">
            <HParkLogo />
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-slate-400">| {t.headerTitle}</span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 flex flex-col gap-5 z-10">
        
        {/* Guest Link Panel */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-lg flex flex-col gap-3">
          <div>
            <h2 className="font-extrabold text-sm text-slate-900">{t.guestLinkTitle}</h2>
            <p className="text-[10px] text-slate-400 mt-0.5">{t.guestLinkDesc}</p>
          </div>
          
          <button 
            onClick={handleCopyLink}
            className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98] ${
              isCopied ? "bg-emerald-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {isCopied ? <><Check className="w-4 h-4 stroke-[3px]" /> {t.copied}</> : <><Copy className="w-4 h-4" /> {t.copyLink}</>}
          </button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-[#FF6022] to-[#FF8A50] rounded-3xl p-4 text-white shadow-lg shadow-orange-500/20 flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-2 opacity-90">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.totalComing}</span>
            </div>
            <div>
              <span className="text-3xl font-black block leading-none">{stats?.total_coming || 0}</span>
              <span className="text-xs font-medium opacity-90 block mt-1">
                {t.kids} {stats?.total_kids || 0} | {t.adults} {stats?.total_adults || 0}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
            <div className="flex items-center gap-1.5 mb-2 text-slate-400">
              <UserX className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{t.cantCome}</span>
            </div>
            <div>
              <span className="text-3xl font-black block leading-none text-slate-800">{stats?.total_not_coming || 0}</span>
              <span className="text-xs font-medium text-slate-400 block mt-1">{t.declines}</span>
            </div>
          </div>
        </div>

        {/* Guest List */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900">{t.responsesList}</h2>
            <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg">
              {rsvps.length} {t.responsesCount}
            </span>
          </div>

          <div className="flex flex-col">
            {rsvps.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <CalendarDays className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-400">{t.noResponsesYet}</p>
                <p className="text-[10px] text-slate-400 mt-1">{t.sendLinkToCollect}</p>
              </div>
            ) : (
              rsvps.map((rsvp, idx) => (
                <div key={rsvp.id} className={`p-4 flex flex-col gap-2 ${idx !== rsvps.length - 1 ? 'border-b border-slate-50' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`font-bold text-sm ${rsvp.status === 'no' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {rsvp.guest_name}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shrink-0 ${
                      rsvp.status === 'yes' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                    }`}>
                      {rsvp.status === 'yes' ? t.coming : t.notComing}
                    </span>
                  </div>
                  
                  {rsvp.status === 'yes' && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold bg-slate-50 px-2 py-1 rounded text-slate-600 flex items-center gap-1.5">
                        <span className="text-sm">👦</span> {rsvp.kids_count} {rsvp.kids_count === 1 ? t.kidSingle : t.kidsPlural}
                      </span>
                      <span className="text-xs font-semibold bg-slate-50 px-2 py-1 rounded text-slate-600 flex items-center gap-1.5">
                        <span className="text-sm">👩</span> {rsvp.adults_count} {rsvp.adults_count === 1 ? t.adultSingle : t.adultsPlural}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(rsvp.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
