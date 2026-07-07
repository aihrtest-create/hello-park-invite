import { useWizard } from "./wizard-context";
import { motion } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence } from "motion/react";

const BASE = import.meta.env.BASE_URL;

type AnimatorCategory =
  | "princesses"
  | "superheroes"
  | "villains"
  | "cartoons"
  | "games"
  | "universal";

interface Animator {
  id: string;
  name: string;
  category: AnimatorCategory;
  image: string;
}

export const SECTION_CATEGORIES: { id: AnimatorCategory; label: string; emoji: string }[] = [
  { id: "princesses", label: "Принцессы", emoji: "👑" },
  { id: "superheroes", label: "Супергерои", emoji: "🦸" },
  { id: "villains", label: "Антигерои", emoji: "🖤" },
  { id: "cartoons", label: "Мультики", emoji: "🎬" },
  { id: "games", label: "Игры", emoji: "🎮" },
  { id: "universal", label: "Другие", emoji: "🌟" },
];

export const ANIMATORS: Animator[] = [
  // 👑 Принцессы
  { id: "elsa", name: "Эльза", category: "princesses", image: "/animators/cropped/elsa_extended_trans.png" },
  { id: "anna", name: "Анна", category: "princesses", image: "/animators/cropped/anna.webp" },
  { id: "ariel", name: "Ариэль", category: "princesses", image: "/animators/cropped/ariel.webp" },
  { id: "rapunzel", name: "Рапунцель", category: "princesses", image: "/animators/cropped/rapunzel.webp" },
  { id: "aurora", name: "Аврора", category: "princesses", image: "/animators/cropped/aurora.webp" },
  { id: "snow_white", name: "Белоснежка", category: "princesses", image: "/animators/cropped/snow_white.webp" },
  { id: "jasmine", name: "Жасмин", category: "princesses", image: "/animators/cropped/jasmine.webp" },
  { id: "cinderella", name: "Золушка", category: "princesses", image: "/animators/cropped/cinderella.webp" },
  { id: "moana", name: "Моана", category: "princesses", image: "/animators/cropped/moana.webp" },
  { id: "minnie_mouse", name: "Минни Маус", category: "princesses", image: "/animators/cropped/minnie_mouse.webp" },
  { id: "barbie", name: "Барби", category: "princesses", image: "/animators/cropped/barbie.webp" },
  { id: "lol_queen_bee", name: "Королева Пчёлка", category: "princesses", image: "/animators/cropped/lol_queen_bee.webp" },
  { id: "lol_doll", name: "Кукла L.O.L.", category: "princesses", image: "/animators/cropped/lol_doll.webp" },
  { id: "lol_unicorn", name: "Фея-Единорог", category: "princesses", image: "/animators/cropped/lol_unicorn.webp" },
  { id: "rainbow_dash", name: "Радуга Дэш", category: "princesses", image: "/animators/cropped/rainbow_dash.webp" },
  { id: "princess_cadence", name: "Принцесса Каденс", category: "princesses", image: "/animators/cropped/princess_cadence.webp" },

  // 🦸 Супергерои
  { id: "spiderman", name: "Человек-Паук", category: "superheroes", image: "/animators/cropped/spiderman.webp" },
  { id: "batman", name: "Бэтмен", category: "superheroes", image: "/animators/cropped/batman.webp" },
  { id: "captain_america", name: "Капитан Америка", category: "superheroes", image: "/animators/cropped/captain_america.webp" },
  { id: "superman", name: "Супермен", category: "superheroes", image: "/animators/cropped/superman.webp" },
  { id: "deadpool", name: "Дэдпул", category: "superheroes", image: "/animators/cropped/deadpool.webp" },
  { id: "optimus_prime", name: "Оптимус Прайм", category: "superheroes", image: "/animators/cropped/optimus_prime.webp" },

  // 🖤 Антигерои
  { id: "wednesday", name: "Уэнсдей", category: "villains", image: "/animators/cropped/wednesday.webp" },
  { id: "enid", name: "Энид", category: "villains", image: "/animators/cropped/enid.webp" },
  { id: "maleficent", name: "Малефисента", category: "villains", image: "/animators/cropped/maleficent.webp" },
  { id: "cruella", name: "Круэлла", category: "villains", image: "/animators/cropped/cruella.webp" },
  { id: "huggy_wuggy", name: "Хаги Ваги", category: "villains", image: "/animators/cropped/huggy_wuggy.webp" },
  { id: "kissy_missy", name: "Киси Миси", category: "villains", image: "/animators/cropped/kissy_missy.webp" },
  { id: "darth_vader", name: "Дарт Вейдер", category: "villains", image: "/animators/cropped/darth_vader.webp" },

  // 🎬 Мультики
  { id: "chase", name: "Чейз", category: "cartoons", image: "/animators/cropped/chase.webp" },
  { id: "skye", name: "Скай", category: "cartoons", image: "/animators/cropped/skye.webp" },
  { id: "kuromi", name: "Куроми", category: "cartoons", image: "/animators/cropped/kuromi.webp" },
  { id: "hello_kitty", name: "Hello Kitty", category: "cartoons", image: "/animators/cropped/hello_kitty.webp" },
  { id: "naruto", name: "Наруто", category: "cartoons", image: "/animators/cropped/naruto.webp" },
  { id: "pikachu", name: "Пикачу", category: "cartoons", image: "/animators/cropped/pikachu.webp" },
  { id: "alice", name: "Алиса", category: "cartoons", image: "/animators/cropped/alice.webp" },
  { id: "maui", name: "Мауи", category: "cartoons", image: "/animators/cropped/maui.webp" },
  { id: "donatello", name: "Донателло", category: "cartoons", image: "/animators/cropped/donatello.webp" },
  { id: "michelangelo", name: "Микеланджело", category: "cartoons", image: "/animators/cropped/michelangelo.webp" },
  { id: "raphael", name: "Рафаэль", category: "cartoons", image: "/animators/cropped/raphael.webp" },

  // 🎮 Игры
  { id: "minecraft_creeper", name: "Крипер", category: "games", image: "/animators/cropped/minecraft_creeper.webp" },
  { id: "green_creeper", name: "Зелёный Крипер", category: "games", image: "/animators/cropped/green_creeper.webp" },
  { id: "brawl_leon", name: "Леон", category: "games", image: "/animators/cropped/brawl_leon.webp" },
  { id: "brawl_shelly", name: "Шелли", category: "games", image: "/animators/cropped/brawl_shelly.webp" },
  { id: "sonic", name: "Соник", category: "games", image: "/animators/cropped/sonic.webp" },
  { id: "mario", name: "Марио", category: "games", image: "/animators/cropped/mario.webp" },
  { id: "roblox_girl", name: "Девочка Роблокс", category: "games", image: "/animators/cropped/roblox_girl.webp" },
  { id: "roblox_boy", name: "Мальчик Роблокс", category: "games", image: "/animators/cropped/roblox_boy.webp" },
  { id: "roblox_blue", name: "Блю Роблокс", category: "games", image: "/animators/cropped/roblox_blue.webp" },

  // 🌟 Другие
  { id: "harry_potter", name: "Гарри Поттер", category: "universal", image: "/animators/cropped/harry_potter.webp" },
  { id: "hermione", name: "Гермиона", category: "universal", image: "/animators/cropped/hermione.webp" },
  { id: "ken", name: "Кен", category: "universal", image: "/animators/cropped/ken.webp" },
  { id: "squid_game", name: "Охранник", category: "universal", image: "/animators/cropped/squid_game.webp" },
  { id: "blogger", name: "Блогерша", category: "universal", image: "/animators/cropped/blogger.webp" },
  { id: "blogger_male", name: "Блогер", category: "universal", image: "/animators/cropped/blogger_male.webp" },
  { id: "pirate", name: "Пират", category: "universal", image: "/animators/cropped/pirate.webp" },
  { id: "pirate_girl", name: "Пиратка", category: "universal", image: "/animators/cropped/pirate_girl.webp" },
  { id: "host", name: "Ведущий", category: "universal", image: "/animators/cropped/host.webp" },
  { id: "pop_it", name: "Pop It", category: "universal", image: "/animators/cropped/pop_it.webp" },
  { id: "paleontologist", name: "Палеонтолог", category: "universal", image: "/animators/cropped/paleontologist.webp" },
  { id: "footballer", name: "Футболист", category: "universal", image: "/animators/cropped/footballer.webp" },
  { id: "dragon", name: "Дракоша", category: "universal", image: "/animators/cropped/dragon.webp" },
  { id: "unicorn", name: "Единорожка", category: "universal", image: "/animators/cropped/unicorn.webp" },
  { id: "jester", name: "Шут", category: "universal", image: "/animators/cropped/jester.webp" },
  { id: "circus_bunny", name: "Цирковой зайка", category: "universal", image: "/animators/cropped/circus_bunny.webp" },
  { id: "circus_artist1", name: "Цирковой артист", category: "universal", image: "/animators/cropped/circus_artist1.webp" },
  { id: "circus_artist2", name: "Цирковой артист", category: "universal", image: "/animators/cropped/circus_artist2.webp" },
];

