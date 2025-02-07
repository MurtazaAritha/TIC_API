const { connectDB } = require("../config/database");
const { logger } = require("../utils/logger");

var pool = connectDB();

const notificationQuery = async (queryType, params = {}) => {
  try {
    let query1 = "";
    switch (queryType) {
      case "GET_NOTIFICATIONS":
        query1 = `SELECT * FROM notifications WHERE user_id = ${params.user_id};`;
        break;
      case "UPDATE_NOTIFICATION":
        query1 = `UPDATE notifications SET is_read = 1 WHERE notification_id IN (${params.notifications}) AND user_id = ${params.user_id};`;
        break;
      case "CREATE_USER_CREATION_NOTIFICATION":
        query1 = `INSERT INTO notifications (user_id, type, notification_message) 
                    VALUES (${params.user_id}, '${params.type}', '${params.notification_message}');
                  `;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`notification dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error("notification dao", err);
  }
};

module.exports = {
  notificationQuery,
};
