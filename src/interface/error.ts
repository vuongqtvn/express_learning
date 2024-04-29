export class AppError {
  message: any;
  statusCode: number;

  constructor(message: any, statusCode: number) {
    this.message = message;
    this.statusCode = statusCode;
  }
}
