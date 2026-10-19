import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Question, ComputerDifficulty, PlayerAnswerRecord } from '../types/game';
import { QUESTION_BANK } from '../data/questions';
import { TugOfWarCanvas } from './TugOfWarCanvas';
import { FeedbackModal } from './FeedbackModal';
import { sound } from '../services/audio';
import { Pause, Play, RotateCcw, Home, Volume2, VolumeX, Clock, Trophy, AlertTriangle } from 'lucide-react';

interface SoloGameProps {
  onBackToMenu: () => void;
  onFinishGame: (
    scoreA: number,
    scoreB: number,
    winner: 'A' | 'B' | 'DRAW',
    records: PlayerAnswerRecord[],
    elapsedSeconds: number
  ) => void;
}

export const SoloGame: React.FC<SoloGameProps> = ({ onBackToMenu, onFinishGame }) => {
  // Game Setup State
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [playerName, setPlayerName] = useState('Murid Hebat');
  const [difficulty, setDifficulty] = useState<ComputerDifficulty>('sedang');
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(5);

  // Active Game State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scorePlayer, setScorePlayer] = useState(0);
  const [scoreComputer, setScoreComputer] = useState(0);
  const [pullCountPlayer, setPullCountPlayer] = useState(0);
  const [pullCountComputer, setPullCountComputer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Question resolution & interaction lock
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Audio status
  const [isSoundMuted, setIsSoundMuted] = useState(!sound.sfxEnabled);

  // History tracking
  const answerRecordsRef = useRef<PlayerAnswerRecord[]>([]);
  const computerTimerRef = useRef<number | null>(null);
  const totalElapsedTimerRef = useRef(0);

  // Start the match
  const handleStartMatch = () => {
    sound.playClick();
    if (sound.bgmEnabled) sound.startBGM();
    // Shuffle and pick questions with guaranteed friction question balance
    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questionCount);
    setQuestions(selected);
    setCurrentIndex(0);
    setScorePlayer(0);
    setScoreComputer(0);
    setPullCountPlayer(0);
    setPullCountComputer(0);
    setTimeLeft(durationMinutes * 60);
    totalElapsedTimerRef.current = 0;
    answerRecordsRef.current = [];
    setIsConfiguring(false);
    setIsLocked(false);
    setSelectedOption(null);
    setShowFeedback(false);
  };

  // Current Question
  const currentQ = questions[currentIndex];

  // Master Timer
  useEffect(() => {
    if (isConfiguring || isPaused || showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeOut();
          return 0;
        }
        if (prev <= 6) {
          sound.playCountdown();
        }
        totalElapsedTimerRef.current += 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isConfiguring, isPaused, showFeedback, currentIndex]);

  // Computer AI answering simulator
  useEffect(() => {
    if (isConfiguring || isPaused || isLocked || showFeedback || !currentQ) return;

    // AI takes between 3 to 7 seconds to answer
    const delay = Math.random() * 3500 + 3000;
    computerTimerRef.current = window.setTimeout(() => {
      // Determine computer accuracy based on chosen difficulty
      const accuracyRate = difficulty === 'mudah' ? 0.4 : difficulty === 'sedang' ? 0.7 : 0.9;
      const isComCorrect = Math.random() < accuracyRate;

      if (isComCorrect) {
        setScoreComputer(s => s + 1);
        setPullCountComputer(c => c + 1);
      } else {
        setScoreComputer(s => Math.max(0, s - 1));
      }
    }, delay);

    return () => {
      if (computerTimerRef.current !== null) {
        clearTimeout(computerTimerRef.current);
      }
    };
  }, [currentIndex, isConfiguring, isPaused, isLocked, showFeedback, difficulty, currentQ]);

  const autoAdvanceTimerRef = useRef<number | null>(null);

  // Handle Player Option Click
  const handleOptionClick = (optionIdx: number) => {
    if (isLocked || !currentQ) return;
    setIsLocked(true);
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === currentQ.correctAnswer;
    setIsCurrentAnswerCorrect(isCorrect);
    setIsTimedOut(false);

    if (isCorrect) {
      sound.playCorrect();
      sound.playTug();
      setScorePlayer(s => s + 1);
      setPullCountPlayer(p => p + 1);
    } else {
      sound.playWrong();
      sound.playTug();
      setScorePlayer(s => Math.max(0, s - 1));
    }

    answerRecordsRef.current.push({
      questionId: currentQ.id,
      questionText: currentQ.text,
      category: currentQ.category,
      frictionTag: currentQ.frictionTag,
      userAnswerIndex: optionIdx,
      correctAnswerIndex: currentQ.correctAnswer,
      isCorrect,
      explanation: currentQ.explanation,
      playerName: playerName || 'Player 1',
    });

    setShowFeedback(true);

    // Auto-advance immediately without having to press "Lanjutkan"
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    autoAdvanceTimerRef.current = window.setTimeout(() => {
      handleNextQuestion();
    }, 750);
  };

  // Timeout handler
  const handleTimeOut = () => {
    if (!currentQ || isLocked) return;
    setIsLocked(true);
    setSelectedOption(null);
    setIsCurrentAnswerCorrect(false);
    setIsTimedOut(true);

    sound.playWrong();

    answerRecordsRef.current.push({
      questionId: currentQ.id,
      questionText: currentQ.text,
      category: currentQ.category,
      frictionTag: currentQ.frictionTag,
      userAnswerIndex: null,
      correctAnswerIndex: currentQ.correctAnswer,
      isCorrect: false,
      explanation: currentQ.explanation,
      playerName: playerName || 'Player 1',
    });

    setShowFeedback(true);

    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    autoAdvanceTimerRef.current = window.setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  // Next Question
  const handleNextQuestion = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setShowFeedback(false);
    setSelectedOption(null);
    setIsLocked(false);

    if (currentIndex + 1 < questions.length && timeLeft > 0) {
      sound.playRoundTransition();
      setCurrentIndex(c => c + 1);
    } else {
      // Game ended
      const winner = scorePlayer > scoreComputer ? 'A' : scoreComputer > scorePlayer ? 'B' : 'DRAW';
      if (winner === 'A') {
        sound.playVictory();
      } else if (winner === 'B') {
        sound.playDefeat();
      }
      onFinishGame(scorePlayer, scoreComputer, winner, answerRecordsRef.current, totalElapsedTimerRef.current);
    }
  };

  const toggleSound = () => {
    const nextState = !isSoundMuted;
    setIsSoundMuted(nextState);
    sound.setBgmEnabled(!nextState);
    sound.setSfxEnabled(!nextState);
  };

  const togglePause = () => {
    sound.playClick();
    setIsPaused(!isPaused);
  };

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // 1. CONFIGURATION SCREEN
  if (isConfiguring) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-6 animate-fade-in">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-blue-400 space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold tracking-wider uppercase bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Mode 1 Pemain
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-blue-950 font-['Fredoka'] mt-2">
              Pengaturan Solo Mode vs Komputer
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Buktikan pemahamanmu tentang gaya gesek dan kalahkan komputer dalam tarik tambang!
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Nama Pemain
              </label>
              <input
                type="text"
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                maxLength={18}
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold text-slate-800"
                placeholder="Masukkan namamu..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                Tingkat Kesulitan Komputer
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['mudah', 'sedang', 'sulit'] as ComputerDifficulty[]).map(diff => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setDifficulty(diff);
                    }}
                    className={`py-3 px-2 rounded-2xl font-bold font-['Fredoka'] text-sm capitalize border-2 transition-all cursor-pointer ${
                      difficulty === diff
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {diff === 'mudah' ? '🌱 Mudah (40%)' : diff === 'sedang' ? '⚡ Sedang (70%)' : '🔥 Sulit (90%)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Jumlah Soal
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15].map(cnt => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setQuestionCount(cnt);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 cursor-pointer transition-all ${
                        questionCount === cnt
                          ? 'bg-amber-400 text-slate-900 border-amber-500 font-extrabold shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {cnt} Soal
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1">
                  Durasi Permainan
                </label>
                <div className="flex gap-2">
                  {[3, 5, 10].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setDurationMinutes(mins);
                      }}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 cursor-pointer transition-all ${
                        durationMinutes === mins
                          ? 'bg-emerald-500 text-white border-emerald-600 font-extrabold shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {mins} Menit
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                sound.playClick();
                onBackToMenu();
              }}
              className="py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-['Fredoka'] cursor-pointer transition-all"
            >
              Kembali
            </button>
            <button
              onClick={handleStartMatch}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg font-['Fredoka'] shadow-lg shadow-blue-500/30 cursor-pointer transform active:scale-98 transition-all"
            >
              Mulai Tarik Tambang! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ACTIVE GAMEPLAY SCREEN
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3 p-2 md:p-4">
      {/* Top Status & Controls Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-2.5 md:p-3 shadow-md border-2 border-sky-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExitConfirm(true)}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-600 cursor-pointer transition-colors"
            title="Kembali ke Menu"
          >
            <Home className="w-5 h-5" />
          </button>
          <button
            onClick={togglePause}
            className="p-2 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-600 cursor-pointer transition-colors"
            title={isPaused ? 'Lanjutkan' : 'Jeda Permainan'}
          >
            {isPaused ? <Play className="w-5 h-5 text-emerald-600" /> : <Pause className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer transition-colors"
            title="Suara"
          >
            {isSoundMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
          </button>
        </div>

        {/* Question Counter Pill */}
        <div className="text-xs md:text-sm font-extrabold font-['Fredoka'] text-blue-900 bg-sky-100 px-3.5 py-1.5 rounded-full border border-sky-300">
          Soal {currentIndex + 1} dari {questions.length}
        </div>

        {/* Digital Countdown Timer */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-bold text-xs md:text-sm border ${
            timeLeft <= 30
              ? 'bg-rose-100 text-rose-700 border-rose-300 animate-pulse'
              : 'bg-slate-100 text-slate-800 border-slate-300'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-600" />
          <span>{formatTimer(timeLeft)}</span>
        </div>
      </div>

      {/* 3D Tug of War Canvas Viewport */}
      <div className="w-full h-[240px] md:h-[320px] rounded-2xl overflow-hidden shadow-lg border-2 border-sky-300 bg-sky-200">
        <TugOfWarCanvas
          scoreA={scorePlayer}
          scoreB={scoreComputer}
          nameA={playerName || 'Player 1'}
          nameB={`Komputer (${difficulty})`}
          teamAColor="#2563EB"
          teamBColor="#DC2626"
          pullCountA={pullCountPlayer}
          pullCountB={pullCountComputer}
        />
      </div>

      {/* Question & Options Area */}
      {currentQ && (
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-xl border-2 border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {currentQ.frictionTag === 'manfaat'
                ? '🌟 Manfaat Gaya Gesek'
                : currentQ.frictionTag === 'kerugian'
                ? '⚠️ Kerugian Gaya Gesek'
                : currentQ.frictionTag === 'memperbesar'
                ? '🔍 Memperbesar Gaya Gesek'
                : currentQ.frictionTag === 'memperkecil'
                ? '💧 Memperkecil Gaya Gesek'
                : '📚 Pemahaman Gaya'}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {currentQ.type === 'true_false' ? 'Tipe: Benar / Salah' : 'Pilihan Ganda'}
            </span>
          </div>

          <h2 className="text-base md:text-xl font-extrabold text-slate-900 leading-snug">
            {currentQ.text}
          </h2>

          {/* Options Grid */}
          <div
            className={`grid gap-2.5 ${
              currentQ.options.length === 2 ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'
            }`}
          >
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isAnswerKey = currentQ.correctAnswer === idx;
              let style = 'bg-slate-50 hover:bg-sky-50 text-slate-800 border-slate-200 hover:border-sky-300';

              if (showFeedback) {
                if (isSelected) {
                  style = isCurrentAnswerCorrect
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-md font-black scale-[1.01]'
                    : 'bg-rose-600 text-white border-rose-700 shadow-md font-black scale-[1.01]';
                } else if (isAnswerKey) {
                  style = 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold';
                } else {
                  style = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isLocked || isPaused}
                  onClick={() => handleOptionClick(idx)}
                  className={`min-h-[52px] p-3.5 rounded-2xl text-left font-bold text-xs md:text-sm border-2 transition-all flex items-center gap-3 cursor-pointer select-none active:scale-98 ${style} ${
                    isLocked && !showFeedback ? 'cursor-not-allowed opacity-80' : ''
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected && showFeedback
                        ? 'bg-white text-slate-900'
                        : isSelected
                        ? 'bg-white text-blue-700'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {isSelected && showFeedback && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/20">
                      {isCurrentAnswerCorrect ? '✓ Benar' : '✗ Salah'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Pedagogical Feedback & Fast-Advance Banner */}
          {showFeedback && (
            <div
              onClick={() => {
                if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
                handleNextQuestion();
              }}
              className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-950 font-medium leading-relaxed animate-fade-in flex items-center justify-between gap-3 cursor-pointer hover:bg-amber-100 transition-all shadow-sm"
              title="Klik untuk langsung melaju ke soal berikutnya"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="font-extrabold text-amber-800 shrink-0">
                  💡 Kunci: {currentQ.options[currentQ.correctAnswer]}
                </span>
                <span className="text-slate-400 hidden sm:inline">·</span>
                <span className="truncate">{currentQ.explanation}</span>
              </div>
              <span className="text-[11px] font-black text-amber-800 shrink-0 bg-amber-200/90 px-2.5 py-1 rounded-xl">
                Lanjut Otomatis... ➔
              </span>
            </div>
          )}
        </div>
      )}

      {/* Pause Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-300 space-y-4">
            <h3 className="text-2xl font-black text-slate-800 font-['Fredoka']">Permainan Dijeda ⏸️</h3>
            <p className="text-sm text-slate-600">Ambil nafas dulu, lalu lanjutkan pertandingan!</p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={togglePause}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-['Fredoka'] cursor-pointer shadow-md"
              >
                Lanjutkan Permainan
              </button>
              <button
                onClick={() => setShowExitConfirm(true)}
                className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-['Fredoka'] cursor-pointer"
              >
                Keluar ke Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border-4 border-rose-300 space-y-4">
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-xl font-black text-slate-800 font-['Fredoka']">Yakin Ingin Keluar?</h3>
            <p className="text-xs text-slate-600">
              Pertandingan yang sedang berjalan tidak akan tersimpan jika kamu keluar sekarang.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onBackToMenu();
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold cursor-pointer shadow-md"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
