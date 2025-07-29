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

// Get all parcels for sender
// export const getMyParcels = catchAsync(async (req: Request, res: Response) => {
//   const senderId = req.user._id;

//   const parcels = await ParcelService.getParcelsBySender(senderId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Sender parcels retrieved successfully',
//     data: parcels,
//   });
// });

// Get parcels for receiver
// export const getMyDeliveries = catchAsync(async (req: Request, res: Response) => {
//   const receiverId = req.user._id;

//   const parcels = await ParcelService.getParcelsByReceiver(receiverId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Receiver parcels retrieved successfully',
//     data: parcels,
//   });
// });

// Cancel a parcel (Sender only)
// export const cancelParcel = catchAsync(async (req: Request, res: Response) => {
//   const parcelId = req.params.id;
//   const userId = req.user._id;

//   const result = await ParcelService.cancelParcel(parcelId, userId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Parcel cancelled successfully',
//     data: result,
//   });
// });

// Update parcel status (Admin only)
// export const updateParcelStatus = catchAsync(async (req: Request, res: Response) => {
//   const parcelId = req.params.id;
//   const { status, location, note } = req.body;
//   const updatedBy = new Types.ObjectId(req.user._id);

//   const result = await ParcelService.updateParcelStatus(
//     parcelId,
//     status as ParcelStatus,
//     updatedBy,
//     location,
//     note
//   );

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Parcel status updated successfully',
//     data: result,
//   });
// });

// Get parcel by ID (shared access)
// export const getParcelById = catchAsync(async (req: Request, res: Response) => {
//   const parcelId = req.params.id;

//   const parcel = await ParcelService.getParcelById(parcelId);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Parcel details retrieved',
//     data: parcel,
//   });
// });
