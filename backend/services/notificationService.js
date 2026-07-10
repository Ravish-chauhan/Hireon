const Notification = require("../models/Notification");

async function createNotification(userId, type, message, action) {
  try {
    await Notification.create({ userId, type, message, action });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

async function getUserNotifications(userId, limit = 10) {
  try {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

module.exports = { createNotification, getUserNotifications };
