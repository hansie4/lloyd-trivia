import { Team } from './Team';
import { GameStates } from 'src/types/GameStates';
import { Question, QuestionBank } from 'src/types/QuestionBank';
import { Action } from 'src/types/GameMove';

export class Game {
  gameId: string;
  adminId: string;
  state: GameStates;
  teams: Team[];
  questionBank: QuestionBank;
  currentQuestion: { question: Question; value: number };
  currentTeamTurn: number;
  actionQueue: Action[];

  constructor(gameId: string, adminId: string, questionBank: QuestionBank) {
    this.gameId = gameId;
    this.adminId = adminId;
    this.state = 'WAITING';
    this.teams = [];
    this.questionBank = questionBank;
    this.currentQuestion = null;
    this.currentTeamTurn = -1;
    this.actionQueue = [];
  }

  debugGameState(): Game {
    return this;
  }

  // State transitions

  // WAITING -> PICKING_QUESTION
  startGame(adminId: string): void {
    if (
      adminId === this.adminId &&
      this.state === 'WAITING' &&
      this.teams.length > 0
    ) {
      this.currentTeamTurn = this.getNextTeam();
      this.state = 'PICKING_QUESTION';
    } else {
      throw new Error('Game already in progress');
    }
  }

  // PICKING_QUESTION -> ANSWERING
  showQuestions(adminId: string): void {
    if (
      adminId === this.adminId &&
      this.state === 'PICKING_QUESTION' &&
      this.currentQuestion
    ) {
      this.state = 'ANSWERING';
    } else {
      throw new Error('Invalid state transition');
    }
  }

  // ANSWERING -> RESULTS
  revealAnswers(adminId: string): void {
    if (
      adminId === this.adminId &&
      this.state === 'ANSWERING' &&
      this.areAllActionsIn()
    ) {
      this.calculateScores();
      this.state = 'RESULTS';
    } else {
      throw new Error('Invalid state transition');
    }
  }

  // RESULTS -> PICKING_QUESTION OR RESULTS -> OVER
  goToNextQuestion(adminId: string): void {
    if (adminId === this.adminId && this.state === 'RESULTS') {
      if (this.areAllQuestionsAnswered()) {
        this.state = 'OVER';
      } else {
        this.currentTeamTurn = this.getNextTeam();
        this.state = 'PICKING_QUESTION';
      }
    } else {
      throw new Error('Invalid state transition');
    }
  }

  // Team actions
  getGameState(teamId: string): any {
    const gameState: any = {
      gameId: this.gameId,
      state: this.state,
      teamId: teamId,
    };

    switch (this.state) {
      case 'WAITING':
        gameState.teams = this.teams.map((T) => {
          return {
            name: T.name,
            avatarId: T.avatarId,
          };
        });
      case 'PICKING_QUESTION':
        gameState.amIPicking =
          this.teams[this.currentTeamTurn].teamId === teamId;
      case 'ANSWERING':
        gameState.teamsAnswered = this.actionQueue.map((A) => A.teamName);
      case 'RESULTS':
        gameState.test = 'test';
      case 'OVER':
        gameState.test = 'test';
    }

    return gameState;
  }

  addToActionQueue(action: Action): void {
    if (
      action.teamId &&
      action.answer !== undefined &&
      this.teams.find((T) => T.teamId === action.teamId) &&
      !this.actionQueue.find((A) => A.teamId === action.teamId)
    ) {
      this.actionQueue.push(action);
    }
  }

  selectQuestion(teamId: string, catId: string, questionValue: number): void {
    if (
      teamId === this.teams[this.currentTeamTurn].teamId &&
      this.state === 'PICKING_QUESTION'
    ) {
      const category = this.questionBank.categories.find(
        (C) => C.catId === catId,
      );

      if (category && !category[questionValue].complete) {
        this.currentQuestion = {
          question: category[questionValue],
          value: questionValue,
        };
      } else {
        throw new Error('Question already completed');
      }
    } else {
      throw new Error('Invalid state transition');
    }
  }

  // Helpers
  areAllActionsIn(): boolean {
    return (
      this.teams.length === this.actionQueue.length &&
      this.actionQueue.length > 0
    );
  }

  areAllQuestionsAnswered(): boolean {
    return !this.questionBank.categories.find((C) => {
      return (
        !C[200].complete ||
        !C[400].complete ||
        !C[600].complete ||
        !C[800].complete ||
        !C[1000].complete
      );
    });
  }

  getNextTeam(): number {
    if (this.currentTeamTurn === -1) return 0;
    if (this.currentTeamTurn === this.teams.length - 1) return 0;
    return this.currentTeamTurn + 1;
  }

  /** How score is calculated:
   *  Answered wrong
   *   - 0 Points
   *  Answered right
   *   - Question values worth of points
   *   - If sabatoged, halve points
   *   - If daily double, double points
   */
  calculateScores(): void {
    if (this.state === 'ANSWERING') {
      const sabatogeMap = this.getSabatogedMap();

      this.actionQueue.forEach((A) => {
        if (A.answer === this.currentQuestion.question.correctAnswer) {
          let score = this.currentQuestion.value;

          const dailyDouble = this.currentQuestion.question.dailyDouble;
          if (dailyDouble) score = score * 2;

          const wasSabatoged = sabatogeMap[A.teamName].length > 0;
          if (wasSabatoged) score = score / 2;

          this.teams.find((T) => T.teamId === A.teamId).score += score;
        }
      });
    } else {
      throw new Error('Invalid state to calculate score');
    }
  }

  // Key will be the team that gotSabatoged and the values will be who sabatoged them
  getSabatogedMap(): { [key: string]: string[] } {
    const sabatogeMap = {};

    this.teams.forEach((T) => (sabatogeMap[T.name] = []));

    this.actionQueue.forEach((A) => {
      if (A.teamToSabatage) {
        sabatogeMap[A.teamToSabatage].push(A.teamName);
      }
    });

    return sabatogeMap;
  }

  isTeamIdInGame(teamId: string): boolean {
    return Boolean(this.teams.find((T) => T.teamId === teamId));
  }
}
