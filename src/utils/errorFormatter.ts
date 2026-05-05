import { ZodError } from "zod";
import { Prisma } from "../../generated/prisma/client";

export type ErrorSource = {
  field?: string;
  message: string;
  code?: string;
};

export interface IGenericErrorResponse {
  success: false;
  message: string;
  errorSource: ErrorSource[];
  debug?: { name?: string; message?: string; stack?: string };
}

export const formatZodError = (error: ZodError): ErrorSource[] =>
  error.issues.map((issue) => ({
    message: issue.message,
    code: issue.code,
    ...(issue.path.length > 0 && { field: issue.path.join(".") }),
  }));

export const formatPrismaValidationError = (
  error: Prisma.PrismaClientValidationError
): ErrorSource[] => [{ message: error.message, code: "PRISMA_VALIDATION_ERROR" }];

export const formatPrismaClientRequestError = (
  error: Prisma.PrismaClientKnownRequestError
): ErrorSource[] => {
  const field = Array.isArray(error.meta?.target)
    ? (error.meta.target as string[]).join(".")
    : (error.meta?.target as string | undefined);

  const base: ErrorSource = { message: error.message, code: error.code, ...(field && { field }) };

  const messages: Record<string, string> = {
    P2002: `Duplicate value for ${field || "unique field"}`,
    P2025: "Requested record was not found",
    P2003: `Unable to delete. This ${field || "item"} is already used in other records.`,
    P2000: `Value too long for ${field || "field"}`,
    P2021: "Table does not exist in the database",
    P2022: "Column does not exist in the database",
  };

  return [{ ...base, message: messages[error.code] ?? error.message }];
};

export const formatPrismaClientInitError = (
  error: Prisma.PrismaClientInitializationError
): ErrorSource[] => [{ message: error.message, code: "PRISMA_CONNECTION_ERROR" }];

export const formatPrismaClientRuntimeError = (
  error: Prisma.PrismaClientRustPanicError | Prisma.PrismaClientUnknownRequestError
): ErrorSource[] => [
    {
      message: error.message,
      code:
        error instanceof Prisma.PrismaClientRustPanicError
          ? "PRISMA_RUST_PANIC"
          : "PRISMA_UNKNOWN_REQUEST_ERROR",
    },
  ];

export const formatGenericError = (error: Error): ErrorSource[] => [
  { message: error.message || "Something went wrong", code: error.name || "GENERIC_ERROR" },
];

export const createErrorResponse = (
  message: string,
  errorSource: ErrorSource[],
  err?: Error,
  isDevelopment = false
): IGenericErrorResponse => {
  const response: IGenericErrorResponse = { success: false, message, errorSource };
  if (isDevelopment && err) {
    const debug: NonNullable<IGenericErrorResponse['debug']> = {
      name: err.name,
      message: err.message,
    };

    if (err.stack) {
      debug.stack = err.stack;
    }

    response.debug = debug;
  }
  return response;
};