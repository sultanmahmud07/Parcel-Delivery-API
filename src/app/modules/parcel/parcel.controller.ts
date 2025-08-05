import { NextFunction, Request, Response } from 'express';
import httpStatus from "http-status-codes";
import { catchAsync } from '../../utils/catchAsync';
import { ParcelService } from './parcel.service';
import { sendResponse } from '../../utils/sendResponse';
import { JwtPayload } from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createParcel = catchAsync(async (req: Request, res: Response,  next: NextFunction) => {
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
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSenderParcels = catchAsync(async (req: Request, res: Response,  next: NextFunction) => {
  const decodeToken = req.user as JwtPayload  
  const result = await ParcelService.getParcelsBySender(decodeToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel Retrieved Successfully By Sender",
        data: result.data
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getReceiverParcels = catchAsync(async (req: Request, res: Response,  next: NextFunction) => {
  const decodeToken = req.user as JwtPayload  
  const result = await ParcelService.getParcelsByReceiver(decodeToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel Retrieved Successfully By Receiver",
        data: result.data
    })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cancelParcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parcelId = req.params.id;
  const decodeToken = req.user as JwtPayload  
  const result = await ParcelService.cancelParcel(parcelId, decodeToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel Cancel Successfully",
        data: result.data
    })
})
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateParcelStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const parcelId = req.params.id;
  const decodeToken = req.user as JwtPayload  
  const result = await ParcelService.cancelParcel(parcelId, decodeToken.userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Parcel Cancel Successfully",
        data: result.data
    })
})

export const ParcelController = {
    createParcel,
    getSenderParcels,
    getReceiverParcels,
    cancelParcel,
    updateParcelStatus
}