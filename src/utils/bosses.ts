import { Boss } from '../types';

export const BOSS_ROSTER: Boss[] = [
  {
    id: 'boss_fanum',
    name: 'The Fanum Tax Goblin',
    title: 'Snatcher of Snacks & Aura',
    icon: '👺',
    maxHp: 100,
    timeLimit: 50,
    rewardCoins: 120,
    rewardAura: 500,
    phrase: '"Give me 20% of your maths aura or I take your lunchbox!"',
    defeatPhrase: '"Womp Womp! Your addition skills were too sigma for me!"',
    color: 'from-amber-600 to-orange-700',
    category: 'addition',
    difficulty: 'easy'
  },
  {
    id: 'boss_grimace',
    name: 'Grimace in Ohio',
    title: 'Lord of the Purple Shake',
    icon: '👾',
    maxHp: 160,
    timeLimit: 55,
    rewardCoins: 200,
    rewardAura: 850,
    phrase: '"You cannot escape the 3x, 4x, and 8x times tables!"',
    defeatPhrase: '"Aura -1000 for me! You truly mastered your multiplications!"',
    color: 'from-purple-600 to-fuchsia-800',
    category: 'multiplication',
    difficulty: 'medium'
  },
  {
    id: 'boss_skibidi',
    name: 'The Skibidi Math King',
    title: 'Ruler of the Ceramic Throne',
    icon: '🚽',
    maxHp: 240,
    timeLimit: 60,
    rewardCoins: 350,
    rewardAura: 1500,
    phrase: '"Dop dop yes yes! Solve my regrouping subtractions or get flushed!"',
    defeatPhrase: '"NOOO! The UK Year 3 subtraction champion has arrived!"',
    color: 'from-sky-600 to-blue-800',
    category: 'subtraction',
    difficulty: 'hard'
  },
  {
    id: 'boss_gigachad',
    name: 'Omega Giga-Chadley',
    title: 'The Jawline of KS2 Mathematics',
    icon: '🗿',
    maxHp: 320,
    timeLimit: 65,
    rewardCoins: 500,
    rewardAura: 2500,
    phrase: '"Only a true Sigma with 100% Times Table accuracy can gaze upon me!"',
    defeatPhrase: '"Respect +10000. You are a legendary Year 3 Mathematics Sigma."',
    color: 'from-emerald-600 to-teal-800',
    category: 'mixed',
    difficulty: 'extreme'
  }
];
