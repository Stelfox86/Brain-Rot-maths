import React from 'react';
import { DailyQuest, UserProfile } from '../types';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  X, 
  Scroll, 
  Coins, 
  Sparkles, 
  Check, 
  Gift, 
  Clock
} from 'lucide-react';

interface DailyQuestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const handleClaimQuest = (quest: DailyQuest) => {
    if (quest.completed || quest.current < quest.target) return;

    SoundEngine.playCoin(profile.soundEnabled);
    SoundEngine.playLevelUp(profile.soundEnabled);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 },
    });

    onUpdateProfile((prev) => ({
      ...prev,
      sigmaCoins: prev.sigmaCoins + quest.rewardCoins,
      aura: prev.aura + quest.rewardAura,
      xp: prev.xp + 40,
      dailyQuests: prev.dailyQuests.map((q) =>
        q.id === quest.id ? { ...q, completed: true } : q
      ),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" id="daily-quests-modal-backdrop">
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl animate-fadeIn text-white">
        {/* Close button */}
        <button
          id="btn-close-quests"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-all border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-white/10 text-purple-200 border border-white/20 shadow-md">
            <Scroll className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Daily Ohio Quests</h3>
            <p className="text-xs text-purple-200/80">Resets daily with fresh challenges & loot!</p>
          </div>
        </div>

        {/* Quest List */}
        <div className="space-y-3 mb-6">
          {profile.dailyQuests.map((quest) => {
            const isReady = !quest.completed && quest.current >= quest.target;
            const progressPercent = Math.min(100, (quest.current / quest.target) * 100);

            return (
              <div
                key={quest.id}
                className={`p-4 rounded-2xl border backdrop-blur-xl transition-all flex flex-col justify-between ${
                  quest.completed
                    ? 'bg-white/5 border-white/10 opacity-50'
                    : isReady
                    ? 'bg-white/20 border-white/40 ring-2 ring-white/30 shadow-lg'
                    : 'bg-white/10 border-white/15'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{quest.icon}</span>
                    <div>
                      <h4 className="text-sm font-black text-white">{quest.title}</h4>
                      <p className="text-xs text-purple-200/80">{quest.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-0.5 text-xs font-black text-yellow-300">
                      <Coins className="w-3.5 h-3.5 text-yellow-400" /> +{quest.rewardCoins}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs font-black text-blue-200">
                      <Sparkles className="w-3.5 h-3.5 text-blue-300" /> +{quest.rewardAura}
                    </span>
                  </div>
                </div>

                {/* Progress bar & Claim button */}
                <div className="flex items-center justify-between gap-3 mt-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] text-purple-200/80 font-bold mb-1">
                      <span>Progress</span>
                      <span>{quest.current} / {quest.target}</span>
                    </div>
                    <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {isReady ? (
                    <button
                      id={`btn-claim-quest-${quest.id}`}
                      onClick={() => handleClaimQuest(quest)}
                      className="px-4 py-2 rounded-xl bg-white hover:bg-white/90 text-indigo-950 font-black text-xs shadow-lg animate-bounce shrink-0"
                    >
                      🎁 Claim Loot!
                    </button>
                  ) : quest.completed ? (
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 shrink-0">
                      <Check className="w-4 h-4" /> Claimed
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-white/50 shrink-0">In Progress</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            id="btn-close-quests-footer"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm border border-white/20 backdrop-blur-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
