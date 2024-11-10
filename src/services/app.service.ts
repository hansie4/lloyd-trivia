import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Game } from 'src/game/Game';
import { Team } from 'src/game/Team';
import { Action } from 'src/types/GameMove';
import { loadQuestionBank } from 'src/util/fileUtil';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  private readonly questionBank = loadQuestionBank();

  private games: Game[] = [];

  getHello(): string {
    return 'Hello World!';
  }

  getGamesDebug(): Game[] {
    return this.games;
  }

  getGameIds(): string[] {
    return this.games.filter((G) => G.state === 'WAITING').map((G) => G.gameId);
  }

  getGame(gameId: string): Game {
    return this.games.find((G) => G.gameId === gameId);
  }

  createNewGame(gameId: string, adminId: string): string {
    if (this.games.find((G) => G.gameId === gameId)) return null;
    this.games.push(new Game(gameId, adminId, this.questionBank));
    this.logger.log(`New game created with id: ${gameId}`);
    return gameId;
  }

  joinGame(gameId: string, teamName: string, avatarId: string): string {
    const game: Game = this.games.find((G) => G.gameId === gameId);

    if (!game) throw new Error('Game does not exist with id: ' + gameId);

    const teamId = randomUUID();

    if (!game.teams.find((T) => T.name === teamName)) {
      game.teams.push(new Team(teamId, teamName, avatarId));
    }

    this.logger.log(`Team with id: ${teamId} has joined game: ${gameId}`);

    return teamId;
  }

  // Methods for admin to progress game
  adminStartGame(adminId: string, gameId: string): void {
    const game = this.getGame(gameId);
    if (!game) throw new Error('Game not found');
    if (adminId !== game.adminId) throw new Error('You are not the admin');
    game.startGame(adminId);
  }

  adminShowQuestions(adminId: string, gameId: string): void {
    const game = this.getGame(gameId);
    if (!game) throw new Error('Game not found');
    if (adminId !== game.adminId) throw new Error('You are not the admin');
    game.showQuestions(adminId);
  }

  adminRevealAnswers(adminId: string, gameId: string): void {
    const game = this.getGame(gameId);
    if (!game) throw new Error('Game not found');
    if (adminId !== game.adminId) throw new Error('You are not the admin');
    game.revealAnswers(adminId);
  }

  adminGoToNextQuestion(adminId: string, gameId: string): void {
    const game = this.getGame(gameId);
    if (!game) throw new Error('Game not found');
    if (adminId !== game.adminId) throw new Error('You are not the admin');
    game.goToNextQuestion(adminId);
  }

  // Method for teams to interact with game
  teamAddAction(teamId: string, action: Action, gameId: string) {
    const game = this.getGame(gameId);
    if (!game) throw new Error('Game not found');
    if (!game.isTeamIdInGame(teamId))
      throw new Error('Your team is not in this game');
    game.addToActionQueue(action);
  }

  selectQuestion(
    teamId: string,
    catId: string,
    questionValue: number,
    gameId: string,
  ) {
    const game = this.getGame(gameId);
    if (!game) throw new Error('Game not found');
    if (!game.isTeamIdInGame(teamId))
      throw new Error('Your team is not in this game');
    if (!catId || !questionValue)
      throw new Error('Missing question information');
    game.selectQuestion(teamId, catId, questionValue);
  }
}
