import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { isWeekendOrHoliday2026 } from "../data/holidays";
import {
  MEGA_PACKAGE_PRICES,
  MEGA_MC_PRICE,
  MEGA_SHOW_PRICES,
  PREMIUM_MASTER_CLASSES,
  getMegaFoodTotal,
} from "../data/megaConfig";

// Backend API URL — Timeweb VPS (HTTPS через nip.io)
const API_BASE = import.meta.env.VITE_API_URL || 'https://194-87-118-33.nip.io';

// ──────────────────────────────────────────────
// localStorage cache helpers
// ──────────────────────────────────────────────
const CACHE_VERSION = 3;
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function getCacheKey(leadId: string | null) {
  return leadId ? `wizard_cache_mega_${leadId}` : `wizard_cache_mega_standalone`;
}

interface CachedData {
  version: number;
  timestamp: number;
  step: number;
  state: WizardState;
  submitted?: boolean;
}

function saveToCache(key: string, step: number, state: WizardState, submitted = false) {
  try {
    const data: CachedData = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      step,
      state: {
        ...state,
        // Date needs special handling — store as ISO string
        date: state.date ? (state.date as unknown as string) : null,
      },
      submitted,
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // localStorage may be full or unavailable (e.g. private mode)
  }
}

function loadFromCache(key: string): { step: number; state: WizardState; submitted?: boolean } | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const data: CachedData = JSON.parse(raw);

    // Version mismatch or expired
    if (data.version !== CACHE_VERSION) { localStorage.removeItem(key); return null; }
    if (Date.now() - data.timestamp > CACHE_TTL_MS) { localStorage.removeItem(key); return null; }

    // Restore Date object
    const restored: WizardState = {
      ...data.state,
      date: data.state.date ? new Date(data.state.date as unknown as string) : null,
    };

    return { step: data.step, state: restored, submitted: data.submitted };
  } catch {
    return null;
  }
}

function clearCacheByKey(key: string) {
  try { localStorage.removeItem(key); } catch { /* noop */ }
}

export interface WizardState {
  // Step 1
  packageType: "basic" | "premium" | "exclusive" | "custom" | null;
  isWeekend: boolean;
  // Step 2 — Quests
  questType: "phygital_voxels" | "phygital_space" | "classic_fort" | "classic_harry" | "classic_harley" | "classic_bloggers" | "animator" | "none" | null;
  // Step 3 — Location (patiroom via quest upgrade)
  patiroom: string | null;
  patiroomDetails: string | null;
  patiroomHours: number;
  cafeZones: string[];
  // Step 4 — Animators
  animators: string[];
  // Step 5 — Shows
  shows: string[];
  // Step 6 — Master classes
  masterClasses: string[];
  // Step 7 — Food
  megaOwnCatering: boolean;
  megaFood: Record<string, number>;
  // Date/time
  date: Date | null;
  time: string;
  childrenCount: number;
  adultsCount: number;
  // Contact
  contactName: string;
  contactPhone: string;
  contactComment: string;
  isQuestPopupOpen: boolean;
  hasReachedSummary: boolean;
  discoChoice: "disco" | "trash_box" | null;
  balloonChoice: "balloon" | "pinata" | null;
  additionalActivities: string[];
  additionalServices: string[];
}

interface WizardContextType {
  isMega: true;
  isExp: boolean;
  step: number;
  totalSteps: number;
  visibleSteps: number[];
  state: WizardState;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateState: (partial: Partial<WizardState>) => void;
  totalPrice: number;
  submitted: boolean;
  setSubmitted: (v: boolean) => void;
  leadId: string | null;
  submitToAPI: (price?: number) => Promise<boolean>;
  clearCache: () => void;
  resetWizard: () => void;
  showResumeBanner: boolean;
  confirmResume: () => void;
  confirmRestart: () => void;
}

const initialState: WizardState = {
  packageType: null,
  isWeekend: false,
  questType: null,
  patiroom: null,
  patiroomDetails: null,
  patiroomHours: 3,
  cafeZones: [],
  animators: [],
  shows: [],
  masterClasses: [],
  megaOwnCatering: false,
  megaFood: {},
  date: null,
  time: "",
  childrenCount: 8,
  adultsCount: 4,
  contactName: "",
  contactPhone: "",
  contactComment: "",
  isQuestPopupOpen: false,
  hasReachedSummary: false,
  discoChoice: null,
  balloonChoice: null,
  additionalActivities: [],
  additionalServices: [],
};

function createInitialState(): WizardState {
  return {
    ...initialState,
    cafeZones: [],
    animators: [],
    shows: [],
    masterClasses: [],
    megaFood: {},
  };
}

const WizardContext = createContext<WizardContextType | null>(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}

