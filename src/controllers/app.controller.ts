import {
  Body,
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
import { Action } from 'src/types/GameMove';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return 'Hello';
  }

  @Get('debug')
  getDebug(): unknown[] {
    return this.appService.games;
  }

  @Get('games')
  getGames(): unknown[] {
    return this.appService.getGames();
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
    this.logger.log('SSE ENDPOINT HIT');
    response.writeHead(200, { 'Content-Type': 'text/event-stream' });
    const game: Game = this.appService.getGame(gameId);

    if (game && playerId) {
      return interval(500).pipe(
        map(() => ({ data: game.getGameState(playerId) })),
      );
    } else {
      response.status(400).send();
    }
  }

  @Get('game-events-get')
  gameEventsGet(
    @Query('gameId') gameId: string,
    @Query('playerId') playerId: string,
  ) {
    const game: Game = this.appService.getGame(gameId);

    if (game && playerId) {
      return game.getGameState(playerId);
    }
  }

  @Post('admin/start')
  adminStart(@Body() body: { adminId: string; gameId: string }) {
    this.appService.adminStartGame(body.adminId, body.gameId);
  }

  @Post('admin/show')
  adminShow(@Body() body: { adminId: string; gameId: string }) {
    this.appService.adminShowQuestions(body.adminId, body.gameId);
  }

  @Post('admin/reveal')
  adminReveal(@Body() body: { adminId: string; gameId: string }) {
    this.appService.adminRevealAnswers(body.adminId, body.gameId);
  }

  @Post('admin/next')
  adminGoToNext(@Body() body: { adminId: string; gameId: string }) {
    this.appService.adminGoToNextQuestion(body.adminId, body.gameId);
  }

  @Post('team/pick-question')
  teamPickQuestion(
    @Body()
    body: {
      teamId: string;
      gameId: string;
      catId: string;
      questionValue: number;
    },
  ) {
    this.appService.teamSelectQuestion(
      body.teamId,
      body.catId,
      body.questionValue,
      body.gameId,
    );
  }

  @Post('team/answer')
  teamAnswer(@Body() body: { teamId: string; gameId: string; action: Action }) {
    this.appService.teamAddAction(body.teamId, body.action, body.gameId);
  }
}
