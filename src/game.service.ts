import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class GameService {
  private games: string[] = [];

  start(): string {
    const token = v4();
    this.games.push(token);

    return token;
  }
}
