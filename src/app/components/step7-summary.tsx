import {
  useWizard,
  getExtraChildrenCount,
  getExtraChildrenCost,
  INCLUDED_CHILDREN,
  EXTRA_CHILD_WEEKDAY,
  EXTRA_CHILD_WEEKEND,
  CUSTOM_CHILD_WEEKDAY,
  CUSTOM_CHILD_WEEKEND,
} from "./wizard-context";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Package,
  MapPin,
  Users as UsersIcon,
  Palette,
  UtensilsCrossed,
  Calendar,
  Phone,
  User,
  MessageSquare,
  PartyPopper,
  Check,
  Star,
  Cake,
  Gamepad2,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { isWeekendOrHoliday2026 } from "../data/holidays";
import { ru } from "date-fns/locale";
import { ANIMATORS } from "./step3-animators";
import {
  MEGA_MC_PRICE,
  MEGA_PACKAGE_PRICES,
  MEGA_SHOW_NAMES,
  MEGA_SHOW_PRICES,
  findMegaFoodItem,
  getMegaFoodTotal,
} from "../data/megaConfig";
import { ALL_SHOWS } from "./step-shows";

const PACKAGE_NAMES: Record<string, string> = {
  basic: "Базовый",
  premium: "Премиум",
  exclusive: "Эксклюзив",
  custom: "Собери сам",
};

const QUEST_NAMES: Record<string, string> = {
  phygital_voxels: "Фиджитал: Воксели",
  phygital_space: "Фиджитал: Космос",
  classic_fort: "Форт Боярд",
  classic_harry: "Гарри Поттер",
  classic_harley: "Харли Квин",
  classic_bloggers: "Блогеры",
  animator: "Герой",
  none: "Без квеста",
};

const MC_NAMES: Record<string, string> = {
  elsa_tiara: "Диадема Эльзы",
  felt_toy: "Игрушка из фетра",
  kapitoshka: "Капитошка",
  mc_weapon: "Оружие из Майнкрафта",
  birthday_card: "Открытка имениннику",
  sand_picture: "Песочная картина",
  gingerbread: "Роспись пряников",
  slime: "Создание слайма",
  jewelry: "Трендовые украшения",
  pinwheel: "Игрушка-ветерок",
  twisting: "Твистинг",
};

const CAKE_NAMES: Record<string, string> = {
  own_cake: "Свой торт",
};

const FILLING_NAMES: Record<string, string> = {
  filling_1: "Лаванда-Ягодный микс",
  filling_2: "Кокос-Малина",
  filling_3: "Красный бархат",
  filling_4: "Фисташка-Клубника",
  filling_5: "Ванильный",
  filling_6: "Сникерс",
  filling_7: "Миндаль-Вишня",
};

const ADDITIONAL_ACTIVITIES_NAMES: Record<string, string> = {

  "trash-box": "Трэш-коробка",
  "mini-disco": "Мини-диско",
  "challenge-party": "Челлендж-пати"
};

const ADDITIONAL_SERVICES_NAMES: Record<string, string> = {
  "photo": "Фотограф",
  "aqua": "Аквагрим",
  "tattoos": "Детские тату"
};

// Russian pluralization for "ребёнок / ребёнка / детей"
function childrenWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "ребёнок";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "ребёнка";
  return "детей";
}


