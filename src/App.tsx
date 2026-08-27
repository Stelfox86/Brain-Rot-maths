import React, { useState, useEffect } from 'react';
import { GameMode, UserProfile } from './types';
import { loadProfile, saveProfile } from './utils/storage';
import { SHOP_ITEMS } from './utils/shopItems';
import { Navbar } from './components/Navbar';
import { ArcadeGame } from './components/ArcadeGame';
import { BossBattleGame } from './components/BossBattleGame';
import { TestRunner } from './components/TestRunner';
import { AuraTowerGame } from './components/AuraTowerGame';
import { DripShop } from './components/DripShop';
import { MathPassport } from './components/MathPassport';
import { DailyQuestsModal } from './components/DailyQuestsModal';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadProfile());
  const [activeMode, setActiveMode] = useState<GameMode>('arcade');
  const [isQuestsModalOpen, setIsQuestsModalOpen] = useState<boolean>(false);

  // Persist profile to localStorage on updates
  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const handleUpdateProfile = (updater: (prev: UserProfile) => UserProfile) => {
    setProfile((prev) => updater(prev));
  };

  const handleToggleSound = () => {
    setProfile((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Find theme CSS
  const equippedThemeItem = SHOP_ITEMS.find((i) => i.id === profile.equipped.theme);
  const themeBg = equippedThemeItem?.cssStyle || 'from-slate-950 via-purple-950 to-indigo-950';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeBg} text-white flex flex-col font-sans selection:bg-purple-400 selection:text-slate-950 relative overflow-x-hidden`}>
      {/* Frosted Glass Ambient Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[450px] h-[450px] bg-purple-600/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[35%] right-[10%] w-[380px] h-[380px] bg-pink-500/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[25%] left-[5%] w-[340px] h-[340px] bg-indigo-500/25 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Navigation & Status Bar */}
      <Navbar
        profile={profile}
        activeMode={activeMode}
        onSelectMode={(mode) => setActiveMode(mode)}
        onToggleSound={handleToggleSound}
        onOpenDailyQuests={() => setIsQuestsModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16 z-10 relative">
        {activeMode === 'arcade' && (
          <ArcadeGame profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}

        {activeMode === 'boss' && (
          <BossBattleGame profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}

        {activeMode === 'test' && (
          <TestRunner profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}

        {activeMode === 'tower' && (
          <AuraTowerGame profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}

        {activeMode === 'shop' && (
          <DripShop profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}

        {activeMode === 'passport' && (
          <MathPassport profile={profile} onUpdateProfile={handleUpdateProfile} />
        )}
      </main>

      {/* Daily Quests Dialog */}
      <DailyQuestsModal
        isOpen={isQuestsModalOpen}
        onClose={() => setIsQuestsModalOpen(false)}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Bottom Footer Note */}
      <footer className="w-full py-4 text-center text-xs text-purple-200/80 border-t border-white/10 bg-white/5 backdrop-blur-xl z-10 relative">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold tracking-wide">Sigma Maths UK • Key Stage 2 Year 3 National Curriculum</span>
          <span className="text-white/60">Multiplications (2, 3, 4, 5, 8, 10x) • Additions • Subtractions • Money £/p</span>
        </div>
      </footer>
    </div>
  );
}
