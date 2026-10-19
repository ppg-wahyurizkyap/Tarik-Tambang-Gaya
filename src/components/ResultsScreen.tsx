import React, { useState, useEffect } from 'react';
import { PlayerAnswerRecord, GameMode, SquadTeam } from '../types/game';
import {
  Trophy,
  RotateCcw,
  Home,
  Award,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Printer,
  MessageSquareHeart,
  Medal,
  Crown,
  Sparkles,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../services/audio';

interface ResultsScreenProps {
  mode: GameMode;
  nameA: string;
  nameB?: string;
  scoreA: number;
  scoreB?: number;
  winner: 'A' | 'B' | 'DRAW';
  totalQuestions: number;
  records: PlayerAnswerRecord[];
  elapsedSeconds: number;
  podiumTeams?: {
    first: SquadTeam;
    second: SquadTeam;
    third?: SquadTeam;
  };
  onPlayAgain: () => void;
  onChangeMode: () => void;
  onReturnToMenu: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  mode,
  nameA,
  nameB,
  scoreA,
  scoreB = 0,
  winner,
  totalQuestions,
  records,
  elapsedSeconds,
  podiumTeams,
  onPlayAgain,
  onChangeMode,
  onReturnToMenu,
}) => {
  const [showWrongList, setShowWrongList] = useState(true);
  const [reflectionAnswers, setReflectionAnswers] = useState({
    r1: '',
    r2: '',
    r3: '',
    r4: '',
    r5: '',
  });

  // Multistage fireworks cannon & grand celebration fanfare
  const triggerGrandCelebration = () => {
    sound.playGrandTrophyFanfare();

    const fireCannon = (originX: number, angle: number, colors: string[]) => {
      try {
        confetti({
          particleCount: 80,
          angle,
          spread: 60,
          origin: { x: originX, y: 0.65 },
          colors,
          shapes: ['circle', 'square'],
        });
      } catch {}
    };

    const goldColors = ['#F59E0B', '#FBBF24', '#D97706', '#FCD34D', '#FFFBEB'];
    const silverColors = ['#94A3B8', '#CBD5E1', '#E2E8F0', '#64748B'];
    const bronzeColors = ['#B45309', '#D97706', '#92400E', '#FDE68A'];
    const rainbowColors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

    // Wave 1: Double side cannons
    fireCannon(0.15, 60, goldColors);
    fireCannon(0.85, 120, silverColors);

    // Wave 2: Center sky rocket burst
    setTimeout(() => {
      try {
        confetti({
          particleCount: 120,
          spread: 100,
          origin: { x: 0.5, y: 0.6 },
          colors: rainbowColors,
        });
      } catch {}
    }, 450);

    // Wave 3: Bronze & Gold cross-blasts
    setTimeout(() => {
      fireCannon(0.3, 70, bronzeColors);
      fireCannon(0.7, 110, goldColors);
    }, 950);

    // Wave 4: Grand finale shower
    setTimeout(() => {
      try {
        confetti({
          particleCount: 150,
          spread: 140,
          origin: { x: 0.5, y: 0.45 },
          colors: [...goldColors, ...rainbowColors],
        });
      } catch {}
    }, 1600);
  };

  useEffect(() => {
    if (podiumTeams) {
      triggerGrandCelebration();
      const t = setTimeout(() => {
        sound.startBGM();
      }, 2600);
      return () => clearTimeout(t);
    } else {
      if (winner !== 'DRAW') {
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      }
      sound.startBGM();
    }
  }, [podiumTeams, winner]);

  // Aggregate stats
  const totalCorrect = records.filter(r => r.isCorrect).length;
  const totalIncorrect = records.length - totalCorrect;
  const accuracyPercent = records.length > 0 ? Math.round((totalCorrect / records.length) * 100) : 0;

  // Breakdown by category
  const categories = [
    { key: 'pengertian_pengaruh', label: '1. Pengertian & Pengaruh Gaya' },
    { key: 'gaya_otot', label: '2. Gaya Otot' },
    { key: 'gaya_pegas', label: '3. Gaya Pegas' },
    { key: 'gaya_magnet', label: '4. Gaya Magnet' },
    { key: 'manfaat_gesek', label: '5. Manfaat Gaya Gesek' },
    { key: 'kerugian_gesek', label: '6. Kerugian Gaya Gesek' },
    { key: 'memperbesar_gesek', label: '7. Cara Memperbesar Gaya Gesek' },
    { key: 'memperkecil_gesek', label: '8. Cara Memperkecil Gaya Gesek' },
  ];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m} menit ${s} detik`;
  };

  const wrongRecords = records.filter(r => !r.isCorrect);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* ========================================================
          GRAND CHAMPION PODIUM (JUARA 1, 2, 3) FOR SQUAD TOURNAMENT
      ======================================================== */}
      {podiumTeams && (
        <div className="bg-gradient-to-b from-amber-400 via-orange-400 to-amber-500 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-white text-center relative overflow-hidden animate-fade-in">
          {/* Decorative Sparkles & Ribbon */}
          <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-white text-amber-900 font-black text-xs md:text-sm shadow-lg mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>PENGANUGERAHAN JUARA TURNAMEN TARIK TAMBANG</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white font-['Fredoka'] tracking-wide drop-shadow-md mb-2">
            PANGGUNG JUARA KELAS 🏆
          </h1>
          <p className="text-amber-100 font-extrabold text-sm md:text-base drop-shadow-xs max-w-xl mx-auto mb-6">
            Selamat kepada seluruh regu yang telah berjuang keras memahami konsep gaya gesek!
          </p>

          {/* 3-Tier Olympic Podium */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 items-end max-w-2xl mx-auto pt-4">
            {/* JUARA 2 (PERAK 🥈) - Left Pedestal */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-slate-200 border-4 border-slate-300 flex items-center justify-center shadow-lg mb-2 relative">
                <Medal className="w-8 h-8 md:w-10 md:h-10 text-slate-500" />
                <span className="absolute -top-2 -right-2 bg-slate-700 text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full">
                  #2
                </span>
              </div>
              <h3 className="font-black text-xs md:text-base text-white font-['Fredoka'] truncate max-w-full">
                {podiumTeams.second.name}
              </h3>
              <p className="text-[11px] font-bold text-slate-100 mb-2 truncate max-w-full">
                {podiumTeams.second.members.map(m => m.name).join(', ')}
              </p>
              <div className="w-full bg-gradient-to-t from-slate-400 to-slate-200 rounded-t-2xl pt-4 pb-3 px-2 shadow-xl border-t-4 border-white/60 min-h-[90px] md:min-h-[110px] flex flex-col justify-between">
                <span className="text-xs md:text-sm font-black text-slate-800">JUARA 2</span>
                <span className="text-xs md:text-sm font-extrabold text-slate-900 bg-white/70 py-0.5 px-2 rounded-full">
                  {podiumTeams.second.totalTournamentPoints} Poin
                </span>
              </div>
            </div>

            {/* JUARA 1 (EMAS 🥇) - Center Pedestal (Highest) */}
            <div className="flex flex-col items-center z-10 scale-105">
              <Crown className="w-9 h-9 text-yellow-200 animate-bounce mb-1 drop-shadow-md" />
              <div className="w-18 h-18 md:w-22 md:h-22 rounded-3xl bg-yellow-300 border-4 border-yellow-100 flex items-center justify-center shadow-2xl mb-2 relative ring-4 ring-yellow-400/80">
                <Trophy className="w-10 h-10 md:w-14 md:h-14 text-amber-700" />
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-md">
                  #1
                </span>
              </div>
              <h3 className="font-black text-sm md:text-lg text-white font-['Fredoka'] truncate max-w-full">
                {podiumTeams.first.name}
              </h3>
              <p className="text-xs font-extrabold text-yellow-100 mb-2 truncate max-w-full">
                {podiumTeams.first.members.map(m => m.name).join(', ')}
              </p>
              <div className="w-full bg-gradient-to-t from-yellow-500 via-amber-300 to-yellow-200 rounded-t-3xl pt-6 pb-4 px-2 shadow-2xl border-t-4 border-white min-h-[130px] md:min-h-[160px] flex flex-col justify-between">
                <div>
                  <span className="text-sm md:text-base font-black text-amber-950 block font-['Fredoka']">
                    JUARA 1
                  </span>
                  <span className="text-[10px] md:text-xs font-bold text-amber-900 uppercase">
                    Kampiun Kelas
                  </span>
                </div>
                <span className="text-xs md:text-base font-black text-amber-950 bg-white/80 py-1 px-3 rounded-full shadow-sm">
                  {podiumTeams.first.totalTournamentPoints} Poin
                </span>
              </div>
            </div>

            {/* JUARA 3 (PERUNGGU 🥉) - Right Pedestal */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 md:w-18 md:h-18 rounded-2xl bg-amber-700/80 border-4 border-amber-600 flex items-center justify-center shadow-lg mb-2 relative">
                <Medal className="w-8 h-8 md:w-10 md:h-10 text-amber-200" />
                <span className="absolute -top-2 -right-2 bg-amber-900 text-white text-[10px] md:text-xs font-black px-2 py-0.5 rounded-full">
                  #3
                </span>
              </div>
              <h3 className="font-black text-xs md:text-base text-white font-['Fredoka'] truncate max-w-full">
                {podiumTeams.third ? podiumTeams.third.name : 'Tim Semifinalis'}
              </h3>
              <p className="text-[11px] font-bold text-amber-100 mb-2 truncate max-w-full">
                {podiumTeams.third ? podiumTeams.third.members.map(m => m.name).join(', ') : '-'}
              </p>
              <div className="w-full bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-2xl pt-4 pb-3 px-2 shadow-xl border-t-4 border-white/60 min-h-[75px] md:min-h-[95px] flex flex-col justify-between text-white">
                <span className="text-xs md:text-sm font-black">JUARA 3</span>
                <span className="text-xs md:text-sm font-extrabold text-amber-100 bg-black/20 py-0.5 px-2 rounded-full">
                  {podiumTeams.third ? `${podiumTeams.third.totalTournamentPoints} Poin` : 'Peringkat 3'}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Grand Celebration Action Bar */}
          <div className="mt-6 pt-4 border-t border-white/30 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                triggerGrandCelebration();
              }}
              className="px-5 py-2.5 rounded-2xl bg-white hover:bg-amber-100 text-amber-950 font-black font-['Fredoka'] text-xs md:text-sm shadow-xl border-2 border-yellow-300 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
              <span>🎆 Ledakkan Kembang Api & Fanfare Lagi!</span>
            </button>
          </div>
        </div>
      )}

      {/* Standard Victory Card (For Solo or Duel modes) */}
      {!podiumTeams && (
        <div className="bg-gradient-to-br from-white to-sky-50 rounded-3xl p-6 md:p-8 shadow-2xl border-4 border-yellow-300 text-center relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center shadow-lg mb-3">
            <Trophy className="w-12 h-12 text-amber-500 animate-bounce" />
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-blue-950 font-['Fredoka'] mb-1">
            {winner === 'A'
              ? `🏆 Selamat! ${nameA} Menang! 🎉`
              : winner === 'B'
              ? `🏆 Selamat! ${nameB || 'Komputer'} Menang! 🎉`
              : '🤝 Pertandingan Berakhir Seri!'}
          </h1>
          <p className="text-slate-600 font-semibold text-sm md:text-base">
            Tarik Tali, Asah Logika, Taklukkan Miskonsepsi!
          </p>

          {/* Score comparison pill */}
          <div className="flex items-center justify-center gap-4 md:gap-8 my-6">
            <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-md min-w-[120px]">
              <span className="text-xs font-bold uppercase opacity-80 block">{nameA}</span>
              <span className="text-3xl font-extrabold font-['Fredoka']">{scoreA} Poin</span>
            </div>

            <span className="text-2xl font-black text-slate-400">VS</span>

            <div className="bg-red-600 text-white px-6 py-3 rounded-2xl shadow-md min-w-[120px]">
              <span className="text-xs font-bold uppercase opacity-80 block">{nameB || 'Komputer'}</span>
              <span className="text-3xl font-extrabold font-['Fredoka']">{scoreB} Poin</span>
            </div>
          </div>

          {/* Highlight Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-bold block">Total Soal</span>
              <span className="text-xl font-extrabold text-slate-800 font-['Fredoka']">{totalQuestions} Butir</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
              <span className="text-xs text-emerald-600 font-bold block">Jawaban Benar</span>
              <span className="text-xl font-extrabold text-emerald-700 font-['Fredoka']">{totalCorrect} Soal</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs">
              <span className="text-xs text-amber-600 font-bold block">Jawaban Salah</span>
              <span className="text-xl font-extrabold text-amber-700 font-['Fredoka']">{totalIncorrect} Soal</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-blue-200 shadow-xs">
              <span className="text-xs text-blue-600 font-bold block">Akurasi Nilai</span>
              <span className="text-xl font-extrabold text-blue-700 font-['Fredoka']">{accuracyPercent}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            ⏱️ Waktu Bermain: {formatTime(elapsedSeconds)}
          </p>
        </div>
      )}

      {/* Category Mastery Breakdown */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-slate-200 space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-6 h-6 text-indigo-600" />
          <h2 className="text-lg md:text-xl font-extrabold text-slate-800 font-['Fredoka']">
            Ringkasan Penguasaan Materi Berdasarkan Kategori
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map(cat => {
            const catRecords = records.filter(r => r.category === cat.key);
            const catCorrect = catRecords.filter(r => r.isCorrect).length;
            const catTotal = catRecords.length;
            const catPct = catTotal > 0 ? Math.round((catCorrect / catTotal) * 100) : null;

            return (
              <div key={cat.key} className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-700">{cat.label}</span>
                  <span className={catPct !== null && catPct >= 75 ? 'text-emerald-600' : 'text-slate-500'}>
                    {catTotal > 0 ? `${catCorrect}/${catTotal} (${catPct}%)` : 'Belum diuji'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      catPct === null
                        ? 'w-0'
                        : catPct >= 75
                        ? 'bg-emerald-500'
                        : catPct >= 50
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${catPct ?? 0}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wrong Answer Review List */}
      {wrongRecords.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-rose-200 space-y-4">
          <div
            onClick={() => setShowWrongList(!showWrongList)}
            className="flex items-center justify-between cursor-pointer select-none border-b border-rose-100 pb-3"
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-6 h-6 text-rose-500" />
              <h2 className="text-lg md:text-xl font-extrabold text-slate-800 font-['Fredoka']">
                Daftar Pembahasan Soal yang Perlu Dipelajari Lagi ({wrongRecords.length} Soal)
              </h2>
            </div>
            {showWrongList ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>

          {showWrongList && (
            <div className="space-y-4 pt-2">
              {wrongRecords.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 text-sm space-y-2">
                  <p className="font-extrabold text-slate-900">
                    {idx + 1}. {item.questionText}
                  </p>
                  <p className="text-xs text-rose-700 font-semibold">
                    ❌ Jawaban Kamu: {item.userAnswerIndex !== null ? `Opsi ${String.fromCharCode(65 + item.userAnswerIndex)}` : 'Waktu Habis'}
                  </p>
                  <p className="text-xs text-emerald-800 font-bold">
                    ✅ Jawaban Benar: Opsi {String.fromCharCode(65 + item.correctAnswerIndex)}
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-rose-200 text-xs text-slate-700">
                    <strong>Penjelasan:</strong> {item.explanation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student Reflection Section (Pertanyaan Refleksi Siswa) */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-6 shadow-xl border-2 border-yellow-300 space-y-4">
        <div className="flex items-center gap-2 border-b border-yellow-200 pb-3">
          <MessageSquareHeart className="w-6 h-6 text-amber-600" />
          <div>
            <h2 className="text-lg md:text-xl font-extrabold text-amber-950 font-['Fredoka']">
              Lembar Refleksi Diri Siswa
            </h2>
            <p className="text-xs text-amber-800">
              Yuk, renungkan pemahamanmu tentang gaya gesek setelah bermain hari ini!
            </p>
          </div>
        </div>

        <div className="space-y-3.5 text-xs md:text-sm">
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              1. Apa contoh manfaat gaya gesek yang kamu temukan hari ini?
            </label>
            <input
              type="text"
              placeholder="Contoh: Membantu sol sepatu mencengkeram tanah agar tidak terpeleset..."
              value={reflectionAnswers.r1}
              onChange={e => setReflectionAnswers({ ...reflectionAnswers, r1: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              2. Apa contoh kerugian gaya gesek?
            </label>
            <input
              type="text"
              placeholder="Contoh: Ban sepeda menjadi aus/botak setelah sering dipakai..."
              value={reflectionAnswers.r2}
              onChange={e => setReflectionAnswers({ ...reflectionAnswers, r2: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              3. Kapan gaya gesek perlu diperbesar?
            </label>
            <input
              type="text"
              placeholder="Contoh: Saat berjalan di lantai basah, rem kendaraan, atau sepatu bola..."
              value={reflectionAnswers.r3}
              onChange={e => setReflectionAnswers({ ...reflectionAnswers, r3: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              4. Kapan gaya gesek perlu diperkecil?
            </label>
            <input
              type="text"
              placeholder="Contoh: Pada rantai sepeda (diberi oli), engsel pintu, dan roda koper..."
              value={reflectionAnswers.r4}
              onChange={e => setReflectionAnswers({ ...reflectionAnswers, r4: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              5. Mengapa gaya gesek tidak selalu merugikan?
            </label>
            <input
              type="text"
              placeholder="Contoh: Karena tanpa gaya gesek kita tidak bisa berjalan dan rem tidak berfungsi!"
              value={reflectionAnswers.r5}
              onChange={e => setReflectionAnswers({ ...reflectionAnswers, r5: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrint}
          className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-['Fredoka'] flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Printer className="w-5 h-5 text-slate-600" />
          <span>Cetak Lembar Nilai</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onPlayAgain}
            className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-['Fredoka'] flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Main Lagi</span>
          </button>

          <button
            onClick={onChangeMode}
            className="py-3 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-['Fredoka'] flex items-center gap-2 cursor-pointer shadow-md"
          >
            <span>Ganti Mode</span>
          </button>

          <button
            onClick={onReturnToMenu}
            className="py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-bold font-['Fredoka'] flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Home className="w-5 h-5" />
            <span>Menu Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};
