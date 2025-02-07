const { logger } = require("../utils/logger");
const { userQuery } = require("../dao/user_dao");
const {
  generateRandomPassword,
  getExpiryTimeStamp,
} = require("../utils/helper");
const { loginQuery } = require("../dao/login_dao");
const { smtpTransporter } = require("../config/aws_config");
const { notificationQuery } = require("../dao/notification_dao");

const insertUserService = async (params) => {
  try {
    let data = {};
    params.user_password = generateRandomPassword();
    params.user_password_expiry = getExpiryTimeStamp();
    const type = "USER_CREATION";

    const res = await userQuery("CREATE_USER", params);
    let user_id = res?.insertId ? res.insertId : 0;
    if (user_id) {
      await notificationQuery("CREATE_USER_CREATION_NOTIFICATION", {
        notification_message: `Welcome on board ${params.user_first_name} ${params.user_last_name}`,
        user_id,
        type,
      });
      let organizationAdmins = await userQuery("GET_ORGANIZATION_ADMIN", {
        organization_id: params.org_id,
      });
      const orgAdminArray = organizationAdmins[0]?.org_admin;
      for (const admin of orgAdminArray) {
        await notificationQuery("CREATE_USER_CREATION_NOTIFICATION", {
          notification_message: "New user has been added to your organization",
          user_id: admin,
          type,
        });
      }
      const roleKeywords = ["admin", "super admin", "org super admin"];
      let isAdmin = roleKeywords.some((keyword) =>
        params.role_name.toLowerCase().includes(keyword.toLowerCase()),
      );
      const currentYear = new Date().getFullYear();
      if (isAdmin) {
        const mailOptions = {
          from: process.env.FROM,
          to: params.user_email.toLowerCase(),
          text: params.user_password,
          subject: "Welcome to Regunova AI – Your Admin Account is Ready!",
          html: `<style>
                    p {
                      color: black;
                    }
                  </style>
                  <p>Dear ${params.user_first_name} ${params.user_last_name},</p>
                  <p>I hope you are doing well.</p>
                  <p>We are thrilled to welcome you to Regunova! You have been added as an admin, granting you full access to manage and oversee your organization's account.</p>
                  <p>Below are your login credentials to access your account:</p>
                  <p><b>Username:</b> ${params.user_email}</p>
                  <p><b>Temporary Password:</b> ${params.user_password}</p>
                  <p>To log in click on the button below:</p>
                  <a href="http://44.196.170.163:3000/login" style="text-decoration: none;">
                    <button style="width: 250px; height: 40px; background-color: rgb(7, 39, 107); border-radius: 6px; border: none; color: white; padding: 10px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                      Login
                    </button>
                  </a>
                  <p>For security purposes, we will require you to update your password after your first login.</p>
                  <p>As an admin, you can:</p>
                  <ul>
                    <li>Add Users for your organization.</li>
                    <li>Manage user permissions and settings.</li>
                  </ul>
                  <p>Thank you for choosing Regunova. We are excited to have you on board!</p>
                  </br>
                  </br>
                  <p>Sincerely,</p>
                  <p>Customer Support Team</p>
                  <p>Regunova AI</p>
                  <p>support@regunova.ai</p>
                  <img src="https://ticimages.s3.us-east-1.amazonaws.com/Regunovalogo.jpeg" alt="Regunova Logo" style="width: 100px; height: 100px;"/>
                  </br>
                  <p style="font-size: 10px;"> <i>Regunova and Regunova Logo are trademarks of Regunova Inc © ${currentYear} All rights reserved.</i></p>
                  <p style="font-size: 10px;"><i>This email may contain privileged or confidential information. If you are not the intended recipient (1) you may not disclose, use, distribute, copy, or rely upon this message or attachment(s); and (2) please notify the sender and then delete this message and any attachment(s). Regunova AI and its affiliates disclaim all liability for any errors, omissions, corruption, or viruses in any message or any attachments.</i></p>
                `,
        };

        await smtpTransporter.sendMail(mailOptions);
      } else {
        const mailOptions = {
          from: process.env.FROM,
          to: params.user_email.toLowerCase(),
          // text: params.user_password,
          subject: "Welcome to Regunova AI – Your User Account is Ready!",
          html: `<style>
                    p {
                      color: black;
                    }
                  </style>
                  <p>Dear ${params.user_first_name} ${params.user_last_name},</p>
                  <p>I hope you are doing well.</p>
                  <p>We are thrilled to welcome you to Regunova! You have been added as a user, granting you access to manage and run projects for your organization.</p>
                  <p>Below are your login credentials to access your account:</p>
                  <p><b>Username:</b> ${params.user_email}</p>
                  <p><b>Temporary Password:</b> ${params.user_password}</p>
                  <p>To log in click on the button below:</p>
                  <a href="http://44.196.170.163:3000/login" style="text-decoration: none;">
                    <button style="width: 250px; height: 40px; background-color: rgb(7, 39, 107); border-radius: 6px; border: none; color: white; padding: 10px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                      Login
                    </button>
                  </a>
                  <p>For security purposes, we will require you to update your password after your first login.</p>
                  <p>Thank you for choosing Regunova. We are excited to have you on board!</p>
                  </br>
                  </br>
                  <p>Sincerely,</p>
                  <p>Customer Support Team</p>
                  <p>Regunova AI</p>
                  <p>support@regunova.ai</p>
                  </br>
                  <img src="https://ticimages.s3.us-east-1.amazonaws.com/Regunovalogo.jpeg" alt="Regunova Logo" style="width: 100px; height: 100px;"/>
                  </br>
                  </br>
                  <p style="font-size: 10px;"> <i>Regunova and Regunova Logo are trademarks of Regunova Inc © ${currentYear} All rights reserved.</i></p>
                  <p style="font-size: 10px;"><i>This email may contain privileged or confidential information. If you are not the intended recipient (1) you may not disclose, use, distribute, copy, or rely upon this message or attachment(s); and (2) please notify the sender and then delete this message and any attachment(s). Regunova AI and its affiliates disclaim all liability for any errors, omissions, corruption, or viruses in any message or any attachments.</i></p>
                `,
        };

        await smtpTransporter.sendMail(mailOptions);
      }

      data = await userQuery("GET_SINGLE_USER", { user_id });
    }
    return data;
  } catch (error) {
    logger.error("insert user service", error);
  }
};

