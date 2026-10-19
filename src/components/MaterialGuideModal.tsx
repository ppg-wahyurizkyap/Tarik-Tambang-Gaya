import React, { useState } from 'react';
import { X, BookOpen, Compass, ShieldAlert, Sparkles, HelpCircle, Check, ArrowRight } from 'lucide-react';

interface MaterialGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MaterialGuideModal: React.FC<MaterialGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'gesek' | 'jenis' | 'miskonsepsi'>('gesek');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border-4 border-sky-300 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 bg-gradient-to-r from-sky-500 to-blue-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-extrabold font-['Fredoka']">Bahan Ajar IPAS Kelas 4 SD</h2>
              <p className="text-xs text-sky-100 font-medium">Materi Inti: Gaya dan Pengaruhnya terhadap Benda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-sky-50 p-2 gap-2 border-b border-sky-100 shrink-0">
          <button
            onClick={() => setActiveTab('gesek')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs md:text-sm font-['Fredoka'] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'gesek'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-sky-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Fokus: Gaya Gesek</span>
          </button>
          <button
            onClick={() => setActiveTab('jenis')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs md:text-sm font-['Fredoka'] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'jenis'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-sky-100'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Jenis-Jenis Gaya</span>
          </button>
          <button
            onClick={() => setActiveTab('miskonsepsi')}
            className={`flex-1 py-2.5 px-3 rounded-2xl font-bold text-xs md:text-sm font-['Fredoka'] transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'miskonsepsi'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-sky-100'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>7 Miskonsepsi Gaya</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {activeTab === 'gesek' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                <h3 className="font-extrabold text-blue-900 text-base md:text-lg mb-1 flex items-center gap-2">
                  <span>Apa itu Gaya Gesek?</span>
                </h3>
                <p className="text-blue-950 font-medium">
                  Gaya gesek terjadi karena adanya interaksi sentuhan antara dua permukaan benda yang saling bersentuhan. Arah gaya gesek selalu <strong>berlawanan</strong> dengan arah gerak benda.
                </p>
              </div>

              {/* Grid 2x2: Manfaat, Kerugian, Memperbesar, Memperkecil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Manfaat */}
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
                  <h4 className="font-extrabold text-emerald-800 text-base mb-2 flex items-center gap-1.5">
                    <Check className="w-5 h-5 text-emerald-600" /> 1. Manfaat Gaya Gesek
                  </h4>
                  <ul className="space-y-1.5 text-xs md:text-sm text-emerald-950">
                    <li>• <strong>Membantu manusia berjalan:</strong> Tanpa gesekan antara sol sepatu dan lantai, kita akan selalu terpeleset.</li>
                    <li>• <strong>Menghentikan laju kendaraan:</strong> Karet rem bergesekan dengan roda sepeda/motor.</li>
                    <li>• <strong>Cengkeraman ban:</strong> Menjaga mobil tetap stabil melaju di jalan.</li>
                    <li>• <strong>Menghasilkan kehangatan:</strong> Menggosokkan kedua tangan saat dingin.</li>
                    <li>• <strong>Menghaluskan kayu:</strong> Menggunakan kertas amplas.</li>
                    <li>• <strong>Memegang benda:</strong> Membantu pensil dan cangkir tidak licin lepas dari jemari.</li>
                  </ul>
                </div>

                {/* 2. Kerugian */}
                <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4">
                  <h4 className="font-extrabold text-rose-800 text-base mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-5 h-5 text-rose-600" /> 2. Kerugian Gaya Gesek
                  </h4>
                  <ul className="space-y-1.5 text-xs md:text-sm text-rose-950">
                    <li>• <strong>Ban kendaraan menjadi aus / botak:</strong> Setelah lama bergesekan dengan aspal.</li>
                    <li>• <strong>Sol sepatu menjadi tipis:</strong> Terkikis oleh permukaan jalan semen atau aspal.</li>
                    <li>• <strong>Keausan mesin:</strong> Komponen mesin yang saling bergesekan tanpa pelumas cepat panas dan rusak.</li>
                    <li>• <strong>Engsel pintu berdecit kriet:</strong> Menimbulkan suara bising dan kaku digerakkan.</li>
                    <li>• <strong>Beban berat sulit digeser:</strong> Lantai semen yang kasar membuat lemari sulit diseret.</li>
                  </ul>
                </div>

                {/* 3. Cara Memperbesar */}
                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                  <h4 className="font-extrabold text-amber-800 text-base mb-2 flex items-center gap-1.5">
                    <ArrowRight className="w-5 h-5 text-amber-600" /> 3. Cara Memperbesar Gaya Gesek
                  </h4>
                  <p className="text-xs text-amber-900 mb-2 font-semibold">Digunakan saat kita membutuhkan cengkeraman & keselamatan:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-amber-950">
                    <li>• Membuat alur / motif bergaris pada ban kendaraan.</li>
                    <li>• Memberi pola bergerigi pada sol sepatu atau sandal.</li>
                    <li>• Menggunakan sepatu pul berpaku pada lapangan rumput sepak bola.</li>
                    <li>• Mengoleskan serbuk kapur magnesium pada telapak tangan atlet senam/panjat.</li>
                    <li>• Memberi plester karet kasar pada tepi anak tangga.</li>
                  </ul>
                </div>

                {/* 4. Cara Memperkecil */}
                <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4">
                  <h4 className="font-extrabold text-sky-800 text-base mb-2 flex items-center gap-1.5">
                    <ArrowRight className="w-5 h-5 text-sky-600" /> 4. Cara Memperkecil Gaya Gesek
                  </h4>
                  <p className="text-xs text-sky-900 mb-2 font-semibold">Digunakan agar gerakan menjadi ringan, mulus, dan tidak cepat aus:</p>
                  <ul className="space-y-1.5 text-xs md:text-sm text-sky-950">
                    <li>• Mengoleskan oli / minyak pelumas pada rantai sepeda dan engsel pintu.</li>
                    <li>• Memasang roda atau troli di bawah lemari/koper pakaian yang berat.</li>
                    <li>• Memasang laher / bantalan pelor peluru baja (bearing) pada poros kipas & roda.</li>
                    <li>• Menghaluskan permukaan lintasan perosotan anak.</li>
                    <li>• Menaburkan serbuk kristal halus pada papan karambol.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'jenis' && (
            <div className="space-y-4">
              <div className="border-2 border-slate-200 rounded-2xl p-4 bg-slate-50">
                <h4 className="font-extrabold text-slate-900 text-base mb-1">Pengertian & Pengaruh Gaya</h4>
                <p className="text-slate-700 text-xs md:text-sm mb-2">
                  <strong>Gaya</strong> adalah tarikan atau dorongan yang diberikan pada benda.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs font-semibold text-slate-800">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">1. Benda diam menjadi bergerak</div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">2. Benda bergerak menjadi berhenti</div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">3. Mengubah arah gerak benda</div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-center">4. Mengubah bentuk benda</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-orange-50 border-2 border-orange-200">
                  <h4 className="font-extrabold text-orange-900 text-sm mb-1">💪 Gaya Otot</h4>
                  <p className="text-xs text-orange-950 mb-2">Dihasilkan oleh kontraksi otot tubuh manusia atau hewan.</p>
                  <p className="text-xs text-orange-800 font-semibold">Contoh: Menendang bola, mendorong gerobak, mengangkat kardus, kuda menarik delman, menarik tali tambang.</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
                  <h4 className="font-extrabold text-purple-900 text-sm mb-1">🪢 Gaya Pegas</h4>
                  <p className="text-xs text-purple-950 mb-2">Dihasilkan oleh benda lentur (elastis) yang dapat kembali ke bentuk semula.</p>
                  <p className="text-xs text-purple-800 font-semibold">Contoh: Ketapel, busur panah, trampolin, per kasur springbed, pulpen cetik.</p>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-50 border-2 border-cyan-200">
                  <h4 className="font-extrabold text-cyan-900 text-sm mb-1">🧲 Gaya Magnet</h4>
                  <p className="text-xs text-cyan-950 mb-2">Gaya tarikan atau tolakan yang ditimbulkan oleh magnet.</p>
                  <p className="text-xs text-cyan-800 font-semibold">Contoh: Magnet kulkas, kompas, speaker, derek pengangkat besi. <em>Ingat: Magnet hanya menarik benda tertentu (besi, baja, nikel), bukan semua logam!</em></p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'miskonsepsi' && (
            <div className="space-y-3">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-xs md:text-sm text-amber-950">
                <strong>Pedoman Guru & Murid:</strong> Seringkali terdapat pemahaman keliru mengenai konsep gaya. Berikut adalah 7 miskonsepsi umum beserta pelurusannya:
              </div>

              <div className="space-y-2.5 text-xs md:text-sm">
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="font-bold text-red-700">❌ Miskonsepsi 1: "Gaya gesek selalu merugikan."</p>
                  <p className="text-emerald-800 font-medium mt-1">
                    ✅ <strong>Koreksi:</strong> Tidak selalu merugikan! Gaya gesek sangat kita perlukan untuk berjalan tanpa terpeleset, pengereman sepeda, dan memegang benda.
                  </p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="font-bold text-red-700">❌ Miskonsepsi 2: "Gaya gesek selalu menguntungkan."</p>
                  <p className="text-emerald-800 font-medium mt-1">
                    ✅ <strong>Koreksi:</strong> Gaya gesek juga merugikan ketika membuat ban aus, sol sepatu botak, dan mesin kendaraan cepat panas serta macet.
                  </p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="font-bold text-red-700">❌ Miskonsepsi 3: "Gaya gesek harus selalu diperbesar."</p>
                  <p className="text-emerald-800 font-medium mt-1">
                    ✅ <strong>Koreksi:</strong> Pada bagian mesin yang berputar atau rantai sepeda, gaya gesek justru harus diperkecil memakai oli agar tidak macet dan aus.
                  </p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="font-bold text-red-700">❌ Miskonsepsi 4: "Gaya gesek harus selalu diperkecil."</p>
                  <p className="text-emerald-800 font-medium mt-1">
                    ✅ <strong>Koreksi:</strong> Jika gaya gesek rem atau sol sepatu diperkecil, kita akan terpeleset jatuh dan kendaraan tidak bisa berhenti.
                  </p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="font-bold text-red-700">❌ Miskonsepsi 5: "Permukaan licin selalu lebih baik daripada kasar."</p>
                  <p className="text-emerald-800 font-medium mt-1">
                    ✅ <strong>Koreksi:</strong> Lantai kamar mandi atau jalan aspal yang terlalu licin sangat berbahaya. Permukaan kasar diperlukan untuk cengkeraman pijakan.
                  </p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="font-bold text-red-700">❌ Miskonsepsi 6: "Gaya hanya menyebabkan benda bergerak."</p>
                  <p className="text-emerald-800 font-medium mt-1">
                    ✅ <strong>Koreksi:</strong> Gaya juga dapat menghentikan gerak benda, membelokkan arah gerak benda, serta mengubah bentuk benda (seperti plastisin).
                  </p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl">
                  <p className="font-bold text-red-700">❌ Miskonsepsi 7: "Semua logam bisa ditarik magnet."</p>
                  <p className="text-emerald-800 font-medium mt-1">
                    ✅ <strong>Koreksi:</strong> Magnet hanya menarik logam feromagnetik seperti besi, baja, dan nikel. Emas, perak, dan aluminium tidak dapat ditarik magnet biasa.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-['Fredoka'] cursor-pointer transition-all shadow-md"
          >
            Tutup & Mulai Berlatih
          </button>
        </div>
      </div>
    </div>
  );
};
