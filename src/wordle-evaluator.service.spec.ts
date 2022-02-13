import { Test, TestingModule } from '@nestjs/testing';
import { WordleEvaluatorService } from './wordle-evaluator.service';
import { States } from './states';

describe('WordleEvaluatorService', () => {
  let provider: WordleEvaluatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordleEvaluatorService],
    }).compile();

    provider = module.get<WordleEvaluatorService>(WordleEvaluatorService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should evaluate 1 correct letter', () => {
    const result = provider.evaluate('chirp', 'ultra');

    expect(result).toStrictEqual([
      States.Absent,
      States.Absent,
      States.Absent,
      States.Correct,
      States.Absent,
    ]);
  });

  it('should evaluate multiple correct letters', () => {
    const result = provider.evaluate('zebra', 'ultra');

    expect(result).toStrictEqual([
      States.Absent,
      States.Absent,
      States.Absent,
      States.Correct,
      States.Correct,
    ]);
  });

  it('should evaluate 1 present letter', () => {
    const result = provider.evaluate('bunny', 'ultra');

    expect(result).toStrictEqual([
      States.Absent,
      States.Present,
      States.Absent,
      States.Absent,
      States.Absent,
    ]);
  });

  it('should evaluate multiple present letters', () => {
    const result = provider.evaluate('lucky', 'ultra');

    expect(result).toStrictEqual([
      States.Present,
      States.Present,
      States.Absent,
      States.Absent,
      States.Absent,
    ]);
  });

  it('should evaluate correct and present letters', () => {
    const result = provider.evaluate('guard', 'ultra');

    expect(result).toStrictEqual([
      States.Absent,
      States.Present,
      States.Present,
      States.Correct,
      States.Absent,
    ]);
  });

  it('should only evaluate correct letter when letter is doubled', () => {
    const result = provider.evaluate('abbey', 'robin');

    expect(result).toStrictEqual([
      States.Absent,
      States.Absent,
      States.Correct,
      States.Absent,
      States.Absent,
    ]);
  });

  it('should properly process doubled letters when one is correct', () => {
    const result = provider.evaluate('knoll', 'silly');

    expect(result).toStrictEqual([
      States.Absent,
      States.Absent,
      States.Absent,
      States.Correct,
      States.Present,
    ]);
  });

  it('should not accept words of different lengths', () => {
    expect(() => provider.evaluate('test', 'ultra')).toThrowError(
      'The guess must be the same length as the answer',
    );
  });
});
