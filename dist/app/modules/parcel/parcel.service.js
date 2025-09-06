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
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const parcel_constant_1 = require("./parcel.constant");
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
const getParcelsBySender = (senderId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find({ sender: senderId }), query);
    const parcels = yield queryBuilder
        .search(parcel_constant_1.parcelSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        parcels.build(),
        queryBuilder.getMeta()
    ]);
    // console.log(meta)
    return {
        data,
        meta
    };
});
const getParcelsByAdmin = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find(), query);
    const parcels = yield queryBuilder
        .search(parcel_constant_1.parcelSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        parcels.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getParcelsByReceiver = (receiverId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(parcel_model_1.Parcel.find({ receiver: receiverId }), query);
    const parcels = yield queryBuilder
        .search(parcel_constant_1.parcelSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        parcels.build(),
        queryBuilder.getMeta()
    ]);
    // console.log(meta)
    return {
        data,
        meta
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
    const parcel = yield parcel_model_1.Parcel.findById(parcelId)
        .populate("sender", "name email")
        .populate("receiver", "name email");
    // .populate({
    //   path: "statusLogs.updatedBy",
    //   select: "name",
    // });
    // Map statusLogs to extract only name
    // const statusLogs = parcel?.statusLogs.map((log) => ({
    //   status: log.status,
    //   updatedByName: log.updatedBy ? log.updatedBy.name : "Unknown",
    //   timestamp: log.timestamp,
    // }));
    return {
        data: parcel,
    };
});
const getParcelByTrackingId = (trackingId) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.find({ trackingId })
        .populate("sender", "name email")
        .populate("receiver", "name email");
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found with this tracking ID");
    }
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
const deleteParcel = (parcelId, userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const parcel = yield parcel_model_1.Parcel.findById(parcelId);
    if (!parcel) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Parcel not found");
    }
    //  If ADMIN or SUPER_ADMIN => Only can delete directly
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
        yield parcel_model_1.Parcel.findByIdAndDelete(parcelId);
        return { data: parcelId };
    }
    //  If SENDER => must be the sender & status must be REQUESTED
    if (role === "SENDER") {
        if (parcel.sender.toString() !== userId.toString()) {
            // console.log("Sender ID mismatch:", parcel.sender.toString(), userId.toString());
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to delete this parcel");
        }
        if (parcel.status !== "REQUESTED") {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Parcel cannot be deleted because its status is ${parcel.status}`);
        }
        yield parcel_model_1.Parcel.findByIdAndDelete(parcelId);
        return { data: parcelId };
    }
    // If RECEIVER => Cannot delete
    throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized to delete parcels");
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
    assignDeliveryPersonnel,
    getParcelByTrackingId,
    deleteParcel
};
