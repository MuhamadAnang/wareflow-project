export class ConflictException extends Error {
  statusCode = 409;
  
  constructor(message: string) {
    super(message);
    this.name = "ConflictException";
  }
}