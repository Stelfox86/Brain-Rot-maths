import { UserProfile, DailyQuest } from '../types';

const STORAGE_KEY = 'sigma_maths_uk_profile_v1';

export const INITIAL_QUESTS: DailyQuest[] = [
  {
    id: 'quest_mult_10',
    title: 'Times Table Warmup',
    description: 'Answer 10 multiplication questions correctly',
    icon: '✖️',
    target: 10,
    current: 0,
    rewardCoins: 50,
    rewardAura: 200,
    completed: false,
  },
  {
    id: 'quest_add_sub_8',
    title: 'Addition & Subtraction Grind',
    description: 'Solve 8 addition or subtraction problems',
    icon: '➕',
    target: 8,
    current: 0,
    rewardCoins: 45,
    rewardAura: 180,
    completed: false,
  },
  {
    id: 'quest_streak_5',
    title: 'Mewing Streak Master',
    description: 'Achieve a 5-in-a-row correct answer streak',
    icon: '🔥',
    target: 5,
    current: 0,
    rewardCoins: 60,
    rewardAura: 250,
    completed: false,
  },
  {
    id: 'quest_boss_hit',
    title: 'Boss Battle Raid',
    description: 'Deal 50 damage to any Skibidi or Ohio Boss',
    icon: '⚔️',
    target: 50,
    current: 0,
    rewardCoins: 75,
    rewardAura: 300,
    completed: false,
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Sigma Year 3',
  avatar: '🗿',
  level: 1,
  xp: 0,
  maxXp: 100,
  aura: 500,
  sigmaCoins: 120, // Give them starter coins to buy an item!
  streak: 0,
  bestStreak: 0,
  equipped: {
    character: 'char_sigma',
    hat: 'hat_none',
    glasses: 'glass_none',
    pet: 'pet_none',
    title: 'title_noob',
    theme: 'theme_default',
  },
  inventory: ['char_sigma', 'hat_none', 'glass_none', 'pet_none', 'title_noob', 'theme_default'],
  completedTests: [],
  bossDefeated: [],
  stats: {
    questionsAnswered: 0,
    questionsCorrect: 0,
    multiplicationCorrect: 0,
    additionCorrect: 0,
    subtractionCorrect: 0,
    bossDamageDealt: 0,
    highestTowerFloor: 0,
  },
  mastery: {
    'table_2': 15,
    'table_3': 0,
    'table_4': 0,
    'table_5': 10,
    'table_8': 0,
    'table_10': 20,
    'addition_regroup': 0,
    'subtraction_exchange': 0,
    'money_word': 0,
  },
  dailyQuests: INITIAL_QUESTS,
  lastDailyDate: new Date().toDateString(),
  soundEnabled: true,
};

export function loadProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw) as UserProfile;
    
    // Check if daily quests need resetting
    const today = new Date().toDateString();
    if (parsed.lastDailyDate !== today) {
      parsed.dailyQuests = INITIAL_QUESTS.map(q => ({ ...q, current: 0, completed: false }));
      parsed.lastDailyDate = today;
    }
    
    // Ensure all required fields exist
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      equipped: { ...DEFAULT_PROFILE.equipped, ...parsed.equipped },
      stats: { ...DEFAULT_PROFILE.stats, ...parsed.stats },
      mastery: { ...DEFAULT_PROFILE.mastery, ...parsed.mastery },
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile', e);
  }
}

export function getAuraRank(aura: number): { rank: string; color: string; badge: string } {
  if (aura < 500) return { rank: 'Ohio Noob', color: 'text-zinc-400', badge: '🌱' };
  if (aura < 1500) return { rank: 'Bronze Rizzler', color: 'text-amber-600', badge: '🥉' };
  if (aura < 3000) return { rank: 'Silver Skibidi', color: 'text-slate-300', badge: '🥈' };
  if (aura < 6000) return { rank: 'Gold Sigma', color: 'text-yellow-400', badge: '🥇' };
  if (aura < 12000) return { rank: 'Diamond Mewing Pro', color: 'text-cyan-400', badge: '💎' };
  if (aura < 25000) return { rank: 'Master of KS2 Maths', color: 'text-purple-400', badge: '🔮' };
  return { rank: 'MYTHIC AURA GOD', color: 'text-rose-400 font-extrabold animate-pulse', badge: '👑' };
}
