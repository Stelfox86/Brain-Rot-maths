import React, { useState, useEffect, useCallback } from 'react';
import { MathCategory, MathQuestion, TimesTableNumber, UserProfile } from '../types';
import { generateQuestion } from '../utils/mathEngine';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  HelpCircle, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Coins, 
  Delete,
  CornerDownLeft,
  BookOpen
} from 'lucide-react';

interface ArcadeGameProps {
  profile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
}

export const ArcadeGame: React.FC<ArcadeGameProps> = ({ profile, onUpdateProfile }) => {
  const [category, setCategory] = useState<MathCategory>('multiplication');
  const [selectedTable, setSelectedTable] = useState<TimesTableNumber>('all-yr3');
  const [currentQuestion, setCurrentQuestion] = useState<MathQuestion>(() =>
    generateQuestion('multiplication', 'all-yr3')
  );
  const [inputMode, setInputMode] = useState<'mcq' | 'keypad'>('mcq');
  const [typedInput, setTypedInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong' | null;
    message: string;
    coinsEarned: number;
    auraEarned: number;
  }>({ status: null, message: '', coinsEarned: 0, auraEarned: 0 });
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);

  // Load a new question when category or table changes
  const nextQuestion = useCallback(() => {
    const q = generateQuestion(category, selectedTable);
    setCurrentQuestion(q);
    setFeedback({ status: null, message: '', coinsEarned: 0, auraEarned: 0 });
    setShowHint(false);
    setTypedInput('');
    setIsAnswering(false);
  }, [category, selectedTable]);

  useEffect(() => {
    nextQuestion();
  }, [nextQuestion]);

  // Handle user answer evaluation
  const handleAnswer = (chosenAnswer: number) => {
    if (isAnswering) return;
    setIsAnswering(true);

    const isCorrect = chosenAnswer === currentQuestion.correctAnswer;

    if (isCorrect) {
      const newStreak = profile.streak + 1;
      const streakMultiplier = Math.min(1 + Math.floor(newStreak / 3) * 0.5, 3);
      const earnedCoins = Math.round(5 * streakMultiplier);
      const earnedAura = Math.round(50 * streakMultiplier);

      SoundEngine.playCorrect(newStreak, profile.soundEnabled);
      SoundEngine.playCoin(profile.soundEnabled);

      if (newStreak % 5 === 0) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setFeedback({
        status: 'correct',
        message: currentQuestion.brainrotLore || 'Sigma Accuracy! +1000 Aura!',
        coinsEarned: earnedCoins,
        auraEarned: earnedAura,
      });

      // Update state in profile
      onUpdateProfile((prev) => {
        const nextXp = prev.xp + 25;
        let newLevel = prev.level;
        let newMaxXp = prev.maxXp;
        let finalXp = nextXp;

        if (nextXp >= prev.maxXp) {
          newLevel += 1;
          finalXp = nextXp - prev.maxXp;
          newMaxXp = Math.round(prev.maxXp * 1.3);
          SoundEngine.playLevelUp(prev.soundEnabled);
        }

        // Update daily quests
        const updatedQuests = prev.dailyQuests.map((q) => {
          let addCount = 0;
          if (q.id === 'quest_mult_10' && currentQuestion.category === 'multiplication') addCount = 1;
          if (q.id === 'quest_add_sub_8' && (currentQuestion.category === 'addition' || currentQuestion.category === 'subtraction')) addCount = 1;
          if (q.id === 'quest_streak_5' && newStreak >= 5) addCount = 5;
          return {
            ...q,
            current: Math.min(q.target, q.current + addCount),
          };
        });

        // Update mastery
        const updatedMastery = { ...prev.mastery };
        if (currentQuestion.category === 'multiplication' && typeof selectedTable === 'number') {
          const key = `table_${selectedTable}`;
          updatedMastery[key] = Math.min(100, (updatedMastery[key] || 0) + 5);
        }

        return {
          ...prev,
          level: newLevel,
          xp: finalXp,
          maxXp: newMaxXp,
          aura: prev.aura + earnedAura,
          sigmaCoins: prev.sigmaCoins + earnedCoins,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          stats: {
            ...prev.stats,
            questionsAnswered: prev.stats.questionsAnswered + 1,
            questionsCorrect: prev.stats.questionsCorrect + 1,
            multiplicationCorrect: prev.stats.multiplicationCorrect + (currentQuestion.category === 'multiplication' ? 1 : 0),
            additionCorrect: prev.stats.additionCorrect + (currentQuestion.category === 'addition' ? 1 : 0),
            subtractionCorrect: prev.stats.subtractionCorrect + (currentQuestion.category === 'subtraction' ? 1 : 0),
          },
          mastery: updatedMastery,
          dailyQuests: updatedQuests,
        };
      });

      // Auto advance after short pause
      setTimeout(() => {
        nextQuestion();
      }, 1400);
    } else {
      SoundEngine.playWrong(profile.soundEnabled);
      setFeedback({
        status: 'wrong',
        message: `Womp womp! Correct answer was ${currentQuestion.correctAnswer}. Check the explanation below!`,
        coinsEarned: 0,
        auraEarned: -20,
      });

      onUpdateProfile((prev) => ({
        ...prev,
        aura: Math.max(0, prev.aura - 20),
        streak: 0,
        stats: {
          ...prev.stats,
          questionsAnswered: prev.stats.questionsAnswered + 1,
        },
      }));
    }
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'clear') {
      setTypedInput('');
    } else if (val === 'backspace') {
      setTypedInput((prev) => prev.slice(0, -1));
    } else if (val === 'enter') {
      if (typedInput.trim()) {
        handleAnswer(parseInt(typedInput, 10));
      }
    } else {
      if (typedInput.length < 5) {
        setTypedInput((prev) => prev + val);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6" id="arcade-game-container">
      {/* Category Selection Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6" id="category-selector">
        <button
          id="btn-cat-mult"
          onClick={() => setCategory('multiplication')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all ${
            category === 'multiplication'
              ? 'bg-white text-indigo-950 shadow-[0_4px_20px_rgba(255,255,255,0.3)] ring-2 ring-white/60 scale-105'
              : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
          }`}
        >
          <span>✖️</span>
          <span>Multiplications</span>
        </button>

        <button
          id="btn-cat-add"
          onClick={() => setCategory('addition')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all ${
            category === 'addition'
              ? 'bg-white text-indigo-950 shadow-[0_4px_20px_rgba(255,255,255,0.3)] ring-2 ring-white/60 scale-105'
              : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
          }`}
        >
          <span>➕</span>
          <span>Additions</span>
        </button>

        <button
          id="btn-cat-sub"
          onClick={() => setCategory('subtraction')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all ${
            category === 'subtraction'
              ? 'bg-white text-indigo-950 shadow-[0_4px_20px_rgba(255,255,255,0.3)] ring-2 ring-white/60 scale-105'
              : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
          }`}
        >
          <span>➖</span>
          <span>Subtractions</span>
        </button>

        <button
          id="btn-cat-word"
          onClick={() => setCategory('word-problems')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all ${
            category === 'word-problems'
              ? 'bg-white text-indigo-950 shadow-[0_4px_20px_rgba(255,255,255,0.3)] ring-2 ring-white/60 scale-105'
              : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
          }`}
        >
          <span>💷</span>
          <span>UK Word Problems</span>
        </button>

        <button
          id="btn-cat-mixed"
          onClick={() => setCategory('mixed')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all ${
            category === 'mixed'
              ? 'bg-white text-indigo-950 shadow-[0_4px_20px_rgba(255,255,255,0.3)] ring-2 ring-white/60 scale-105'
              : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20 hover:text-white border border-white/15'
          }`}
        >
          <span>⚡</span>
          <span>Mixed Brainrot</span>
        </button>
      </div>

      {/* Specific Times Table Filter (If Multiplication selected) */}
      {category === 'multiplication' && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-6 bg-white/10 backdrop-blur-xl p-3.5 rounded-3xl border border-white/20 shadow-lg">
          <span className="text-xs font-bold text-purple-200 mr-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-purple-300" /> Year 3 Tables:
          </span>
          {([2, 3, 4, 5, 8, 10, 'all-yr3'] as TimesTableNumber[]).map((tab) => (
            <button
              key={tab.toString()}
              id={`btn-table-${tab}`}
              onClick={() => setSelectedTable(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                selectedTable === tab
                  ? 'bg-white text-indigo-950 shadow-md ring-2 ring-white/60 scale-105'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/10'
              }`}
            >
              {tab === 'all-yr3' ? '🌟 All Year 3' : `${tab}×`}
            </button>
          ))}
        </div>
      )}

      {/* Main Question Card */}
      <div className="relative bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 p-6 sm:p-8 shadow-2xl shadow-purple-950/40 mb-6 text-white">
        {/* Top Card Bar */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-purple-200 border border-white/20">
              {currentQuestion.promptText}
            </span>
            <span className="hidden sm:inline-block text-[11px] text-purple-200/70 font-medium truncate max-w-[280px]">
              {currentQuestion.year3Objective}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Input Mode Toggle */}
            <div className="flex items-center bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/15">
              <button
                id="btn-mode-mcq"
                onClick={() => setInputMode('mcq')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  inputMode === 'mcq' ? 'bg-white text-indigo-950 shadow-sm font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Cards
              </button>
              <button
                id="btn-mode-keypad"
                onClick={() => setInputMode('keypad')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  inputMode === 'keypad' ? 'bg-white text-indigo-950 shadow-sm font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Keypad
              </button>
            </div>

            {/* Skip / Next */}
            <button
              id="btn-skip-question"
              onClick={nextQuestion}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 hover:text-white transition-all"
              title="Skip to next question"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Text Display */}
        <div className="text-center py-6 sm:py-8">
          <div className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md leading-tight">
            {currentQuestion.question}
          </div>

          {/* Hint Toggle Button */}
          <div className="mt-4 flex justify-center">
            <button
              id="btn-toggle-hint"
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-yellow-300 text-xs font-bold border border-yellow-400/30 transition-all shadow-sm"
            >
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span>{showHint ? 'Hide Visual Hint' : 'Need a Hint / Working Out?'}</span>
            </button>
          </div>

          {/* Visual Aid / Hint Box */}
          {showHint && (
            <div className="mt-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-yellow-400/30 text-left animate-fadeIn">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-100">{currentQuestion.hint}</p>
                  
                  {/* Array visualizer for times tables */}
                  {currentQuestion.visualAid?.type === 'array' && (
                    <div className="mt-3 p-3 bg-black/30 backdrop-blur-md rounded-xl border border-white/10">
                      <div className="text-xs text-purple-200 mb-2 font-bold">
                        Array Model: {currentQuestion.visualAid.num1} rows of {currentQuestion.visualAid.num2}
                      </div>
                      <div className="flex flex-col gap-1.5 max-w-xs overflow-x-auto">
                        {Array.from({ length: Math.min(currentQuestion.visualAid.num1, 10) }).map((_, r) => (
                          <div key={r} className="flex gap-1.5">
                            {Array.from({ length: Math.min(currentQuestion.visualAid.num2, 10) }).map((_, c) => (
                              <span key={c} className="w-4 h-4 rounded-full bg-purple-300 flex items-center justify-center text-[10px] text-slate-950 font-bold shadow-sm">
                                •
                              </span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Answer Section: Multiple Choice Mode */}
        {inputMode === 'mcq' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-2" id="mcq-options-grid">
            {currentQuestion.options.map((option, idx) => {
              let btnColor = 'bg-white/10 hover:bg-white/25 text-white border-white/20 hover:border-white/40 shadow-lg';
              if (feedback.status) {
                if (option === currentQuestion.correctAnswer) {
                  btnColor = 'bg-emerald-500 text-white border-white ring-4 ring-emerald-400/50 animate-bounce';
                } else if (feedback.status === 'wrong') {
                  btnColor = 'bg-white/5 text-white/30 border-white/10 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  id={`btn-option-${idx}`}
                  disabled={isAnswering}
                  onClick={() => handleAnswer(option)}
                  className={`py-4 sm:py-6 px-3 rounded-2xl border backdrop-blur-xl font-black text-2xl sm:text-3xl shadow-xl transition-all active:scale-95 flex items-center justify-center ${btnColor}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        )}

        {/* Answer Section: Virtual Keypad Mode */}
        {inputMode === 'keypad' && (
          <div className="max-w-xs mx-auto mt-2" id="keypad-container">
            {/* Display Input Box */}
            <div className="mb-3 p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/25 text-center font-mono text-3xl font-black text-white h-16 flex items-center justify-center tracking-widest shadow-inner">
              {typedInput || <span className="text-white/30">?</span>}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'enter'].map((key) => {
                if (key === 'clear') {
                  return (
                    <button
                      key={key}
                      id="btn-keypad-clear"
                      onClick={() => handleKeypadPress('clear')}
                      className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-200 font-black text-xs flex items-center justify-center transition-all"
                    >
                      CLEAR
                    </button>
                  );
                }
                if (key === 'enter') {
                  return (
                    <button
                      key={key}
                      id="btn-keypad-enter"
                      onClick={() => handleKeypadPress('enter')}
                      className="p-3 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-black text-sm flex items-center justify-center shadow-lg shadow-white/20 active:scale-95 transition-all"
                    >
                      <CornerDownLeft className="w-5 h-5" />
                    </button>
                  );
                }
                return (
                  <button
                    key={key}
                    id={`btn-keypad-${key}`}
                    onClick={() => handleKeypadPress(key)}
                    className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/25 border border-white/20 text-white font-black text-xl active:scale-95 transition-all backdrop-blur-md"
                  >
                    {key}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback Banner */}
        {feedback.status && (
          <div
            className={`mt-6 p-4 rounded-2xl border backdrop-blur-2xl flex items-center justify-between animate-fadeIn shadow-2xl ${
              feedback.status === 'correct'
                ? 'bg-white/15 border-emerald-400/40 text-emerald-100'
                : 'bg-white/15 border-rose-400/40 text-rose-100'
            }`}
          >
            <div className="flex items-center gap-3">
              {feedback.status === 'correct' ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-300 shrink-0" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-300 shrink-0" />
              )}
              <div>
                <p className="font-extrabold text-base">{feedback.message}</p>
                {feedback.status === 'wrong' && (
                  <p className="text-xs text-white/80 mt-1">{currentQuestion.explanation}</p>
                )}
              </div>
            </div>

            {feedback.status === 'correct' && (
              <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 text-yellow-300 text-sm font-black px-2.5 py-1 bg-white/15 rounded-xl border border-white/20">
                  <Coins className="w-4 h-4 text-yellow-400" /> +{feedback.coinsEarned}
                </span>
                <span className="flex items-center gap-1 text-blue-200 text-sm font-black px-2.5 py-1 bg-white/15 rounded-xl border border-white/20">
                  <Sparkles className="w-4 h-4 text-blue-300" /> +{feedback.auraEarned}
                </span>
              </div>
            )}

            {feedback.status === 'wrong' && (
              <button
                id="btn-retry-next"
                onClick={nextQuestion}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-white/90 text-indigo-950 font-black text-xs shrink-0 shadow-lg"
              >
                Next ➔
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Tip / Streak Info */}
      <div className="flex flex-wrap items-center justify-between text-xs text-purple-200/80 px-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Keep your streak alive to earn up to 3× Sigma Coins & Aura multiplier!</span>
        </div>
        <div className="text-purple-200 font-semibold">
          Aligned with UK Key Stage 2 Year 3 Mathematics
        </div>
      </div>
    </div>
  );
};
