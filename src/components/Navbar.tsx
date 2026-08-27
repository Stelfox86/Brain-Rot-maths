import React from 'react';
import { GameMode, UserProfile } from '../types';
import { CharacterAvatar } from './CharacterAvatar';
import { getAuraRank } from '../utils/storage';
import { 
  Gamepad2, 
  Swords, 
  GraduationCap, 
  Building2, 
  ShoppingBag, 
  Award, 
  Volume2, 
  VolumeX, 
  Flame, 
  Coins, 
  Sparkles,
  Scroll
} from 'lucide-react';
import { SHOP_ITEMS } from '../utils/shopItems';

interface NavbarProps {
  profile: UserProfile;
  activeMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onToggleSound: () => void;
  onOpenDailyQuests: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeMode,
  onSelectMode,
  onToggleSound,
  onOpenDailyQuests,
}) => {
  const auraRank = getAuraRank(profile.aura);
  const equippedTitle = SHOP_ITEMS.find((i) => i.id === profile.equipped.title);
  const claimableQuestsCount = profile.dailyQuests.filter((q) => !q.completed && q.current >= q.target).length;

  return (
    <header className="w-full bg-white/10 backdrop-blur-2xl border-b border-white/20 sticky top-0 z-40 shadow-2xl shadow-black/20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        {/* Top bar: Player Stats & Quick Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-white/10">
          {/* Left: Player Profile Pill */}
          <div className="flex items-center gap-3">
            <button
              id="btn-header-avatar"
              onClick={() => onSelectMode('shop')}
              className="flex items-center gap-2.5 p-1.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 transition-all text-left group shadow-sm"
              title="Click to visit Drip Shop & customize"
            >
              <CharacterAvatar
                characterId={profile.equipped.character}
                hatId={profile.equipped.hat}
                glassesId={profile.equipped.glasses}
                petId={profile.equipped.pet}
                size="sm"
                showPet={true}
              />
              <div className="pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm text-white tracking-wide">{profile.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/15 text-purple-200 font-bold border border-white/20">
                    Lv.{profile.level}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-purple-200/90 font-medium">
                  <span>{equippedTitle?.icon || '🌱'}</span>
                  <span className="truncate max-w-[130px]">{equippedTitle?.name || 'Ohio Math Novice'}</span>
                </div>
              </div>
            </button>

            {/* XP Bar */}
            <div className="hidden md:flex flex-col gap-1 w-28">
              <div className="flex justify-between text-[10px] text-purple-200/70 font-semibold">
                <span>XP</span>
                <span>{profile.xp}/{profile.maxXp}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/30 overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (profile.xp / profile.maxXp) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Currency, Aura & Streak Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter */}
            <div 
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black border backdrop-blur-xl transition-all ${
                profile.streak > 0 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-sm shadow-amber-500/20 animate-pulse' 
                  : 'bg-white/10 text-white/60 border-white/15'
              }`}
              title={`Current Streak: ${profile.streak} (Best: ${profile.bestStreak})`}
            >
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{profile.streak} Streak</span>
            </div>

            {/* Sigma Coins */}
            <button
              id="btn-header-coins"
              onClick={() => onSelectMode('shop')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl text-yellow-300 border border-white/20 text-xs font-black shadow-sm transition-transform active:scale-95"
              title="Sigma Coins - Click to spend in Drip Shop"
            >
              <Coins className="w-4 h-4 text-yellow-400" />
              <span>{profile.sigmaCoins}</span>
            </button>

            {/* Aura Points & Rank */}
            <div 
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-xl text-blue-300 border border-white/20 text-xs font-black shadow-sm"
              title={`Aura: ${profile.aura} (${auraRank.rank})`}
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>{profile.aura} Aura</span>
              <span className="hidden sm:inline text-[10px] text-purple-200 font-bold px-1.5 py-0.5 rounded-md bg-white/10 border border-white/15">
                {auraRank.badge}
              </span>
            </div>

            {/* Daily Quests Button */}
            <button
              id="btn-header-quests"
              onClick={onOpenDailyQuests}
              className="relative p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20 transition-all shadow-sm"
              title="Daily Quests & Rewards"
            >
              <Scroll className="w-4 h-4 text-purple-200" />
              {claimableQuestsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-black text-white flex items-center justify-center animate-bounce shadow-md">
                  {claimableQuestsCount}
                </span>
              )}
            </button>

            {/* Sound Toggle */}
            <button
              id="btn-header-sound"
              onClick={onToggleSound}
              className={`p-2.5 rounded-2xl border backdrop-blur-xl transition-all shadow-sm ${
                profile.soundEnabled
                  ? 'bg-white/15 text-purple-200 border-white/25 hover:bg-white/25'
                  : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/15'
              }`}
              title={profile.soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects'}
            >
              {profile.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2.5 pt-2.5 overflow-x-auto no-scrollbar" id="main-navigation">
          <button
            id="nav-arcade"
            onClick={() => onSelectMode('arcade')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeMode === 'arcade'
                ? 'bg-white text-indigo-950 shadow-[0_4px_25px_rgba(255,255,255,0.35)] ring-2 ring-white/60 scale-[1.02]'
                : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
            }`}
          >
            <Gamepad2 className={`w-4 h-4 ${activeMode === 'arcade' ? 'text-purple-600' : 'text-pink-400'}`} />
            <span>Sigma Arcade</span>
          </button>

          <button
            id="nav-boss"
            onClick={() => onSelectMode('boss')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeMode === 'boss'
                ? 'bg-white text-indigo-950 shadow-[0_4px_25px_rgba(255,255,255,0.35)] ring-2 ring-white/60 scale-[1.02]'
                : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
            }`}
          >
            <Swords className={`w-4 h-4 ${activeMode === 'boss' ? 'text-red-600' : 'text-red-400'}`} />
            <span>Boss Battles</span>
          </button>

          <button
            id="nav-tests"
            onClick={() => onSelectMode('test')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeMode === 'test'
                ? 'bg-white text-indigo-950 shadow-[0_4px_25px_rgba(255,255,255,0.35)] ring-2 ring-white/60 scale-[1.02]'
                : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
            }`}
          >
            <GraduationCap className={`w-4 h-4 ${activeMode === 'test' ? 'text-blue-600' : 'text-cyan-400'}`} />
            <span>UK Year 3 Tests</span>
          </button>

          <button
            id="nav-tower"
            onClick={() => onSelectMode('tower')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeMode === 'tower'
                ? 'bg-white text-indigo-950 shadow-[0_4px_25px_rgba(255,255,255,0.35)] ring-2 ring-white/60 scale-[1.02]'
                : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeMode === 'tower' ? 'text-amber-600' : 'text-yellow-400'}`} />
            <span>Aura Tower</span>
          </button>

          <button
            id="nav-shop"
            onClick={() => onSelectMode('shop')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeMode === 'shop'
                ? 'bg-white text-indigo-950 shadow-[0_4px_25px_rgba(255,255,255,0.35)] ring-2 ring-white/60 scale-[1.02]'
                : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
            }`}
          >
            <ShoppingBag className={`w-4 h-4 ${activeMode === 'shop' ? 'text-fuchsia-600' : 'text-fuchsia-400'}`} />
            <span>Drip Shop</span>
          </button>

          <button
            id="nav-passport"
            onClick={() => onSelectMode('passport')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm whitespace-nowrap transition-all ${
              activeMode === 'passport'
                ? 'bg-white text-indigo-950 shadow-[0_4px_25px_rgba(255,255,255,0.35)] ring-2 ring-white/60 scale-[1.02]'
                : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
            }`}
          >
            <Award className={`w-4 h-4 ${activeMode === 'passport' ? 'text-emerald-600' : 'text-emerald-400'}`} />
            <span>Maths Passport</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
