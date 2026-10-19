import React, { useState, useEffect } from 'react';
import { GameMode } from '../types/game';
import { TugOfWarCanvas } from './TugOfWarCanvas';
import { sound } from '../services/audio';
import { Play, User, Users, ShieldCheck, BookOpen, HelpCircle, Maximize2, Minimize2, Volume2, VolumeX, Sparkles, Download } from 'lucide-react';

interface TitleScreenProps {
  onSelectMode: (mode: GameMode) => void;
  onOpenRules: () => void;
  onOpenMaterials: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onSelectMode,
  onOpenRules,
  onOpenMaterials,
}) => {
  const [selectedMode, setSelectedMode] = useState<GameMode>('SOLO');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundState, setSoundState] = useState({
    bgmEnabled: sound.bgmEnabled,
    bgmVolume: sound.bgmVolume,
  });

  useEffect(() => {
    return sound.subscribe(state => {
      setSoundState({
        bgmEnabled: state.bgmEnabled,
        bgmVolume: state.bgmVolume,
      });
    });
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        console.warn('Fullscreen request declined by browser');
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  const handleCycleSound = () => {
    sound.playClick();
    sound.cycleVolumePreset();
  };

  const handleStart = (mode: GameMode) => {
    sound.playClick();
    if (soundState.bgmEnabled) {
      sound.startBGM();
    }
    onSelectMode(mode);
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-between p-3 md:p-6 overflow-hidden bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-200">
      {/* Top Utility Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-white/90 text-blue-900 font-extrabold text-xs md:text-sm shadow-md border-2 border-white">
            🏫 IPAS Kelas 4 SD
          </span>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-amber-400 text-amber-950 font-bold text-xs shadow-md">
            Materi: Gaya & Gaya Gesek
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMaterials}
            className="p-2.5 rounded-2xl bg-white/90 hover:bg-white text-blue-800 shadow-md border-2 border-white flex items-center gap-1.5 font-bold text-xs cursor-pointer transition-all active:scale-95"
            title="Bahan Ajar Materi Gaya"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline">Bahan Ajar</span>
          </button>

          <button
            onClick={onOpenRules}
            className="p-2.5 rounded-2xl bg-white/90 hover:bg-white text-amber-800 shadow-md border-2 border-white flex items-center gap-1.5 font-bold text-xs cursor-pointer transition-all active:scale-95"
            title="Panduan Permainan"
          >
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">Panduan</span>
          </button>

          <button
            onClick={handleCycleSound}
            className="px-3 py-2 rounded-2xl bg-white/90 hover:bg-white text-slate-800 shadow-md border-2 border-white flex items-center gap-1.5 font-bold text-xs cursor-pointer transition-all active:scale-95"
            title="Atur Musik Latar: Lembut (Santai) / Sedang / Mati"
          >
            {!soundState.bgmEnabled ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-500" />
                <span className="hidden sm:inline text-rose-700 font-extrabold">Musik: Mati</span>
              </>
            ) : soundState.bgmVolume <= 0.05 ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline text-emerald-800 font-extrabold">Musik: Lembut 🍃</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline text-blue-800 font-extrabold">Musik: Sedang 🎵</span>
              </>
            )}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-2xl bg-white/90 hover:bg-white text-slate-800 shadow-md border-2 border-white cursor-pointer transition-all active:scale-95"
            title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5 text-blue-600" /> : <Maximize2 className="w-5 h-5 text-blue-600" />}
          </button>
        </div>
      </div>

      {/* Main Center Content */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center my-auto z-10 space-y-4 md:space-y-6">
        {/* Title Lockup */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-300 text-yellow-950 font-black text-xs md:text-sm shadow-md border-2 border-yellow-400">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>GAME EDUKASI 3D INTERAKTIF</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-['Fredoka'] tracking-wide drop-shadow-[0_4px_8px_rgba(30,58,138,0.4)]">
            TARIK TAMBANG GAYA
          </h1>
        </div>

        {/* Live 3D Centerpiece Showcase */}
        <div className="w-full max-w-2xl h-[170px] sm:h-[220px] md:h-[260px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-sky-200 relative">
          <TugOfWarCanvas
            scoreA={0}
            scoreB={0}
            teamAColor="#2563EB"
            teamBColor="#DC2626"
            hideHUD={true}
          />
        </div>

        {/* Mode Selector Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 max-w-3xl">
          {/* Solo Card */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedMode('SOLO');
            }}
            className={`p-4 rounded-3xl border-3 transition-all cursor-pointer select-none text-left flex flex-col justify-between ${
              selectedMode === 'SOLO'
                ? 'bg-white border-blue-500 shadow-xl scale-102 ring-4 ring-blue-300/60'
                : 'bg-white/85 hover:bg-white border-white/80 shadow-md'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                <User className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900 font-['Fredoka']">SOLO MODE</h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Lawan komputer dengan 3 level kecerdasan (Mudah, Sedang, Sulit).
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-600 mt-3 block">1 Pemain vs AI 🤖</span>
          </div>

          {/* Duel Card */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedMode('DUEL');
            }}
            className={`p-4 rounded-3xl border-3 transition-all cursor-pointer select-none text-left flex flex-col justify-between ${
              selectedMode === 'DUEL'
                ? 'bg-white border-purple-500 shadow-xl scale-102 ring-4 ring-purple-300/60'
                : 'bg-white/85 hover:bg-white border-white/80 shadow-md'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900 font-['Fredoka']">DUEL MODE</h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Tanding berdua pada 1 perangkat. Giliran rahasia & buka skor bersama!
              </p>
            </div>
            <span className="text-[11px] font-bold text-purple-600 mt-3 block">2 Pemain (1 Layar) ⚔️</span>
          </div>

          {/* Squad Card */}
          <div
            onClick={() => {
              sound.playClick();
              setSelectedMode('SQUAD');
            }}
            className={`p-4 rounded-3xl border-3 transition-all cursor-pointer select-none text-left flex flex-col justify-between ${
              selectedMode === 'SQUAD'
                ? 'bg-white border-emerald-500 shadow-xl scale-102 ring-4 ring-emerald-300/60'
                : 'bg-white/85 hover:bg-white border-white/80 shadow-md'
            }`}
          >
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-lg text-slate-900 font-['Fredoka']">SQUAD MODE</h3>
              <p className="text-xs text-slate-600 font-medium mt-1">
                Turnamen 2–5 tim kelas dengan bagan eliminasi & perebutan Juara!
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-3 block">Regu Kelas 🏆</span>
          </div>
        </div>

        {/* Primary Start CTA Button */}
        <button
          onClick={() => handleStart(selectedMode)}
          className="w-full max-w-md py-4 px-8 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xl md:text-2xl font-['Fredoka'] shadow-2xl shadow-orange-500/40 border-4 border-white flex items-center justify-center gap-3 cursor-pointer transform active:scale-95 transition-all"
        >
          <Play className="w-7 h-7 fill-current" />
          <span>MULAI BERMAIN ({selectedMode})</span>
        </button>
      </div>

      {/* Bottom Footer Notice & Standalone HTML Info */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-blue-950 bg-white/70 backdrop-blur-none px-4 py-2 rounded-2xl z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span>🎯 Aturan Skor:</span>
          <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Benar: +1 Poin</span>
          <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">Salah: -1 Poin (Min 0)</span>
        </div>

        <a
          href="/tarik-tambang-gaya.html"
          download="tarik-tambang-gaya.html"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-blue-700 hover:text-blue-900 underline cursor-pointer"
          title="Unduh file HTML mandiri untuk dijalankan tanpa internet"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh Versi HTML Mandiri (tarik-tambang-gaya.html)</span>
        </a>
      </div>
    </div>
  );
};
