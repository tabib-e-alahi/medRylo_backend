import { Response } from "express";

interface IResponseData<T> {
  httpStatusCode: number;
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
}


export const sendResponse = <T>(res: Response, responseData: IResponseData<T>) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({ success, message, data, ...(meta && { meta }) });
};

// Shorthand helpers used in controllers
export const sendSuccess = <T>(res: Response, data: T, message = "Success", statusCode = 200, meta?: IResponseData<T>["meta"]) =>
  sendResponse(res, { httpStatusCode: statusCode, success: true, message, data, ...(meta && { meta }) });

export const sendCreated = <T>(res: Response, data: T, message = "Created successfully") =>
  sendResponse(res, { httpStatusCode: 201, success: true, message, data });

export const sendError = (res: Response, message: string, statusCode = 400) =>
  sendResponse(res, { httpStatusCode: statusCode, success: false, message });

// Pagination helper
export const getPaginationMeta = (total: number, page: number, limit: number) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

export const parsePagination = (query: Record<string, unknown>) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};