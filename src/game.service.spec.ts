import { GameService } from './game.service';
import { Test, TestingModule } from '@nestjs/testing';
import { v4, validate, version } from 'uuid';
import { WordleEvaluatorService } from './wordle-evaluator.service';

const date = '2022-02-13';

describe('GameService', () => {
  let provider: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService, WordleEvaluatorService],
    }).compile();

    provider = module.get<GameService>(GameService);
  });

  it('should start a game', () => {
    const token = provider.start(date);

    expect(validate(token)).toBeTruthy();
    expect(version(token)).toBe(4);
    expect(provider.getNumber(token)).toBe(239);
    expect(provider.getWord(token)).toBe('robin');
  });

  it('should allow making a guess', () => {
    const token = provider.start(date);
    const words = provider.guess(token, 'soare');

    expect(words.length).toBeGreaterThan(10);
    expect(words).toContain('robin');
  });

  it('should fail on an invalid guess', () => {
    const token = provider.start(date);

    expect(() => provider.guess(token, 'abcde')).toThrowError(
      'Invalid word specified',
    );
  });

  it('should throw an error if game not found', () => {
    expect(() => provider.getNumber(v4())).toThrowError('Game not found');
  });
});
