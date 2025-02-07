const { logger } = require("../utils/logger");
const { roleQuery } = require("../dao/role_dao");

const getRoleService = async () => {
  try {
    const data = await roleQuery("GET_ROLES");
    return data;
  } catch (error) {
    logger.error("get organization service", error);
  }
};

const getSingleRoleService = async (params) => {
  try {
    const data = await roleQuery("GET_SINGLE_ROLE", params);
    return data;
  } catch (error) {
    logger.error("get single organization service", error);
  }
};

const createRoleService = async (params) => {
  try {
    let data = {};
    const response = await roleQuery("CREATE_ROLE", params);
    let role_id = response?.insertId ? response.insertId : 0;
    if (role_id) {
      data = await roleQuery("GET_SINGLE_ROLE", { role_id });
    }
    return data;
  } catch (error) {
    logger.error("create organization service", error);
  }
};

const getPermissionsService = async () => {
  try {
    const data = await roleQuery("GET_PERMISSIONS");
    return data;
  } catch (error) {
    logger.error("get permissions service", error);
  }
};

const deleteRoleService = async (params) => {
  try {
    let roleDetails = await roleQuery("CHECK_IF_ROLE_IN_USE", params);
    if (roleDetails && roleDetails.length == 0) {
      await roleQuery("DELETE_ROLE", params);
      return true;
    }
    return false;
  } catch (error) {
    logger.error("delete role service", error);
  }
};

module.exports = {
  getRoleService,
  getSingleRoleService,
  createRoleService,
  getPermissionsService,
  deleteRoleService,
};
