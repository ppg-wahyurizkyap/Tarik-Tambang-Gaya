import React from 'react';
import { Question } from '../types/game';
import { CheckCircle2, XCircle, ArrowRight, BookOpen, Lightbulb } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  question: Question;
  selectedOptionIndex: number | null;
  onNext: () => void;
  playerName?: string;
  isTimedOut?: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  isCorrect,
  question,
  selectedOptionIndex,
  onNext,
  playerName,
  isTimedOut = false,
}) => {
  if (!isOpen) return null;

  const getFrictionBadge = () => {
    switch (question.frictionTag) {
      case 'manfaat':
        return { text: '🌟 Manfaat Gaya Gesek', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'kerugian':
        return { text: '⚠️ Kerugian Gaya Gesek', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'memperbesar':
        return { text: '🔍 Cara Memperbesar Gaya Gesek', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'memperkecil':
        return { text: '💧 Cara Memperkecil Gaya Gesek', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300' };
      case 'miskonsepsi':
        return { text: '💡 Pelurusan Miskonsepsi', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      default:
        return { text: '📚 Konsep Dasar Gaya', bg: 'bg-sky-100 text-sky-800 border-sky-300' };
    }
  };

  const badge = getFrictionBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-yellow-300 overflow-hidden transform transition-all">
        {/* Header Banner */}
        <div className="flex items-center gap-3 mb-4">
          {isCorrect ? (
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 animate-bounce" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center shrink-0 shadow-md">
              <XCircle className="w-9 h-9 text-amber-600" />
            </div>
          )}

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-['Fredoka']">
              {playerName ? `Evaluasi Jawaban: ${playerName}` : 'Umpan Balik Edukatif'}
            </span>
            <h3 className={`text-xl md:text-2xl font-extrabold font-['Fredoka'] leading-tight ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
              {isCorrect
                ? 'Hebat! Jawabanmu Benar! 🎉 (+1 Poin)'
                : isTimedOut
                ? 'Waktu Habis! Yuk, pelajari alasannya! ⏰'
                : 'Hampir Tepat! Yuk, pelajari alasannya! 💪 (-1 Poin)'}
            </h3>
          </div>
        </div>

        {/* Category & Concept Badge */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${badge.bg}`}>
            {badge.text}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Tingkat: {question.difficulty.toUpperCase()}
          </span>
        </div>

        {/* Question & Chosen Answer Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 text-sm">
          <p className="font-bold text-slate-800 mb-2">
            Pertanyaan: <span className="font-normal text-slate-700">{question.text}</span>
          </p>

          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            {!isCorrect && (
              <p className="text-xs text-rose-600 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Jawaban kamu:{' '}
                <span className="font-medium text-slate-700">
                  {selectedOptionIndex !== null ? question.options[selectedOptionIndex] : '(Waktu Habis)'}
                </span>
              </p>
            )}
            <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Kunci Jawaban:{' '}
              <span className="font-extrabold text-emerald-800">
                {question.options[question.correctAnswer]}
              </span>
            </p>
          </div>
        </div>

        {/* Scientific Explanation Box */}
        <div className="bg-amber-50/80 rounded-2xl p-4 border-2 border-amber-200 mb-6 flex gap-3 items-start">
          <Lightbulb className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Alasan Ilmiah (IPAS Kelas 4)
            </h4>
            <p className="text-sm text-amber-950 font-medium leading-relaxed">
              {question.explanation}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onNext}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-base md:text-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer font-['Fredoka']"
        >
          <span>Lanjut ke Babak Berikutnya</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
