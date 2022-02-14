export class InvalidWordError implements Error {
  message: string;
  name: string;

  constructor() {
    this.message = 'Invalid word specified';
    this.name = 'InvalidWordError';
  }
}
