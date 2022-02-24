export class InvalidDateError implements Error {
  message: string;
  name: string;

  constructor() {
    this.message = 'An invalid date was provided';
    this.name = 'InvalidDate';
  }
}
