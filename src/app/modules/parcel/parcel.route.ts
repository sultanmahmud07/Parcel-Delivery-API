import { Router } from "express";
import { Role } from "../user/user.interface";
import { createParcelZodSchema, updateParcelStatusZodSchema } from "./parcel.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { ParcelController } from "./parcel.controller";

const router = Router();

router.post(
  "/create",
  checkAuth(...Object.values(Role)),
  validateRequest(createParcelZodSchema),
  ParcelController.createParcel
);

router.get("/sender", checkAuth(Role.SENDER), ParcelController.getSenderParcels);
router.get("/receiver", checkAuth(Role.RECEIVER), ParcelController.getReceiverParcels);

router.patch("/cancel/:id", checkAuth(Role.SENDER), ParcelController.cancelParcel);
router.patch(
  "/status/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updateParcelStatusZodSchema),
  ParcelController.updateParcelStatus
);

export const ParcelRoutes = router;
