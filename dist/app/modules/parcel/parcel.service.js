"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelService = void 0;
const parcel_model_1 = require("./parcel.model");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const generateTrackingId_1 = require("../../utils/generateTrackingId");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createParcel = (data, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const trackingId = (0, generateTrackingId_1.generateTrackingId)();
    const initialStatusLog = {
        status: "REQUESTED",
        updatedBy: userId,
        timestamp: new Date()
    };
    const parcel = yield parcel_model_1.Parcel.create(Object.assign(Object.assign({}, data), { trackingId, sender: userId, statusLogs: [initialStatusLog] }));
    return parcel;
});
const getParcelsBySender = (senderId) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("Sender Id:", senderId)
    const parcel = yield parcel_model_1.Parcel.find({ sender: senderId });
    return {
        data: parcel
    };
});
const getParcelsByAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const parcels = yield parcel_model_1.Parcel.find({});
    const totalParcels = yield parcel_model_1.Parcel.countDocuments();
    return {
        data: parcels,
        meta: {
            total: totalParcels
        }
    };
});
const getParcelsByReceiver = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.find({ receiver: receiverId });
    return {
        data: parcel
    };
});
const getDeliveryHistory = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.find({
        receiver: receiverId,
        status: "DELIVERED",
    }).populate("sender", "name email");
    return {
        data: parcel
    };
});
const getParcelById = (parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.find({ _id: parcelId });
    return {
        data: parcel
    };
});
const updateParcelStatus = (parcelId, status, updatedBy, location, note) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    parcel.status = status;
    parcel.statusLogs.push({
        status,
        updatedBy,
        location,
        note,
        timestamp: new Date()
    });
    yield parcel.save();
    return {
        data: parcel
    };
});
const assignDeliveryPersonnel = (parcelId, personnelId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, { deliveryPersonnel: personnelId }, { new: true }).populate("deliveryPersonnel", "name email");
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    yield parcel.save();
    return {
        data: parcel
    };
});
const parcelBlockAndUnblock = (parcelId, isBlocked, updatedBy, location, note) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    parcel.isBlocked = isBlocked;
    parcel.statusLogs.push({
        status: isBlocked ? "BLOCKED" : "UNBLOCKED",
        updatedBy,
        location,
        note,
        timestamp: new Date(),
    });
    yield parcel.save();
    return parcel;
});
const cancelParcel = (parcelId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ _id: parcelId, sender: senderId });
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (["DISPATCHED", "IN_TRANSIT", "DELIVERED"].includes(parcel.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Cannot cancel after dispatch");
    }
    parcel.status = "CANCELED";
    parcel.statusLogs.push({
        status: "CANCELED",
        updatedBy: senderId,
        timestamp: new Date()
    });
    yield parcel.save();
    return {
        data: parcel
    };
});
const deliveryParcelByReceiver = (parcelId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findOne({ _id: parcelId, receiver: receiverId });
    if (!parcel)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    if (["DELIVERED"].includes(parcel.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Parcel already delivered");
    }
    parcel.status = "DELIVERED";
    parcel.statusLogs.push({
        status: "DELIVERED",
        updatedBy: receiverId,
        timestamp: new Date()
    });
    yield parcel.save();
    return {
        data: parcel
    };
});
exports.ParcelService = {
    createParcel,
    getParcelsBySender,
    getParcelsByReceiver,
    getParcelById,
    getParcelsByAdmin,
    getDeliveryHistory,
    updateParcelStatus,
    parcelBlockAndUnblock,
    cancelParcel,
    deliveryParcelByReceiver,
    assignDeliveryPersonnel
};
