const { logger } = require('../utils/logger');
const { userQuery } = require('../dao/user_dao');
const { generateRandomPassword } = require('../utils/helper');
const { loginQuery } = require('../dao/login_dao');
// const { smtpTransporter } = require('../config/aws_config');

const insertUserService = async (params) => {
  try {
    let data = {};
    params.user_password = generateRandomPassword();

    const res = await userQuery('CREATE_USER', params);
    let user_id = res?.insertId ? res.insertId : 0;
    if (user_id) {
      data = await userQuery('GET_SINGLE_USER', { user_id });
    }
    return data;
  } catch (error) {
    logger.error('insert user service', error);
  }
};

const getUserService = async () => {
  try {
    const data = {};
    data.activeUsers = await userQuery('GET_SA_ACTIVE_USERS');
    data.inactiveUsers = await userQuery('GET_SA_INACTIVE_USERS');
    return data;
  } catch (error) {
    logger.error('get user service', error);
  }
};

const getSignleUserService = async (params) => {
  try {
    const data = await userQuery('GET_SINGLE_USER', params);
    return data;
  } catch (error) {
    logger.error('get single user service', error);
  }
};

const getUserExistService = async (params) => {
  try {
    try {
      const [{ user_id = null } = {}] = await loginQuery(
        'CHECK_IF_USER_EXISTS',
        params,
      );
      return user_id;
    } catch (error) {
      logger.error('get single user service', error);
    }
  } catch (error) {
    logger.error('get user exist service', error);
  }
};

const getOrgUserService = async (params) => {
  try {
    const data = {};
    data.activeUsers = await userQuery('GET_ORG_ACTIVE_USERS', params);
    data.inactiveUsers = await userQuery('GET_ORG_INACTIVE_USERS', params);
    return data;
  } catch (error) {
    logger.error('get org user service', error);
  }
};

const updateUserService = async (params) => {
  try {
    await userQuery('UPDATE_USER', params);
    let data = await userQuery('GET_SINGLE_USER', { user_id: params.user_id });
    return data;
  } catch (error) {
    logger.error('update user service', error);
  }
};

const getOrgUserCountService = async (params) => {
  try {
    const data = await userQuery('GET_ORG_USER_COUNT', params);
    return data;
  } catch (error) {
    logger.error('get org user count service', error);
  }
};

const getSaUserCountService = async (params) => {
  try {
    const data = await userQuery('GET_SA_USER_COUNT', params);
    return data;
  } catch (error) {
    logger.error('get sa user count service', error);
  }
};

const deleteUserService = async (params) => {
  try {
    await userQuery('UPADTE_USER_STATUS', params);
    return true;
  } catch (error) {
    logger.error('delete user service', error);
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
