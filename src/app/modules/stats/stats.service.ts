import AppError from "../../errorHelpers/AppError";
import { Parcel } from "../parcel/parcel.model";
import { IsActive } from "../user/user.interface";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
    const totalUsersPromise = User.countDocuments()

    const totalActiveUsersPromise = User.countDocuments({ isActive: IsActive.ACTIVE })
    const totalInActiveUsersPromise = User.countDocuments({ isActive: IsActive.INACTIVE })
    const totalBlockedUsersPromise = User.countDocuments({ isActive: IsActive.BLOCKED })

    const newUsersInLast7DaysPromise = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const newUsersInLast30DaysPromise = User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })

    const usersByRolePromise = User.aggregate([

        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])


    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise
    ])
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    }
}

const getSenderStats = async (senderId: string) => {

    if (!senderId) {
        throw new AppError(httpStatus.NOT_FOUND, "Sender ID is required");
    }

    const totalParcels = await Parcel.countDocuments({ sender: senderId });
    const delivered = await Parcel.countDocuments({ sender: senderId, status: "DELIVERED" });
    const inTransit = await Parcel.countDocuments({
        sender: senderId,
        status: { $in: ["IN_TRANSIT", "DISPATCHED"] },
    });
    const pending = await Parcel.countDocuments({
        sender: senderId,
        status: { $in: ["REQUESTED", "APPROVED"] },
    });
    const canceled = await Parcel.countDocuments({ sender: senderId, status: "CANCELED" });

    // Monthly trend data
    const monthlyShipments = await Parcel.aggregate([
        { $match: { sender: senderId } },
        {
            $group: {
                _id: { $month: "$createdAt" },
                count: { $sum: 1 },
            },
        },
        { $sort: { "_id": 1 } },
    ]);

     const monthlyData = await Parcel.aggregate([
        { $match: { sender: senderId } },
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
    }
}
// In StatsService
const getReceiverStats = async (receiverId: string) => {
    if (!receiverId) throw new AppError(404, "Receiver ID is required");

    const totalParcels = await Parcel.countDocuments({ receiver: receiverId });
    const delivered = await Parcel.countDocuments({ receiver: receiverId, status: "DELIVERED" });
    const inTransit = await Parcel.countDocuments({
        receiver: receiverId,
        status: { $in: ["IN_TRANSIT", "DISPATCHED"] },
    });
    const pending = await Parcel.countDocuments({
        receiver: receiverId,
        status: { $in: ["REQUESTED", "APPROVED"] },
    });
    const canceled = await Parcel.countDocuments({ receiver: receiverId, status: "CANCELED" });

    // Daily trend aggregation
    const dailyData = await Parcel.aggregate([
        { $match: { receiver: receiverId } },
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
                    $dateToString: { format: "%Y-%m-%d", date: { $dateFromParts: { year: "$_id.year", month: "$_id.month", day: "$_id.day" } } },
                },
                count: 1,
                _id: 0,
            },
        },
        { $sort: { date: 1 } },
    ]);

    return {
        data: {
            totalParcels,
            delivered,
            inTransit,
            pending,
            canceled,
            dailyData,
        },
    };
};


export const StatsService = {
    getSenderStats,
    getUserStats,
    getReceiverStats
}
