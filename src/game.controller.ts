import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly game: GameService) {}

  @Get('start/:date')
  start(@Param('date') date: string): { game: string } {
    const game = this.game.start(date);

    return { game };
  }

  @Get(':token/guess/:word')
  guess(
    @Param('token') token: string,
    @Param('word') word: string,
  ): { words: string[] } {
    const words = this.game.guess(token, word);

    return { words };
  }
}
