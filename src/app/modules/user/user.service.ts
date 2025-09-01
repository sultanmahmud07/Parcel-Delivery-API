import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isExist = await User.findOne({ email });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));
  const auth: IAuthProvider = { provider: "credentials", providerId: email as string };

  const user = await User.create({
    email,
    password: hashedPassword,
    auths: [auth],
    ...rest
  });

  return user;
};

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError(httpStatus.NOT_FOUND, "User not found");

  if (payload.role) {
    if ([Role.SENDER, Role.RECEIVER].includes(decodedToken.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "Insufficient role");
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, "Only super admin can assign super admin");
    }
  }

  if (payload.isActive || payload.isDeleted || payload.isVerified) {
    if ([Role.SENDER, Role.RECEIVER].includes(decodedToken.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "Insufficient role");
    }
  }

  if (payload.password) {
    payload.password = await bcryptjs.hash(payload.password, Number(envVars.BCRYPT_SALT_ROUND));
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true
  });

  return updatedUser;
};

const getAllUsers = async () => {
    const users = await User.find({});
    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
};
const getAllSender = async () => {
  const users = await User.find({ role: "SENDER" });
  const totalSender = await User.countDocuments({ role: "SENDER" });
  return {
    data: users,
    meta: {
      total: totalSender,
    },
  };
};
const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};
export const UserServices = {
    createUser,
    getAllUsers,
    getAllSender,
    updateUser,
    getMe,
    getSingleUser
}