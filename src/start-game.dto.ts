import { DateTime } from 'luxon';

export class StartGameDto {
  constructor(
    readonly number: number,
    readonly date: DateTime,
    readonly token: string,
  ) {}
}
