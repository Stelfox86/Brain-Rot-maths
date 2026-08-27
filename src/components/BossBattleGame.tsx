import React, { useState, useEffect, useRef } from 'react';
import { Boss, UserProfile, MathQuestion } from '../types';
import { BOSS_ROSTER } from '../utils/bosses';
import { generateQuestion } from '../utils/mathEngine';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Swords, 
  Clock, 
  Heart, 
  Coins, 
  Sparkles, 
  Trophy, 
  Zap, 
  RotateCcw, 
  ShieldAlert,
  Flame,
  ArrowLeft
} from 'lucide-react';

interface BossBattleGameProps {
  profile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
}

export const BossBattleGame: React.FC<BossBattleGameProps> = ({ profile, onUpdateProfile }) => {
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [bossHp, setBossHp] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isBattleActive, setIsBattleActive] = useState<boolean>(false);
  const [battleState, setBattleState] = useState<'selecting' | 'fighting' | 'won' | 'lost'>('selecting');
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion | null>(null);
  const [damageNumber, setDamageNumber] = useState<{ amount: number; isCrit: boolean } | null>(null);
  const [bossMessage, setBossMessage] = useState<string>('');
  const [isBossHurt, setIsBossHurt] = useState<boolean>(false);
  const [combo, setCombo] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start boss fight
  const startFight = (boss: Boss) => {
    setSelectedBoss(boss);
    setBossHp(boss.maxHp);
    setTimeLeft(boss.timeLimit);
    setBattleState('fighting');
    setIsBattleActive(true);
    setCombo(0);
    setBossMessage(boss.phrase);
    setCurrentQuestion(generateQuestion(boss.category));
  };

  // Timer countdown effect
  useEffect(() => {
    if (battleState === 'fighting' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (battleState === 'fighting' && timeLeft <= 0) {
      // Time over - player lost
      setBattleState('lost');
      setIsBattleActive(false);
      SoundEngine.playWrong(profile.soundEnabled);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [battleState, timeLeft, profile.soundEnabled]);

  // Handle attacking boss
  const handleAttack = (chosenOption: number) => {
    if (!currentQuestion || !selectedBoss || battleState !== 'fighting') return;

    const isCorrect = chosenOption === currentQuestion.correctAnswer;

    if (isCorrect) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      const isCrit = nextCombo >= 3;
      const baseDamage = 25;
      const damage = isCrit ? baseDamage * 2 : baseDamage;

      // Sound & visuals
      if (isCrit) {
        SoundEngine.playVineBoom(profile.soundEnabled);
      } else {
        SoundEngine.playCorrect(nextCombo, profile.soundEnabled);
      }

      setDamageNumber({ amount: damage, isCrit });
      setIsBossHurt(true);
      setTimeout(() => setIsBossHurt(false), 400);

      const newHp = Math.max(0, bossHp - damage);
      setBossHp(newHp);

      // Check Boss Defeat
      if (newHp <= 0) {
        setBattleState('won');
        setIsBattleActive(false);
        setBossMessage(selectedBoss.defeatPhrase);
        SoundEngine.playLevelUp(profile.soundEnabled);

        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
        });

        // Update profile
        onUpdateProfile((prev) => {
          const bossDefeatedList = prev.bossDefeated.includes(selectedBoss.id)
            ? prev.bossDefeated
            : [...prev.bossDefeated, selectedBoss.id];

          // Daily quests
          const updatedQuests = prev.dailyQuests.map((q) => {
            if (q.id === 'quest_boss_hit') {
              return { ...q, current: Math.min(q.target, q.current + 50) };
            }
            return q;
          });

          return {
            ...prev,
            sigmaCoins: prev.sigmaCoins + selectedBoss.rewardCoins,
            aura: prev.aura + selectedBoss.rewardAura,
            xp: prev.xp + 80,
            bossDefeated: bossDefeatedList,
            stats: {
              ...prev.stats,
              bossDamageDealt: prev.stats.bossDamageDealt + selectedBoss.maxHp,
            },
            dailyQuests: updatedQuests,
          };
        });
      } else {
        // Next question
        setTimeout(() => {
          setDamageNumber(null);
          setCurrentQuestion(generateQuestion(selectedBoss.category));
        }, 500);
      }
    } else {
      // Wrong answer
      setCombo(0);
      SoundEngine.playWrong(profile.soundEnabled);
      setBossMessage('"Hahaha! Your math has NO RIZZ!"');
      // Time penalty: lose 3 seconds
      setTimeLeft((prev) => Math.max(1, prev - 3));
    }
  };

  // Boss Selection View
  if (battleState === 'selecting' || !selectedBoss) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8" id="boss-selection-screen">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-red-300 border border-white/20 text-xs font-black uppercase tracking-wider mb-2">
            <Swords className="w-4 h-4" /> Ohio Raid Arena
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Choose Your Boss Battle</h2>
          <p className="text-sm text-purple-200/80 mt-1">
            Solve rapid UK Year 3 maths to deal damage, defend your lunchbox, and earn massive Sigma Coins!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BOSS_ROSTER.map((boss) => {
            const isDefeated = profile.bossDefeated.includes(boss.id);
            const difficultyBadge = {
              easy: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
              medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
              hard: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
              extreme: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
            }[boss.difficulty];

            return (
              <div
                key={boss.id}
                id={`boss-card-${boss.id}`}
                className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 hover:border-white/40 p-6 transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl filter drop-shadow-md">{boss.icon}</span>
                      <div>
                        <h3 className="text-xl font-black text-white">{boss.name}</h3>
                        <p className="text-xs text-purple-200 font-semibold">{boss.title}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full border backdrop-blur-md ${difficultyBadge}`}>
                        {boss.difficulty}
                      </span>
                      {isDefeated && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
                          <Trophy className="w-3 h-3" /> Defeated
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs italic text-white/90 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 mb-4">
                    "{boss.phrase}"
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="flex items-center gap-1.5 text-white/90 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span>HP: {boss.maxHp}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/90 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      <span>{boss.timeLimit}s Timer</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-black text-yellow-300">
                      <Coins className="w-4 h-4 text-yellow-400" /> +{boss.rewardCoins}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-blue-300">
                      <Sparkles className="w-4 h-4 text-blue-400" /> +{boss.rewardAura}
                    </span>
                  </div>

                  <button
                    id={`btn-start-fight-${boss.id}`}
                    onClick={() => startFight(boss)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-black text-xs shadow-lg shadow-white/20 transition-all active:scale-95"
                  >
                    <Swords className="w-4 h-4" />
                    <span>Fight Boss</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Battle Arena View
  return (
    <div className="max-w-4xl mx-auto px-4 py-6" id="boss-arena">
      {/* Header with Exit button and Boss HP */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          id="btn-exit-boss"
          onClick={() => setBattleState('selecting')}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white text-xs font-bold border border-white/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Arena</span>
        </button>

        {/* Timer Bar */}
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-md">
          <Clock className={`w-5 h-5 ${timeLeft <= 10 ? 'text-rose-400 animate-spin' : 'text-cyan-400'}`} />
          <span className={`text-xl font-black ${timeLeft <= 10 ? 'text-rose-300 animate-pulse' : 'text-white'}`}>
            {timeLeft}s
          </span>
        </div>

        {/* Combo Counter */}
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-black backdrop-blur-xl">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{combo}× Combo {combo >= 3 ? '(CRIT!)' : ''}</span>
        </div>
      </div>

      {/* Boss Visual Stage */}
      <div className="relative bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 p-6 sm:p-8 shadow-2xl shadow-purple-950/40 mb-6 overflow-hidden text-white">
        {/* Boss HP Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-black text-purple-200 mb-1.5">
            <span className="flex items-center gap-1.5 text-red-300">
              <ShieldAlert className="w-4 h-4" /> {selectedBoss.name}
            </span>
            <span>{bossHp} / {selectedBoss.maxHp} HP</span>
          </div>
          <div className="w-full h-4 bg-black/40 rounded-full overflow-hidden border border-white/15 p-0.5 backdrop-blur-md">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 rounded-full transition-all duration-300 shadow-inner"
              style={{ width: `${Math.max(0, (bossHp / selectedBoss.maxHp) * 100)}%` }}
            />
          </div>
        </div>

        {/* Boss Character Visual & Speech */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          {/* Damage Float number */}
          {damageNumber && (
            <div className={`absolute top-0 font-black text-3xl sm:text-5xl animate-bounce z-20 ${
              damageNumber.isCrit ? 'text-yellow-300 drop-shadow-[0_4px_16px_rgba(250,204,21,0.9)]' : 'text-red-400'
            }`}>
              {damageNumber.isCrit ? `🔥 CRIT -${damageNumber.amount}!` : `-${damageNumber.amount}`}
            </div>
          )}

          {/* Boss Sprite */}
          <div className={`text-7xl sm:text-8xl select-none transition-transform duration-200 ${
            isBossHurt ? 'scale-90 rotate-12 filter brightness-150' : 'hover:scale-105'
          }`}>
            {selectedBoss.icon}
          </div>

          {/* Boss Dialogue Bubble */}
          <div className="mt-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-xs sm:text-sm font-bold text-white max-w-md text-center shadow-lg">
            {bossMessage}
          </div>
        </div>

        {/* Math Question Attack Panel */}
        {battleState === 'fighting' && currentQuestion && (
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <div className="text-xs font-bold text-red-300 mb-2 uppercase tracking-wider">
              ⚡ Cast Maths Strike to Attack!
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white mb-6">
              {currentQuestion.question}
            </div>

            {/* Attack Answer Choices */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {currentQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  id={`btn-boss-opt-${idx}`}
                  onClick={() => handleAttack(opt)}
                  className="py-4 sm:py-5 rounded-2xl bg-white/10 hover:bg-white/25 text-white font-black text-2xl sm:text-3xl border border-white/20 hover:border-white/40 backdrop-blur-xl transition-all active:scale-95 shadow-xl flex items-center justify-center gap-1 group"
                >
                  <Zap className="w-4 h-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{opt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {battleState === 'won' && (
          <div className="mt-6 pt-6 border-t border-emerald-400/40 text-center animate-fadeIn">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-300 mb-2 border border-emerald-400/30">
              <Trophy className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black text-emerald-300">BOSS DEFEATED!</h3>
            <p className="text-sm text-purple-200 mt-1">
              You showed pure UK Year 3 Mathematics Rizz!
            </p>

            <div className="flex justify-center gap-4 my-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 border border-white/20 text-yellow-300 font-black text-lg backdrop-blur-xl">
                <Coins className="w-6 h-6 text-yellow-400" />
                <span>+{selectedBoss.rewardCoins} Coins</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 border border-white/20 text-blue-200 font-black text-lg backdrop-blur-xl">
                <Sparkles className="w-6 h-6 text-blue-300" />
                <span>+{selectedBoss.rewardAura} Aura</span>
              </div>
            </div>

            <button
              id="btn-boss-victory-return"
              onClick={() => setBattleState('selecting')}
              className="px-6 py-3 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-black text-sm shadow-xl hover:scale-105 transition-transform"
            >
              Back to Boss Arena
            </button>
          </div>
        )}

        {/* Defeat / Time Up Screen */}
        {battleState === 'lost' && (
          <div className="mt-6 pt-6 border-t border-rose-400/40 text-center animate-fadeIn">
            <h3 className="text-2xl sm:text-3xl font-black text-rose-300">TIME RAN OUT!</h3>
            <p className="text-sm text-purple-200 mt-1">
              The Fanum Tax was too heavy this time. Lock in, sharpen your times tables, and try again!
            </p>
            <div className="flex justify-center gap-3 mt-6">
              <button
                id="btn-boss-retry"
                onClick={() => startFight(selectedBoss)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-black text-sm shadow-xl active:scale-95 transition-transform"
              >
                <RotateCcw className="w-4 h-4" /> Retry Fight
              </button>
              <button
                id="btn-boss-quit"
                onClick={() => setBattleState('selecting')}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm border border-white/20"
              >
                Choose Another Boss
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
