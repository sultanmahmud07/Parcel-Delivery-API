import { Request, Response } from 'express';
import httpStatus from "http-status-codes";
import { catchAsync } from '../../utils/catchAsync';
import { ParcelService } from './parcel.service';
import { sendResponse } from '../../utils/sendResponse';

// Create a new parcel (Sender only)
export const createParcel = catchAsync(async (req: Request, res: Response) => {
  const senderId = "";
  const parcelData = req.body;

  const parcel = await ParcelService.createParcel( parcelData, senderId );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Parcel created successfully',
    data: parcel,
  });
});
