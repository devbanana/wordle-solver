import { States } from './states';

export class GuessNarrower {
  private state: States[];
  private processedCorrect: boolean[];

  constructor(
    private readonly answer: string,
    private readonly wordList: string[],
  ) {
    this.state = Array(answer.length).fill(States.Absent);
    this.processedCorrect = Array(answer.length).fill(false);
  }

  guess(word: string): string[] {
    for (let i = 0; i < word.length; i++) {
      if (word[i] === this.answer[i] && !this.processedCorrect[i]) {
        this.state[i] = States.Correct;
        this.processedCorrect[i] = true;
      }
    }

    const regex = Array(word.length).fill('.');
    for (let i = 0; i < word.length; i++) {
      if (this.state[i] === States.Correct) {
        regex[i] = word[i];
      }
    }

    return this.wordList
      .filter(value => {
        return value.match(regex.join(''));
      })
      .sort();
  }
}
