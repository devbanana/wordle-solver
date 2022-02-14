import { GuessNarrower } from './guess-narrower';
import { WordleEvaluatorService } from './wordle-evaluator.service';
import { Test } from '@nestjs/testing';

const wordList = [
  'alert',
  'angry',
  'being',
  'blurb',
  'fairy',
  'flirt',
  'furry',
  'glare',
  'glory',
  'golem',
  'guard',
  'icily',
  'ledge',
  'lemon',
  'lodge',
  'notch',
  'plant',
  'revel',
  'ruler',
  'silly',
  'slope',
  'sloth',
  'total',
  'ultra',
  'umbra',
  'wheel',
  'whirl',
  'whole',
  'zebra',
];

describe('GuessNarrower', () => {
  let narrower: GuessNarrower;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [WordleEvaluatorService],
    }).compile();

    narrower = new GuessNarrower(
      'ultra',
      wordList,
      module.get<WordleEvaluatorService>(WordleEvaluatorService),
    );
  });

  it('should be defined', () => {
    expect(narrower).toBeDefined();
  });

  it('should narrow based on correct letter', () => {
    const result = narrower.guess('soare');

    expect(result).toStrictEqual(['angry', 'fairy', 'ultra', 'umbra']);
  });

  it('should narrow based on multiple correct guesses', () => {
    narrower.guess('soare');
    const result = narrower.guess('hydra');

    expect(result).toStrictEqual(['ultra', 'umbra']);
  });

  it("should correctly narrow even if second guess doesn't use first correct letter", () => {
    narrower.guess('sorry');
    const result = narrower.guess('mocha');

    expect(result).toStrictEqual(['ultra', 'zebra']);
  });

  it('should narrow based on present letter', () => {
    const result = narrower.guess('icily');

    expect(result).toStrictEqual([
      'alert',
      'blurb',
      'glare',
      'golem',
      'ledge',
      'lemon',
      'lodge',
      'plant',
      'revel',
      'ruler',
      'slope',
      'sloth',
      'total',
      'ultra',
      'wheel',
    ]);
  });

  it('should narrow based on multiple present letters', () => {
    narrower.guess('icily');
    const result = narrower.guess('revel');

    expect(result).toStrictEqual(['blurb', 'ultra']);
  });

  it('should narrow based on absent letters', () => {
    const result = narrower.guess('being');

    expect(result).toStrictEqual(['furry', 'sloth', 'total', 'ultra']);
  });

  it('should only process an absent letter once', () => {
    const result = narrower.guess('silly');

    expect(result).toStrictEqual([
      'alert',
      'blurb',
      'glare',
      'ledge',
      'lemon',
      'lodge',
      'plant',
      'revel',
      'total',
      'ultra',
      'wheel',
    ]);
  });

  it('should keep a correct letter even when absent in another guess', () => {
    narrower.guess('sword');
    const result = narrower.guess('audio');

    expect(result).toStrictEqual(['ultra', 'umbra']);
  });
});
