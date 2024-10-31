import {
  Controller,
  Get,
  HttpCode,
  Logger,
  MessageEvent,
  Post,
  Query,
  Res,
  Sse,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { interval, map, Observable } from 'rxjs';
import { Game } from 'src/game/Game';
import { Response } from 'express';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('debug')
  debugGames(): Game[] {
    return this.appService.getGamesDebug();
  }

  @Get('games')
  getGames(): string[] {
    return this.appService.getGameIds();
  }

  @Post('games')
  @HttpCode(204)
  createGame(
    @Query('gameId') gameId: string,
    @Query('adminId') adminId: string,
  ): string {
    if (!gameId) throw Error('Missing gameId');
    return this.appService.createNewGame(gameId, adminId);
  }

  @Post('games/join')
  joinGame(
    @Query('gameId') gameId: string,
    @Query('teamName') teamName: string,
    @Query('avatarId') avatarId: string,
  ): string {
    return this.appService.joinGame(gameId, teamName, avatarId);
  }

  @Sse('game-events')
  gameEvents(
    @Query('gameId') gameId: string,
    @Query('playerId') playerId: string,
    @Res() response: Response,
  ): Observable<MessageEvent> {
    const game: Game = this.appService.getGame(gameId);

    if (game && playerId) {
      return interval(1000).pipe(
        map(() => ({ data: game.getGameState(playerId) })),
      );
    } else {
      response.status(400).send();
    }
  }
}
