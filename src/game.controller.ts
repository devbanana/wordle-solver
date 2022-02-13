import { Controller, Get } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly game: GameService) {}

  @Get('start')
  start(): { game: string } {
    const game = this.game.start();

    return { game };
  }
}
