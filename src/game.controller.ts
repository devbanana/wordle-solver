import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { GameService } from './game.service';
import { GameNotFoundError } from './exceptions/game-not-found.error';
import { InvalidWordError } from './exceptions/invalid-word.error';
import { InvalidDateError } from './exceptions/invalid-date.error';
import { StartGameDto } from './start-game.dto';

interface StartResponse {
  number: number;
  date: string;
  token: string;
}

interface WordsResponse {
  words: string[];
}

interface WinResponse {
  status: 'won';
  solution: string;
}

@Controller('game')
export class GameController {
  constructor(private readonly game: GameService) {}

  @Get('start/:date')
  start(@Param('date') date: string): StartResponse {
    let game: StartGameDto;

    try {
      game = this.game.start(date);
    } catch (error) {
      if (error instanceof InvalidDateError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }

    return {
      number: game.number,
      date: game.date.toFormat('yyyy-MM-dd'),
      token: game.token,
    };
  }

  @Get(':token/guess/:word')
  guess(
    @Param('token') token: string,
    @Param('word') word: string,
  ): WordsResponse | WinResponse {
    let words: string[];

    try {
      words = this.game.guess(token, word);
    } catch (error) {
      if (error instanceof GameNotFoundError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof InvalidWordError) {
        throw new BadRequestException(error.message);
      }

      throw error;
    }

    if (words.length > 1) {
      return { words };
    }

    return { status: 'won', solution: words[0] };
  }
}
