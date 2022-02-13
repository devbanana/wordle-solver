import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { validate, version } from 'uuid';

describe('GameController', () => {
  let gameController: GameController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [GameService],
    }).compile();

    gameController = app.get<GameController>(GameController);
  });

  describe('/game/start', () => {
    it('should return a new game token', () => {
      const result = gameController.start();

      expect(result.game).not.toBe('');
      expect(validate(result.game)).toBeTruthy();
      expect(version(result.game)).toBe(4);
    });
  });
});