const TOTAL_STEPS = 17;
const MEGA_STEPS_BASE = [1, 2, 3, 4, 8, 9, 12];

function getMegaSteps(packageType: WizardState["packageType"], questType: WizardState["questType"]) {
  const steps = [...MEGA_STEPS_BASE];
  if (packageType === "custom") {
    // Insert step 17 before 3 (index 2)
    steps.splice(steps.indexOf(3), 0, 17);
  }
  
  if (questType === "animator") {
    const idx = steps.indexOf(4);
    if (idx !== -1) steps.splice(idx, 1);
  }

  if (packageType === "exclusive" || packageType === "custom") {
    // Insert step 7 before 9
    steps.splice(steps.indexOf(9), 0, 7);
  }
  if (packageType === "premium" || packageType === "exclusive") {
    // Insert step 13 before 9
    steps.splice(steps.indexOf(9), 0, 13);
  }
  if (packageType === "exclusive") {
    // Insert step 14 before 9
    steps.splice(steps.indexOf(9), 0, 14);
  }
  if (packageType === "custom") {
    // Insert step 15 before 9 (Additional Activities)
    steps.splice(steps.indexOf(9), 0, 15);
  }
  // Insert step 16 before 9 (Additional Services)
  steps.splice(steps.indexOf(9), 0, 16);
  return steps;
}

// ── Per-child surcharge ──
// Every package is priced for 8 children. Each additional child costs extra.
// Does not apply to "custom" (no fixed package base) or when no package is chosen.
export const INCLUDED_CHILDREN = 8;
export const EXTRA_CHILD_WEEKDAY = 855;
export const EXTRA_CHILD_WEEKEND = 1215;
export const CUSTOM_CHILD_WEEKDAY = 1250;
export const CUSTOM_CHILD_WEEKEND = 1650;

export function getExtraChildrenCount(state: WizardState): number {
  if (!state.packageType) return 0;
  if (state.packageType === "custom") return state.childrenCount || 0;
  return Math.max(0, (state.childrenCount || 0) - INCLUDED_CHILDREN);
}

export function getExtraChildrenCost(state: WizardState, isWeekend: boolean): number {
  if (state.packageType === "custom") {
    return getExtraChildrenCount(state) * (isWeekend ? CUSTOM_CHILD_WEEKEND : CUSTOM_CHILD_WEEKDAY);
  }
  return getExtraChildrenCount(state) * (isWeekend ? EXTRA_CHILD_WEEKEND : EXTRA_CHILD_WEEKDAY);
}

// ── Custom mode: gift logic based on selected services ──
export interface CustomGift {
  id: string;
  name: string;
  gradient: string;
  emoji: string;
}

const ALL_CUSTOM_GIFTS: CustomGift[] = [
  { id: "invite", name: "Электронные пригласительные", gradient: "from-[#d4fc79] to-[#96e6a1]", emoji: "✉️" },
  { id: "wow", name: "WOW-поздравление от Лиса Рокки", gradient: "from-[#a1c4fd] to-[#c2e9fb]", emoji: "🎉" },
  { id: "gift", name: "Подарок имениннику", gradient: "from-[#a18cd1] to-[#fbc2eb]", emoji: "🎁" },
  { id: "balloon_decor", name: "Украшение шарами", gradient: "from-[#fbc2eb] to-[#a6c1ee]", emoji: "🎈" },
  { id: "balloon", name: "Шар-сюрприз", gradient: "from-[#ffecd2] to-[#fcb69f]", emoji: "🎊" },
  { id: "pinata", name: "Пиньята / Шар-цифра", gradient: "from-[#ff9a9e] to-[#fecfef]", emoji: "🪅" },
  { id: "gifts_all", name: "Подарки всем гостям", gradient: "from-[#84fab0] to-[#8fd3f4]", emoji: "🛍️" },
];

export function getCustomGifts(state: WizardState): CustomGift[] {
  if (state.packageType !== "custom") return [];
  const gifts: CustomGift[] = [];
  const hasAnyService = state.questType || state.patiroom || state.shows.length > 0
    || state.masterClasses.length > 0 || Object.values(state.megaFood).some(q => q > 0) || state.animators.length > 0;
  const hasQuest = !!state.questType && state.questType !== "none";
  const hasShow = state.shows.length > 0;
  const hasMC = state.masterClasses.length > 0;
  const hasFood = Object.values(state.megaFood).some(q => q > 0);
  const hasPatiroom = !!state.patiroom;

  // Level 1: any service → invites
  if (hasAnyService) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "invite")!);
  }
  // Level 2: quest → wow + birthday gift
  if (hasQuest) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "wow")!);
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "gift")!);
  }
  // Level 3: patiroom → balloon decor
  if (hasPatiroom) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "balloon_decor")!);
  }
  // Level 4: quest + show or MC → surprise balloon
  if (hasQuest && (hasShow || hasMC)) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "balloon")!);
  }
  // Level 5: quest + show + MC → pinata
  if (hasQuest && hasShow && hasMC) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "pinata")!);
  }
  // Level 6: quest + show + MC + food → gifts for all
  if (hasQuest && hasShow && hasMC && hasFood) {
    gifts.push(ALL_CUSTOM_GIFTS.find(g => g.id === "gifts_all")!);
  }

  return gifts;
}


