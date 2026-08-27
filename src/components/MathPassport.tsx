import React, { useState } from 'react';
import { UserProfile } from '../types';
import { UK_YEAR3_OBJECTIVES } from '../utils/mathEngine';
import { CharacterAvatar } from './CharacterAvatar';
import { 
  Award, 
  CheckCircle2, 
  Edit3, 
  Check, 
  BarChart3, 
  Trophy, 
  Zap, 
  BookOpen, 
  Flame,
  Printer
} from 'lucide-react';

interface MathPassportProps {
  profile: UserProfile;
  onUpdateProfile: (updater: (prev: UserProfile) => UserProfile) => void;
}

export const MathPassport: React.FC<MathPassportProps> = ({ profile, onUpdateProfile }) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(profile.name);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      onUpdateProfile((prev) => ({ ...prev, name: nameInput.trim() }));
      setIsEditingName(false);
    }
  };

  const accuracy = profile.stats.questionsAnswered > 0
    ? Math.round((profile.stats.questionsCorrect / profile.stats.questionsAnswered) * 100)
    : 100;

  const timesTablesList = [
    { num: 2, key: 'table_2', name: '2 Times Table' },
    { num: 3, key: 'table_3', name: '3 Times Table' },
    { num: 4, key: 'table_4', name: '4 Times Table' },
    { num: 5, key: 'table_5', name: '5 Times Table' },
    { num: 8, key: 'table_8', name: '8 Times Table' },
    { num: 10, key: 'table_10', name: '10 Times Table' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" id="math-passport-page">
      {/* Header Profile Card */}
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-2xl mb-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <CharacterAvatar
              characterId={profile.equipped.character}
              hatId={profile.equipped.hat}
              glassesId={profile.equipped.glasses}
              petId={profile.equipped.pet}
              size="lg"
              showPet={true}
            />

            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      id="input-player-name"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={18}
                      className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/30 rounded-xl text-white font-black text-lg focus:outline-none"
                    />
                    <button
                      id="btn-save-name"
                      onClick={handleSaveName}
                      className="p-1.5 bg-white text-indigo-950 rounded-xl hover:bg-white/90 shadow-md"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-white">{profile.name}</h2>
                    <button
                      id="btn-edit-name"
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-purple-200/80 hover:text-white"
                      title="Edit Name"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-cyan-300 font-bold mt-1">
                Official UK Key Stage 2 Mathematics Learning Record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-print-passport"
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/25 backdrop-blur-md shadow-sm"
            >
              <Printer className="w-4 h-4 text-cyan-300" />
              <span>Print Passport</span>
            </button>
          </div>
        </div>

        {/* Lifetime Stats Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-xs text-purple-200/80 block font-bold">Solved Correctly</span>
            <span className="text-xl font-black text-white">{profile.stats.questionsCorrect}</span>
          </div>
          <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-xs text-purple-200/80 block font-bold">Accuracy</span>
            <span className="text-xl font-black text-cyan-300">{accuracy}%</span>
          </div>
          <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-xs text-purple-200/80 block font-bold">Best Streak</span>
            <span className="text-xl font-black text-amber-300 flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" /> {profile.bestStreak}
            </span>
          </div>
          <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
            <span className="text-xs text-purple-200/80 block font-bold">Bosses Smashed</span>
            <span className="text-xl font-black text-purple-200 flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-300" /> {profile.bossDefeated.length} / 4
            </span>
          </div>
        </div>
      </div>

      {/* UK Year 3 Times Table Mastery Cards */}
      <div className="mb-8">
        <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-300" /> Year 3 Times Table Mastery
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {timesTablesList.map((tbl) => {
            const masteryVal = profile.mastery[tbl.key] || 0;
            const stars = masteryVal >= 90 ? 3 : masteryVal >= 50 ? 2 : masteryVal >= 20 ? 1 : 0;

            return (
              <div
                key={tbl.key}
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 hover:border-white/40 p-4 flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-black text-white">{tbl.name}</span>
                  <div className="flex text-xs">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} className={i < stars ? 'text-yellow-300' : 'text-white/20'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden my-2 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-300 rounded-full"
                    style={{ width: `${Math.min(100, masteryVal)}%` }}
                  />
                </div>

                <span className="text-[11px] text-purple-200/80 font-semibold">
                  {masteryVal >= 100 ? '✅ Mastered' : `${masteryVal}% Progress`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* UK National Curriculum Objectives Checklist */}
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 p-6 sm:p-8 shadow-xl text-white">
        <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-300" /> UK Key Stage 2 Curriculum Objectives
        </h3>

        <div className="space-y-3">
          {UK_YEAR3_OBJECTIVES.map((obj) => (
            <div
              key={obj.id}
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-black text-white">{obj.name}</h4>
                  <p className="text-xs text-purple-200/80 mt-0.5">{obj.description}</p>
                </div>
              </div>

              <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-white/15 text-cyan-300 border border-white/20 shrink-0">
                {obj.ukCode}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
