import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { WordleEvaluatorService } from './wordle-evaluator.service';

@Module({
  imports: [],
  controllers: [GameController],
  providers: [GameService, WordleEvaluatorService],
})
export class GameModule {}
