import React from 'react';
import { X, Trophy, Users, User, ShieldCheck, Flame } from 'lucide-react';

interface RulesGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesGuideModal: React.FC<RulesGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-yellow-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-yellow-200" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold font-['Fredoka']">Panduan & Aturan Permainan</h2>
              <p className="text-xs text-amber-100 font-medium">Tarik Tambang Gaya — IPAS Kelas 4 SD</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-5 text-slate-800 text-sm">
          {/* Scoring Rules */}
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
            <h3 className="font-extrabold text-amber-900 text-base mb-2 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" /> Aturan Skor & Gerakan Tali
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm">
              <div className="bg-white p-3 rounded-xl border border-emerald-300">
                <span className="font-bold text-emerald-700 block mb-0.5">✅ Jawaban Benar</span>
                <p className="text-slate-600">Mendapatkan <strong>+1 Poin</strong> dan menarik tali mendekati tim kamu!</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-rose-300">
                <span className="font-bold text-rose-700 block mb-0.5">❌ Jawaban Salah</span>
                <p className="text-slate-600">Mengurangi <strong>-1 Poin</strong> (Skor minimal 0, tidak pernah minus).</p>
              </div>
            </div>
            <p className="text-xs text-amber-900 font-medium mt-3">
              ⏰ Waktu habis tanpa menjawab bernilai <strong>0 Poin</strong>. Setiap soal hanya dinilai satu kali untuk menjaga keadilan.
            </p>
          </div>

          {/* Game Modes */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" /> Tiga Mode Permainan Seru
            </h3>

            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex gap-3 items-start">
              <User className="w-6 h-6 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sky-900 text-sm">1. SOLO MODE (1 Pemain)</h4>
                <p className="text-xs text-sky-950">
                  Kamu bertanding sendirian melawan Komputer. Tersedia pilihan kesulitan: <strong>Mudah</strong> (akurasi ~40%), <strong>Sedang</strong> (~70%), atau <strong>Sulit</strong> (~90%).
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex gap-3 items-start">
              <Users className="w-6 h-6 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-purple-900 text-sm">2. DUEL MODE (2 Pemain - 1 Perangkat)</h4>
                <p className="text-xs text-purple-950">
                  Dua murid duduk berhadapan pada satu layar atau laptop. Keduanya mendapatkan soal yang sama dengan giliran bergantian. Kunci jawaban baru dibuka setelah kedua murid mengunci jawabannya!
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex gap-3 items-start">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900 text-sm">3. SQUAD TOURNAMENT (2–5 Tim)</h4>
                <p className="text-xs text-emerald-950">
                  Turnamen antar-kelompok kelas (3–5 murid per tim). Ada bagan pertandingan, perebutan Juara 3, dan Babak Final. Anggota tim menjawab bergiliran secara adil!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold font-['Fredoka'] cursor-pointer transition-all shadow-md"
          >
            Mengerti!
          </button>
        </div>
      </div>
    </div>
  );
};
