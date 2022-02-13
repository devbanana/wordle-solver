import { GuessNarrower } from './guess-narrower';

const wordList = ['ultra', 'angry', 'silly', 'furry'];

describe('GuessNarrower', () => {
  it('should be defined', () => {
    expect(new GuessNarrower('ultra', [])).toBeDefined();
  });

  it('should narrow based on correct letter', () => {
    const narrower = new GuessNarrower('ultra', wordList);

    const result = narrower.guess('soare');

    expect(result.length).toBe(3);
    expect(result[0]).toBe('angry');
    expect(result[1]).toBe('furry');
    expect(result[2]).toBe('ultra');
  });
});
