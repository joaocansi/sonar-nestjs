export enum ErrorType {
  RESOURCE_NOT_FOUND,
  RESOURCE_CONFLICT,
  RESOURCE_ALREADY_EXISTS,
  INTERNAL_ERROR,
}

export class AppError extends Error {
  constructor(
    message: string,
    private readonly type: ErrorType,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  public getType() {
    return this.type;
  }
}
