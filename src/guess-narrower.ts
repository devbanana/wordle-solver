import { States } from './states';
import { WordleEvaluatorService } from './wordle-evaluator.service';

export class GuessNarrower {
  private readonly correctPositions: string[];
  private readonly presentPositions: Set<string>;
  private readonly absentPositions: Array<Set<string>>;

  constructor(
    private readonly answer: string,
    private readonly wordList: string[],
    private readonly evaluator: WordleEvaluatorService,
  ) {
    this.correctPositions = [];
    this.presentPositions = new Set<string>();
    this.absentPositions = [
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
      new Set<string>(),
    ];
  }

  guess(word: string): string[] {
    const state = this.evaluator.evaluate(word, this.answer);

    state.forEach((state, index) => {
      const letter = word[index];

      switch (state) {
        case States.Correct:
          this.setCorrectLetter(index, letter);
          break;

        case States.Present:
          this.addPossibleLetter(index, letter);
          break;

        case States.Absent:
          this.addAbsentLetter(index, letter);
          break;
      }
    });

    const regex = this.calculateRegex(word);

    return this.wordList
      .filter(value => RegExp(regex).exec(value))
      .filter(value =>
        [...this.presentPositions].every(letter => value.includes(letter)),
      )
      .sort();
  }

  private setCorrectLetter(index: number, letter: string): void {
    this.correctPositions[index] = letter;
    this.absentPositions[index].clear();
  }

  private addPossibleLetter(index: number, letter: string): void {
    if (!this.isPositionCorrect(index)) {
      this.absentPositions[index].add(letter);
    }

    this.presentPositions.add(letter);
  }

  private addAbsentLetter(index: number, letter: string) {
    if (this.isPositionCorrect(index)) {
      return;
    }

    if (
      this.correctPositions.includes(letter) ||
      this.presentPositions.has(letter)
    ) {
      this.absentPositions[index].add(letter);
    } else {
      for (let i = 0; i < this.answer.length; i++) {
        if (!this.isPositionCorrect(i)) {
          this.absentPositions[i].add(letter);
        }
      }
    }
  }

  private isPositionCorrect(index: number): boolean {
    return this.correctPositions[index] !== undefined;
  }

  private calculateRegex(word: string): string {
    const regex = Array<string>(word.length).fill('.');
    this.correctPositions.forEach((letter, index) => (regex[index] = letter));
    this.absentPositions.forEach((letters, index) => {
      if (letters.size) {
        regex[index] = `[^${[...letters].sort().join('')}]`;
      }
    });

    return regex.join('');
  }
}
