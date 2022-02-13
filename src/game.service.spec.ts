import { GameService } from './game.service';
import { Test, TestingModule } from '@nestjs/testing';
import { validate, version } from 'uuid';

describe('GameService', () => {
  let provider: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    provider = module.get<GameService>(GameService);
  });

  it('should start a game', () => {
    const token = provider.start();

    expect(validate(token)).toBeTruthy();
    expect(version(token)).toBe(4);
  });
});
