import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Game } from 'src/game/Game';
import { Team } from 'src/game/Team';
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
    return this.games.map((G) => G.gameId);
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
}