export function WizardProvider({ children }: { children: React.ReactNode }) {
  // Lead ID from URL parameter (?lead=abc123)
  const [leadId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('lead');
  });

  const cacheKey = getCacheKey(leadId);
  const parkInitialState = React.useMemo(() => createInitialState(), []);

  // Try to restore from cache on first render
  // If cache exists with step > 1 and not submitted, show resume banner
  const cachedOnMount = useRef(loadFromCache(cacheKey));
  const hasPendingSession = cachedOnMount.current && (cachedOnMount.current.step > 1) && !cachedOnMount.current.submitted;

  const [showResumeBanner, setShowResumeBanner] = useState(!!hasPendingSession);

  const [step, setStep] = useState(() => {
    const cached = cachedOnMount.current;
    if (!cached) return 1;
    // If submitted, restore to step 12 to show submitted screen
    if (cached.submitted) return cached.step;
    // If pending session, start at 1 until user confirms resume
    if (hasPendingSession) return 1;
    return Math.max(cached.step, 1);
  });
  const [state, setState] = useState<WizardState>(() => {
    const cached = cachedOnMount.current;
    if (!cached) return parkInitialState;
    // If submitted, restore full state
    if (cached.submitted) {
      return {
        ...parkInitialState,
        ...cached.state,
        patiroomHours: cached.state.patiroomHours ?? 3,
      };
    }
    // If pending session, start with initial state until user confirms
    if (hasPendingSession) return parkInitialState;
    return {
      ...parkInitialState,
      ...cached.state,
      patiroomHours: cached.state.patiroomHours ?? 3,
    };
  });
  const [submitted, setSubmitted] = useState(() => {
    const cached = cachedOnMount.current;
    return cached?.submitted ?? false;
  });

  // Flag to prevent overwriting cache during initial lead data fetch
  const isInitializing = useRef(true);
  useEffect(() => { isInitializing.current = false; }, []);

  // Update hasReachedSummary
  useEffect(() => {
    if (step === 12 && !state.hasReachedSummary) {
      setState(s => ({ ...s, hasReachedSummary: true }));
    }
  }, [step, state.hasReachedSummary]);

  // Persist state + step to localStorage on every change
  useEffect(() => {
    if (showResumeBanner) return; // Don't overwrite cache while banner is shown
    saveToCache(cacheKey, step, state, submitted);
  }, [step, state, cacheKey, submitted, showResumeBanner]);

  // Clear cache helper (call after successful submission)
  const clearCache = useCallback(() => {
    clearCacheByKey(cacheKey);
  }, [cacheKey]);

  // Reset entire wizard state
  const resetWizard = useCallback(() => {
    clearCacheByKey(cacheKey);
    setState(parkInitialState);
    setStep(1);
    setSubmitted(false);
    setShowResumeBanner(false);
  }, [cacheKey, parkInitialState]);

  // Resume banner actions
  const confirmResume = useCallback(() => {
    const cached = cachedOnMount.current;
    if (cached) {
      setState({
        ...parkInitialState,
        ...cached.state,
        patiroomHours: cached.state.patiroomHours ?? 3,
      });
      setStep(Math.max(cached.step, 1));
    }
    setShowResumeBanner(false);
  }, [parkInitialState]);

  const confirmRestart = useCallback(() => {
    clearCacheByKey(cacheKey);
    setState(parkInitialState);
    setStep(1);
    setSubmitted(false);
    setShowResumeBanner(false);
  }, [cacheKey, parkInitialState]);

  // On mount: if we have a leadId, notify server and pre-fill contact data
  useEffect(() => {
    if (!leadId || !API_BASE) return;

    // Notify server that configurator was opened
    fetch(`${API_BASE}/api/leads/${leadId}/opened`, { method: 'POST' }).catch(() => {});

    // Fetch lead data to pre-fill name and phone
    fetch(`${API_BASE}/api/leads/${leadId}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.lead) {
          setState(s => ({
            ...s,
            contactName: data.lead.name || s.contactName,
            contactPhone: data.lead.phone || s.contactPhone,
          }));
        }
      })
      .catch(() => {});
  }, [leadId]);

  // Submit configuration to API
  // Note: totalPrice is passed by the component calling submitToAPI
  const submitToAPI = useCallback(async (price?: number): Promise<boolean> => {
    if (!leadId || !API_BASE) return true; // No lead = standalone mode, always OK
    try {
      const payload = {
        ...state,
        parkId: "mega",
        date: state.date?.toISOString(),
        totalPrice: price ?? 0,
      };
      const res = await fetch(`${API_BASE}/api/leads/${leadId}/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data.success;
    } catch {
      console.error('Failed to submit to API');
      return false;
    }
  }, [leadId, state]);

  const nextStep = useCallback(() => {
    setStep((s) => {
      const steps = getMegaSteps(state.packageType, state.questType);
      const index = steps.indexOf(s);
      if (index >= 0) return steps[Math.min(index + 1, steps.length - 1)];
      return steps[0];
    });
  }, [state.questType, state.packageType]);

  const prevStep = useCallback(() => {
    setStep((s) => {
      const steps = getMegaSteps(state.packageType, state.questType);
      const index = steps.indexOf(s);
      if (index >= 0) return steps[Math.max(index - 1, 0)];
      return steps[0];
    });
  }, [state.questType, state.packageType]);
  const updateState = useCallback(
    (partial: Partial<WizardState>) => setState((s) => ({ ...s, ...partial })),
    []
  );

  const totalPrice = (() => {
    let total = 0;
    const effectiveWeekend = state.date ? isWeekendOrHoliday2026(state.date) : state.isWeekend;

    if (state.packageType) {
      const [weekday, weekend] = MEGA_PACKAGE_PRICES[state.packageType] || [0, 0];
      total += effectiveWeekend ? weekend : weekday;
    }

    if (state.questType && state.questType !== "none" && state.questType !== "animator") {
      if (state.packageType === "custom") {
        total += state.questType.startsWith("phygital_") ? 12000 : 16000;
      } else if (state.questType.startsWith("classic_")) {
        if (state.packageType === "basic") total += 16000;
        else if (state.packageType === "premium") total += 9000;
        else if (state.packageType === "exclusive") total += 9000;
      }
    }

    if (state.animators.length > 1) {
      total += (state.animators.length - 1) * 8000;
    }

    if (state.packageType === "exclusive") {
      let showsCost = 0;
      for (const show of state.shows) showsCost += MEGA_SHOW_PRICES[show] || 0;
      if (state.shows.length > 0) showsCost -= MEGA_SHOW_PRICES[state.shows[0]] || 0;
      total += showsCost;
    } else {
      for (const show of state.shows) total += MEGA_SHOW_PRICES[show] || 0;
    }

    // Separate MCs into regular and premium
    const regularMcs = state.masterClasses.filter(id => !PREMIUM_MASTER_CLASSES.find(p => p.id === id));
    const premiumMcs = state.masterClasses.filter(id => PREMIUM_MASTER_CLASSES.find(p => p.id === id));

    if (state.packageType === "premium" || state.packageType === "exclusive") {
      total += Math.max(0, regularMcs.length - 1) * MEGA_MC_PRICE;
    } else {
      total += regularMcs.length * MEGA_MC_PRICE;
    }

    for (const mcId of premiumMcs) {
      const pmc = PREMIUM_MASTER_CLASSES.find(p => p.id === mcId);
      if (pmc) {
        total += state.packageType === "exclusive" ? pmc.excPrice : pmc.price;
      }
    }

    for (const zone of state.cafeZones) {
      if (zone === "cafe_round") total += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_small") total += 5000;
      if (zone === "cafe_pink") total += effectiveWeekend ? 10000 : 5000;
      if (zone === "cafe_pink_full") total += effectiveWeekend ? 20000 : 10000;
    }

    total += getMegaFoodTotal(state.megaFood);

    for (const act of state.additionalActivities) {
      if (act === "trash-animals") total += 35000;
      if (act === "trash-box") total += 7000;
      if (act === "mini-disco") total += 6000;
      if (act === "challenge-party") total += 10000;
    }

    for (const srv of state.additionalServices) {
      if (srv === "photo") total += 7000;
      if (srv === "aqua") total += 7000;
      if (srv === "tattoos") total += 4000;
    }

    if (state.packageType === "custom") {
      total += getExtraChildrenCost(state, effectiveWeekend);
    }

    return total;
  })();

  const visibleSteps = React.useMemo(
    () => getMegaSteps(state.packageType, state.questType),
    [state.questType, state.packageType]
  );

  const isExp = React.useMemo(() => !new URLSearchParams(window.location.search).has("noexp"), []);

  return (
    <WizardContext.Provider
      value={{
        isMega: true, isExp,
        step, totalSteps: TOTAL_STEPS, visibleSteps, state, setStep,
        nextStep, prevStep, updateState, totalPrice, submitted, setSubmitted,
        leadId, submitToAPI, clearCache, resetWizard,
        showResumeBanner, confirmResume, confirmRestart
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}
