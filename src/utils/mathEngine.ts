import { MathCategory, MathQuestion, TimesTableNumber } from '../types';

export const UK_YEAR3_OBJECTIVES = [
  { id: '3N1b', name: 'Count in multiples of 4, 8, 50 & 100', category: 'multiplication' as MathCategory, description: 'Recall multiples up to 12x.', ukCode: 'Year 3 Number & Place Value', targetCount: 15 },
  { id: '3C1', name: 'Add & Subtract 3-digit numbers', category: 'addition' as MathCategory, description: 'Mental addition & subtraction with 1s, 10s, and 100s.', ukCode: 'Year 3 Addition & Subtraction', targetCount: 20 },
  { id: '3C6', name: 'Recall 2, 3, 4, 5, 8 & 10 Times Tables', category: 'multiplication' as MathCategory, description: 'Times tables multiplication & division facts.', ukCode: 'Year 3 Multiplication & Division', targetCount: 25 },
  { id: '3C2', name: 'Formal Written Column Addition', category: 'addition' as MathCategory, description: 'Add numbers up to 3 digits using column method.', ukCode: 'Year 3 Written Calculations', targetCount: 15 },
  { id: '3C2b', name: 'Formal Column Subtraction', category: 'subtraction' as MathCategory, description: 'Subtract numbers with regrouping.', ukCode: 'Year 3 Subtraction with Exchange', targetCount: 15 },
  { id: '3M9', name: 'UK Money & Word Problems', category: 'word-problems' as MathCategory, description: 'Solve money word problems using £ and pence.', ukCode: 'Year 3 Measurement & Money', targetCount: 10 },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateOptions(correctAnswer: number, category: MathCategory): number[] {
  const options = new Set<number>();
  options.add(correctAnswer);

  const offsets = [-10, 10, -1, 1, -2, 2, -5, 5, -8, 8, -12, 12];
  shuffle(offsets);

  for (const offset of offsets) {
    if (options.size >= 4) break;
    const candidate = correctAnswer + offset;
    if (candidate >= 0 && candidate !== correctAnswer) {
      options.add(candidate);
    }
  }

  // Fallback if needed
  while (options.size < 4) {
    const delta = randomInt(1, 15) * (Math.random() > 0.5 ? 1 : -1);
    const candidate = Math.max(0, correctAnswer + delta);
    options.add(candidate);
  }

  return shuffle(Array.from(options));
}

// Generate UK Year 3 Multiplication (2, 3, 4, 5, 8, 10 times tables)
export function generateMultiplicationQuestion(specificTable?: TimesTableNumber): MathQuestion {
  const validTables = [2, 3, 4, 5, 8, 10];
  let table: number;

  if (specificTable && typeof specificTable === 'number') {
    table = specificTable;
  } else {
    table = validTables[randomInt(0, validTables.length - 1)];
  }

  const multiplier = randomInt(1, 12);
  const isDivision = Math.random() < 0.25; // 25% chance of related division fact
  const isMissingNumber = Math.random() < 0.2;

  let questionText = '';
  let correctAnswer = 0;
  let hint = '';
  let explanation = '';
  let visualAid: MathQuestion['visualAid'];

  if (isDivision) {
    const product = table * multiplier;
    questionText = `${product} ÷ ${table} = ?`;
    correctAnswer = multiplier;
    hint = `Think: What number multiplied by ${table} gives ${product}?`;
    explanation = `${product} ÷ ${table} = ${multiplier} because ${table} × ${multiplier} = ${product}.`;
  } else if (isMissingNumber) {
    const product = table * multiplier;
    if (Math.random() > 0.5) {
      questionText = `? × ${table} = ${product}`;
      correctAnswer = multiplier;
    } else {
      questionText = `${multiplier} × ? = ${product}`;
      correctAnswer = table;
    }
    hint = `Find the missing factor to reach ${product}.`;
    explanation = `${multiplier} × ${table} = ${product}. Missing number is ${correctAnswer}.`;
  } else {
    questionText = `${multiplier} × ${table} = ?`;
    correctAnswer = multiplier * table;
    hint = `Add ${table} together ${multiplier} times, or count in steps of ${table}.`;
    explanation = `${multiplier} groups of ${table} = ${correctAnswer}.`;
    visualAid = {
      type: 'array',
      num1: multiplier,
      num2: table,
      op: '×'
    };
  }

  const brainrotQuips = [
    "Sigma math moment! Flex your multiplier aura!",
    "No Fanum Tax on this times table, calculate fast!",
    "Mewing streak activated: Lock in and solve it!",
    "Level 100 Rizz calculation incoming!",
    "Ohio Times Table test! Show your sigma speed!"
  ];

  return {
    id: `mult_${Date.now()}_${randomInt(100, 999)}`,
    category: 'multiplication',
    question: questionText,
    promptText: `Year 3 Multiplications (${table}x Table)`,
    correctAnswer,
    options: generateOptions(correctAnswer, 'multiplication'),
    hint,
    visualAid,
    explanation,
    brainrotLore: brainrotQuips[randomInt(0, brainrotQuips.length - 1)],
    year3Objective: `Year 3 Key Stage 2: Recall and use multiplication & division facts for the ${table} times table.`
  };
}

// Generate UK Year 3 Additions (Mental & Column method with regrouping)
export function generateAdditionQuestion(): MathQuestion {
  const subType = randomInt(1, 5);
  let qText = '';
  let ans = 0;
  let hint = '';
  let explanation = '';
  let visualAid: MathQuestion['visualAid'];

  if (subType === 1) {
    // 2-digit + 2-digit with regrouping (e.g. 47 + 38)
    const a = randomInt(24, 78);
    const b = randomInt(15, 68);
    ans = a + b;
    qText = `${a} + ${b} = ?`;
    hint = `Add the tens (${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${(Math.floor(a/10) + Math.floor(b/10))*10}), then add the units (${a%10} + ${b%10} = ${(a%10)+(b%10)}).`;
    explanation = `${a} + ${b} = ${ans}. (Tens: ${Math.floor(a/10)*10} + ${Math.floor(b/10)*10} = ${(Math.floor(a/10) + Math.floor(b/10))*10}, Units: ${a%10} + ${b%10} = ${(a%10)+(b%10)}).`;
  } else if (subType === 2) {
    // 3-digit + single digit bridging tens (e.g. 156 + 8)
    const a = randomInt(120, 480);
    const b = randomInt(4, 9);
    ans = a + b;
    qText = `${a} + ${b} = ?`;
    hint = `Count on ${b} from ${a}, or make up to the next ten.`;
    explanation = `${a} + ${b} = ${ans}.`;
  } else if (subType === 3) {
    // 3-digit + tens (e.g. 340 + 50 or 267 + 40)
    const a = randomInt(110, 550);
    const b = randomInt(2, 8) * 10;
    ans = a + b;
    qText = `${a} + ${b} = ?`;
    hint = `Add ${b/10} tens to ${a}.`;
    explanation = `${a} + ${b} = ${ans}. Only the tens and hundreds change.`;
  } else if (subType === 4) {
    // Number bonds to 100 (e.g. 64 + ? = 100)
    const a = randomInt(15, 85);
    ans = 100 - a;
    qText = `${a} + ? = 100`;
    hint = `How much more do you need to add to ${a} to reach 100?`;
    explanation = `${a} + ${ans} = 100 (Bond to 100).`;
  } else {
    // 3-digit + 3-digit column addition (e.g. 235 + 142)
    const a = randomInt(120, 430);
    const b = randomInt(110, 350);
    ans = a + b;
    qText = `${a} + ${b} = ?`;
    hint = `Add hundreds, tens, and units in order.`;
    explanation = `${a} + ${b} = ${ans}.`;
  }

  return {
    id: `add_${Date.now()}_${randomInt(100, 999)}`,
    category: 'addition',
    question: qText,
    promptText: 'Year 3 Addition Challenge',
    correctAnswer: ans,
    options: generateOptions(ans, 'addition'),
    hint,
    visualAid,
    explanation,
    brainrotLore: "Aura +500! Adding up your Sigma points before Fanum Tax!",
    year3Objective: "Year 3 Key Stage 2: Add numbers mentally and with formal written column addition."
  };
}

// Generate UK Year 3 Subtractions (Mental & Column with exchange)
export function generateSubtractionQuestion(): MathQuestion {
  const subType = randomInt(1, 4);
  let qText = '';
  let ans = 0;
  let hint = '';
  let explanation = '';

  if (subType === 1) {
    // 2-digit minus 2-digit with exchange (e.g. 83 - 47)
    const a = randomInt(45, 98);
    const b = randomInt(16, a - 10);
    ans = a - b;
    qText = `${a} - ${b} = ?`;
    hint = `Subtract ${Math.floor(b/10)*10} first (${a} - ${Math.floor(b/10)*10} = ${a - Math.floor(b/10)*10}), then subtract the remaining ${b%10}.`;
    explanation = `${a} - ${b} = ${ans}.`;
  } else if (subType === 2) {
    // 3-digit minus tens (e.g. 430 - 60)
    const tensCount = randomInt(20, 60);
    const base = tensCount * 10;
    const subTens = randomInt(2, 8) * 10;
    ans = base - subTens;
    qText = `${base} - ${subTens} = ?`;
    hint = `Count back ${subTens/10} tens from ${base}.`;
    explanation = `${base} - ${subTens} = ${ans}.`;
  } else if (subType === 3) {
    // Missing number subtraction (e.g. 100 - ? = 42 or 75 - ? = 38)
    const a = randomInt(50, 100);
    const b = randomInt(12, a - 10);
    ans = a - b;
    qText = `${a} - ? = ${b}`;
    hint = `Subtract ${b} from ${a} to find the difference.`;
    explanation = `${a} - ${ans} = ${b}. The missing number is ${ans}.`;
  } else {
    // 3-digit minus 2-digit (e.g. 254 - 38)
    const a = randomInt(140, 480);
    const b = randomInt(25, 75);
    ans = a - b;
    qText = `${a} - ${b} = ?`;
    hint = `Take away ${Math.floor(b/10)*10} then take away ${b%10}.`;
    explanation = `${a} - ${b} = ${ans}.`;
  }

  return {
    id: `sub_${Date.now()}_${randomInt(100, 999)}`,
    category: 'subtraction',
    question: qText,
    promptText: 'Year 3 Subtraction Slam',
    correctAnswer: ans,
    options: generateOptions(ans, 'subtraction'),
    hint,
    explanation,
    brainrotLore: "Ohio subtraction test! Take away the tax and claim the sigma loot!",
    year3Objective: "Year 3 Key Stage 2: Subtract numbers with up to 3 digits using mental methods and formal exchange."
  };
}

// Generate UK Year 3 Word Problems (with UK Currency £ and p & Hilarious Brainrot Scenarios)
export function generateWordProblemQuestion(): MathQuestion {
  const templates = [
    {
      story: (n1: number, n2: number) => `Baby Gronk collected ${n1} Sigma Coins in Ohio on Monday, and found ${n2} more on Tuesday. How many Sigma Coins does he have altogether?`,
      generator: () => {
        const n1 = randomInt(25, 65);
        const n2 = randomInt(18, 45);
        return {
          text: `Baby Gronk collected ${n1} Sigma Coins on Monday, and found ${n2} more on Tuesday. How many Sigma Coins does he have in total?`,
          ans: n1 + n2,
          hint: `Add ${n1} + ${n2}.`,
          exp: `${n1} + ${n2} = ${n1 + n2} Sigma Coins.`
        };
      }
    },
    {
      story: () => {},
      generator: () => {
        const cost = randomInt(3, 8);
        const count = randomInt(3, 5);
        const total = cost * count;
        return {
          text: `Kai Cenat buys ${count} Grimace Shakes at the shop. Each shake costs £${cost}. How much does he spend in total?`,
          ans: total,
          hint: `Multiply the number of shakes (${count}) by the price (£${cost}).`,
          exp: `${count} × £${cost} = £${total}.`
        };
      }
    },
    {
      story: () => {},
      generator: () => {
        const total = randomInt(60, 95);
        const tax = randomInt(15, 38);
        return {
          text: `The Fanum Tax Goblin raided a lunch box containing ${total} chips and stole ${tax} chips! How many chips are left?`,
          ans: total - tax,
          hint: `Subtract the stolen chips (${tax}) from the original total (${total}).`,
          exp: `${total} - ${tax} = ${total - tax} chips remaining.`
        };
      }
    },
    {
      story: () => {},
      generator: () => {
        const packSize = 8;
        const packs = randomInt(3, 7);
        const total = packSize * packs;
        return {
          text: `A gaming store sells Skibidi stickers in packs of 8. Livvy bought ${packs} packs. How many stickers did she get?`,
          ans: total,
          hint: `Multiply ${packs} packs × 8 stickers (8 times table!).`,
          exp: `${packs} × 8 = ${total} stickers.`
        };
      }
    },
    {
      story: () => {},
      generator: () => {
        const startMoney = 100; // 100p = £1.00
        const spent = randomInt(35, 75);
        return {
          text: `You have £1.00 (100p). You spend ${spent}p on a Sigma Capybara sticker. How much change in pence (p) do you get?`,
          ans: startMoney - spent,
          hint: `Subtract ${spent}p from 100p. (Number bonds to 100).`,
          exp: `100p - ${spent}p = ${startMoney - spent}p change.`
        };
      }
    },
    {
      story: () => {},
      generator: () => {
        const groups = 4;
        const perGroup = randomInt(4, 9);
        const total = groups * perGroup;
        return {
          text: `In Ohio, ${total} Capybaras need to share equally into ${groups} boats. How many Capybaras will be in each boat?`,
          ans: perGroup,
          hint: `Divide ${total} by ${groups} (or think: 4 × ? = ${total}).`,
          exp: `${total} ÷ ${groups} = ${perGroup} Capybaras per boat.`
        };
      }
    }
  ];

  const chosen = templates[randomInt(0, templates.length - 1)].generator();

  return {
    id: `wp_${Date.now()}_${randomInt(100, 999)}`,
    category: 'word-problems',
    question: chosen.text,
    promptText: 'UK Year 3 Real-Life Maths Problem',
    correctAnswer: chosen.ans,
    options: generateOptions(chosen.ans, 'word-problems'),
    hint: chosen.hint,
    explanation: chosen.exp,
    brainrotLore: 'Solve real-world math scenarios and protect your aura!',
    year3Objective: 'Year 3 Key Stage 2: Solve one-step and two-step problems in contexts, choosing the appropriate operations.'
  };
}

// Master generator by category
export function generateQuestion(category: MathCategory, timesTable?: TimesTableNumber): MathQuestion {
  switch (category) {
    case 'multiplication':
      return generateMultiplicationQuestion(timesTable);
    case 'addition':
      return generateAdditionQuestion();
    case 'subtraction':
      return generateSubtractionQuestion();
    case 'word-problems':
      return generateWordProblemQuestion();
    case 'mixed':
    default: {
      const rand = Math.random();
      if (rand < 0.4) return generateMultiplicationQuestion(timesTable);
      if (rand < 0.65) return generateAdditionQuestion();
      if (rand < 0.85) return generateSubtractionQuestion();
      return generateWordProblemQuestion();
    }
  }
}
