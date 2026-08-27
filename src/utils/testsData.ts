import { MathCategory, TimesTableNumber } from '../types';

export interface UkMathTest {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: MathCategory;
  timesTableFocus?: TimesTableNumber;
  questionCount: number;
  timeLimitSeconds: number; // e.g. 180s (3 mins)
  rewardCoins: number;
  rewardAura: number;
  badge: string;
  ukStandard: string;
}

export const UK_YEAR3_TESTS: UkMathTest[] = [
  {
    id: 'test_tables_core',
    title: 'Year 3 Times Table Mastery Test',
    subtitle: 'Official UK Curriculum (2x, 3x, 4x, 5x, 8x, 10x)',
    description: '15 quickfire times tables and division facts to prove your multiplication aura.',
    category: 'multiplication',
    questionCount: 15,
    timeLimitSeconds: 150,
    rewardCoins: 150,
    rewardAura: 600,
    badge: '✖️ Times Table Sigma',
    ukStandard: 'National Curriculum KS2 Year 3: Recall and use multiplication and division facts for 3, 4 and 8 multiplication tables'
  },
  {
    id: 'test_add_sub',
    title: 'Column Addition & Subtraction Checkpoint',
    subtitle: 'Mental & Written Calculations with 2 & 3 digits',
    description: '12 questions on 2-digit & 3-digit additions, number bonds to 100, and regrouping subtractions.',
    category: 'mixed',
    questionCount: 12,
    timeLimitSeconds: 180,
    rewardCoins: 160,
    rewardAura: 700,
    badge: '➕➖ Calculation Master',
    ukStandard: 'National Curriculum KS2 Year 3: Add and subtract numbers with up to 3 digits using formal written methods'
  },
  {
    id: 'test_money_word',
    title: 'UK Money & Word Problem Challenge',
    subtitle: 'Pounds (£), Pence (p) and Real-World Brainrot Problems',
    description: '10 fun real-world problems calculating change, buying snacks, and sharing loot in Ohio.',
    category: 'word-problems',
    questionCount: 10,
    timeLimitSeconds: 200,
    rewardCoins: 200,
    rewardAura: 900,
    badge: '💷 Pounds & Pence Rizz',
    ukStandard: 'National Curriculum KS2 Year 3: Add and subtract amounts of money to give change, using both £ and p'
  },
  {
    id: 'test_grand_sats',
    title: 'Grand Year 3 KS2 SATS Championship',
    subtitle: 'The Ultimate All-Round Maths Test',
    description: '20 varied curriculum questions covering multiplications, additions, subtractions, missing numbers, and word puzzles.',
    category: 'mixed',
    questionCount: 20,
    timeLimitSeconds: 300,
    rewardCoins: 350,
    rewardAura: 1800,
    badge: '🏆 Key Stage 2 Grand Champion',
    ukStandard: 'Complete Year 3 National Curriculum Mathematics standard assessment'
  }
];
