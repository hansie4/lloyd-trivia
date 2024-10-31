import { GameState } from 'src/types/GameState';
import { Team } from './Team';
import { GameStates } from 'src/types/GameStates';
import { Question, QuestionBank } from 'src/types/QuestionBank';

export class Game {
  gameId: string;
  adminId: string;
  state: GameStates;
  teams: Team[];

  questionBank: QuestionBank;
  currentQuestion: Question;

  constructor(gameId: string, adminId: string, questionBank: QuestionBank) {
    this.gameId = gameId;
    this.adminId = adminId;
    this.state = 'NOT_STARTED';
    this.teams = [];
    this.questionBank = questionBank;
    this.currentQuestion = null;
  }

  getGameState(teamId: string): GameState {
    return {
      questionId:
        teamId === this.adminId
          ? 'HELLO ADMIN ' + teamId
          : 'HELLO Team ' + teamId,
    };
  }

  startGame(questionId: string) {
    if (this.state === 'PICKING_QUESTION') {
      const questionIdentifiers: [] = questionId.split('-');

      if (this.currentQuestion === null) {
      }
    } else {
      throw new Error('Game already in progress');
    }
  }
}
