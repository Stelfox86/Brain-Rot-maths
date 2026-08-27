export type MathCategory = 'multiplication' | 'addition' | 'subtraction' | 'mixed' | 'word-problems';

export type TimesTableNumber = 2 | 3 | 4 | 5 | 8 | 10 | 'all-yr3';

export type GameMode = 
  | 'menu' 
  | 'arcade' 
  | 'boss' 
  | 'test' 
  | 'tower' 
  | 'shop' 
  | 'passport' 
  | 'daily';

export interface MathQuestion {
  id: string;
  category: MathCategory;
  question: string;
  promptText?: string;
  correctAnswer: number;
  options: number[];
  hint?: string;
  visualAid?: {
    type: 'array' | 'number-line' | 'blocks' | 'ten-frame';
    num1: number;
    num2: number;
    op: string;
  };
  explanation: string;
  brainrotLore?: string;
  year3Objective: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  maxXp: number;
  aura: number;
  sigmaCoins: number;
  streak: number;
  bestStreak: number;
  equipped: {
    character: string;
    hat: string;
    glasses: string;
    pet: string;
    title: string;
    theme: string;
  };
  inventory: string[]; // item IDs
  completedTests: {
    id: string;
    title: string;
    score: number;
    total: number;
    date: string;
    percentage: number;
    badge: string;
  }[];
  bossDefeated: string[];
  stats: {
    questionsAnswered: number;
    questionsCorrect: number;
    multiplicationCorrect: number;
    additionCorrect: number;
    subtractionCorrect: number;
    bossDamageDealt: number;
    highestTowerFloor: number;
  };
  mastery: Record<string, number>; // e.g., 'table_3': 100
  dailyQuests: DailyQuest[];
  lastDailyDate: string;
  soundEnabled: boolean;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  rewardCoins: number;
  rewardAura: number;
  completed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'character' | 'hat' | 'glasses' | 'pet' | 'title' | 'theme';
  price: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  lore: string;
  cssStyle?: string;
  unlockedByDefault?: boolean;
}

export interface Boss {
  id: string;
  name: string;
  title: string;
  icon: string;
  maxHp: number;
  timeLimit: number; // seconds
  rewardCoins: number;
  rewardAura: number;
  phrase: string;
  defeatPhrase: string;
  color: string;
  category: MathCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

export interface CurriculumObjective {
  id: string;
  name: string;
  category: MathCategory;
  description: string;
  ukCode: string;
  targetCount: number;
}
