"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateParcelStatusZodSchema = exports.createParcelZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createParcelZodSchema = zod_1.default.object({
    receiver: zod_1.default.string({ required_error: "Receiver ID required" }),
    type: zod_1.default.string().min(1, "Parcel type required"),
    weight: zod_1.default.number().positive("Weight must be positive"),
    address: zod_1.default.string().min(10, "Address must be at least 10 chars"),
    fee: zod_1.default.number().optional(),
    deliveryDate: zod_1.default.string().optional()
});
exports.updateParcelStatusZodSchema = zod_1.default.object({
    status: zod_1.default.enum([
        "REQUESTED",
        "APPROVED",
        "DISPATCHED",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELED",
        "BLOCKED",
        "UNBLOCKED"
    ]),
    location: zod_1.default.string().optional(),
    note: zod_1.default.string().optional()
});
