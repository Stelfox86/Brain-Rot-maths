import React, { useState, useEffect, useRef } from 'react';
import { UkMathTest, UK_YEAR3_TESTS } from '../utils/testsData';
import { MathQuestion, UserProfile } from '../types';
import { generateQuestion } from '../utils/mathEngine';
import { SoundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  ArrowLeft, 
  Coins, 
  Sparkles, 
  Printer, 
  Award,
  BookOpen
} from 'lucide-react';
import { CharacterAvatar } from './CharacterAvatar';

interface TestRunnerProps {
  profile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
}

interface AnswerRecord {
  question: MathQuestion;
  userAnswer: number;
  isCorrect: boolean;
}

export const TestRunner: React.FC<TestRunnerProps> = ({ profile, onUpdateProfile }) => {
  const [selectedTest, setSelectedTest] = useState<UkMathTest | null>(null);
  const [testQuestions, setTestQuestions] = useState<MathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [testState, setTestState] = useState<'selecting' | 'taking' | 'completed'>('selecting');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Start Test
  const startTest = (test: UkMathTest) => {
    setSelectedTest(test);
    const questions: MathQuestion[] = [];
    for (let i = 0; i < test.questionCount; i++) {
      questions.push(generateQuestion(test.category, test.timesTableFocus));
    }
    setTestQuestions(questions);
    setCurrentIndex(0);
    setAnswers([]);
    setTimeLeft(test.timeLimitSeconds);
    setTestState('taking');
  };

  // Countdown timer
  useEffect(() => {
    if (testState === 'taking' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (testState === 'taking' && timeLeft <= 0) {
      finishTest(answers);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [testState, timeLeft]);

  // Handle answering an item
  const handleSelectAnswer = (option: number) => {
    if (testState !== 'taking') return;
    const currentQ = testQuestions[currentIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      SoundEngine.playCorrect(1, profile.soundEnabled);
    } else {
      SoundEngine.playWrong(profile.soundEnabled);
    }

    const updatedAnswers = [...answers, { question: currentQ, userAnswer: option, isCorrect }];
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < testQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishTest(updatedAnswers);
    }
  };

  // Complete Test & Score
  const finishTest = (finalAnswers: AnswerRecord[]) => {
    setTestState('completed');
    if (timerRef.current) clearTimeout(timerRef.current);

    const correctCount = finalAnswers.filter((a) => a.isCorrect).length;
    const totalCount = selectedTest?.questionCount || finalAnswers.length;
    const percentage = Math.round((correctCount / totalCount) * 100);

    if (percentage >= 70) {
      SoundEngine.playLevelUp(profile.soundEnabled);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    if (selectedTest) {
      const earnedCoins = Math.round(selectedTest.rewardCoins * (percentage / 100));
      const earnedAura = Math.round(selectedTest.rewardAura * (percentage / 100));

      onUpdateProfile((prev) => ({
        ...prev,
        sigmaCoins: prev.sigmaCoins + earnedCoins,
        aura: prev.aura + earnedAura,
        xp: prev.xp + Math.round(percentage * 0.8),
        completedTests: [
          ...prev.completedTests,
          {
            id: selectedTest.id,
            title: selectedTest.title,
            score: correctCount,
            total: totalCount,
            date: new Date().toLocaleDateString('en-GB'),
            percentage,
            badge: selectedTest.badge,
          }
        ]
      }));
    }
  };

  // Test Selection Screen
  if (testState === 'selecting' || !selectedTest) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8" id="tests-selection-screen">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-cyan-300 border border-white/20 text-xs font-black uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4" /> UK Key Stage 2 Checkpoints
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Year 3 Maths Assessments</h2>
          <p className="text-sm text-purple-200/80 mt-1">
            Standard UK National Curriculum tests with certificates, scores, and massive rewards!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {UK_YEAR3_TESTS.map((test) => {
            const previousAttempts = profile.completedTests.filter((t) => t.id === test.id);
            const bestAttempt = previousAttempts.length
              ? Math.max(...previousAttempts.map((t) => t.percentage))
              : null;

            return (
              <div
                key={test.id}
                id={`test-card-${test.id}`}
                className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 hover:border-white/40 p-6 shadow-xl flex flex-col justify-between transition-all hover:scale-[1.02]"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-xl font-black text-white">{test.title}</h3>
                      <p className="text-xs text-purple-200 font-bold mt-0.5">{test.subtitle}</p>
                    </div>
                    {bestAttempt !== null && (
                      <span className={`text-xs font-black px-2.5 py-1 rounded-full border backdrop-blur-md ${
                        bestAttempt >= 80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      }`}>
                        Best: {bestAttempt}%
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-white/80 mb-4">{test.description}</p>

                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-[11px] text-purple-200/90 mb-4 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-300 shrink-0" />
                    <span>{test.ukStandard}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                    <div className="flex items-center gap-1.5 text-white/90 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                      <GraduationCap className="w-4 h-4 text-cyan-300" />
                      <span>{test.questionCount} Questions</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/90 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span>{Math.floor(test.timeLimitSeconds / 60)} Mins</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs font-black text-yellow-300">
                      <Coins className="w-4 h-4 text-yellow-400" /> Up to +{test.rewardCoins}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-black text-blue-300">
                      <Sparkles className="w-4 h-4 text-blue-400" /> Up to +{test.rewardAura}
                    </span>
                  </div>

                  <button
                    id={`btn-start-test-${test.id}`}
                    onClick={() => startTest(test)}
                    className="px-4 py-2 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-black text-xs shadow-lg shadow-white/20 transition-all active:scale-95"
                  >
                    Start Test
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Taking Test View
  if (testState === 'taking') {
    const currentQ = testQuestions[currentIndex];
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
      <div className="max-w-3xl mx-auto px-4 py-8" id="taking-test-view">
        {/* Test Header */}
        <div className="flex items-center justify-between gap-3 mb-6 bg-white/10 backdrop-blur-2xl p-4 rounded-2xl border border-white/20 shadow-xl">
          <div>
            <h3 className="text-lg font-black text-white">{selectedTest.title}</h3>
            <p className="text-xs text-purple-200/80">
              Question {currentIndex + 1} of {testQuestions.length}
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-md">
            <Clock className={`w-4 h-4 ${timeLeft < 30 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
            <span className={`font-mono text-sm font-black ${timeLeft < 30 ? 'text-rose-300' : 'text-white'}`}>
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 bg-black/40 backdrop-blur-md rounded-full overflow-hidden mb-6 border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-300 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / testQuestions.length) * 100}%` }}
          />
        </div>

        {/* Main Question Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-[32px] border border-white/20 p-6 sm:p-10 shadow-2xl shadow-purple-950/40 mb-6 text-center text-white">
          <div className="text-xs font-bold text-purple-200 uppercase tracking-widest mb-4">
            {currentQ.promptText}
          </div>

          <div className="text-3xl sm:text-5xl font-black text-white py-6">
            {currentQ.question}
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                id={`btn-test-opt-${idx}`}
                onClick={() => handleSelectAnswer(opt)}
                className="py-5 rounded-2xl bg-white/10 hover:bg-white/25 text-white font-black text-2xl sm:text-3xl border border-white/20 hover:border-white/40 backdrop-blur-xl transition-all active:scale-95 shadow-xl"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Test Completed Screen & Certificate
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const totalCount = testQuestions.length;
  const percentage = Math.round((correctCount / totalCount) * 100);

  let gradeText = 'Ohio Trainee 🌱';
  let gradeColor = 'text-amber-300';
  if (percentage >= 90) {
    gradeText = 'Level 100 Sigma God 👑 (Greater Depth)';
    gradeColor = 'text-yellow-300';
  } else if (percentage >= 75) {
    gradeText = 'Skibidi Gold Scholar 🥇 (Expected Standard+)';
    gradeColor = 'text-emerald-300';
  } else if (percentage >= 50) {
    gradeText = 'Bronze Rizzler 🥉 (Working Towards)';
    gradeColor = 'text-cyan-300';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" id="test-results-screen">
      {/* Printable Certificate Area */}
      <div 
        id="uk-maths-certificate"
        className="relative bg-white/10 backdrop-blur-2xl border-2 border-white/30 rounded-3xl p-6 sm:p-10 shadow-2xl text-center mb-8 overflow-hidden text-white"
      >
        {/* Certificate Watermark / Header */}
        <div className="flex items-center justify-center gap-2 mb-2 text-yellow-300 font-extrabold text-xs uppercase tracking-widest">
          <Award className="w-5 h-5" /> Official UK Key Stage 2 Certificate of Achievement
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-white mb-1">
          {selectedTest.title}
        </h2>
        <p className="text-xs text-purple-200/80 mb-6">{selectedTest.ukStandard}</p>

        {/* Avatar & Player Name */}
        <div className="flex flex-col items-center justify-center mb-6">
          <CharacterAvatar
            characterId={profile.equipped.character}
            hatId={profile.equipped.hat}
            glassesId={profile.equipped.glasses}
            petId={profile.equipped.pet}
            size="lg"
            showPet={true}
          />
          <h3 className="text-2xl font-black text-white mt-3">{profile.name}</h3>
          <p className={`text-lg font-black mt-1 ${gradeColor}`}>{gradeText}</p>
        </div>

        {/* Score Circles */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl">
            <span className="block text-3xl font-black text-white">{correctCount} / {totalCount}</span>
            <span className="text-xs font-semibold text-purple-200">Score</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl">
            <span className="block text-3xl font-black text-cyan-300">{percentage}%</span>
            <span className="text-xs font-semibold text-purple-200">Accuracy</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          <button
            id="btn-print-certificate"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/25 backdrop-blur-md shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Certificate</span>
          </button>

          <button
            id="btn-retake-test"
            onClick={() => startTest(selectedTest)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-white/90 text-indigo-950 font-black text-xs shadow-lg shadow-white/20"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Test</span>
          </button>

          <button
            id="btn-back-to-tests"
            onClick={() => setTestState('selecting')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Tests</span>
          </button>
        </div>
      </div>

      {/* Question by Question Review */}
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 text-white shadow-xl">
        <h4 className="text-lg font-black text-white mb-4">Question Review & Explanations</h4>
        <div className="space-y-3">
          {answers.map((rec, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border backdrop-blur-md flex items-start justify-between gap-3 ${
                rec.isCorrect ? 'bg-white/10 border-emerald-400/40 text-emerald-200' : 'bg-white/10 border-rose-400/40 text-rose-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {rec.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-extrabold text-sm text-white">{rec.question.question}</p>
                  <p className="text-xs text-white/80 mt-1">{rec.question.explanation}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-xs font-black px-2.5 py-1 rounded-xl ${
                  rec.isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                }`}>
                  Your answer: {rec.userAnswer}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