export function Step3Animators() {
  const { state, updateState, isExp } = useWizard();
  const [activeCategory, setActiveCategory] = useState<AnimatorCategory>("princesses");
  const [surchargePopup, setSurchargePopup] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const isScrollingToRef = useRef(false);

  const toggleAnimator = (id: string) => {
    const current = state.animators;
    if (current.includes(id)) {
      // Deselect
      updateState({ animators: current.filter((a) => a !== id) });
    } else if (current.length === 0) {
      // First animator — free
      updateState({ animators: [id] });
    } else {
      // Second+ animator — show surcharge popup
      setSurchargePopup(id);
    }
  };

  const confirmAddAnimator = () => {
    if (surchargePopup) {
      updateState({ animators: [...state.animators, surchargePopup] });
      setSurchargePopup(null);
    }
  };

  // Auto-scroll the active tab into view within the horizontal tab bar
  const scrollTabIntoView = useCallback((catId: string) => {
    const btn = tabButtonRefs.current[catId];
    const container = tabsRef.current;
    if (btn && container) {
      const btnRect = btn.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollLeft =
        container.scrollLeft +
        (btnRect.left - containerRect.left) -
        containerRect.width / 2 +
        btnRect.width / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  // IntersectionObserver to auto-switch active tab on scroll
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
                scrollTabIntoView(cat.id);
              }
            });
          },
          {
            rootMargin: "-80px 0px -70% 0px",
            threshold: 0,
          }
        );
        observer.observe(el);
        observers.push(observer);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      observers.forEach((o) => o.disconnect());
    };
  }, [scrollTabIntoView]);

  // Click on tab → scroll to section
  const scrollToSection = (catId: AnimatorCategory) => {
    setActiveCategory(catId);
    scrollTabIntoView(catId);

    const el = sectionRefs.current[catId];
    if (el) {
      isScrollingToRef.current = true;
      const yOffset = -210; // App header (~145px) + sticky tabs (~65px)
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      setTimeout(() => {
        isScrollingToRef.current = false;
      }, 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="pb-16"
    >
      {/* Header */}
      <div className="text-center mb-4 px-8 pt-2">
        <h2 className="text-3xl font-black text-[#1A1A1A] mb-2 leading-tight flex items-center justify-center gap-3">
          <span className="text-4xl drop-shadow-md hover:scale-110 transition-transform cursor-pointer">
            🦸‍♂️
          </span>
          Любимые герои
        </h2>
        <p className="text-base font-bold text-[#747474] leading-relaxed">
          Выберите героя для праздника
        </p>
      </div>

      {state.questType?.startsWith("phygital_") && (
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-4 mb-4 mx-4 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[#FF6022] font-bold text-sm mb-1">
              К фиджитал-квесту!
            </h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Вы выбрали программу с Лисом Рокки. Теперь вы можете добавить
              любимых героев, которые присоединятся к нему на празднике!
            </p>
          </div>
          <div className="absolute -bottom-2 -right-2 text-6xl opacity-20 transform rotate-12">
            🦊
          </div>
        </div>
      )}

      {state.questType === "animator" && (
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 border border-pink-200 rounded-2xl p-4 mb-4 mx-4 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-[#FF6022] font-bold text-sm mb-1">
              Герой
            </h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Выбранный герой проведёт 40 минут весёлой игры с интерактивными
              инсталляциями — без сюжета, активности на усмотрение аниматора.
            </p>
          </div>
          <div className="absolute -bottom-2 -right-2 text-6xl opacity-20 transform rotate-12">
            🎈
          </div>
        </div>
      )}

      {/* Selection info */}
      <div className="flex items-center justify-between mb-3 px-5">
        <span className="text-sm text-[#747474]">
          Выбрано:{" "}
          <span className="font-bold text-[#1A1A1A]">
            {state.animators.length}
          </span>
        </span>
        {state.animators.length >= 1 && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center gap-1"
          >
            <Check className="w-3 h-3" /> Отлично!
          </motion.span>
        )}
      </div>

      {/* Sticky category tabs with glassmorphism */}
      <div className="sticky top-[110px] z-30 pt-2 pb-3 px-1 mx-0 rounded-2xl" style={{ background: 'rgba(247,247,247,0.65)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
        <div
          ref={tabsRef}
          className="flex gap-1.5 overflow-x-auto scrollbar-hide"
        >
          {SECTION_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                ref={(el) => { tabButtonRefs.current[cat.id] = el; }}
                onClick={() => scrollToSection(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#1A1A1A] text-white shadow-md"
                    : "bg-white text-[#747474] ring-1 ring-[#E5E5E5]"
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* All sections rendered continuously */}
      <div className="px-4 mt-2">
        {SECTION_CATEGORIES.map((cat) => {
          const sectionAnimators = ANIMATORS.filter((a) => a.category === cat.id);
          return (
            <div
              key={cat.id}
              ref={(el) => { sectionRefs.current[cat.id] = el; }}
              className="mb-6"
            >
              {/* Section heading */}
              <div className="flex items-center gap-2 mb-3 pt-2">
                <span className="text-xl">{cat.emoji}</span>
                <h3 className="text-[17px] font-bold text-[#1A1A1A]">{cat.label}</h3>
                <span className="text-xs text-[#ABABAB] font-medium ml-1">{sectionAnimators.length}</span>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-2 gap-3">
                {sectionAnimators.map((anim) => {
                  const isSelected = state.animators.includes(anim.id);
                  
                  return (
                    <button
                      key={anim.id}
                      onClick={() => toggleAnimator(anim.id)}
                      className={`group relative rounded-[28px] bg-white p-2 transition-all duration-300 cursor-pointer border flex flex-col text-left ${
                        isSelected
                          ? "scale-[1.02]"
                          : "border-black/[0.04] shadow-[0_6px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
                      }`}
                      style={{
                        borderColor: isSelected ? "#FF6022" : "rgba(0,0,0,0.04)",
                        borderWidth: isSelected ? "2px" : "1px",
                        boxShadow: isSelected 
                          ? "0 16px 36px rgba(255,96,34,0.15), 0 0 0 1px rgba(255,96,34,0.1)" 
                          : undefined
                      }}
                    >
                      <div className="relative aspect-[4/3.5] w-full rounded-[20px] overflow-hidden bg-white border border-[#F0F0F0] flex items-center justify-center shrink-0">
                        <img
                          src={`${BASE}${anim.image.startsWith('/') ? anim.image.slice(1) : anim.image}`}
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
                            {state.packageType === "custom" ? (
                              state.animators.length >= 1 && !isSelected ? "+8 000 ₽" : isSelected && state.animators.indexOf(anim.id) === 0 ? "Включён" : isSelected ? "+8 000 ₽" : "Включён"
                            ) : (
                              isSelected ? "Выбран" : "Добавить"
                            )}
                          </span>
                          
                          <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? "bg-[#FF6022] text-white shadow-sm" : "bg-gray-50 text-[#D1D1D1]"
                            }`}
                          >
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

      {/* Premium costume info */}
      <div className="mx-4 bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-4 relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-violet-500 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-[#1A1A1A] mb-1">
              Свой герой
            </h3>
            <p className="text-xs text-[#5A5A5A] leading-relaxed">
              Не нашли нужного персонажа? Напишите нам — мы подберём костюм
              специально под вашу тему!
            </p>
          </div>
        </div>
        <div className="absolute -bottom-3 -right-3 text-5xl opacity-10 transform rotate-12">
          ✨
        </div>
      </div>

      {/* Surcharge popup for additional animator */}
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
                  <span className="text-3xl">🦸</span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Дополнительный герой</h3>
                <p className="text-sm text-[#747474] leading-relaxed">
                  За дополнительного героя нужно доплатить
                </p>
                <p className="text-2xl font-black text-[#FF6022] mt-2">
                  +8 000 ₽
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
                  onClick={confirmAddAnimator}
                  className="flex-1 py-3.5 rounded-xl font-medium text-center bg-[#FF6022] text-white shadow-md shadow-[#FF6022]/30 active:scale-[0.98]"
                >
                  Добавить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}