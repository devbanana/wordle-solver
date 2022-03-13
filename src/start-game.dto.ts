export class StartGameDto {
  constructor(
    readonly number: number,
    readonly date: string,
    readonly token: string,
  ) {}
}
