import { Request, Response } from 'express';
import httpStatus from "http-status-codes";
import { catchAsync } from '../../utils/catchAsync';
import { ParcelService } from './parcel.service';
import { sendResponse } from '../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';

// Create a new parcel (Sender only)
export const createParcel = catchAsync(async (req: Request, res: Response) => {
 const decodeToken = req.user as JwtPayload
  const parcelData = req.body;
// console.log(decodeToken)
  const parcel = await ParcelService.createParcel(parcelData, decodeToken.userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Parcel created successfully',
    data: parcel,
  });
});

export const ParcelController = {
    createParcel,
    
}