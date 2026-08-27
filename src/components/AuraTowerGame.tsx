import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, MathQuestion } from '../types';
import { generateQuestion } from '../utils/mathEngine';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  Flame, 
  Coins, 
  Sparkles, 
  Trophy, 
  ArrowUpCircle, 
  Clock, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';

interface AuraTowerGameProps {
  profile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
}

export const AuraTowerGame: React.FC<AuraTowerGameProps> = ({ profile, onUpdateProfile }) => {
  const [floor, setFloor] = useState<number>(1);
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion>(() => generateQuestion('mixed'));
  const [timeLeft, setTimeLeft] = useState<number>(12);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [totalCoinsWon, setTotalCoinsWon] = useState<number>(0);
  const [totalAuraWon, setTotalAuraWon] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTower = () => {
    setFloor(1);
    setTimeLeft(12);
    setIsPlaying(true);
    setGameOver(false);
    setTotalCoinsWon(0);
    setTotalAuraWon(0);
    setCurrentQuestion(generateQuestion('mixed'));
  };

  useEffect(() => {
    if (isPlaying && !gameOver && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isPlaying && !gameOver && timeLeft <= 0) {
      // Game Over due to timeout
      endTowerRun();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, gameOver, timeLeft]);

  const handleAnswer = (option: number) => {
    if (!isPlaying || gameOver) return;

    if (option === currentQuestion.correctAnswer) {
      const nextFloor = floor + 1;
      const floorCoins = Math.round(5 + floor * 2);
      const floorAura = Math.round(30 + floor * 10);

      SoundEngine.playCorrect(floor, profile.soundEnabled);
      SoundEngine.playCoin(profile.soundEnabled);

      setFloor(nextFloor);
      setTotalCoinsWon((prev) => prev + floorCoins);
      setTotalAuraWon((prev) => prev + floorAura);
      setTimeLeft(Math.max(6, 12 - Math.floor(nextFloor / 5))); // slight speedup

      if (nextFloor % 5 === 0) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      setCurrentQuestion(generateQuestion('mixed'));
    } else {
      SoundEngine.playWrong(profile.soundEnabled);
      endTowerRun();
    }
  };

  const endTowerRun = () => {
    setGameOver(true);
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    onUpdateProfile((prev) => ({
      ...prev,
      sigmaCoins: prev.sigmaCoins + totalCoinsWon,
      aura: prev.aura + totalAuraWon,
      stats: {
        ...prev.stats,
        highestTowerFloor: Math.max(prev.stats.highestTowerFloor, floor),
      }
    }));
  };

  if (!isPlaying && !gameOver) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center" id="tower-intro">
        <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-xl text-amber-300 mb-4 border border-white/20 shadow-xl">
          <Building2 className="w-12 h-12" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white">The Infinite Ohio Tower</h2>
        <p className="text-sm text-purple-200/80 mt-2 max-w-md mx-auto">
          Climb as high as you can! Each floor tests your multiplications, additions, and subtractions with a fast timer.
        </p>

        <div className="my-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 inline-block text-left shadow-lg">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-amber-400" />
            <div>
              <span className="text-xs text-purple-200 font-bold block">Your Best Record</span>
              <span className="text-xl font-black text-white">Floor {profile.stats.highestTowerFloor}</span>
            </div>
          </div>
        </div>

        <div>
          <button
            id="btn-start-tower"
            onClick={startTower}
            className="px-8 py-4 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-black text-lg shadow-xl shadow-white/20 hover:scale-105 transition-all"
          >
            🚀 Start Climbing Floor 1
          </button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl text-white" id="tower-gameover">
        <div className="text-5xl mb-3">💥</div>
        <h3 className="text-2xl font-black text-white">Run Finished!</h3>
        <p className="text-sm text-purple-200/80 mt-1">You reached</p>
        <div className="text-4xl font-black text-amber-300 my-3">Floor {floor}</div>

        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs text-purple-200 block font-bold">Coins Earned</span>
            <span className="text-xl font-black text-yellow-300 flex items-center justify-center gap-1">
              <Coins className="w-4 h-4 text-yellow-400" /> +{totalCoinsWon}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
            <span className="text-xs text-purple-200 block font-bold">Aura Earned</span>
            <span className="text-xl font-black text-blue-200 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-blue-300" /> +{totalAuraWon}
            </span>
          </div>
        </div>

        <button
          id="btn-tower-retry"
          onClick={startTower}
          className="w-full py-3.5 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <RotateCcw className="w-4 h-4" /> Climb Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6" id="tower-climbing">
      {/* Top HUD */}
      <div className="flex items-center justify-between mb-6 bg-white/10 backdrop-blur-2xl p-4 rounded-2xl border border-white/20 shadow-xl">
        <div className="flex items-center gap-3">
          <CharacterAvatar
            characterId={profile.equipped.character}
            hatId={profile.equipped.hat}
            glassesId={profile.equipped.glasses}
            petId={profile.equipped.pet}
            size="sm"
          />
          <div>
            <span className="text-xs text-amber-300 font-black uppercase">Aura Tower</span>
            <h4 className="text-xl font-black text-white">Floor {floor}</h4>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-md">
          <Clock className={`w-4 h-4 ${timeLeft <= 3 ? 'text-rose-400 animate-spin' : 'text-cyan-400'}`} />
          <span className={`font-mono text-base font-black ${timeLeft <= 3 ? 'text-rose-300' : 'text-white'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 p-6 sm:p-8 text-center shadow-2xl shadow-purple-950/40 mb-6 text-white">
        <div className="text-xs font-bold text-purple-200 uppercase mb-3">
          {currentQuestion.promptText}
        </div>

        <div className="text-3xl sm:text-4xl font-black text-white py-4">
          {currentQuestion.question}
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              id={`btn-tower-opt-${idx}`}
              onClick={() => handleAnswer(opt)}
              className="py-4 rounded-2xl bg-white/10 hover:bg-white/25 text-white font-black text-2xl border border-white/20 hover:border-white/40 backdrop-blur-xl transition-all active:scale-95 shadow-xl"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
