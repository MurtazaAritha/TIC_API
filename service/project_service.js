const { logger } = require('../utils/logger');
const { projectQuery } = require('../dao/project_dao');
const { userQuery } = require('../dao/user_dao');
const { genericQuery } = require('../dao/generic_dao');

// const {} = require('../constants/response_constants');
const projectService = async (params) => {
  try {
    let data = {};
    const response = await projectQuery('CREATE_PROJECT', params);
    let project_id = response?.insertId ? response.insertId : 0;
    if (project_id) {
      data = await projectQuery('GET_SINGLE_PROJECT', { project_id });
    }
    return data;
  } catch (error) {
    logger.error('Project service', error);
  }
};

const getProjectService = async () => {
  try {
    const data = await projectQuery('GET_PROJECTS');
    return data;
  } catch (error) {
    logger.error('Project service', error);
  }
};

const getSingleProjectService = async (params) => {
  try {
    const data = await projectQuery('GET_SINGLE_PROJECT', params);
    return data;
  } catch (error) {
    logger.error('Get Single project service', error);
  }
};

const projectUpdateService = async (params) => {
  try {
    let data = {};
    await projectQuery('UPDATE_PROJECT', params);
    let project_id = params.project_id;
    if (project_id) {
      data = await projectQuery('GET_SINGLE_PROJECT', { project_id });
    }
    return data;
  } catch (error) {
    logger.error('Project update service', error);
  }
};

const getProjectCountService = async (params) => {
  try {
    const data = await projectQuery('GET_PROJECT_COUNTS', params);
    return data;
  } catch (error) {
    logger.error('Get project count service', error);
  }
};

const getOrgProjectService = async (params) => {
  try {
    const data = await projectQuery('GET_ORG_PROJECTS', params);
    return data;
  } catch (error) {
    logger.error('Get org project service', error);
  }
};

const getUserCreatedProjectService = async (params) => {
  try {
    const data = await projectQuery('GET_USER_CREATED_PROJECTS', params);
    return data;
  } catch (error) {
    logger.error('Get user created project service', error);
  }
};

const getOrgCountService = async (params) => {
  try {
    const data = {};
    let details = await projectQuery('GET_ORG_PROJECT_COUNTS', params);
    data.details = details[0] ? details[0] : {};
    data.userCount = await userQuery('GET_ORG_USER_COUNT', params);
    return data;
  } catch (error) {
    logger.error('Get org project count service', error);
  }
};

const getSACountService = async () => {
  try {
    let data = {};
    let details = await projectQuery('GET_SA_PROJECT_COUNTS');
    data.details = details[0] ? details[0] : {};
    data.userCount = await userQuery('GET_SA_USER_COUNT');
    data.orgCount = await genericQuery('GET_ORGANIZATION_COUNT');
    return data;
  } catch (error) {
    logger.error('Get SA project count service', error);
  }
};

const getSATopProjectService = async () => {
  try {
    let details = await projectQuery('GET_SA_TOP_PROJECTS');
    return details;
  } catch (error) {
    logger.error('Get SA top project service', error);
  }
};

const getOrgTopProjectService = async (params) => {
  try {
    let details = await projectQuery('GET_ORG_TOP_PROJECTS', params);
    return details;
  } catch (error) {
    logger.error('Get org top project service', error);
  }
};

const getUserTopProjectService = async (params) => {
  try {
    let details = await projectQuery('GET_USER_TOP_PROJECTS', params);
    return details;
  } catch (error) {
    logger.error('Get user top project service', error);
  }
};

const getOrgRecentProjectService = async (params) => {
  try {
    let details = await projectQuery('GET_ORG_RECENT_PROJECTS', params);
    return details;
  } catch (error) {
    logger.error('Get org recent project service', error);
  }
};

module.exports = {
  projectService,
  getProjectService,
  getSingleProjectService,
  projectUpdateService,
  getProjectCountService,
  getOrgProjectService,
  getUserCreatedProjectService,
  getOrgCountService,
  getSACountService,
  getSATopProjectService,
  getOrgTopProjectService,
  getUserTopProjectService,
  getOrgRecentProjectService,
};
