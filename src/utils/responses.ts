import { Response } from "express";

export const sendErrorResponse = (
  res: Response,
  status: number,
  message: string,
  data: any = null
): void => {
  res.status(status).json({
    error: true,
    status,
    message,
    data,
  });
};

export const sendSuccessResponse = (
  res: Response,
  message: string,
  data: any = null,
  accessToken?: string,
  refreshToken?: string
): void => {
  res.status(200).json({
    error: false,
    status: 200,
    message,
    accessToken,
    refreshToken,
    data,
  });
};
