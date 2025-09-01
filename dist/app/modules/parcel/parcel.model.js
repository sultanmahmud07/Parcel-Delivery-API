"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parcel = void 0;
const mongoose_1 = require("mongoose");
const statusLogSchema = new mongoose_1.Schema({
    status: { type: String, required: true },
    location: { type: String },
    note: { type: String },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    timestamp: { type: Date, default: Date.now }
}, { _id: false });
const parcelSchema = new mongoose_1.Schema({
    trackingId: { type: String, required: true, unique: true },
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    weight: { type: Number, required: true },
    address: { type: String, required: true },
    fee: { type: Number },
    deliveryDate: { type: Date },
    status: {
        type: String,
        enum: ["REQUESTED", "APPROVED", "DISPATCHED", "IN_TRANSIT", "DELIVERED", "CANCELED", "BLOCKED", "UNBLOCKED"],
        default: "REQUESTED"
    },
    isBlocked: { type: Boolean, default: false },
    statusLogs: [statusLogSchema]
}, {
    timestamps: true,
    versionKey: false
});
exports.Parcel = (0, mongoose_1.model)("Parcel", parcelSchema);
