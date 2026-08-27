import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  // Characters
  {
    id: 'char_sigma',
    name: 'Sigma Boy',
    type: 'character',
    price: 0,
    rarity: 'common',
    icon: '🗿',
    lore: 'The classic stone-cold sigma with 100% focus and zero distractions.',
    unlockedByDefault: true
  },
  {
    id: 'char_skibidi',
    name: 'Skibidi Toilet',
    type: 'character',
    price: 150,
    rarity: 'rare',
    icon: '🚽',
    lore: 'Dop dop yes yes! Sits in the porcelain throne doing 8 times tables.',
    unlockedByDefault: false
  },
  {
    id: 'char_mewing_cat',
    name: 'Mewing Cat',
    type: 'character',
    price: 250,
    rarity: 'epic',
    icon: '😼',
    lore: 'Strict mewing posture since Year 2. Jawline cut like a diamond.',
    unlockedByDefault: false
  },
  {
    id: 'char_capybara',
    name: 'Chill Capybara',
    type: 'character',
    price: 350,
    rarity: 'epic',
    icon: '🦫',
    lore: 'Ok I pull up! Never gets stressed by UK SATS or column subtraction.',
    unlockedByDefault: false
  },
  {
    id: 'char_grimace',
    name: 'Grimace Shake Master',
    type: 'character',
    price: 500,
    rarity: 'legendary',
    icon: '🍇',
    lore: 'Fueled by mysterious purple berry shakes and pure multiplication aura.',
    unlockedByDefault: false
  },
  {
    id: 'char_gigachad',
    name: 'Giga Chadley',
    type: 'character',
    price: 800,
    rarity: 'legendary',
    icon: '🧔‍♂️',
    lore: 'Can solve 12 × 8 in 0.2 seconds while looking directly into the camera.',
    unlockedByDefault: false
  },
  {
    id: 'char_golden_rizzler',
    name: 'Golden Rizzler',
    type: 'character',
    price: 1200,
    rarity: 'mythic',
    icon: '👑',
    lore: 'The ultimate UK Maths Legend. Emits glowing 24k gold energy particles.',
    unlockedByDefault: false
  },

  // Hats
  {
    id: 'hat_none',
    name: 'No Hat',
    type: 'hat',
    price: 0,
    rarity: 'common',
    icon: '🚫',
    lore: 'Pure aerodynamic maths head.',
    unlockedByDefault: true
  },
  {
    id: 'hat_cap',
    name: 'Backwards Cap',
    type: 'hat',
    price: 100,
    rarity: 'common',
    icon: '🧢',
    lore: 'Classic playground street cred in London.',
    unlockedByDefault: false
  },
  {
    id: 'hat_fedora',
    name: 'Rizz Fedora',
    type: 'hat',
    price: 200,
    rarity: 'rare',
    icon: '🎩',
    lore: 'Tips fedora: "M\'lady, 8 times 7 is 56."',
    unlockedByDefault: false
  },
  {
    id: 'hat_crown',
    name: 'Crown of Ohio',
    type: 'hat',
    price: 450,
    rarity: 'epic',
    icon: '👑',
    lore: 'Only worn by the ruler of the 4 and 8 times table kingdom.',
    unlockedByDefault: false
  },
  {
    id: 'hat_propeller',
    name: 'Propeller Beanie',
    type: 'hat',
    price: 300,
    rarity: 'rare',
    icon: '🚁',
    lore: 'Spins rapidly when your brain solves 3-digit additions.',
    unlockedByDefault: false
  },
  {
    id: 'hat_viking',
    name: 'Viking Horns',
    type: 'hat',
    price: 600,
    rarity: 'legendary',
    icon: '⚔️',
    lore: 'Used by ancient warriors to raid column subtractions.',
    unlockedByDefault: false
  },

  // Glasses / Eyewear
  {
    id: 'glass_none',
    name: 'No Glasses',
    type: 'glasses',
    price: 0,
    rarity: 'common',
    icon: '🚫',
    lore: 'Natural 20/20 maths vision.',
    unlockedByDefault: true
  },
  {
    id: 'glass_thug',
    name: 'Deal With It Shades',
    type: 'glasses',
    price: 180,
    rarity: 'rare',
    icon: '🕶️',
    lore: 'Pixelated black sunglasses that drop from the sky when you get a 10 streak.',
    unlockedByDefault: false
  },
  {
    id: 'glass_nerd',
    name: 'Sigma Nerd Specs',
    type: 'glasses',
    price: 220,
    rarity: 'rare',
    icon: '🤓',
    lore: '+50 Intelligence when solving missing number algebra.',
    unlockedByDefault: false
  },
  {
    id: 'glass_laser',
    name: 'Laser Glowing Eyes',
    type: 'glasses',
    price: 550,
    rarity: 'legendary',
    icon: '👀',
    lore: 'Emits red laser beams directly at wrong answers.',
    unlockedByDefault: false
  },
  {
    id: 'glass_monocle',
    name: 'British Gentleman Monocle',
    type: 'glasses',
    price: 400,
    rarity: 'epic',
    icon: '🧐',
    lore: 'Exquisite proper UK mathematics gentleman accessory.',
    unlockedByDefault: false
  },

  // Pets
  {
    id: 'pet_none',
    name: 'No Pet',
    type: 'pet',
    price: 0,
    rarity: 'common',
    icon: '🚫',
    lore: 'Solo sigma journey.',
    unlockedByDefault: true
  },
  {
    id: 'pet_capy',
    name: 'Mini Capybara',
    type: 'pet',
    price: 250,
    rarity: 'rare',
    icon: '🐾',
    lore: 'Trots beside you, munching on carrot snacks and cheering.',
    unlockedByDefault: false
  },
  {
    id: 'pet_burger',
    name: 'Fanum Tax Burger',
    type: 'pet',
    price: 350,
    rarity: 'epic',
    icon: '🍔',
    lore: 'Takes a tiny bite out of your mistakes so they hurt less.',
    unlockedByDefault: false
  },
  {
    id: 'pet_gronk',
    name: 'Baby Gronk Sprite',
    type: 'pet',
    price: 500,
    rarity: 'legendary',
    icon: '🏈',
    lore: 'Does touchdown dances whenever you clear a boss.',
    unlockedByDefault: false
  },
  {
    id: 'pet_nugget',
    name: 'Gedagedigedagedago Nugget',
    type: 'pet',
    price: 600,
    rarity: 'mythic',
    icon: '🍗',
    lore: 'Sings western cowboy songs while you calculate.',
    unlockedByDefault: false
  },

  // Titles
  {
    id: 'title_noob',
    name: 'Ohio Math Novice',
    type: 'title',
    price: 0,
    rarity: 'common',
    icon: '🌱',
    lore: 'Just arrived in Ohio. Ready to learn the 3x table.',
    unlockedByDefault: true
  },
  {
    id: 'title_rizzler',
    name: 'Certified Rizzler',
    type: 'title',
    price: 150,
    rarity: 'rare',
    icon: '✨',
    lore: 'Rizzing up the multiplication tables with pure confidence.',
    unlockedByDefault: false
  },
  {
    id: 'title_mewing',
    name: 'Mewing Grandmaster',
    type: 'title',
    price: 300,
    rarity: 'epic',
    icon: '🤫',
    lore: 'Silent, deadly, and accurate to the nearest 100.',
    unlockedByDefault: false
  },
  {
    id: 'title_sigma',
    name: 'Sigma of Key Stage 2',
    type: 'title',
    price: 500,
    rarity: 'legendary',
    icon: '🗿',
    lore: 'Acknowledged across all UK schools as a true sigma.',
    unlockedByDefault: false
  },
  {
    id: 'title_aura',
    name: 'Infinite Aura Overlord',
    type: 'title',
    price: 1000,
    rarity: 'mythic',
    icon: '⚡',
    lore: 'Your maths aura cannot be measured by ordinary instruments.',
    unlockedByDefault: false
  },

  // Background Themes
  {
    id: 'theme_default',
    name: 'Cosmic Glass',
    type: 'theme',
    price: 0,
    rarity: 'common',
    icon: '🔮',
    lore: 'Deep cosmic backdrop with frosted glass panels and indigo nebula glows.',
    cssStyle: 'from-[#0F0C29] via-[#302b63] to-[#24243e]',
    unlockedByDefault: true
  },
  {
    id: 'theme_grimace',
    name: 'Frosted Aurora',
    type: 'theme',
    price: 200,
    rarity: 'rare',
    icon: '🟣',
    lore: 'Mystical purple aurora Borealis shimmering through frosted crystal.',
    cssStyle: 'from-[#1a0933] via-[#3d1466] to-[#120726]',
    unlockedByDefault: false
  },
  {
    id: 'theme_sigma_gold',
    name: 'Champagne Glow',
    type: 'theme',
    price: 450,
    rarity: 'epic',
    icon: '🪙',
    lore: 'Frosted amber and warm gold luminescence with rich sigma prestige.',
    cssStyle: 'from-[#231505] via-[#45270a] to-[#160b02]',
    unlockedByDefault: false
  },
  {
    id: 'theme_matrix',
    name: 'Cyber Ice Grid',
    type: 'theme',
    price: 600,
    rarity: 'legendary',
    icon: '🧊',
    lore: 'Sub-zero cyan and emerald matrix light refraction.',
    cssStyle: 'from-[#021b24] via-[#083344] to-[#04131c]',
    unlockedByDefault: false
  }
];