export function Step7Summary() {
  const { state, updateState, totalPrice, submitted, resetWizard } = useWizard();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) {
      updateState({ contactPhone: "" });
      return;
    }
    let numbers = val.replace(/\D/g, "");
    if (numbers.length === 0) {
      updateState({ contactPhone: "" });
      return;
    }
    if (numbers[0] === "8") {
      numbers = "7" + numbers.slice(1);
    } else if (numbers[0] === "9") {
      numbers = "79" + numbers.slice(1);
    } else if (numbers[0] !== "7") {
      numbers = "7" + numbers;
    }
    numbers = numbers.substring(0, 11);
    let formatted = "+7";
    if (numbers.length > 1) {
      formatted += " (" + numbers.substring(1, 4);
    }
    if (numbers.length >= 5) {
      formatted += ") " + numbers.substring(4, 7);
    }
    if (numbers.length >= 8) {
      formatted += "-" + numbers.substring(7, 9);
    }
    if (numbers.length >= 10) {
      formatted += "-" + numbers.substring(9, 11);
    }
    updateState({ contactPhone: formatted });
  };

  const effectiveWeekend = state.date ? isWeekendOrHoliday2026(state.date) : state.isWeekend;

  // Per-child surcharge (beyond the 8 included in every package)
  const hasPackageBase = !!state.packageType && state.packageType !== "custom";
  const extraChildren = getExtraChildrenCount(state);
  const extraChildrenCost = getExtraChildrenCost(state, effectiveWeekend);
  const perChildRate = state.packageType === "custom"
    ? (effectiveWeekend ? CUSTOM_CHILD_WEEKEND : CUSTOM_CHILD_WEEKDAY)
    : (effectiveWeekend ? EXTRA_CHILD_WEEKEND : EXTRA_CHILD_WEEKDAY);
  const guestsValue = `${state.childrenCount} ${childrenWord(state.childrenCount)}${
    hasPackageBase
      ? ` (${INCLUDED_CHILDREN} в пакете${extraChildren > 0 ? ` + ${extraChildren} доп.` : ""})`
      : ""
  }, ${state.adultsCount} взрослых`;

  const getPackagePrice = () => {
    if (!state.packageType) return 0;
    const [weekday, weekend] = MEGA_PACKAGE_PRICES[state.packageType] || [0, 0];
    return effectiveWeekend ? weekend : weekday;
  };

  const getQuestPrice = () => {
    if (!state.questType || state.questType === "none" || state.questType === "animator") return 0;
    if (state.packageType === "custom") {
      return state.questType.startsWith("phygital_") ? 12000 : 16000;
    } else if (state.questType.startsWith("classic_")) {
      if (state.packageType === "basic") return 16000;
      if (state.packageType === "premium") return 9000;
      if (state.packageType === "exclusive") return 9000;
    }
    return 0;
  };

  const getPatiroomPrice = () => 0;

  const getCafeZonesPrice = () => {
    let p = 0;
    for (const zone of state.cafeZones) {
      if (zone === "cafe_round") p += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_small") p += 5000;
      if (zone === "cafe_pink") p += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_pink_full") p += effectiveWeekend ? 20000 : 10000;
    }
    return p;
  };

  const getAnimatorsPrice = () => {
    if (state.animators.length > 1) {
      return (state.animators.length - 1) * 8000;
    }
    return 0;
  };

  const getShowsPrice = () => {
    let p = 0;
    const getPrice = (id: string) => MEGA_SHOW_PRICES[id] || ALL_SHOWS.find(s => s.id === id)?.price || 0;

    if (state.packageType === "exclusive") {
      if (state.shows.length > 0) {
        for (const showId of state.shows) p += getPrice(showId);
        p -= getPrice(state.shows[0]);
      }
    } else {
      for (const showId of state.shows) p += getPrice(showId);
    }
    return p;
  };

  const getMCPrice = () => {
    const mcPrice = MEGA_MC_PRICE;
    if (state.packageType === "basic" || state.packageType === "custom") {
      return state.masterClasses.length * mcPrice;
    } else if (state.packageType === "premium" || state.packageType === "exclusive") {
      return Math.max(0, state.masterClasses.length - 1) * mcPrice;
    }
    return 0;
  };

  const getFoodPrice = () => getMegaFoodTotal(state.megaFood);

  const getActivitiesPrice = () => {
    let p = 0;
    for (const act of state.additionalActivities) {
      if (act === "trash-animals") p += 35000;
      if (act === "trash-box") p += 7000;
      if (act === "mini-disco") p += 6000;
      if (act === "challenge-party") p += 10000;
    }
    return p;
  };

  const getServicesPrice = () => {
    let p = 0;
    for (const srv of state.additionalServices) {
      if (srv === "photo") p += 7000;
      if (srv === "aqua") p += 7000;
    }
    return p;
  };


  const formatPrice = (p: number) => p === 0 ? "Включено" : `${p.toLocaleString("ru-RU")} ₽`;
  const formatPackagePrice = (p: number) => state.packageType === "custom" ? "" : formatPrice(p);
  const getShowLabel = (id: string) => MEGA_SHOW_NAMES[id] || ALL_SHOWS.find(s => s.id === id)?.name || id;
  const getMegaFoodSummary = () => {
    const parts = [];
    if (state.megaOwnCatering) parts.push("Свой кейтеринг");
    for (const [itemId, qty] of Object.entries(state.megaFood)) {
      if (qty <= 0) continue;
      const item = findMegaFoodItem(itemId);
      parts.push(`${item?.name || itemId} × ${qty}`);
    }
    return parts.join(" + ");
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="px-4 pb-6 flex flex-col items-center justify-center min-h-[60vh]"
      >
        <div className="w-20 h-20 bg-[#4CAF50] rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-xl text-[#1A1A1A] mb-2 text-center">
          Заявка отправлена!
        </h2>
        <p className="text-sm text-[#747474] text-center mb-6 max-w-xs">
          Наш банкетный менеджер свяжется с вами в ближайшее время для подтверждения деталей праздника
        </p>
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center border border-[#E5E5E5]">
          <PartyPopper className="w-8 h-8 text-[#FF6022] mx-auto mb-2" />
          <p className="text-sm text-[#1A1A1A]">
            Итого: <span className="text-lg text-[#FF6022]">{totalPrice.toLocaleString("ru-RU")} ₽</span>
          </p>
          <p className="text-xs text-[#ABABAB] mt-1">
            {state.contactName}, мы готовим для вас незабываемый праздник!
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="px-4 pb-6"
    >
      <div className="text-center mb-8 px-4 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">📝</span>
          Ваш праздник
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">Проверьте детали и оставьте заявку</p>
      </div>

      {/* Summary card */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm overflow-hidden mb-5">
        {state.packageType && (
          <SummaryRow
            icon={<Package className="w-4 h-4" />}
            label="Формат"
            value={PACKAGE_NAMES[state.packageType]}
            priceText={formatPackagePrice(getPackagePrice())}
            stepNumber={2}
          />
        )}

        {state.questType && state.questType !== "none" && (
          <SummaryRow
            icon={<Gamepad2 className="w-4 h-4" />}
            label={state.questType === "animator" ? "Программа" : "Квест"}
            value={QUEST_NAMES[state.questType] || state.questType}
            priceText={formatPrice(getQuestPrice())}
            stepNumber={3}
          />
        )}

        {state.patiroomDetails && (
          <SummaryRow
            icon={<MapPin className="w-4 h-4" />}
            label="Фиджитал Патирум"
            value={state.patiroomDetails}
            priceText={formatPrice(getPatiroomPrice())}
            stepNumber={undefined}
          />
        )}

        {state.cafeZones.length > 0 && (
          <SummaryRow
            icon={<MapPin className="w-4 h-4" />}
            label="Стол для родителей"
            value={state.cafeZones.map(z => {
              if (z === "cafe_round") return "Круглый стол";
              if (z === "cafe_small") return "Маленький столик";
              if (z === "cafe_pink") return "За шторками";
              if (z === "cafe_pink_full") return "Вся зона за шторками";
              return z;
            }).join(", ")}
            priceText={formatPrice(getCafeZonesPrice())}
            stepNumber={6}
          />
        )}

        {state.animators.length > 0 && (
          <SummaryRow
            icon={<UsersIcon className="w-4 h-4" />}
            label="Герой"
            value={state.animators.map((id, index) => {
              const name = ANIMATORS.find(a => a.id === id)?.name || id;
              if (index === 0) {
                return state.packageType !== "custom" ? `${name} (Входит в пакет)` : name;
              }
              return `${name} (+8 000 ₽)`;
            }).join(", ")}
            priceText={formatPrice(getAnimatorsPrice())}
            stepNumber={4}
          />
        )}

        {state.shows.length > 0 && (
          <SummaryRow
            icon={<Star className="w-4 h-4" />}
            label="Шоу-программы"
            value={state.shows.map(getShowLabel).join(", ")}
            priceText={formatPrice(getShowsPrice())}
            stepNumber={7}
          />
        )}

        {state.discoChoice && (
          <SummaryRow
            icon={<PartyPopper className="w-4 h-4" />}
            label="Активность"
            value={state.discoChoice === "disco" ? "Мини дискотека" : "Треш-коробка"}
            priceText="Включено"
            stepNumber={13}
          />
        )}

        {(state.packageType === "premium" || state.balloonChoice) && (
          <SummaryRow
            icon={<PartyPopper className="w-4 h-4" />}
            label="Финал"
            value={state.packageType === "premium" ? "Шар-сюрприз" : (state.balloonChoice === "balloon" ? "Шар-сюрприз" : "Пиньята")}
            priceText="Включено"
            stepNumber={state.packageType === "premium" ? undefined : 14}
          />
        )}

        {state.masterClasses.length > 0 && (
          <SummaryRow
            icon={<Palette className="w-4 h-4" />}
            label="Мастер-классы"
            value={state.masterClasses.map(mc => MC_NAMES[mc] || mc).join(", ")}
            priceText={formatPrice(getMCPrice())}
            stepNumber={8}
          />
        )}

        {(state.megaOwnCatering || Object.values(state.megaFood).some(qty => qty > 0)) && (
          <SummaryRow
            icon={<UtensilsCrossed className="w-4 h-4" />}
            label="Еда"
            value={getMegaFoodSummary()}
            priceText={formatPrice(getFoodPrice())}
            stepNumber={9}
          />
        )}

        {state.additionalActivities && state.additionalActivities.length > 0 && (
          <SummaryRow
            icon={<PartyPopper className="w-4 h-4" />}
            label="Доп. активности"
            value={state.additionalActivities.map(act => ADDITIONAL_ACTIVITIES_NAMES[act] || act).join(", ")}
            priceText={formatPrice(getActivitiesPrice())}
            stepNumber={15}
          />
        )}

        {state.additionalServices && state.additionalServices.length > 0 && (
          <SummaryRow
            icon={<Star className="w-4 h-4" />}
            label="Доп. услуги"
            value={state.additionalServices.map(srv => {
              const baseName = ADDITIONAL_SERVICES_NAMES[srv] || srv;
              return baseName;
            }).join(", ")}
            priceText={formatPrice(getServicesPrice())}
            stepNumber={16}
          />
        )}

        {state.date && (
          <SummaryRow
            icon={<Calendar className="w-4 h-4" />}
            label="Дата"
            value={`${format(state.date, "d MMMM yyyy", { locale: ru })}, ${state.time}${
              isWeekendOrHoliday2026(state.date) ? " (выходной)" : " (будний)"
            }`}
          />
        )}

        <SummaryRow
          icon={<UsersIcon className="w-4 h-4" />}
          label="Гости"
          value={guestsValue}
          stepNumber={1}
          isLast={extraChildren === 0 || state.packageType !== "custom"}
        />

        {extraChildren > 0 && state.packageType === "custom" && (
          <SummaryRow
            icon={<UsersIcon className="w-4 h-4" />}
            label="Детские билеты"
            value={`${extraChildren} ${childrenWord(extraChildren)} × ${perChildRate.toLocaleString("ru-RU")} ₽`}
            priceText={formatPrice(extraChildrenCost)}
            stepNumber={1}
            isLast
          />
        )}
      </div>

      {/* Total */}
      <div 
        className="relative overflow-hidden rounded-[28px] p-6 mb-6 text-center text-white"
        style={{
          background: "linear-gradient(135deg, #FF6022, #FF8A50)",
          boxShadow: "0 12px 32px rgba(255, 96, 34, 0.3)",
        }}
      >
        <p className="text-[15px] font-bold text-white/90 mb-1.5 uppercase tracking-wider">
          Итого к оплате
        </p>
        <p className="text-[42px] leading-none font-black tracking-tight mb-2 drop-shadow-sm">
          {totalPrice.toLocaleString("ru-RU")} ₽
        </p>
        <p className="text-[13px] font-medium text-white/80">
          Окончательная стоимость подтверждается менеджером
        </p>
      </div>

      {/* Contact form */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5 mb-6">
        <h3 className="text-[#1A1A1A] mb-4">Контактные данные</h3>

        <div className="space-y-3">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ABABAB]" />
            <input
              type="text"
              placeholder="Ваше имя"
              value={state.contactName}
              onChange={(e) => updateState({ contactName: e.target.value })}
              className="w-full bg-[#F5F5F5] rounded-xl py-3 pl-10 pr-4 text-sm border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#FF6022]"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ABABAB]" />
            <input
              type="tel"
              placeholder="+7 (___) ___-__-__"
              value={state.contactPhone}
              onChange={handlePhoneChange}
              maxLength={18}
              className="w-full bg-[#F5F5F5] rounded-xl py-3 pl-10 pr-4 text-sm border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#FF6022]"
            />
          </div>

          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-[#ABABAB]" />
            <textarea
              placeholder="Комментарий или пожелания..."
              value={state.contactComment}
              onChange={(e) => updateState({ contactComment: e.target.value })}
              className="w-full bg-[#F5F5F5] rounded-xl py-3 pl-10 pr-4 text-sm border border-[#E5E5E5] focus:outline-none focus:ring-2 focus:ring-[#FF6022] resize-none h-20"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => setShowResetConfirm(true)}
        className="w-full py-4 mb-8 rounded-2xl border-2 border-red-500/20 text-red-500 font-bold flex items-center justify-center gap-2 hover:bg-red-50 active:scale-95 transition-all"
      >
        <Trash2 className="w-5 h-5" />
        Очистить корзину и начать заново
      </button>

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

    </motion.div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
  priceText,
  stepNumber,
  isLast = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  priceText?: string;
  stepNumber?: number;
  isLast?: boolean;
}) {
  const { setStep } = useWizard();

  return (
    <div
      onClick={stepNumber ? () => setStep(stepNumber) : undefined}
      className={`flex items-center gap-3 px-4 py-3 ${
        !isLast ? "border-b border-[#E5E5E5]" : ""
      } ${stepNumber ? "cursor-pointer hover:bg-black/5 transition-colors" : ""}`}
    >
      <div className="w-8 h-8 rounded-full bg-[#FF6022]/10 flex items-center justify-center text-[#FF6022] shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#ABABAB]">{label}</p>
        <p className="text-sm text-[#1A1A1A] truncate">{value}</p>
      </div>
      {priceText && (
        <div className={`text-sm font-bold whitespace-nowrap mr-2 ${priceText === "Включено" || priceText === "Бесплатно" ? "text-[#4CAF50]" : "text-[#1A1A1A]"}`}>
          {priceText}
        </div>
      )}
      {stepNumber && (
        <ChevronRight className="w-4 h-4 text-[#ABABAB] shrink-0" />
      )}
    </div>
  );
}
