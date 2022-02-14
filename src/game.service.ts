import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { DateTime } from 'luxon';
import * as words from '../words.json';
import { GuessNarrower } from './guess-narrower';
import { WordleEvaluatorService } from './wordle-evaluator.service';

interface Game {
  token: string;
  date: DateTime;
  number: number;
  word: string;
  narrower: GuessNarrower;
}

@Injectable()
export class GameService {
  private games: Map<string, Game> = new Map<string, Game>();
  private possibleWords: string[];
  private validWords: string[];

  constructor(private readonly evaluator: WordleEvaluatorService) {
    this.possibleWords = words.answers;
    this.validWords = words.valid;
  }

  start(dateString: string): string {
    const token = v4();
    const date = DateTime.fromISO(dateString);
    const number = date.diff(DateTime.fromISO('2021-06-19'), 'days').as('days');
    const word = this.possibleWords[number % this.possibleWords.length];
    const narrower = new GuessNarrower(
      word,
      this.possibleWords,
      this.evaluator,
    );

    const game: Game = { token, date, number, word, narrower };

    this.games.set(token, game);

    return token;
  }

  getNumber(token: string): number {
    return this.load(token).number;
  }

  getWord(token: string): string {
    return this.load(token).word;
  }

  guess(token: string, guess: string): string[] {
    const game = this.load(token);

    if (
      !this.possibleWords.includes(guess) &&
      !this.validWords.includes(guess)
    ) {
      throw new Error('Invalid word specified');
    }

    return game.narrower.guess(guess);
  }

  private load(token: string): Game {
    const game = this.games.get(token);

    if (game === undefined) {
      throw new Error('Game not found');
    }

    return game;
  }
}
