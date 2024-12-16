import { Team } from './Team';
import { GameStates } from 'src/types/GameStates';
import { Question, QuestionBank } from 'src/types/QuestionBank';
import { Action } from 'src/types/GameMove';
import { GameState } from 'src/types/GameState';

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
  getGameState(teamId: string): GameState {
    return teamId === this.adminId
      ? this.getGameForAdminView()
      : this.getGameForTeamView(teamId);
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
          if (wasSabatoged) score = score / 4;

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

  getGameForAdminView(): GameState {
    return {
      isAdmin: true,
      gameId: this.gameId,
      adminId: this.adminId,
      state: this.state,
      teams: this.teams,
      questionBank: this.questionBank,
      currentQuestion: this.currentQuestion,
      currentTeamTurn: this.currentTeamTurn,
      actionQueue: this.actionQueue,
      readyForNextState:
        this.state === 'WAITING'
          ? Boolean(this.teams.length > 0)
          : this.state === 'PICKING_QUESTION'
            ? Boolean(this.currentQuestion?.question?.question)
            : this.state === 'ANSWERING'
              ? this.areAllActionsIn()
              : this.state === 'RESULTS'
                ? true
                : this.state === 'OVER'
                  ? true
                  : false,
    };
  }

  getGameForTeamView(teamId: string): GameState {
    return {
      isAdmin: false,
      gameId: this.gameId,
      state: this.state,
      teams: this.teams.map((T) => T.getInfoForTeamView(T.teamId === teamId)),
      questionBank: {
        categories: this.questionBank.categories.map((C) => {
          return {
            ...C,
            200: { ...C[200], correctAnswer: undefined },
            400: { ...C[400], correctAnswer: undefined },
            600: { ...C[600], correctAnswer: undefined },
            800: { ...C[800], correctAnswer: undefined },
            1000: { ...C[1000], correctAnswer: undefined },
          };
        }),
      },
      currentQuestion: {
        ...this.currentQuestion,
        question: {
          ...this.currentQuestion?.question,
          correctAnswer: undefined,
        },
      },
      currentTeamTurn: this.currentTeamTurn,
      actionQueue:
        this.state === 'RESULTS'
          ? this.actionQueue
          : this.actionQueue.map((A) => A.teamName),
    };
  }
}
