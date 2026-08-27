import React, { useState } from 'react';
import { ShopItem, UserProfile } from '../types';
import { SHOP_ITEMS } from '../utils/shopItems';
import { CharacterAvatar } from './CharacterAvatar';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  ShoppingBag, 
  Coins, 
  Sparkles, 
  Check, 
  Lock, 
  Crown, 
  Shirt, 
  Glasses, 
  Smile, 
  Tag, 
  Palette,
  Eye
} from 'lucide-react';

interface DripShopProps {
  profile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
}

export const DripShop: React.FC<DripShopProps> = ({ profile, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'character' | 'hat' | 'glasses' | 'pet' | 'title' | 'theme'>('character');
  const [previewItem, setPreviewItem] = useState<ShopItem | null>(null);

  const filteredItems = SHOP_ITEMS.filter((item) => item.type === activeTab);

  // Determine what is previewed or equipped
  const currentEquippedId = profile.equipped[activeTab];

  const handleBuyOrEquip = (item: ShopItem) => {
    const isUnlocked = profile.inventory.includes(item.id) || item.price === 0;

    if (isUnlocked) {
      // Equip item
      SoundEngine.playUnlock(profile.soundEnabled);
      onUpdateProfile((prev) => ({
        ...prev,
        equipped: {
          ...prev.equipped,
          [item.type]: item.id,
        },
      }));
    } else {
      // Purchase item
      if (profile.sigmaCoins >= item.price) {
        SoundEngine.playCoin(profile.soundEnabled);
        SoundEngine.playUnlock(profile.soundEnabled);
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });

        onUpdateProfile((prev) => ({
          ...prev,
          sigmaCoins: prev.sigmaCoins - item.price,
          inventory: [...prev.inventory, item.id],
          equipped: {
            ...prev.equipped,
            [item.type]: item.id,
          },
        }));
      } else {
        SoundEngine.playWrong(profile.soundEnabled);
      }
    }
  };

  const rarityBadges = {
    common: 'text-slate-400 bg-slate-800 border-slate-700',
    rare: 'text-sky-400 bg-sky-950/40 border-sky-500/30',
    epic: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
    legendary: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    mythic: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6" id="drip-shop-page">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-pink-300 border border-white/20 text-xs font-black uppercase mb-1">
            <ShoppingBag className="w-3.5 h-3.5" /> Ohio Drip Locker & Cosmetics
          </div>
          <h2 className="text-3xl font-black text-white">Locker & Drip Shop</h2>
          <p className="text-xs text-purple-200/80 mt-0.5">
            Spend your hard-earned Sigma Coins on avatars, hats, shades, pets, and titles!
          </p>
        </div>

        {/* Currency balance */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-xl text-yellow-300 border border-white/20 font-black text-base shadow-lg">
          <Coins className="w-5 h-5 text-yellow-400" />
          <span>{profile.sigmaCoins} Sigma Coins</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Live Dressing Room Preview */}
        <div className="lg:col-span-1 bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 flex flex-col items-center justify-center text-center shadow-xl text-white">
          <span className="text-xs font-black text-purple-200 uppercase tracking-widest mb-4 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-cyan-300" /> Live Dressing Room
          </span>

          <div className="my-4 p-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
            <CharacterAvatar
              characterId={profile.equipped.character}
              hatId={profile.equipped.hat}
              glassesId={profile.equipped.glasses}
              petId={profile.equipped.pet}
              size="xl"
              showPet={true}
              animate={true}
            />
          </div>

          <h3 className="text-2xl font-black text-white mt-2">{profile.name}</h3>
          <span className="text-xs px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 font-extrabold border border-white/20 mt-1">
            {SHOP_ITEMS.find((i) => i.id === profile.equipped.title)?.name || 'Ohio Math Novice'}
          </span>

          {/* Quick Stats Summary */}
          <div className="w-full mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <span className="text-purple-200/80 block">Level</span>
              <span className="font-black text-white">Level {profile.level}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <span className="text-purple-200/80 block">Aura</span>
              <span className="font-black text-blue-200">{profile.aura}</span>
            </div>
          </div>
        </div>

        {/* Right: Category Tabs & Catalog */}
        <div className="lg:col-span-2">
          {/* Shop Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 bg-white/10 backdrop-blur-2xl p-2 rounded-2xl border border-white/20 shadow-lg">
            <button
              id="shop-tab-char"
              onClick={() => setActiveTab('character')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'character' ? 'bg-white text-indigo-950 shadow-md' : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Smile className="w-4 h-4" /> Characters
            </button>
            <button
              id="shop-tab-hat"
              onClick={() => setActiveTab('hat')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'hat' ? 'bg-white text-indigo-950 shadow-md' : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Crown className="w-4 h-4" /> Hats
            </button>
            <button
              id="shop-tab-glasses"
              onClick={() => setActiveTab('glasses')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'glasses' ? 'bg-white text-indigo-950 shadow-md' : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Glasses className="w-4 h-4" /> Glasses
            </button>
            <button
              id="shop-tab-pet"
              onClick={() => setActiveTab('pet')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'pet' ? 'bg-white text-indigo-950 shadow-md' : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>🐾</span> Pets
            </button>
            <button
              id="shop-tab-title"
              onClick={() => setActiveTab('title')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'title' ? 'bg-white text-indigo-950 shadow-md' : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Tag className="w-4 h-4" /> Titles
            </button>
            <button
              id="shop-tab-theme"
              onClick={() => setActiveTab('theme')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'theme' ? 'bg-white text-indigo-950 shadow-md' : 'text-purple-200/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Palette className="w-4 h-4" /> Themes
            </button>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredItems.map((item) => {
              const isUnlocked = profile.inventory.includes(item.id) || item.price === 0;
              const isEquipped = currentEquippedId === item.id;
              const canAfford = profile.sigmaCoins >= item.price;

              return (
                <div
                  key={item.id}
                  id={`item-card-${item.id}`}
                  className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between backdrop-blur-xl ${
                    isEquipped
                      ? 'bg-white/25 border-white shadow-xl ring-2 ring-white/40'
                      : 'bg-white/10 border-white/20 hover:border-white/40 hover:bg-white/15'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl filter drop-shadow-sm">{item.icon}</span>
                        <div>
                          <h4 className="text-base font-black text-white">{item.name}</h4>
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border backdrop-blur-md ${rarityBadges[item.rarity]}`}>
                            {item.rarity}
                          </span>
                        </div>
                      </div>

                      {isEquipped && (
                        <span className="flex items-center gap-1 text-[11px] font-black text-indigo-950 bg-white px-2 py-0.5 rounded-full shadow-md">
                          <Check className="w-3 h-3" /> Equipped
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-purple-200/80 mb-3">{item.lore}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-xs font-black text-yellow-300 flex items-center gap-1">
                      {isUnlocked ? (
                        <span className="text-emerald-300">Unlocked</span>
                      ) : (
                        <>
                          <Coins className="w-3.5 h-3.5 text-yellow-400" />
                          {item.price} Coins
                        </>
                      )}
                    </span>

                    <button
                      id={`btn-shop-${item.id}`}
                      disabled={!isUnlocked && !canAfford}
                      onClick={() => handleBuyOrEquip(item)}
                      className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-transform active:scale-95 flex items-center gap-1 ${
                        isEquipped
                          ? 'bg-white/15 text-white/50 cursor-default'
                          : isUnlocked
                          ? 'bg-white hover:bg-white/90 text-indigo-950 shadow-md'
                          : canAfford
                          ? 'bg-yellow-400 hover:bg-yellow-300 text-indigo-950 font-black shadow-md'
                          : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                      }`}
                    >
                      {isEquipped ? (
                        'Active'
                      ) : isUnlocked ? (
                        'Equip'
                      ) : canAfford ? (
                        'Buy & Equip'
                      ) : (
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Need Coins
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
