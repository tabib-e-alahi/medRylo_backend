import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import envConfig from '../config/route.config';
import { createErrorResponse, ErrorSource, formatGenericError, formatPrismaClientInitError, formatPrismaClientRequestError, formatPrismaClientRuntimeError, formatPrismaValidationError, formatZodError } from '../utils/errorFormatter';
import { logErrorToConsole } from '../utils/errorLogger';
import { AppError } from '../errors/AppError';
import { Prisma } from '../../generated/prisma/client';


const isDevelopment = envConfig.NODE_ENV === 'development';

export const globalErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorSource: ErrorSource[] = [
    {
      message: 'Something went wrong',
      code: 'INTERNAL_SERVER_ERROR',
    },
  ];

  logErrorToConsole(err, isDevelopment);

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    errorSource = formatZodError(err);
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSource = [
      {
        message: err.message,
        code: err.constructor.name,
      },
    ];
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Database Validation Error';
    errorSource = formatPrismaValidationError(err);
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    errorSource = formatPrismaClientRequestError(err);

    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Resource already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Resource not found';
        break;
      case 'P2003':
        statusCode = 409;
        message = 'Foreign key constraint failed';
        break;
      case 'P2021':
      case 'P2022':
      case 'P2024':
        statusCode = 500;
        message = 'Database Operation Error';
        break;
      default:
        statusCode = 400;
        message = 'Database Operation Error';
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = 500;
    message = 'Database Connection Error';
    errorSource = formatPrismaClientInitError(err);
  } else if (
    err instanceof Prisma.PrismaClientRustPanicError ||
    err instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    statusCode = 500;
    message = 'Database Runtime Error';
    errorSource = formatPrismaClientRuntimeError(err);
  } else if (err instanceof SyntaxError) {
    statusCode = 400;
    message = 'Invalid Request Format';
    errorSource = formatGenericError(err);
  } else if (err instanceof Error) {
    statusCode = 500;
    message = 'Internal Server Error';
    errorSource = formatGenericError(err);
  }

  const errorResponse = createErrorResponse(
    message,
    errorSource,
    err instanceof Error ? err : undefined,
    isDevelopment,
  );
  res.status(statusCode).json(errorResponse);
};

export default globalErrorHandler;