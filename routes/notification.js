const express = require("express");
const router = new express.Router();
const { setResponse } = require("../utils/response");
const { validate } = require("../utils/helper");
const { logger } = require("../utils/logger");
const {
  SUCCESS,
  STATUS_CODE_SUCCESS,
  CUSTOM_RESPONSE,
  STATUS_CODE_BAD_REQUEST,
  STATUS_CODE_INTERNAL_SERVER_ERROR,
} = require("../constants/response_constants");
const {
  getNotificationsService,
  updateNotificationService,
} = require("../service/notification_service");

router.get("/api/v1/notifications", async (req, res) => {
  try {
    const {
      query: { user_id = 0 },
    } = req;
    let data = {};
    let responseType = "";
    let statusCode = "";
    let customResponse = {};
    const { isValid, errors } = validate({}, {}, { user_id });
    if (isValid) {
      let notifications = await getNotificationsService({ user_id });
      if (notifications) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.details = notifications;
        data.message = "Fetched Notifications Successfully";
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = "Failed to fetch notifications";
        customResponse.messageCode = statusCode;
      }
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(", ");
    }
    let response = setResponse(responseType, "", data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error("Get notifications route", err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

router.post("/api/v1/notifications/markAsRead", async (req, res) => {
  try {
    const {
      body: { notifications = [] },
      query: { user_id = 0 },
    } = req;
    let data = {};
    let responseType = "";
    let statusCode = "";
    let customResponse = {};
    const { isValid, errors } = validate({}, {}, { user_id });
    if (isValid && notifications && notifications.length > 0) {
      let response = await updateNotificationService({
        user_id,
        notifications,
      });
      if (response) {
        responseType = SUCCESS;
        statusCode = STATUS_CODE_SUCCESS;
        data.message = "Updated Notifications Successfully";
      } else {
        responseType = CUSTOM_RESPONSE;
        statusCode = STATUS_CODE_BAD_REQUEST;
        customResponse.statusCode = statusCode;
        customResponse.message = "Failed to mark notifications as read";
        customResponse.messageCode = statusCode;
      }
    } else {
      responseType = CUSTOM_RESPONSE;
      statusCode = STATUS_CODE_BAD_REQUEST;
      customResponse.statusCode = statusCode;
      customResponse.message = Object.values(errors)
        .flatMap((err) => Object.values(err))
        .filter((msg) => msg)
        .join(", ");
    }
    let response = setResponse(responseType, "", data, customResponse);
    res.status(statusCode).send(response);
  } catch (err) {
    logger.error("Mark notifications as read route", err);
    res.status(STATUS_CODE_INTERNAL_SERVER_ERROR).send(err);
  }
});

module.exports = router;
