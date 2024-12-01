import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import AppError, { AppErrorType } from '../domain/app-error';

@Catch(AppError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorType = exception.type;

    let status: number;
    switch (errorType) {
      case AppErrorType.RESOURCE_ALREADY_EXISTS:
        status = 409;
        break;
      case AppErrorType.RESOURCE_NOT_FOUND:
        status = 404;
        break;
      case AppErrorType.RESOURCE_CONFLICT:
        status = 409;
        break;
      default:
        status = 500;
    }

    response.status(status).json({
      status,
      message: exception.message,
    });
  }
}
