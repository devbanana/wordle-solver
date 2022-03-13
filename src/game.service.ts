import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { DateTime } from 'luxon';
import * as words from '../words.json';
import { GuessNarrower } from './guess-narrower';
import { WordleEvaluatorService } from './wordle-evaluator.service';
import { GameNotFoundError } from './exceptions/game-not-found.error';
import { InvalidWordError } from './exceptions/invalid-word.error';
import { InvalidDateError } from './exceptions/invalid-date.error';
import { StartGameDto } from './start-game.dto';

interface Game {
  token: string;
  date: DateTime;
  number: number;
  word: string;
  narrower: GuessNarrower;
}

@Injectable()
export class GameService {
  private readonly games: Map<string, Game> = new Map<string, Game>();
  private readonly possibleWords: string[];
  private readonly validWords: string[];

  constructor(private readonly evaluator: WordleEvaluatorService) {
    this.possibleWords = words.answers;
    this.validWords = words.valid;
  }

  start(dateString: string): StartGameDto {
    const date = DateTime.fromISO(dateString);
    if (!date.isValid) {
      throw new InvalidDateError();
    }

    const token = v4();
    const number = date.diff(DateTime.fromISO('2021-06-19'), 'days').as('days');
    const word = this.possibleWords[number % this.possibleWords.length];
    const narrower = new GuessNarrower(
      word,
      this.possibleWords,
      this.evaluator,
    );

    const game: Game = { token, date, number, word, narrower };

    this.games.set(token, game);

    return new StartGameDto(number, date.toFormat('yyyy-MM-dd'), token);
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
      throw new InvalidWordError();
    }

    return game.narrower.guess(guess);
  }

  private load(token: string): Game {
    const game = this.games.get(token);

    if (game === undefined) {
      throw new GameNotFoundError();
    }

    return game;
  }
}
