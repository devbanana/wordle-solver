export class GameNotFoundError implements Error {
  message: string;
  name: string;

  constructor() {
    this.message = 'Game not found';
    this.name = 'GameNotFoundError';
  }
}
