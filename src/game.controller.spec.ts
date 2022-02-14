import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { validate, version } from 'uuid';
import { WordleEvaluatorService } from './wordle-evaluator.service';

describe('GameController', () => {
  let gameController: GameController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService, WordleEvaluatorService],
    }).compile();

    gameController = app.get<GameController>(GameController);
  });

  describe('/game/start', () => {
    it('should return a new game token', () => {
      const result = gameController.start('2022-02-13');

      expect(result.game).not.toBe('');
      expect(validate(result.game)).toBeTruthy();
      expect(version(result.game)).toBe(4);
    });
  });
});
