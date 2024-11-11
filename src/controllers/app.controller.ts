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
    const game: Game = this.appService.getGame(gameId);

    if (game && playerId) {
      return interval(1000).pipe(
        map(() => ({ data: game.getGameState(playerId) })),
      );
    } else {
      response.status(400).send();
    }
  }

  @Post('admin/start')
  adminStart(@Query() adminId: string, @Query() gameId: string) {
    this.appService.adminStartGame(adminId, gameId);
  }

  @Post('admin/show')
  adminShow(@Query() adminId: string, @Query() gameId: string) {
    this.appService.adminShowQuestions(adminId, gameId);
  }

  @Post('admin/reveal')
  adminReveal(@Query() adminId: string, @Query() gameId: string) {
    this.appService.adminRevealAnswers(adminId, gameId);
  }

  @Post('admin/next')
  adminGoToNext(@Query() adminId: string, @Query() gameId: string) {
    this.appService.adminGoToNextQuestion(adminId, gameId);
  }

  @Post('team/answer')
  teamAnswer(
    @Query() teamId: string,
    @Query() gameId: string,
    @Body() action: Action,
  ) {
    this.appService.teamAddAction(teamId, action, gameId);
  }

  @Post('team/pick-question')
  teamPickQuestion(
    @Query() teamId: string,
    @Query() gameId: string,
    @Query() catId: string,
    @Query() questionValue: number,
  ) {
    this.appService.teamSelectQuestion(teamId, catId, questionValue, gameId);
  }
}
