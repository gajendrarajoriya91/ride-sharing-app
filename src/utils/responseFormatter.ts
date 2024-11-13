import { Response } from 'express';

export const sendSuccessResponse = (
  res: Response,
  data: any,
  message = 'Success',
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    status: statusCode,
    message,
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  errorMessage: string,
  statusCode = 500,
  details: any = null,
) => {
  const response: any = {
    status: statusCode,
    message: errorMessage,
  };

  if (details) response.details = details;

  return res.status(statusCode).json(response);
};
