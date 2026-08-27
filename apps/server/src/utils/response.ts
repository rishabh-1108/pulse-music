import { Response } from 'express';
import { PaginatedResponse } from '../types';

export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, data });
};

export const sendPaginatedResponse = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
) => {
  const totalPages = Math.ceil(total / limit);
  const response: PaginatedResponse<T> = {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
  return res.status(200).json({ success: true, ...response });
};

export const sendError = (res: Response, message: string, statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message });
};
