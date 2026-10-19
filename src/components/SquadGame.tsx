import React, { useState, useEffect, useRef } from 'react';
import { SquadTeam, TournamentMatch, Question, PlayerAnswerRecord } from '../types/game';
import { QUESTION_BANK } from '../data/questions';
import { TugOfWarCanvas } from './TugOfWarCanvas';
import { sound } from '../services/audio';
import {
  Trophy,
  Users,
  ShieldCheck,
  Play,
  ArrowRight,
  Home,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  Zap,
  UserCheck,
  Medal,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SquadGameProps {
  onBackToMenu: () => void;
  onFinishTournament: (
    championTeam: SquadTeam,
    runnerUpTeam: SquadTeam,
    thirdPlaceTeam?: SquadTeam,
    allTeams?: SquadTeam[],
    records?: PlayerAnswerRecord[]
  ) => void;
}

const DEFAULT_NAMES_POOL = [
  ['Budi', 'Siti', 'Edo', 'Maya', 'Rian'],
  ['Andi', 'Dewi', 'Fajar', 'Tari', 'Gani'],
  ['Doni', 'Ayu', 'Rizky', 'Putri', 'Bagas'],
  ['Hadi', 'Lani', 'Dimas', 'Zahra', 'Kevin'],
  ['Nisa', 'Toni', 'Vina', 'Galih', 'Indah'],
];

export const SquadGame: React.FC<SquadGameProps> = ({ onBackToMenu, onFinishTournament }) => {
  // Phase: 'SETUP' | 'BRACKET' | 'MATCH' | 'MATCH_SUMMARY' | 'TOURNAMENT_OVER'
  const [phase, setPhase] = useState<'SETUP' | 'BRACKET' | 'MATCH' | 'MATCH_SUMMARY' | 'TOURNAMENT_OVER'>('SETUP');

  // Setup options
  const [teamCount, setTeamCount] = useState<number>(4);
  const [membersPerTeam, setMembersPerTeam] = useState<number>(3); // 3, 4, or 5
  const [isAudioMuted, setIsAudioMuted] = useState(!sound.bgmEnabled);

  // Initial teams builder
  const buildInitialTeams = (mCount: number): SquadTeam[] => {
    const teamColors = ['#2563EB', '#DC2626', '#16A34A', '#D97706', '#7C3AED'];
    const teamNames = ['Tim Garuda', 'Tim Harimau', 'Tim Rajawali', 'Tim Badak', 'Tim Elang'];

    return Array.from({ length: 5 }, (_, tIdx) => ({
      id: `team-${tIdx + 1}`,
      name: teamNames[tIdx],
      color: teamColors[tIdx],
      members: Array.from({ length: mCount }, (_, mIdx) => ({
        id: `t${tIdx + 1}-m${mIdx + 1}`,
        name: DEFAULT_NAMES_POOL[tIdx][mIdx] || `Anggota ${mIdx + 1}`,
      })),
      currentMemberIndex: 0,
      matchScore: 0,
      totalTournamentPoints: 0,
    }));
  };

  const [teams, setTeams] = useState<SquadTeam[]>(() => buildInitialTeams(3));

  // Change members count (3, 4, or 5)
  const handleMembersCountChange = (count: number) => {
    sound.playClick();
    setMembersPerTeam(count);
    setTeams(prev =>
      prev.map((t, tIdx) => ({
        ...t,
        members: Array.from({ length: count }, (_, mIdx) => ({
          id: `t${tIdx + 1}-m${mIdx + 1}`,
          name: t.members[mIdx]?.name || DEFAULT_NAMES_POOL[tIdx][mIdx] || `Anggota ${mIdx + 1}`,
        })),
      }))
    );
  };

  // Tournament Matches
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  // Active Match: Independent parallel state for each team
  const [questionsA, setQuestionsA] = useState<Question[]>([]);
  const [questionsB, setQuestionsB] = useState<Question[]>([]);
  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(0);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [pullCountA, setPullCountA] = useState(0);
  const [pullCountB, setPullCountB] = useState(0);
  const [isFinishedA, setIsFinishedA] = useState(false);
  const [isFinishedB, setIsFinishedB] = useState(false);
  const [matchTimeLeft, setMatchTimeLeft] = useState(240);

  // Micro-feedback state per team (so they can see quick confirmation without waiting for the other team)
  const [feedbackA, setFeedbackA] = useState<{
    selected: number;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  const [feedbackB, setFeedbackB] = useState<{
    selected: number;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  // Match Summary State
  const [lastCompletedMatch, setLastCompletedMatch] = useState<{
    match: TournamentMatch;
    teamA: SquadTeam;
    teamB: SquadTeam;
    scoreA: number;
    scoreB: number;
    winner: 'A' | 'B' | 'DRAW';
  } | null>(null);

  const answerRecordsRef = useRef<PlayerAnswerRecord[]>([]);

  // Start BGM on user interaction & sync audio state
  useEffect(() => {
    if (sound.bgmEnabled) {
      sound.startBGM();
    }
    return sound.subscribe(state => {
      setIsAudioMuted(!state.bgmEnabled);
    });
  }, []);

  const toggleSound = () => {
    sound.playClick();
    sound.cycleVolumePreset();
  };

  // ==========================================
  // GENERATE TOURNAMENT BRACKET
  // ==========================================
  const handleGenerateBracket = () => {
    sound.playClick();
    if (sound.bgmEnabled) sound.startBGM();

    const activeTeams = teams.slice(0, teamCount);
    const newMatches: TournamentMatch[] = [];

    if (teamCount === 2) {
      // 2 Teams: Direct Final
      newMatches.push({
        id: 'm-final',
        title: 'Babak Final Juara',
        teamAId: activeTeams[0].id,
        teamBId: activeTeams[1].id,
        isCompleted: false,
        isCurrent: true,
        stage: 'final',
        questionCount: 10,
        durationSeconds: 600, // 10 menit
      });
    } else if (teamCount === 3) {
      // 3 Teams: Round robin penyisihan (5 soal, 4 menit), Top 2 melaju ke Final (10 soal, 10 menit)
      newMatches.push({
        id: 'm-p1',
        title: 'Babak Penyisihan 1',
        teamAId: activeTeams[0].id,
        teamBId: activeTeams[1].id,
        isCompleted: false,
        isCurrent: true,
        stage: 'penyisihan',
        questionCount: 5,
        durationSeconds: 240, // 4 menit
      });
      newMatches.push({
        id: 'm-p2',
        title: 'Babak Penyisihan 2',
        teamAId: activeTeams[1].id,
        teamBId: activeTeams[2].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'penyisihan',
        questionCount: 5,
        durationSeconds: 240,
      });
      newMatches.push({
        id: 'm-p3',
        title: 'Babak Penyisihan 3',
        teamAId: activeTeams[0].id,
        teamBId: activeTeams[2].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'penyisihan',
        questionCount: 5,
        durationSeconds: 240,
      });
      newMatches.push({
        id: 'm-final',
        title: 'Babak Final (Top 2 Tim)',
        teamAId: activeTeams[0].id,
        teamBId: activeTeams[1].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'final',
        questionCount: 10,
        durationSeconds: 600, // 10 menit
      });
    } else if (teamCount === 4) {
      // Exactly as user specified:
      // - Penyisihan dilakukan 2x (Penyisihan 1: Tim 1 vs Tim 2, Penyisihan 2: Tim 3 vs Tim 4) - 5 soal (3 PG, 2 B/S), durasi 4 menit
      // - Babak Perebutan Juara 3: 2 tim dengan poin terendah (10 soal: 5 PG, 5 B/S, durasi 10 menit)
      // - Babak Final: 2 tim dengan poin tertinggi (10 soal: 5 PG, 5 B/S, durasi 10 menit)
      newMatches.push({
        id: 'm-penyisihan-1',
        title: 'Babak Penyisihan 1',
        teamAId: activeTeams[0].id,
        teamBId: activeTeams[1].id,
        isCompleted: false,
        isCurrent: true,
        stage: 'penyisihan',
        questionCount: 5,
        durationSeconds: 240, // 4 menit
      });
      newMatches.push({
        id: 'm-penyisihan-2',
        title: 'Babak Penyisihan 2',
        teamAId: activeTeams[2].id,
        teamBId: activeTeams[3].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'penyisihan',
        questionCount: 5,
        durationSeconds: 240, // 4 menit
      });
      newMatches.push({
        id: 'm-juara3',
        title: 'Babak Perebutan Juara 3 (2 Tim Poin Terendah)',
        teamAId: activeTeams[1].id, // will update dynamically after penyisihan
        teamBId: activeTeams[3].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'juara3',
        questionCount: 10,
        durationSeconds: 600, // 10 menit
      });
      newMatches.push({
        id: 'm-final',
        title: 'Babak Final (2 Tim Poin Tertinggi)',
        teamAId: activeTeams[0].id, // will update dynamically after penyisihan
        teamBId: activeTeams[2].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'final',
        questionCount: 10,
        durationSeconds: 600, // 10 menit
      });
    } else {
      // 5 Teams:
      // Babak Penyisihan (Tim 4 vs Tim 5, Tim 2 vs Tim 3, Tim 1 vs Pemenang) -> 2 tim terendah ke Juara 3, 2 tim tertinggi ke Final
      newMatches.push({
        id: 'm-p1',
        title: 'Babak Penyisihan 1',
        teamAId: activeTeams[3].id,
        teamBId: activeTeams[4].id,
        isCompleted: false,
        isCurrent: true,
        stage: 'penyisihan',
        questionCount: 5,
        durationSeconds: 240,
      });
      newMatches.push({
        id: 'm-p2',
        title: 'Babak Penyisihan 2',
        teamAId: activeTeams[1].id,
        teamBId: activeTeams[2].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'penyisihan',
        questionCount: 5,
        durationSeconds: 240,
      });
      newMatches.push({
        id: 'm-p3',
        title: 'Babak Penyisihan 3',
        teamAId: activeTeams[0].id,
        teamBId: activeTeams[3].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'penyisihan',
        questionCount: 5,
        durationSeconds: 240,
      });
      newMatches.push({
        id: 'm-juara3',
        title: 'Babak Perebutan Juara 3',
        teamAId: activeTeams[1].id,
        teamBId: activeTeams[3].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'juara3',
        questionCount: 10,
        durationSeconds: 600,
      });
      newMatches.push({
        id: 'm-final',
        title: 'Babak Final',
        teamAId: activeTeams[0].id,
        teamBId: activeTeams[2].id,
        isCompleted: false,
        isCurrent: false,
        stage: 'final',
        questionCount: 10,
        durationSeconds: 600,
      });
    }

    setMatches(newMatches);
    setCurrentMatchIndex(0);
    setPhase('BRACKET');
  };

  // ==========================================
  // LAUNCH ACTIVE MATCH
  // ==========================================
  const handleLaunchMatch = (matchIdx: number) => {
    sound.playRoundTransition();
    if (sound.bgmEnabled) sound.startBGM();

    const match = matches[matchIdx];
    setCurrentMatchIndex(matchIdx);

    // Filter questions according to stage rules:
    // Penyisihan: Exactly 3 PG (4 options) + 2 B/S (total 5)
    // Juara 3 & Final: Exactly 5 PG (4 options) + 5 B/S (total 10)
    const mcPool = QUESTION_BANK.filter(q => q.type === 'multiple_choice').sort(() => Math.random() - 0.5);
    const tfPool = QUESTION_BANK.filter(q => q.type === 'true_false').sort(() => Math.random() - 0.5);

    const mcCount = match.stage === 'penyisihan' ? 3 : 5;
    const tfCount = match.stage === 'penyisihan' ? 2 : 5;

    const basePool: Question[] = [
      ...mcPool.slice(0, mcCount),
      ...tfPool.slice(0, tfCount),
    ];

    // "Soal yang dikerjakan antara 2 team sama, hanya saja urutannya yang diacak."
    // Team A and Team B get the IDENTICAL questions, but in different randomized order!
    const shuffledForA = [...basePool].sort(() => Math.random() - 0.5);
    const shuffledForB = [...basePool].sort(() => Math.random() - 0.5);

    setQuestionsA(shuffledForA);
    setQuestionsB(shuffledForB);

    setIndexA(0);
    setIndexB(0);
    setScoreA(0);
    setScoreB(0);
    setPullCountA(0);
    setPullCountB(0);
    setIsFinishedA(false);
    setIsFinishedB(false);
    setFeedbackA(null);
    setFeedbackB(null);
    setMatchTimeLeft(match.durationSeconds);

    setPhase('MATCH');
  };

  const currentMatch = matches[currentMatchIndex];
  const teamA = teams.find(t => t.id === currentMatch?.teamAId) || teams[0];
  const teamB = teams.find(t => t.id === currentMatch?.teamBId) || teams[1];

  // Active member on turn for Team A and Team B (rotates per question)
  const memberA = teamA.members[indexA % teamA.members.length];
  const memberB = teamB.members[indexB % teamB.members.length];

  // Match Countdown Timer
  useEffect(() => {
    if (phase !== 'MATCH') return;

    const timer = setInterval(() => {
      setMatchTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishMatch();
          return 0;
        }
        if (prev <= 6) {
          sound.playCountdown();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isFinishedA, isFinishedB]);

  // Check if BOTH teams have finished all their questions -> Finish Match!
  useEffect(() => {
    if (phase === 'MATCH' && isFinishedA && isFinishedB) {
      const delay = setTimeout(() => {
        finishMatch();
      }, 1000);
      return () => clearTimeout(delay);
    }
  }, [phase, isFinishedA, isFinishedB]);

  // ==========================================
  // TEAM A INDEPENDENT ANSWER ACTION
  // Auto-advances immediately to next question in 650ms without pressing "Lanjut"
  // ==========================================
  const handleAnswerA = (optionIdx: number) => {
    if (feedbackA !== null || isFinishedA || indexA >= questionsA.length) return;

    const currentQA = questionsA[indexA];
    const isCorrect = optionIdx === currentQA.correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
      sound.playTug();
      setScoreA(s => s + 1);
      setPullCountA(p => p + 1);
    } else {
      sound.playWrong();
      sound.playTug();
      setScoreA(s => Math.max(0, s - 1));
    }

    // Save record
    answerRecordsRef.current.push({
      questionId: currentQA.id,
      questionText: currentQA.text,
      category: currentQA.category,
      frictionTag: currentQA.frictionTag,
      userAnswerIndex: optionIdx,
      correctAnswerIndex: currentQA.correctAnswer,
      isCorrect,
      explanation: currentQA.explanation,
      playerName: `${memberA.name} (${teamA.name})`,
    });

    setFeedbackA({
      selected: optionIdx,
      isCorrect,
      explanation: currentQA.explanation,
    });

    // Auto-advance immediately without pressing any button!
    setTimeout(() => {
      setFeedbackA(null);
      setIndexA(prev => {
        if (prev + 1 < questionsA.length) {
          return prev + 1;
        } else {
          setIsFinishedA(true);
          return prev;
        }
      });
    }, 650);
  };

  // ==========================================
  // TEAM B INDEPENDENT ANSWER ACTION
  // Auto-advances immediately to next question in 650ms without pressing "Lanjut"
  // ==========================================
  const handleAnswerB = (optionIdx: number) => {
    if (feedbackB !== null || isFinishedB || indexB >= questionsB.length) return;

    const currentQB = questionsB[indexB];
    const isCorrect = optionIdx === currentQB.correctAnswer;

    if (isCorrect) {
      sound.playCorrect();
      sound.playTug();
      setScoreB(s => s + 1);
      setPullCountB(p => p + 1);
    } else {
      sound.playWrong();
      sound.playTug();
      setScoreB(s => Math.max(0, s - 1));
    }

    // Save record
    answerRecordsRef.current.push({
      questionId: currentQB.id,
      questionText: currentQB.text,
      category: currentQB.category,
      frictionTag: currentQB.frictionTag,
      userAnswerIndex: optionIdx,
      correctAnswerIndex: currentQB.correctAnswer,
      isCorrect,
      explanation: currentQB.explanation,
      playerName: `${memberB.name} (${teamB.name})`,
    });

    setFeedbackB({
      selected: optionIdx,
      isCorrect,
      explanation: currentQB.explanation,
    });

    // Auto-advance immediately without pressing any button!
    setTimeout(() => {
      setFeedbackB(null);
      setIndexB(prev => {
        if (prev + 1 < questionsB.length) {
          return prev + 1;
        } else {
          setIsFinishedB(true);
          return prev;
        }
      });
    }, 650);
  };

  // ==========================================
  // FINISH CURRENT MATCH & ADVANCE BRACKET
  // ==========================================
  const finishMatch = () => {
    let winnerId = teamA.id;
    let loserId = teamB.id;
    let winnerSide: 'A' | 'B' | 'DRAW' = 'DRAW';

    if (scoreA > scoreB) {
      winnerId = teamA.id;
      loserId = teamB.id;
      winnerSide = 'A';
    } else if (scoreB > scoreA) {
      winnerId = teamB.id;
      loserId = teamA.id;
      winnerSide = 'B';
    } else {
      winnerId = teamA.id;
      loserId = teamB.id;
      winnerSide = 'DRAW';
    }

    sound.playVictory();
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}

    // Update matches list
    const updatedMatches = matches.map((m, idx) => {
      if (idx === currentMatchIndex) {
        return {
          ...m,
          isCompleted: true,
          teamAScore: scoreA,
          teamBScore: scoreB,
          winnerTeamId: winnerId,
          loserTeamId: loserId,
        };
      }
      return m;
    });

    // Update cumulative tournament points for leaderboard
    setTeams(prev =>
      prev.map(t => {
        if (t.id === winnerId) {
          return {
            ...t,
            totalTournamentPoints: t.totalTournamentPoints + (scoreA > scoreB ? scoreA : scoreB) + 3,
            matchScore: scoreA > scoreB ? scoreA : scoreB,
          };
        }
        if (t.id === loserId) {
          return {
            ...t,
            totalTournamentPoints: t.totalTournamentPoints + (scoreA < scoreB ? scoreA : scoreB) + 1,
            matchScore: scoreA < scoreB ? scoreA : scoreB,
          };
        }
        return t;
      })
    );

    // If 4 teams: Assign finalists & bronze contenders after both penyisihan matches
    if (teamCount === 4) {
      if (currentMatchIndex === 0) {
        // Penyisihan 1 finished
        updatedMatches[2].teamAId = loserId; // to Juara 3
        updatedMatches[3].teamAId = winnerId; // to Final
      } else if (currentMatchIndex === 1) {
        // Penyisihan 2 finished
        updatedMatches[2].teamBId = loserId; // to Juara 3
        updatedMatches[3].teamBId = winnerId; // to Final
      }
    }

    setMatches(updatedMatches);

    setLastCompletedMatch({
      match: updatedMatches[currentMatchIndex],
      teamA,
      teamB,
      scoreA,
      scoreB,
      winner: winnerSide,
    });

    setPhase('MATCH_SUMMARY');
  };

  // Continue from Match Summary to Next Round or Final Results
  const handleContinueAfterSummary = () => {
    sound.playClick();
    if (currentMatchIndex + 1 >= matches.length) {
      // Tournament finished! Determine Champ, Runner-up, Third Place
      const finalMatch = matches[matches.length - 1];
      const champ = teams.find(t => t.id === finalMatch?.winnerTeamId) || teams[0];
      const runner = teams.find(t => t.id === finalMatch?.loserTeamId) || teams[1];

      let thirdPlace = teams[2];
      if (matches.length >= 3) {
        const bronzeMatch = matches.find(m => m.stage === 'juara3');
        if (bronzeMatch?.winnerTeamId) {
          thirdPlace = teams.find(t => t.id === bronzeMatch.winnerTeamId) || teams[2];
        }
      }

      setPhase('TOURNAMENT_OVER');
      onFinishTournament(champ, runner, thirdPlace, teams, answerRecordsRef.current);
    } else {
      setPhase('BRACKET');
    }
  };

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // ==========================================
  // VIEW 1: SETUP PHASE
  // ==========================================
  if (phase === 'SETUP') {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 md:p-6 animate-fade-in">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-emerald-400 space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold tracking-wider uppercase bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              Squad Mode — Turnamen Antar-Tim
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-emerald-950 font-['Fredoka'] mt-2">
              Pengaturan Babak & Formasi Tim
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Saat 2 tim bertanding, <strong>keduanya bermain bersamaan</strong> dengan kumpulan soal yang sama (urutan diacak). Tim bisa langsung lanjut ke soal berikutnya tanpa menunggu lawan!
            </p>
          </div>

          {/* Tahap 1: Memilih Jumlah Tim */}
          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">
                Tahap 1: Pilih Jumlah Tim yang Bertanding
              </label>
              <span className="text-xs font-bold text-emerald-700">
                {teamCount > 3 ? '✨ Tersedia 3 Babak Turnamen' : 'Final / Round Robin'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => {
                    sound.playClick();
                    setTeamCount(cnt);
                  }}
                  className={`py-3 rounded-2xl font-black font-['Fredoka'] text-sm md:text-base border-2 cursor-pointer transition-all ${
                    teamCount === cnt
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-102 ring-2 ring-emerald-300'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cnt} Tim
                </button>
              ))}
            </div>

            {/* Explanation of the 3 Stages */}
            {teamCount >= 4 ? (
              <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <p className="font-extrabold text-emerald-800">
                  📋 Susunan 3 Babak Turnamen ({teamCount} Tim):
                </p>
                <p>
                  <strong>1. Babak Penyisihan ({teamCount === 4 ? '2x Match' : 'Penyisihan'}):</strong> 5 soal (3 Pilihan Ganda & 2 Benar/Salah) · Durasi 4 menit.
                </p>
                <p>
                  <strong>2. Babak Perebutan Juara 3:</strong> 2 Tim dengan poin terendah saling bertanding · 10 soal (5 Pilihan Ganda & 5 Benar/Salah) · Durasi 10 menit.
                </p>
                <p>
                  <strong>3. Babak Final:</strong> 2 Tim dengan poin tertinggi saling bertanding · 10 soal (5 Pilihan Ganda & 5 Benar/Salah) · Durasi 10 menit.
                </p>
              </div>
            ) : (
              <p className="text-xs text-emerald-800">
                {teamCount === 2
                  ? 'Pertandingan Final Langsung: 10 soal (5 PG & 5 B/S) · Durasi 10 menit.'
                  : 'Penyisihan 3 tim, 2 tim terbaik melaju ke Babak Final!'}
              </p>
            )}
          </div>

          {/* Jumlah Anggota per Tim (3 - 5 Orang) */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-1.5">
              Pilih Jumlah Anggota per Tim (3 - 5 Siswa)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 4, 5].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => handleMembersCountChange(cnt)}
                  className={`py-2.5 rounded-2xl font-black font-['Fredoka'] text-sm border-2 cursor-pointer transition-all ${
                    membersPerTeam === cnt
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102 ring-2 ring-blue-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cnt} Orang per Tim
                </button>
              ))}
            </div>
          </div>

          {/* Teams and members naming */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            <label className="text-xs font-bold text-slate-700 uppercase block">
              Nama Tim & Anggota ({membersPerTeam} Siswa per Tim)
            </label>
            {teams.slice(0, teamCount).map((team, tIdx) => (
              <div key={team.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-full shrink-0"
                    style={{ backgroundColor: team.color }}
                  />
                  <input
                    type="text"
                    value={team.name}
                    onChange={e => {
                      const val = e.target.value;
                      setTeams(prev => prev.map((t, i) => (i === tIdx ? { ...t, name: val } : t)));
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-sm bg-white"
                  />
                </div>

                <div className={`grid gap-2 ${membersPerTeam === 5 ? 'grid-cols-5' : membersPerTeam === 4 ? 'grid-cols-4' : 'grid-cols-3'}`}>
                  {team.members.map((mem, mIdx) => (
                    <input
                      key={mem.id}
                      type="text"
                      placeholder={`Anggota ${mIdx + 1}`}
                      value={mem.name}
                      onChange={e => {
                        const val = e.target.value;
                        setTeams(prev =>
                          prev.map((t, i) => {
                            if (i === tIdx) {
                              const newMembers = [...t.members];
                              newMembers[mIdx] = { ...newMembers[mIdx], name: val };
                              return { ...t, members: newMembers };
                            }
                            return t;
                          })
                        );
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 font-semibold"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onBackToMenu();
              }}
              className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-['Fredoka'] cursor-pointer"
            >
              Kembali
            </button>
            <button
              onClick={handleGenerateBracket}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-lg font-['Fredoka'] shadow-lg cursor-pointer"
            >
              Susun Bagan Turnamen! 🏆
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: BRACKET & LEADERBOARD PHASE
  // ==========================================
  if (phase === 'BRACKET') {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-6 animate-fade-in space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-emerald-400">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Turnamen Tarik Tambang Gaya ({teamCount} Tim · {membersPerTeam} Orang/Tim)
              </span>
              <h2 className="text-2xl font-black text-slate-900 font-['Fredoka']">
                Bagan 3 Babak & Jadwal Pertandingan
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSound}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                title="Suara"
              >
                {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                onClick={() => setPhase('SETUP')}
                className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Ubah Tim
              </button>
            </div>
          </div>

          {/* Tournament Matches Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {matches.map((match, idx) => {
              const mA = teams.find(t => t.id === match.teamAId);
              const mB = teams.find(t => t.id === match.teamBId);
              const isNext = !match.isCompleted && (idx === 0 || matches[idx - 1].isCompleted);

              return (
                <div
                  key={match.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    match.isCompleted
                      ? 'bg-slate-50 border-slate-200 opacity-80'
                      : isNext
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold mb-2">
                    <span className="text-emerald-700 font-['Fredoka']">{match.title}</span>
                    <span className="text-slate-500 font-mono">
                      {match.stage === 'penyisihan' ? '5 Soal (3 PG, 2 B/S) · 4 Menit' : '10 Soal (5 PG, 5 B/S) · 10 Menit'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between font-bold text-sm">
                    <span style={{ color: mA?.color }}>{mA?.name || 'TBD'}</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-black">
                      {match.isCompleted ? `${match.teamAScore} - ${match.teamBScore}` : 'VS'}
                    </span>
                    <span style={{ color: mB?.color }}>{mB?.name || 'TBD'}</span>
                  </div>

                  {isNext && (
                    <button
                      onClick={() => handleLaunchMatch(idx)}
                      className="w-full mt-3 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Play className="w-4 h-4" />
                      <span>Mulai Pertandingan Ini</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Leaderboard Table */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h3 className="font-extrabold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> Klasemen Poin Tim
            </h3>
            <div className="divide-y divide-slate-200 text-xs">
              {teams.slice(0, teamCount).map((t, idx) => (
                <div key={t.id} className="py-2 flex items-center justify-between font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span style={{ color: t.color }}>{t.name}</span>
                  </div>
                  <span className="font-black text-slate-800 font-['Fredoka']">
                    {t.totalTournamentPoints} Poin
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: MATCH SUMMARY MODAL/VIEW
  // ==========================================
  if (phase === 'MATCH_SUMMARY' && lastCompletedMatch) {
    const { match, teamA: mA, teamB: mB, scoreA: sA, scoreB: sB, winner } = lastCompletedMatch;
    const isTie = sA === sB;

    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-6 animate-fade-in">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-yellow-300 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center mx-auto shadow-md">
            <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Hasil {match.title}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-['Fredoka'] mt-1">
              {winner === 'A'
                ? `🎉 ${mA.name} Menang Pertandingan!`
                : winner === 'B'
                ? `🎉 ${mB.name} Menang Pertandingan!`
                : '🤝 Pertandingan Berakhir Seri!'}
            </h2>
          </div>

          {/* Final Match Scores */}
          <div className="flex items-center justify-center gap-6 my-4">
            <div className="p-4 rounded-2xl border-2 min-w-[130px]" style={{ borderColor: mA.color, backgroundColor: `${mA.color}10` }}>
              <span className="text-xs font-bold block" style={{ color: mA.color }}>{mA.name}</span>
              <span className="text-3xl font-black font-['Fredoka'] text-slate-900">{sA} Poin</span>
            </div>
            <span className="text-2xl font-black text-slate-400">VS</span>
            <div className="p-4 rounded-2xl border-2 min-w-[130px]" style={{ borderColor: mB.color, backgroundColor: `${mB.color}10` }}>
              <span className="text-xs font-bold block" style={{ color: mB.color }}>{mB.name}</span>
              <span className="text-3xl font-black font-['Fredoka'] text-slate-900">{sB} Poin</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
            {match.stage === 'penyisihan'
              ? 'Poin telah dicatat ke dalam klasemen turnamen untuk menentukan tim yang melaju ke Babak Perebutan Juara 3 dan Babak Final.'
              : match.stage === 'juara3'
              ? `Juara 3 berhasil diraih oleh ${winner === 'A' ? mA.name : mB.name}!`
              : `Juara 1 Turnamen Tarik Tambang Gaya berhasil direbut oleh ${winner === 'A' ? mA.name : mB.name}!`}
          </p>

          <button
            onClick={handleContinueAfterSummary}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base font-['Fredoka'] flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Lanjut ke Babak Berikutnya</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 4: ACTIVE SIMULTANEOUS INDEPENDENT MATCH
  // "Bagi team yang sudah menjawab, bisa langsung lanjut ke soal berikutnya tanpa menunggu team lawan"
  // ==========================================
  const currentQA = questionsA[indexA];
  const currentQB = questionsB[indexB];

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-3 p-2 md:p-4">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-2.5 shadow-md border-2 border-emerald-200">
        <button
          onClick={() => setPhase('BRACKET')}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          title="Bagan Pertandingan"
        >
          <Home className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-extrabold font-['Fredoka'] text-emerald-900 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
            {currentMatch?.title}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Bermain Mandiri Bersamaan!</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            title="Musik & Suara"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-full font-mono font-bold text-xs md:text-sm bg-slate-100 text-slate-800 border border-slate-300">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>{formatTimer(matchTimeLeft)}</span>
          </div>
        </div>
      </div>

      {/* 3D Tug of War Arena (continuous real-time physics pull) */}
      <div className="w-full h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-lg border-2 border-sky-300 bg-sky-200">
        <TugOfWarCanvas
          scoreA={scoreA}
          scoreB={scoreB}
          nameA={teamA.name}
          nameB={teamB.name}
          teamAColor={teamA.color}
          teamBColor={teamB.color}
          pullCountA={pullCountA}
          pullCountB={pullCountB}
        />
      </div>

      {/* SIMULTANEOUS INDEPENDENT PANELS: Both teams progress through their randomized questions independently! */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* =========================================
            TEAM A PANEL (LEFT)
        ========================================= */}
        <div className="bg-white rounded-3xl p-4 md:p-5 shadow-xl border-2 border-blue-200 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-blue-100 pb-2 mb-3">
              <div>
                <span className="font-black text-sm md:text-base text-blue-900 font-['Fredoka'] block">
                  🔵 {teamA.name}
                </span>
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Penjawab: <strong>{memberA?.name || 'Anggota'}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold bg-blue-100 text-blue-900 px-2.5 py-1 rounded-full">
                  {scoreA} Poin
                </span>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {isFinishedA ? 'Selesai' : `Soal ${indexA + 1}/${questionsA.length}`}
                </span>
              </div>
            </div>

            {/* Question Body */}
            {!isFinishedA && currentQA ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    {currentQA.frictionTag === 'manfaat'
                      ? '🌟 Manfaat Gesek'
                      : currentQA.frictionTag === 'kerugian'
                      ? '⚠️ Kerugian Gesek'
                      : currentQA.frictionTag === 'memperbesar'
                      ? '🔍 Memperbesar'
                      : currentQA.frictionTag === 'memperkecil'
                      ? '💧 Memperkecil'
                      : '📚 Pemahaman Gaya'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {currentQA.type === 'true_false' ? 'Benar / Salah' : 'Pilihan Ganda'}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-snug min-h-[44px]">
                  {currentQA.text}
                </h3>

                {/* Options Grid with instant feedback and auto-advance */}
                <div className="space-y-2 pt-1">
                  {currentQA.options.map((opt, idx) => {
                    const isChosen = feedbackA?.selected === idx;
                    const isAnswerKey = currentQA.correctAnswer === idx;
                    let style = 'bg-blue-50/50 hover:bg-blue-100 text-slate-800 border-blue-200';

                    if (feedbackA !== null) {
                      if (isChosen) {
                        style = feedbackA.isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-black scale-101'
                          : 'bg-rose-500 text-white border-rose-600 shadow-md font-black scale-101';
                      } else if (isAnswerKey) {
                        style = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                      } else {
                        style = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={feedbackA !== null}
                        onClick={() => handleAnswerA(idx)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs md:text-sm font-bold border flex items-center gap-2 cursor-pointer transition-all active:scale-98 ${style}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-black shrink-0 ${
                            isChosen ? 'bg-white text-slate-900' : 'bg-blue-600 text-white'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isChosen && (
                          <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white/20">
                            {feedbackA.isCorrect ? '✓ Benar (+1)' : '✗ Kurang Tepat (-1)'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {feedbackA && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-950 font-medium leading-relaxed animate-fade-in flex items-center gap-2">
                    <span className="font-bold text-amber-800 shrink-0">💡 Kunci: {currentQA.options[currentQA.correctAnswer]}</span>
                    <span className="text-slate-400">·</span>
                    <span className="truncate">{feedbackA.explanation}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-bold text-blue-900 bg-blue-50/70 rounded-2xl border border-blue-200">
                <p className="text-base font-black mb-1">🎉 {teamA.name} Selesai!</p>
                <p className="text-slate-500">
                  Semua soal telah terjawab. Skor akhir: {scoreA} Poin.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* =========================================
            TEAM B PANEL (RIGHT)
        ========================================= */}
        <div className="bg-white rounded-3xl p-4 md:p-5 shadow-xl border-2 border-red-200 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-red-100 pb-2 mb-3">
              <div>
                <span className="font-black text-sm md:text-base text-red-900 font-['Fredoka'] block">
                  🔴 {teamB.name}
                </span>
                <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  Penjawab: <strong>{memberB?.name || 'Anggota'}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold bg-red-100 text-red-900 px-2.5 py-1 rounded-full">
                  {scoreB} Poin
                </span>
                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {isFinishedB ? 'Selesai' : `Soal ${indexB + 1}/${questionsB.length}`}
                </span>
              </div>
            </div>

            {/* Question Body */}
            {!isFinishedB && currentQB ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-red-800 border border-red-200">
                    {currentQB.frictionTag === 'manfaat'
                      ? '🌟 Manfaat Gesek'
                      : currentQB.frictionTag === 'kerugian'
                      ? '⚠️ Kerugian Gesek'
                      : currentQB.frictionTag === 'memperbesar'
                      ? '🔍 Memperbesar'
                      : currentQB.frictionTag === 'memperkecil'
                      ? '💧 Memperkecil'
                      : '📚 Pemahaman Gaya'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {currentQB.type === 'true_false' ? 'Benar / Salah' : 'Pilihan Ganda'}
                  </span>
                </div>

                <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-snug min-h-[44px]">
                  {currentQB.text}
                </h3>

                {/* Options Grid with instant feedback and auto-advance */}
                <div className="space-y-2 pt-1">
                  {currentQB.options.map((opt, idx) => {
                    const isChosen = feedbackB?.selected === idx;
                    const isAnswerKey = currentQB.correctAnswer === idx;
                    let style = 'bg-red-50/50 hover:bg-red-100 text-slate-800 border-red-200';

                    if (feedbackB !== null) {
                      if (isChosen) {
                        style = feedbackB.isCorrect
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-md font-black scale-101'
                          : 'bg-rose-500 text-white border-rose-600 shadow-md font-black scale-101';
                      } else if (isAnswerKey) {
                        style = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                      } else {
                        style = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={feedbackB !== null}
                        onClick={() => handleAnswerB(idx)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs md:text-sm font-bold border flex items-center gap-2 cursor-pointer transition-all active:scale-98 ${style}`}
                      >
                        <span
                          className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-black shrink-0 ${
                            isChosen ? 'bg-white text-slate-900' : 'bg-red-600 text-white'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isChosen && (
                          <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-white/20">
                            {feedbackB.isCorrect ? '✓ Benar (+1)' : '✗ Kurang Tepat (-1)'}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {feedbackB && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 text-[11px] text-amber-950 font-medium leading-relaxed animate-fade-in flex items-center gap-2">
                    <span className="font-bold text-amber-800 shrink-0">💡 Kunci: {currentQB.options[currentQB.correctAnswer]}</span>
                    <span className="text-slate-400">·</span>
                    <span className="truncate">{feedbackB.explanation}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-xs font-bold text-red-900 bg-red-50/70 rounded-2xl border border-red-200">
                <p className="text-base font-black mb-1">🎉 {teamB.name} Selesai!</p>
                <p className="text-slate-500">
                  Semua soal telah terjawab. Skor akhir: {scoreB} Poin.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
