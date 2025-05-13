import { Router } from "express";
import { getNotifications, markNotificationAsSeen, createNotification, deleteNotification, deleteNotificationByUserId} from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/auth.js";

const notificationRouter = Router();

notificationRouter.post("/create", authMiddleware, createNotification);
notificationRouter.get("/", authMiddleware, getNotifications);
notificationRouter.patch("/markAsRead/:id", authMiddleware, markNotificationAsSeen);
notificationRouter.delete("/delete/:id", authMiddleware, deleteNotification);
notificationRouter.delete("/deleteAll", authMiddleware, deleteNotificationByUserId);

export default notificationRouter;