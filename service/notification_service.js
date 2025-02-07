const { logger } = require("../utils/logger");
const { notificationQuery } = require("../dao/notification_dao");

const getNotificationsService = async (params) => {
  try {
    const response = await notificationQuery("GET_NOTIFICATIONS", params);
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    logger.error("get notifications service", error);
    throw error;
  }
};

const updateNotificationService = async (params) => {
  try {
    const response = await notificationQuery("UPDATE_NOTIFICATION", params);
    if (response) {
      return response;
    }
    return null;
  } catch (error) {
    logger.error("update notifications service", error);
    throw error;
  }
};

module.exports = {
  getNotificationsService,
  updateNotificationService,
};
