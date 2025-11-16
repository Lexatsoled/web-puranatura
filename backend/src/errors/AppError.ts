export class ValidationError extends Error {
  public readonly errors: any[];

  constructor(message: string, errors: any[]) {
    super(message);
    this.name = 'ValidationError';
    this.errors = errors;
  }
}