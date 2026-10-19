import React, { useState, useEffect } from 'react';
import { GameMode, PlayerAnswerRecord, SquadTeam } from './types/game';
import { TitleScreen } from './components/TitleScreen';
import { SoloGame } from './components/SoloGame';
import { DuelGame } from './components/DuelGame';
import { SquadGame } from './components/SquadGame';
import { ResultsScreen } from './components/ResultsScreen';
import { RulesGuideModal } from './components/RulesGuideModal';
import { MaterialGuideModal } from './components/MaterialGuideModal';
import { sound } from './services/audio';
import { Volume2, VolumeX, Music } from 'lucide-react';

type AppScreen = 'TITLE' | 'SOLO' | 'DUEL' | 'SQUAD' | 'RESULTS';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('TITLE');
  const [activeMode, setActiveMode] = useState<GameMode>('SOLO');
  const [soundState, setSoundState] = useState({
    bgmEnabled: sound.bgmEnabled,
    sfxEnabled: sound.sfxEnabled,
    isBgmPlaying: sound.isBgmPlaying,
    bgmVolume: sound.bgmVolume,
  });

  useEffect(() => {
    const unsubscribe = sound.subscribe(state => {
      setSoundState({ ...state });
    });
    return unsubscribe;
  }, []);

  // Modals
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);

  // Results State
  const [resultsData, setResultsData] = useState<{
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
  }>({
    nameA: 'Pemain 1',
    nameB: 'Komputer',
    scoreA: 0,
    scoreB: 0,
    winner: 'DRAW',
    totalQuestions: 10,
    records: [],
    elapsedSeconds: 0,
  });

  const handleSelectMode = (mode: GameMode) => {
    setActiveMode(mode);
    if (mode === 'SOLO') setCurrentScreen('SOLO');
    else if (mode === 'DUEL') setCurrentScreen('DUEL');
    else if (mode === 'SQUAD') setCurrentScreen('SQUAD');
  };

  const handleSoloFinish = (
    scoreA: number,
    scoreB: number,
    winner: 'A' | 'B' | 'DRAW',
    records: PlayerAnswerRecord[],
    elapsedSeconds: number
  ) => {
    setResultsData({
      nameA: records[0]?.playerName || 'Pemain 1',
      nameB: 'Komputer',
      scoreA,
      scoreB,
      winner,
      totalQuestions: records.length,
      records,
      elapsedSeconds,
      podiumTeams: undefined,
    });
    setCurrentScreen('RESULTS');
  };

  const handleDuelFinish = (
    scoreA: number,
    scoreB: number,
    winner: 'A' | 'B' | 'DRAW',
    records: PlayerAnswerRecord[],
    elapsedSeconds: number
  ) => {
    setResultsData({
      nameA: 'Pemain 1 (Biru)',
      nameB: 'Pemain 2 (Merah)',
      scoreA,
      scoreB,
      winner,
      totalQuestions: Math.ceil(records.length / 2),
      records,
      elapsedSeconds,
      podiumTeams: undefined,
    });
    setCurrentScreen('RESULTS');
  };

  const handleSquadFinish = (
    championTeam: SquadTeam,
    runnerUpTeam: SquadTeam,
    thirdPlaceTeam?: SquadTeam,
    _allTeams?: SquadTeam[],
    records?: PlayerAnswerRecord[]
  ) => {
    setResultsData({
      nameA: championTeam.name,
      nameB: runnerUpTeam.name,
      scoreA: championTeam.matchScore || championTeam.totalTournamentPoints,
      scoreB: runnerUpTeam.matchScore || runnerUpTeam.totalTournamentPoints,
      winner: 'A',
      totalQuestions: records?.length || 10,
      records: records || [],
      elapsedSeconds: 300,
      podiumTeams: {
        first: championTeam,
        second: runnerUpTeam,
        third: thirdPlaceTeam,
      },
    });
    setCurrentScreen('RESULTS');
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 text-slate-800 font-['Nunito'] flex flex-col justify-between selection:bg-yellow-300 selection:text-slate-900">
      {currentScreen === 'TITLE' && (
        <TitleScreen
          onSelectMode={handleSelectMode}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenMaterials={() => setIsMaterialsOpen(true)}
        />
      )}

      {currentScreen === 'SOLO' && (
        <div className="min-h-screen py-4 md:py-6 flex flex-col justify-center bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100">
          <SoloGame
            onBackToMenu={() => setCurrentScreen('TITLE')}
            onFinishGame={handleSoloFinish}
          />
        </div>
      )}

      {currentScreen === 'DUEL' && (
        <div className="min-h-screen py-4 md:py-6 flex flex-col justify-center bg-gradient-to-b from-purple-200 via-purple-100 to-indigo-100">
          <DuelGame
            onBackToMenu={() => setCurrentScreen('TITLE')}
            onFinishGame={handleDuelFinish}
          />
        </div>
      )}

      {currentScreen === 'SQUAD' && (
        <div className="min-h-screen py-4 md:py-6 flex flex-col justify-center bg-gradient-to-b from-emerald-200 via-emerald-100 to-teal-100">
          <SquadGame
            onBackToMenu={() => setCurrentScreen('TITLE')}
            onFinishTournament={handleSquadFinish}
          />
        </div>
      )}

      {currentScreen === 'RESULTS' && (
        <div className="min-h-screen py-6 md:py-8 flex flex-col justify-center bg-gradient-to-b from-sky-100 via-white to-amber-50">
          <ResultsScreen
            mode={activeMode}
            nameA={resultsData.nameA}
            nameB={resultsData.nameB}
            scoreA={resultsData.scoreA}
            scoreB={resultsData.scoreB}
            winner={resultsData.winner}
            totalQuestions={resultsData.totalQuestions}
            records={resultsData.records}
            elapsedSeconds={resultsData.elapsedSeconds}
            podiumTeams={resultsData.podiumTeams}
            onPlayAgain={() => handleSelectMode(activeMode)}
            onChangeMode={() => setCurrentScreen('TITLE')}
            onReturnToMenu={() => setCurrentScreen('TITLE')}
          />
        </div>
      )}

      {/* Global Modals */}
      <RulesGuideModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
      <MaterialGuideModal isOpen={isMaterialsOpen} onClose={() => setIsMaterialsOpen(false)} />

      {/* Floating Global Audio Widget (Ensures audio status is visible and accessible throughout the game) */}
      {currentScreen !== 'TITLE' && (
        <aside
          aria-label="Pengaturan Musik Latar"
          className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-xl border-2 border-emerald-300 animate-fade-in"
        >
          <button
            onClick={() => {
              sound.playClick();
              sound.toggleMute();
            }}
            className="flex items-center gap-1.5 text-xs font-black cursor-pointer text-slate-800 hover:text-emerald-700 transition-colors select-none"
            title={soundState.bgmEnabled ? 'Klik untuk membisukan musik' : 'Klik untuk memutar musik'}
          >
            {soundState.bgmEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-600" />
                <span className="flex items-center gap-1 text-[11px] text-emerald-900 font-black">
                  <span className="inline-block w-1 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="inline-block w-1 h-3 bg-emerald-600 rounded-full animate-bounce" />
                  <span className="inline-block w-1 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="ml-1">
                    {soundState.bgmVolume <= 0.05 ? 'Musik: Lembut 🍃' : 'Musik: Sedang 🎵'}
                  </span>
                </span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-rose-500" />
                <span className="text-[11px] text-rose-700 font-bold">Musik: Mati</span>
              </>
            )}
          </button>

          {soundState.bgmEnabled && (
            <button
              onClick={() => {
                sound.playClick();
                sound.cycleVolumePreset();
              }}
              className="text-[10px] font-extrabold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-lg border border-emerald-300 cursor-pointer transition-all active:scale-95 ml-1"
              title="Ganti tingkat volume (Lembut / Sedang / Mati)"
            >
              Ubah Vol
            </button>
          )}
        </aside>
      )}
    </div>
  );
}