const getUserService = async () => {
  try {
    const data = {};
    data.activeUsers = await userQuery("GET_SA_ACTIVE_USERS");
    data.inactiveUsers = await userQuery("GET_SA_INACTIVE_USERS");
    return data;
  } catch (error) {
    logger.error("get user service", error);
  }
};

const getSignleUserService = async (params) => {
  try {
    const data = await userQuery("GET_SINGLE_USER", params);
    return data;
  } catch (error) {
    logger.error("get single user service", error);
  }
};

const getUserExistService = async (params) => {
  try {
    try {
      const [{ user_id = null } = {}] = await loginQuery(
        "CHECK_IF_USER_EXISTS",
        params,
      );
      return user_id;
    } catch (error) {
      logger.error("get single user service", error);
    }
  } catch (error) {
    logger.error("get user exist service", error);
  }
};

const getOrgUserService = async (params) => {
  try {
    const data = {};
    data.activeUsers = await userQuery("GET_ORG_ACTIVE_USERS", params);
    data.inactiveUsers = await userQuery("GET_ORG_INACTIVE_USERS", params);
    return data;
  } catch (error) {
    logger.error("get org user service", error);
  }
};

const updateUserService = async (params) => {
  try {
    await userQuery("UPDATE_USER", params);
    let data = await userQuery("GET_SINGLE_USER", { user_id: params.user_id });
    return data;
  } catch (error) {
    logger.error("update user service", error);
  }
};

const getOrgUserCountService = async (params) => {
  try {
    const data = await userQuery("GET_ORG_USER_COUNT", params);
    return data;
  } catch (error) {
    logger.error("get org user count service", error);
  }
};

const getSaUserCountService = async (params) => {
  try {
    const data = await userQuery("GET_SA_USER_COUNT", params);
    return data;
  } catch (error) {
    logger.error("get sa user count service", error);
  }
};

const deleteUserService = async (params) => {
  try {
    await userQuery("UPADTE_USER_STATUS", params);
    return true;
  } catch (error) {
    logger.error("delete user service", error);
  }
};

module.exports = {
  insertUserService,
  getUserService,
  getSignleUserService,
  getUserExistService,
  getOrgUserService,
  updateUserService,
  getOrgUserCountService,
  getSaUserCountService,
  deleteUserService,
};
