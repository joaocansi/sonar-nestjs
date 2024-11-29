import { Test, TestingModule } from '@nestjs/testing';
import { AppError, ErrorType } from '../errors/error';
import { Response } from 'express';
import { ArgumentsHost } from '@nestjs/common';
import { HttpExceptionFilter } from './http-expection.filter';

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
      ErrorType.RESOURCE_ALREADY_EXISTS,
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
      ErrorType.RESOURCE_NOT_FOUND,
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
      ErrorType.RESOURCE_CONFLICT,
    );
    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(409);
    expect(response.json).toHaveBeenCalledWith({
      status: 409,
      message: 'Resource conflict',
    });
  });

  it('should handle unknown error type', () => {
    const exception = new AppError('Unknown error', ErrorType.INTERNAL_ERROR);
    filter.catch(exception, host);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Unknown error',
    });
  });
});
