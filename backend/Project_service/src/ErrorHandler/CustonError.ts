import { StatusCode } from "../Interfaces/StatusCode";

export class CustomError extends Error {
  public statusCode: StatusCode;

  constructor(message: string, statusCode: StatusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}
