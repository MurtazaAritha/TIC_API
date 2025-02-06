const { logger } = require('../utils/logger');
const { projectQuery } = require('../dao/project_dao');
const { userQuery } = require('../dao/user_dao');
const { genericQuery } = require('../dao/generic_dao');
const { smtpTransporter } = require('../config/aws_config');
const fs = require('fs');
const path = require('path');

// const {} = require('../constants/response_constants');
const projectService = async (params) => {
  try {
    let data = {};
    const response = await projectQuery('CREATE_PROJECT', params);
    let project_id = response?.insertId ? response.insertId : 0;
    if (project_id) {
      data = await projectQuery('GET_SINGLE_PROJECT', { project_id });
      params.invite_members.forEach((user) => {
        console.log(user.user_email);
        sendMail({user_name: user.user_name, user_email: user.user_email, project_name: params.project_name});
        console.log('Mail sent');
      });
    }
    return data;
  } catch (error) {
    logger.error('Project service', error);
  }
};

const sendMail = async (params) => {
  try {
    const currentYear = new Date().getFullYear();
    // const logoPath = path.join(__dirname, 'utils/regunova.jpeg');
    // const base64Image = fs.readFileSync(logoPath, 'base64');
    const mailOptions = {
      from: process.env.FROM,
      to: params.user_email.toLowerCase(),
      text: params.user_password,
      subject: 'Welcome to Regunova AI – You have been invited to a project!',
      html: `<style>
                    p {
                      color: black;
                    }
                  </style>
                  <p>Dear ${params.user_name},</p>
                  <p>I hope you are doing well.</p>
                  <p>You have been added to the <b>${params.project_name}</b> as a participant/informed to track the progress of the project. We are thrilled to welcome you to Regunova!</p>
                  <p>To check out the project, click on the button below:</p>
                  <a href="http://44.196.170.163:3000/login" style="text-decoration: none;">
                    <button style="width: 250px; height: 40px; background-color: rgb(7, 39, 107); border-radius: 6px; border: none; color: white; padding: 10px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">
                      Login
                    </button>
                  </a>
                  </br>
                  <p>Sincerely,</p>
                  <p>Customer Support Team</p>
                  <p>Regunova AI</p>
                  <p>support@regunova.ai</p>
                 
                  </br>
                  <p style="font-size: 10px;"> <i>Regunova and Regunova Logo are trademarks of Regunova Inc © ${currentYear} All rights reserved.</i></p>
                  <p style="font-size: 10px;"><i>This email may contain privileged or confidential information. If you are not the intended recipient (1) you may not disclose, use, distribute, copy, or rely upon this message or attachment(s); and (2) please notify the sender and then delete this message and any attachment(s). Regunova AI and its affiliates disclaim all liability for any errors, omissions, corruption, or viruses in any message or any attachments.</i></p>
                `,
      //  <img src="data:image/jpeg;base64,${base64Image}" alt="Regunova Logo" style="width: 100px; height: 100px;"/>
    };
    await smtpTransporter.sendMail(mailOptions);
  } catch (error) {
    logger.error('Send mail service', error);
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

const getUserInvitedProjectService = async (params) => {
  try {
    const data = await projectQuery('GET_USER_INVITED_PROJECTS', params);
    return data;
  } catch (error) {
    logger.error('Get user invited project service', error);
  }
};

const getOrgCountService = async (params) => {
  try {
    const data = {};
    let details = await projectQuery('GET_ORG_PROJECT_COUNTS', params);
    data.details = details[0] ? details[0] : {};
    data.activeUserCount = await userQuery('GET_ORG_ACTIVE_USER_COUNT', params);
    data.inactiveUserCount = await userQuery(
      'GET_ORG_INACTIVE_USER_COUNT',
      params,
    );
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
    data.activeUserCount = await userQuery('GET_SA_ACTIVE_USER_COUNT');
    data.inactiveUserCount = await userQuery('GET_SA_INACTIVE_USER_COUNT');
    data.orgCount = await genericQuery('GET_ORGANIZATION_COUNT');
    return data;
  } catch (error) {
    logger.error('Get SA project count service', error);
  }
};

const getSATopProjectService = async () => {
  try {
    let data = {};
    data.industryCount = await projectQuery('GET_SA_TOP_PROJECTS');
    data.orgCount = await projectQuery('GET_SA_ORG_PROJECT_COUNTS');
    return data;
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
  getUserInvitedProjectService,
  getOrgCountService,
  getSACountService,
  getSATopProjectService,
  getOrgTopProjectService,
  getUserTopProjectService,
  getOrgRecentProjectService,
};
