import { Parcel } from "./parcel.model";
import { IParcel, ParcelStatus } from "./parcel.interface";
import AppError from "../../errorHelpers/AppError";
import { generateTrackingId } from "../../utils/generateTrackingId";
import httpStatus from "http-status-codes";
import { Types } from "mongoose";

const createParcel = async (data: Partial<IParcel>, userId: string) => {
  const trackingId = generateTrackingId();

  const initialStatusLog = {
    status: "REQUESTED",
    updatedBy: userId,
    timestamp: new Date()
  };

  const parcel = await Parcel.create({
    ...data,
    trackingId,
    sender: userId,
    statusLogs: [initialStatusLog]
  });

  return parcel;
};

const getParcelsBySender = async (senderId: string) => {
  // console.log("Sender Id:", senderId)
  const parcel = await Parcel.find({ sender: senderId });
  return {
    data: parcel
  }
};
const getParcelsByAdmin = async () => {
 const parcels = await Parcel.find({});
     const totalParcels = await Parcel.countDocuments();
     return {
         data: parcels,
         meta: {
             total: totalParcels
         }
     }
};
const getParcelsByReceiver = async (receiverId: string) => {
  const parcel = await Parcel.find({ receiver: receiverId });
  return {
    data: parcel
  }
};
const getDeliveryHistory = async (receiverId: string) => {
  const parcel = await Parcel.find({
      receiver: receiverId,
      status: "DELIVERED",
    }).populate("sender", "name email");
  return {
    data: parcel
  }
};
const getParcelById = async (parcelId: string) => {
  const parcel = await Parcel.find({ _id: parcelId });
  return {
    data: parcel
  }
};

const updateParcelStatus = async (parcelId: string, status: ParcelStatus, updatedBy: Types.ObjectId, location?: string, note?: string) => {
  const parcel = await Parcel.findById(parcelId);
  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");

  parcel.status = status;
  parcel.statusLogs.push({
    status,
    updatedBy,
    location,
    note,
    timestamp: new Date()
  });

  await parcel.save();
  return {
    data: parcel
  }
};

const cancelParcel = async (parcelId: string, senderId: Types.ObjectId) => {
  const parcel = await Parcel.findOne({ _id: parcelId, sender: senderId });

  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  if (["DISPATCHED", "IN_TRANSIT", "DELIVERED"].includes(parcel.status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot cancel after dispatch");
  }

  parcel.status = "CANCELED";
  parcel.statusLogs.push({
    status: "CANCELED",
    updatedBy: senderId,
    timestamp: new Date()
  });

  await parcel.save();
  return {
    data: parcel
  };
};
const deliveryParcelByReceiver = async (parcelId: string, receiverId: Types.ObjectId) => {
  const parcel = await Parcel.findOne({ _id: parcelId, receiver: receiverId });

  if (!parcel) throw new AppError(httpStatus.NOT_FOUND, "Parcel not found");
  if (["DELIVERED"].includes(parcel.status)) {
    throw new AppError(httpStatus.BAD_REQUEST, "Parcel already delivered");
  }

  parcel.status = "DELIVERED";
  parcel.statusLogs.push({
    status: "DELIVERED",
    updatedBy: receiverId,
    timestamp: new Date()
  });

  await parcel.save();
  return {
    data: parcel
  };
};

export const ParcelService = {
  createParcel,
  getParcelsBySender,
  getParcelsByReceiver,
  getParcelById,
  getParcelsByAdmin,
  getDeliveryHistory,
  updateParcelStatus,
  cancelParcel,
  deliveryParcelByReceiver
};
