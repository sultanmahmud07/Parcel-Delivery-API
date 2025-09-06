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
exports.StatsService = exports.getReceiverStats = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const parcel_model_1 = require("../parcel/parcel.model");
const user_interface_1 = require("../user/user.interface");
const user_model_1 = require("../user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE });
    const totalInActiveUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE });
    const totalBlockedUsersPromise = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.BLOCKED });
    const newUsersInLast7DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newUsersInLast30DaysPromise = user_model_1.User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });
    const usersByRolePromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = yield Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise
    ]);
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    };
});
const getSenderStats = (senderId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!senderId) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender ID is required");
    }
    const totalParcels = yield parcel_model_1.Parcel.countDocuments({ sender: senderId });
    const senderObjectId = new mongoose_1.default.Types.ObjectId(senderId);
    const delivered = yield parcel_model_1.Parcel.countDocuments({ sender: senderId, status: "DELIVERED" });
    const inTransit = yield parcel_model_1.Parcel.countDocuments({
        sender: senderId,
        status: { $in: ["IN_TRANSIT", "DISPATCHED"] },
    });
    const pending = yield parcel_model_1.Parcel.countDocuments({
        sender: senderId,
        status: { $in: ["REQUESTED", "APPROVED"] },
    });
    const canceled = yield parcel_model_1.Parcel.countDocuments({ sender: senderId, status: "CANCELED" });
    // Monthly trend data
    const monthlyShipments = yield parcel_model_1.Parcel.aggregate([
        { $match: { sender: senderObjectId } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id": 1 } },
    ]);
    const monthlyData = yield parcel_model_1.Parcel.aggregate([
        { $match: { sender: senderObjectId } },
        {
            $group: {
                _id: { $month: "$createdAt" }, // Group by month
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                month: "$_id",
                count: 1,
                _id: 0,
            },
        },
        { $sort: { month: 1 } },
    ]);
    // Convert month number to short name
    const formatted = monthlyData.map((item) => ({
        month: new Date(2024, item.month - 1).toLocaleString("default", { month: "short" }),
        count: item.count,
    }));
    return {
        data: {
            totalParcels,
            delivered,
            inTransit,
            pending,
            canceled,
            monthlyShipments,
            formatted
        }
    };
});
const getReceiverStats = (receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!receiverId)
        throw new AppError_1.default(404, "Receiver ID is required");
    const receiverObjectId = new mongoose_1.default.Types.ObjectId(receiverId);
    // ✅ Summary counts
    const totalParcels = yield parcel_model_1.Parcel.countDocuments({ receiver: receiverObjectId });
    const delivered = yield parcel_model_1.Parcel.countDocuments({ receiver: receiverObjectId, status: "DELIVERED" });
    const inTransit = yield parcel_model_1.Parcel.countDocuments({
        receiver: receiverObjectId,
        status: { $in: ["IN_TRANSIT", "DISPATCHED"] },
    });
    const pending = yield parcel_model_1.Parcel.countDocuments({
        receiver: receiverObjectId,
        status: { $in: ["REQUESTED", "APPROVED"] },
    });
    const canceled = yield parcel_model_1.Parcel.countDocuments({ receiver: receiverObjectId, status: "CANCELED" });
    // ✅ Date ranges
    const now = new Date();
    // Last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 6);
    // Last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(now.getMonth() - 11);
    // ✅ Daily trend (last 7 days)
    const dailyData = yield parcel_model_1.Parcel.aggregate([
        {
            $match: {
                receiver: receiverObjectId,
                createdAt: { $gte: sevenDaysAgo, $lte: now },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                    day: { $dayOfMonth: "$createdAt" },
                },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                date: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: {
                            $dateFromParts: {
                                year: "$_id.year",
                                month: "$_id.month",
                                day: "$_id.day",
                            },
                        },
                    },
                },
                count: 1,
                _id: 0,
            },
        },
        { $sort: { date: 1 } },
    ]);
    // ✅ Monthly trend (last 12 months)
    const monthlyData = yield parcel_model_1.Parcel.aggregate([
        {
            $match: {
                receiver: receiverObjectId,
                createdAt: { $gte: twelveMonthsAgo, $lte: now },
            },
        },
        {
            $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                month: {
                    $dateToString: {
                        format: "%Y-%m",
                        date: {
                            $dateFromParts: { year: "$_id.year", month: "$_id.month" },
                        },
                    },
                },
                count: 1,
                _id: 0,
            },
        },
        { $sort: { month: 1 } },
    ]);
    // ✅ Format monthly for charts (convert YYYY-MM to short month name)
    const formattedMonthly = monthlyData.map((item) => ({
        month: new Date(item.month + "-01").toLocaleString("default", { month: "short" }),
        count: item.count,
    }));
    return {
        data: {
            totalParcels,
            delivered,
            inTransit,
            pending,
            canceled,
            dailyData,
            monthlyData: formattedMonthly,
        },
    };
});
exports.getReceiverStats = getReceiverStats;
exports.StatsService = {
    getSenderStats,
    getUserStats,
    getReceiverStats: exports.getReceiverStats
};
