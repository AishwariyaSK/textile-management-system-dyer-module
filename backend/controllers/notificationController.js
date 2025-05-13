import notificationModel from "../models/notificationModel.js";
import mongoose from "mongoose";

const createNotification = async (req, res) => {
  try {
    const { userId, message, batchId, category, isForAdmin } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: "Message is required and must be a string" });
    }

    let validUserId = null;
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, message: "Invalid userId" });
      }
      validUserId = userId;
    }
    let validBatchId = null;
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(batchId)) {
        return res.status(400).json({ success: false, message: "Invalid batchId" });
      }
      validBatchId = batchId;
    }     

    const notification = new notificationModel({
      userId: validUserId,
      message,
      isForAdmin,
      category,
      batchId:validBatchId
      // isForAdmin is handled automatically in schema based on absence of userId
    });

    await notification.save();

    res.status(201).json({ success: true, notification });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createNotificationFunction = async ({ userId, message, batchId, category, isForAdmin }) => {
  try {
    if (!message || typeof message !== 'string') {
      throw new Error("Message is required and must be a string");
    }

    let validUserId = null;
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId");
      }
      validUserId = userId;
    }

    let validBatchId = null;
    if (batchId) {
      if (!mongoose.Types.ObjectId.isValid(batchId)) {
        throw new Error("Invalid batchId");
      }
      validBatchId = batchId;
    }

    const notification = new notificationModel({
      userId: validUserId,
      message,
      isForAdmin,
      category,
      batchId: validBatchId
    });

    await notification.save();
    return notification;
  } catch (err) {
    console.error("Error creating notification:", err);
    throw err;
  }
};

const getNotifications = async (req, res) => {
    try{
        const userId = req.user._id;
        const role = req.user.role;
        if (req.user.role === 'admin') {
            const notifications = await notificationModel.find({ isForAdmin: true }).sort({ dateTime: -1 });
            return res.status(200).json({ success: true, notifications });
        }
        const notifications = await notificationModel.find({ userId }).sort({ dateTime: -1 });
        res.status(200).json({ success: true, notifications });
    }catch (err) {
        console.error("Error fetching notifications:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid notification ID" });
    }

    const notification = await notificationModel.findByIdAndDelete(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

const markNotificationAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid notification ID" });
    }

    const notification = await notificationModel.findByIdAndUpdate(id, { seen: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, notification });
  } catch (err) {
    console.error("Error marking notification as seen:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

const deleteNotificationByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    if (userId===process.env.ADMIN_EMAIL) {
        const notifications = await notificationModel.deleteMany({ userId: null });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const notifications = await notificationModel.deleteMany({ userId });
    if (!notifications) {
      return res.status(404).json({ success: false, message: "No notifications found" });
    }

    res.status(200).json({ success: true, message: "Notifications deleted successfully" });
  } catch (err) {
    console.error("Error deleting notifications:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}



export {createNotification, getNotifications, deleteNotification, markNotificationAsSeen, deleteNotificationByUserId};
