import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-expection.filter';
import AppError, { AppErrorType } from '../domain/app-error';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let response: Response;
  let host: ArgumentsHost;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpExceptionFilter],
    }).compile();

    filter = module.get<HttpExceptionFilter>(HttpExceptionFilter);
    response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    host = {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as unknown as ArgumentsHost;
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should handle RESOURCE_ALREADY_EXISTS error', () => {
    const exception = new AppError(
      'Resource already exists',
      AppErrorType.RESOURCE_ALREADY_EXISTS,
    );
    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      status: 409,
      message: 'Resource already exists',
    });
  });

  it('should handle RESOURCE_NOT_FOUND error', () => {
    const exception = new AppError(
      'Resource not found',
      AppErrorType.RESOURCE_NOT_FOUND,
    );
    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.json).toHaveBeenCalledWith({
      status: 404,
      message: 'Resource not found',
    });
  });

  it('should handle RESOURCE_CONFLICT error type', () => {
    const exception = new AppError(
      'Resource conflict',
      AppErrorType.RESOURCE_CONFLICT,
    );
    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      status: 409,
      message: 'Resource conflict',
    });
  });

  it('should handle unknown error type', () => {
    const exception = new AppError(
      'Unknown error',
      AppErrorType.INTERNAL_ERROR,
    );
    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Unknown error',
    });
  });
});
