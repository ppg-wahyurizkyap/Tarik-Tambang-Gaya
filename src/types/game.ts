export type GameMode = 'SOLO' | 'DUEL' | 'SQUAD';

export type QuestionType = 'multiple_choice' | 'true_false';

export type QuestionCategory = 
  | 'pengertian_pengaruh'
  | 'gaya_otot'
  | 'gaya_pegas'
  | 'gaya_magnet'
  | 'manfaat_gesek'
  | 'kerugian_gesek'
  | 'memperbesar_gesek'
  | 'memperkecil_gesek'
  | 'miskonsepsi';

export type FrictionTag = 'manfaat' | 'kerugian' | 'memperbesar' | 'memperkecil' | 'konsep' | 'miskonsepsi';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[]; // 4 options for MC or 2 options ["Benar", "Salah"] for TF
  correctAnswer: number; // index of correct option
  explanation: string;
  category: QuestionCategory;
  difficulty: 'mudah' | 'sedang' | 'sulit';
  frictionTag: FrictionTag;
}

export type ComputerDifficulty = 'mudah' | 'sedang' | 'sulit';

export interface TeamMember {
  id: string;
  name: string;
}

export interface SquadTeam {
  id: string;
  name: string;
  color: string;
  members: TeamMember[];
  currentMemberIndex: number;
  matchScore: number;
  totalTournamentPoints: number;
}

export interface TournamentMatch {
  id: string;
  title: string;
  teamAId: string;
  teamBId: string;
  winnerTeamId?: string;
  loserTeamId?: string;
  teamAScore?: number;
  teamBScore?: number;
  isCompleted: boolean;
  isCurrent: boolean;
  stage: 'penyisihan' | 'semifinal' | 'juara3' | 'final';
  questionCount: number;
  durationSeconds: number;
}

export interface PlayerAnswerRecord {
  questionId: string;
  questionText: string;
  category: QuestionCategory;
  frictionTag: FrictionTag;
  userAnswerIndex: number | null; // null if timed out
  correctAnswerIndex: number;
  isCorrect: boolean;
  explanation: string;
  playerName: string;
}
