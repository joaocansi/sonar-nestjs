export enum AppErrorType {
  RESOURCE_ALREADY_EXISTS,
  RESOURCE_NOT_FOUND,
  RESOURCE_CONFLICT,
  INTERNAL_ERROR,
}

export default class AppError extends Error {
  constructor(
    message: string,
    readonly type: AppErrorType,
  ) {
    super(message);
    this.type = type;
  }
}
