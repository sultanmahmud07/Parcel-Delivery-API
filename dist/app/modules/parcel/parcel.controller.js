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
exports.ParcelController = exports.getParcelById = exports.createParcel = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const catchAsync_1 = require("../../utils/catchAsync");
const parcel_service_1 = require("./parcel.service");
const sendResponse_1 = require("../../utils/sendResponse");
const mongoose_1 = require("mongoose");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
exports.createParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const parcelData = req.body;
    // console.log(decodeToken)
    const parcel = yield parcel_service_1.ParcelService.createParcel(parcelData, decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Parcel created successfully',
        data: parcel,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getParcelsByAdmin = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield parcel_service_1.ParcelService.getParcelsByAdmin();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Retrieved Successfully By Admin",
        data: result.data,
        meta: result.meta
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getSenderParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.getParcelsBySender(decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Retrieved Successfully By Sender",
        data: result.data
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getReceiverParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.getParcelsByReceiver(decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Retrieved Successfully By Receiver",
        data: result.data
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cancelParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    // console.log(parcelId)
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.cancelParcel(parcelId, decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Cancel Successfully",
        data: result.data
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deliveryParcelByReceiver = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    // console.log(parcelId)
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.deliveryParcelByReceiver(parcelId, decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Delivery Successfully",
        data: result.data
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getDeliveryHistory = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const result = yield parcel_service_1.ParcelService.getDeliveryHistory(decodeToken.userId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Delivery history retrieved successfully",
        data: result.data
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const parcelBlockAndUnblock = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { isBlocked, location, note } = req.body;
    const { id: parcelId } = req.params;
    const decoded = req.user;
    const updatedBy = new mongoose_1.Types.ObjectId(decoded._id);
    const result = yield parcel_service_1.ParcelService.parcelBlockAndUnblock(parcelId, isBlocked, updatedBy, location, note);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: `Parcel ${isBlocked ? "blocked" : "unblocked"} successfully`,
        data: result,
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assignDeliveryPersonnel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { parcelId } = req.params;
    const { personnelId } = req.body;
    const result = yield parcel_service_1.ParcelService.assignDeliveryPersonnel(parcelId, personnelId);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Delivery personnel assigned successfully",
        data: result.data
    });
}));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateParcelStatus = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, location, note } = req.body;
    const parcelId = req.params.id;
    const decodeToken = req.user;
    const updatedBy = new mongoose_1.Types.ObjectId(decodeToken._id);
    const result = yield parcel_service_1.ParcelService.updateParcelStatus(parcelId, status, updatedBy, location, note);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.default.CREATED,
        message: "Parcel Cancel Successfully",
        data: result.data
    });
}));
exports.getParcelById = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelId = req.params.id;
    const parcel = yield parcel_service_1.ParcelService.getParcelById(parcelId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Parcel details retrieved',
        data: parcel,
    });
}));
exports.ParcelController = {
    createParcel: exports.createParcel,
    getSenderParcels,
    getReceiverParcels,
    getParcelsByAdmin,
    getParcelById: exports.getParcelById,
    getDeliveryHistory,
    cancelParcel,
    deliveryParcelByReceiver,
    updateParcelStatus,
    assignDeliveryPersonnel,
    parcelBlockAndUnblock
};
