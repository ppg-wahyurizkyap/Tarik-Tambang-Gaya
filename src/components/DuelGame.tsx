import React, { useState, useEffect, useRef } from 'react';
import { Question, PlayerAnswerRecord } from '../types/game';
import { QUESTION_BANK } from '../data/questions';
import { TugOfWarCanvas } from './TugOfWarCanvas';
import { sound } from '../services/audio';
import { Home, Volume2, VolumeX, Clock, Users, ArrowRight, Zap, UserCheck } from 'lucide-react';

interface DuelGameProps {
  onBackToMenu: () => void;
  onFinishGame: (
    scoreA: number,
    scoreB: number,
    winner: 'A' | 'B' | 'DRAW',
    records: PlayerAnswerRecord[],
    elapsedSeconds: number
  ) => void;
}

export const DuelGame: React.FC<DuelGameProps> = ({ onBackToMenu, onFinishGame }) => {
  // Configuration
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [player1Name, setPlayer1Name] = useState('Pemain 1 (Biru)');
  const [player2Name, setPlayer2Name] = useState('Pemain 2 (Merah)');
  const [questionCount, setQuestionCount] = useState(10);
  const [durationMinutes, setDurationMinutes] = useState(5);

  // Match State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [pullCount1, setPullCount1] = useState(0);
  const [pullCount2, setPullCount2] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isSoundMuted, setIsSoundMuted] = useState(!sound.bgmEnabled);

  // SIMULTANEOUS REAL-TIME PLAY:
  // Both players choose at the same time!
  const [choice1, setChoice1] = useState<number | null>(null);
  const [choice2, setChoice2] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const answerRecordsRef = useRef<PlayerAnswerRecord[]>([]);
  const totalElapsedTimerRef = useRef(0);

  useEffect(() => {
    if (sound.bgmEnabled) sound.startBGM();
  }, []);

  const toggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    sound.setBgmEnabled(!next);
    sound.setSfxEnabled(!next);
    if (!next) sound.startBGM();
  };

  const handleStartMatch = () => {
    sound.playClick();
    if (sound.bgmEnabled) sound.startBGM();

    const shuffled = [...QUESTION_BANK].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, questionCount));
    setCurrentIndex(0);
    setScore1(0);
    setScore2(0);
    setPullCount1(0);
    setPullCount2(0);
    setTimeLeft(durationMinutes * 60);
    totalElapsedTimerRef.current = 0;
    answerRecordsRef.current = [];
    setChoice1(null);
    setChoice2(null);
    setIsRevealed(false);
    setIsConfiguring(false);
  };

  const currentQ = questions[currentIndex];

  // Master Timer
  useEffect(() => {
    if (isConfiguring || isRevealed) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeExpired();
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
  }, [isConfiguring, isRevealed, currentIndex]);

  const handleTimeExpired = () => {
    const winner = score1 > score2 ? 'A' : score2 > score1 ? 'B' : 'DRAW';
    if (winner === 'A' || winner === 'B') sound.playVictory();
    onFinishGame(score1, score2, winner, answerRecordsRef.current, totalElapsedTimerRef.current);
  };

  // Check if both players have chosen -> Trigger simultaneous reveal!
  useEffect(() => {
    if (isConfiguring || isRevealed || !currentQ) return;

    if (choice1 !== null && choice2 !== null) {
      evaluateBoth(choice1, choice2);
    }
  }, [choice1, choice2, isRevealed, isConfiguring, currentQ]);

  const handleSelectP1 = (idx: number) => {
    if (choice1 !== null || isRevealed) return;
    sound.playClick();
    setChoice1(idx);
  };

  const handleSelectP2 = (idx: number) => {
    if (choice2 !== null || isRevealed) return;
    sound.playClick();
    setChoice2(idx);
  };

  const evaluateBoth = (c1: number, c2: number) => {
    if (!currentQ) return;
    setIsRevealed(true);

    const isP1Correct = c1 === currentQ.correctAnswer;
    const isP2Correct = c2 === currentQ.correctAnswer;

    let newScore1 = score1;
    let newScore2 = score2;

    if (isP1Correct) {
      newScore1 += 1;
      setPullCount1(p => p + 1);
    } else {
      newScore1 = Math.max(0, newScore1 - 1);
    }

    if (isP2Correct) {
      newScore2 += 1;
      setPullCount2(p => p + 1);
    } else {
      newScore2 = Math.max(0, newScore2 - 1);
    }

    setScore1(newScore1);
    setScore2(newScore2);

    if (isP1Correct || isP2Correct) {
      sound.playCorrect();
      sound.playTug();
    } else {
      sound.playWrong();
    }

    answerRecordsRef.current.push({
      questionId: currentQ.id,
      questionText: currentQ.text,
      category: currentQ.category,
      frictionTag: currentQ.frictionTag,
      userAnswerIndex: c1,
      correctAnswerIndex: currentQ.correctAnswer,
      isCorrect: isP1Correct,
      explanation: currentQ.explanation,
      playerName: player1Name,
    });

    answerRecordsRef.current.push({
      questionId: currentQ.id,
      questionText: currentQ.text,
      category: currentQ.category,
      frictionTag: currentQ.frictionTag,
      userAnswerIndex: c2,
      correctAnswerIndex: currentQ.correctAnswer,
      isCorrect: isP2Correct,
      explanation: currentQ.explanation,
      playerName: player2Name,
    });

    // Auto-advance immediately without having to press "Lanjut ke Soal Berikutnya"
    if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    autoAdvanceTimerRef.current = window.setTimeout(() => {
      handleNextQuestion();
    }, 1100);
  };

  const autoAdvanceTimerRef = useRef<number | null>(null);

  const handleNextQuestion = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (currentIndex + 1 < questions.length && timeLeft > 0) {
      sound.playRoundTransition();
      setCurrentIndex(c => c + 1);
      setChoice1(null);
      setChoice2(null);
      setIsRevealed(false);
    } else {
      const winner = score1 > score2 ? 'A' : score2 > score1 ? 'B' : 'DRAW';
      if (winner === 'A' || winner === 'B') sound.playVictory();
      onFinishGame(score1, score2, winner, answerRecordsRef.current, totalElapsedTimerRef.current);
    }
  };

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  if (isConfiguring) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:p-6 animate-fade-in">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-purple-400 space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold tracking-wider uppercase bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              Mode 2 Pemain (1 Layar)
            </span>
            <h1 className="text-2xl md:text-3xl font-black text-purple-950 font-['Fredoka'] mt-2">
              Pengaturan Duel Mode
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Kedua murid dapat <strong>menjawab secara bersamaan</strong> dalam waktu nyata!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50 border-2 border-blue-200">
              <label className="text-xs font-bold text-blue-900 uppercase block mb-1">
                Nama Pemain 1 (Sisi Kiri)
              </label>
              <input
                type="text"
                value={player1Name}
                onChange={e => setPlayer1Name(e.target.value)}
                maxLength={18}
                className="w-full px-3 py-2.5 rounded-xl border border-blue-300 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200">
              <label className="text-xs font-bold text-red-900 uppercase block mb-1">
                Nama Pemain 2 (Sisi Kanan)
              </label>
              <input
                type="text"
                value={player2Name}
                onChange={e => setPlayer2Name(e.target.value)}
                maxLength={18}
                className="w-full px-3 py-2.5 rounded-xl border border-red-300 font-bold bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Jumlah Soal</label>
              <div className="flex gap-2">
                {[5, 10, 15].map(cnt => (
                  <button
                    key={cnt}
                    onClick={() => {
                      sound.playClick();
                      setQuestionCount(cnt);
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 cursor-pointer ${
                      questionCount === cnt ? 'bg-amber-400 text-slate-900 border-amber-500 font-extrabold shadow-sm' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {cnt} Soal
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Durasi</label>
              <div className="flex gap-2">
                {[3, 5, 8].map(mins => (
                  <button
                    key={mins}
                    onClick={() => {
                      sound.playClick();
                      setDurationMinutes(mins);
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 cursor-pointer ${
                      durationMinutes === mins ? 'bg-purple-600 text-white border-purple-700 font-extrabold shadow-sm' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    {mins} Menit
                  </button>
                ))}
              </div>
            </div>
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
              onClick={handleStartMatch}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-lg font-['Fredoka'] shadow-lg cursor-pointer"
            >
              Mulai Duel Seru! ⚔️
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-3 p-2 md:p-4">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white rounded-2xl p-2.5 shadow-md border-2 border-purple-200">
        <button
          onClick={() => {
            sound.playClick();
            onBackToMenu();
          }}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
          title="Menu Utama"
        >
          <Home className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs md:text-sm font-extrabold font-['Fredoka'] text-purple-900 bg-purple-100 px-4 py-1.5 rounded-full border border-purple-300">
            Soal {currentIndex + 1} dari {questions.length}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Bermain Bersamaan!</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
            title="Musik & Suara"
          >
            {isSoundMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-bold text-xs md:text-sm bg-slate-100 text-slate-800 border border-slate-300">
            <Clock className="w-4 h-4 text-slate-600" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>
      </div>

      {/* 3D Tug Arena */}
      <div className="w-full h-[220px] md:h-[280px] rounded-2xl overflow-hidden shadow-lg border-2 border-sky-300 bg-sky-200">
        <TugOfWarCanvas
          scoreA={score1}
          scoreB={score2}
          nameA={player1Name}
          nameB={player2Name}
          teamAColor="#2563EB"
          teamBColor="#DC2626"
          pullCountA={pullCount1}
          pullCountB={pullCount2}
        />
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white rounded-3xl p-4 md:p-5 shadow-xl border-2 border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-purple-100 text-purple-800">
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

            <span
              className={`text-xs md:text-sm font-black px-4 py-1 rounded-full font-['Fredoka'] ${
                isRevealed
                  ? 'bg-emerald-600 text-white'
                  : choice1 !== null && choice2 !== null
                  ? 'bg-amber-500 text-white'
                  : 'bg-purple-600 text-white animate-pulse'
              }`}
            >
              {isRevealed
                ? '✨ Jawaban Terkunci & Hasil Ditampilkan!'
                : choice1 !== null && choice2 === null
                ? `⏳ ${player1Name} sudah jawab! Menunggu ${player2Name}...`
                : choice2 !== null && choice1 === null
                ? `⏳ ${player2Name} sudah jawab! Menunggu ${player1Name}...`
                : '⚡ KEDUA PEMAIN MENJAWAB BERSAMAAN!'}
            </span>
          </div>

          <h2 className="text-sm md:text-lg font-extrabold text-slate-900 mb-4 leading-snug">
            {currentQ.text}
          </h2>

          {/* SIMULTANEOUS VERTICAL SPLIT SCREEN: Both answer at the exact same time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Player 1 Panel */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                choice1 !== null ? 'bg-blue-50/50 border-blue-400' : 'bg-white border-blue-300 ring-2 ring-blue-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-blue-100 pb-2">
                <span className="font-extrabold text-sm text-blue-900 font-['Fredoka']">
                  🔵 {player1Name}
                </span>
                <span className="text-xs font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded-full">
                  {score1} Poin
                </span>
              </div>

              {!isRevealed ? (
                choice1 === null ? (
                  <div className="space-y-2">
                    <p className="text-xs text-blue-700 font-bold">Pilih jawabanmu:</p>
                    {currentQ.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectP1(idx)}
                        className="w-full p-2.5 rounded-xl bg-blue-50/60 hover:bg-blue-100 text-left text-xs md:text-sm font-bold text-slate-800 border border-blue-200 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <span className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs flex items-center justify-center font-black shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs font-bold text-blue-800 bg-blue-50/70 rounded-xl border border-blue-200">
                    <p className="text-base font-extrabold mb-1">🔒 Jawaban Terkunci!</p>
                    <p className="text-slate-500">
                      {choice2 === null ? `Menunggu ${player2Name}...` : 'Memproses...'}
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-2 pt-1">
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                    <p className="text-slate-700 mb-1">
                      Pilihan {player1Name}: <strong>{choice1 !== null ? currentQ.options[choice1] : '-'}</strong>
                    </p>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${
                        choice1 === currentQ.correctAnswer
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {choice1 === currentQ.correctAnswer ? '✅ Benar (+1 Poin)' : '❌ Salah (-1 Poin)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Player 2 Panel */}
            <div
              className={`p-4 rounded-2xl border-2 transition-all ${
                choice2 !== null ? 'bg-red-50/50 border-red-400' : 'bg-white border-red-300 ring-2 ring-red-100'
              }`}
            >
              <div className="flex items-center justify-between mb-3 border-b border-red-100 pb-2">
                <span className="font-extrabold text-sm text-red-900 font-['Fredoka']">
                  🔴 {player2Name}
                </span>
                <span className="text-xs font-bold bg-red-100 text-red-900 px-3 py-1 rounded-full">
                  {score2} Poin
                </span>
              </div>

              {!isRevealed ? (
                choice2 === null ? (
                  <div className="space-y-2">
                    <p className="text-xs text-red-700 font-bold">Pilih jawabanmu:</p>
                    {currentQ.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectP2(idx)}
                        className="w-full p-2.5 rounded-xl bg-red-50/60 hover:bg-red-100 text-left text-xs md:text-sm font-bold text-slate-800 border border-red-200 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                      >
                        <span className="w-6 h-6 rounded-lg bg-red-600 text-white text-xs flex items-center justify-center font-black shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs font-bold text-red-800 bg-red-50/70 rounded-xl border border-red-200">
                    <p className="text-base font-extrabold mb-1">🔒 Jawaban Terkunci!</p>
                    <p className="text-slate-500">
                      {choice1 === null ? `Menunggu ${player1Name}...` : 'Memproses...'}
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-2 pt-1">
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs">
                    <p className="text-slate-700 mb-1">
                      Pilihan {player2Name}: <strong>{choice2 !== null ? currentQ.options[choice2] : '-'}</strong>
                    </p>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black ${
                        choice2 === currentQ.correctAnswer
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {choice2 === currentQ.correctAnswer ? '✅ Benar (+1 Poin)' : '❌ Salah (-1 Poin)'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reveal & Pedagogical Explanation Box with hands-free progression */}
          {isRevealed && (
            <div
              onClick={handleNextQuestion}
              className="mt-4 p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-2 animate-fade-in cursor-pointer hover:bg-amber-100/90 transition-all shadow-sm"
              title="Klik untuk langsung melaju ke soal berikutnya"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-amber-900 uppercase">
                  💡 Penjelasan Sains & Kunci Jawaban:
                </p>
                <span className="text-[11px] font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
                  Lanjut Otomatis... ➔
                </span>
              </div>
              <p className="text-sm font-semibold text-amber-950">
                Kunci Jawaban: <strong>{currentQ.options[currentQ.correctAnswer]}</strong>
              </p>
              <p className="text-xs text-amber-900 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
