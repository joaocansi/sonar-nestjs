import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { AppError, ErrorType } from '../errors/error';

@Catch(AppError)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: AppError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const errorType = exception.getType();

    let status: number;
    switch (errorType) {
      case ErrorType.RESOURCE_ALREADY_EXISTS:
        status = 409;
        break;
      case ErrorType.RESOURCE_NOT_FOUND:
        status = 404;
        break;
      case ErrorType.RESOURCE_CONFLICT:
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
