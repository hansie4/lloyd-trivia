import { Action } from './GameMove';
import { GameStates } from './GameStates';
import { Question, QuestionBank } from './QuestionBank';

export interface GameState {
  gameId: string;
  state: GameStates;
  teams: {
    teamId: string;
    name: string;
    avatarId: string;
    score: number;
    sabatages: number;
  }[];
  questionBank: QuestionBank;
  adminId?: string;
  currentQuestion: { question: Question; value: number };
  currentTeamTurn: number;
  actionQueue?: Action[];
}
