const { connectDB } = require("../config/database");
const { logger } = require("../utils/logger");

var pool = connectDB();

const userQuery = async (queryType, params = {}) => {
  try {
    let query1 = "";
    switch (queryType) {
      case "GET_SA_ACTIVE_USERS":
        query1 = `SELECT 
                      user_id, 
                      user_email, 
                      user_address, 
                      user_first_name, 
                      user_last_name, 
                      user_phone_no, 
                      user_profile, 
                      created_by, 
                      created_date, 
                      updated_by, 
                      updated_date, 
                      sector_id, 
                      sector_name, 
                      org_id, 
                      org_name, 
                      industry_id, 
                      industry_name, 
                      role_id, 
                      role_name, 
                      is_active, 
                      password_updated_date 
                  FROM users 
                  WHERE is_active = 1 
                  ORDER BY created_date DESC;`;
        break;
      case "GET_SA_INACTIVE_USERS":
        query1 = `SELECT 
                      user_id, 
                      user_email, 
                      user_address, 
                      user_first_name, 
                      user_last_name, 
                      user_phone_no, 
                      user_profile, 
                      created_by, 
                      created_date, 
                      updated_by, 
                      updated_date, 
                      sector_id, 
                      sector_name, 
                      org_id, 
                      org_name, 
                      industry_id, 
                      industry_name, 
                      role_id, 
                      role_name, 
                      is_active, 
                      password_updated_date 
                  FROM users 
                  WHERE is_active = 0 
                  ORDER BY created_date DESC;`;
        break;
      case "GET_ORG_ACTIVE_USERS":
        query1 = `SELECT 
                      user_id, 
                      user_email, 
                      user_address, 
                      user_first_name, 
                      user_last_name, 
                      user_phone_no, 
                      user_profile, 
                      created_by, 
                      created_date, 
                      updated_by, 
                      updated_date, 
                      sector_id, 
                      sector_name, 
                      org_id, 
                      org_name, 
                      industry_id, 
                      industry_name, 
                      role_id, 
                      role_name, 
                      is_active, 
                      password_updated_date  
                  FROM users 
                  WHERE org_id = ${params.org_id} ${params.industry_id ? ` AND industry_id = ${params.industry_id}` : ""} 
                      AND is_active = 1 
                  ORDER BY created_date DESC;`;
        break;
      case "GET_ORG_INACTIVE_USERS":
        query1 = `SELECT user_id, 
                      user_email, 
                      user_address, 
                      user_first_name, 
                      user_last_name, 
                      user_phone_no, 
                      user_profile, 
                      created_by, 
                      created_date, 
                      updated_by, 
                      updated_date, 
                      sector_id, 
                      sector_name, 
                      org_id, 
                      org_name, 
                      industry_id, 
                      industry_name, 
                      role_id, 
                      role_name, 
                      is_active, 
                      password_updated_date 
                  FROM users 
                  WHERE org_id = ${params.org_id} ${params.industry_id ? ` AND industry_id = ${params.industry_id}` : ""} 
                      AND is_active = 0 
                  ORDER BY created_date DESC;`;
        break;
      case "GET_ORG_ACTIVE_USER_COUNT":
        query1 = `SELECT count(user_id) as count FROM users WHERE org_id = ${params.org_id} ${params.industry_id ? ` AND industry_id = ${params.industry_id}` : ""} AND is_active = 1;`;
        break;
      case "GET_ORG_INACTIVE_USER_COUNT":
        query1 = `SELECT count(user_id) as count FROM users WHERE org_id = ${params.org_id} ${params.industry_id ? ` AND industry_id = ${params.industry_id}` : ""} AND is_active = 0;`;
        break;
      case "GET_SA_ACTIVE_USER_COUNT":
        query1 = `select count(user_id) as count FROM users WHERE is_active = 1;`;
        break;
      case "GET_SA_INACTIVE_USER_COUNT":
        query1 = `select count(user_id) as count FROM users WHERE is_active = 0;`;
        break;
      case "GET_SINGLE_USER":
        query1 = `SELECT user_email, 
                      user_address, 
                      user_first_name, 
                      user_last_name, 
                      user_phone_no, 
                      user_profile, 
                      created_by, 
                      created_date, 
                      updated_by, 
                      updated_date, 
                      sector_id, 
                      sector_name, 
                      org_id, 
                      org_name, 
                      industry_id, 
                      industry_name, 
                      role_id, 
                      role_name, 
                      is_active, 
                      password_updated_date 
                  FROM users 
                  WHERE user_id = ${params.user_id} AND is_active = 1;`;
        break;
      case "CREATE_USER":
        query1 = `INSERT INTO users (
                      org_id, 
                      role_id, 
                      role_name, 
                      user_first_name, 
                      user_last_name, 
                      user_profile, 
                      user_email, 
                      user_phone_no, 
                      user_password, 
                      user_address, 
                      created_by, 
                      sector_id, 
                      sector_name, 
                      org_name, 
                      industry_id, 
                      industry_name,
                      user_password_expiry
                  ) VALUES (
                      ${params.org_id},
                      ${params.role_id},
                      '${params.role_name}',
                      '${params.user_first_name}',
                      '${params.user_last_name}',
                      '${params.user_profile}',
                      '${params.user_email}',
                      '${params.user_phone_no}',
                      '${params.user_password}',
                      '${JSON.stringify(params.user_address)}',
                      ${params.created_by},
                      ${params.sector_id},
                      '${params.sector_name}',
                      '${params.org_name}',
                      ${params.industry_id},
                      '${params.industry_name}',
                      '${params.user_password_expiry}'
                  );`;
        break;
      case "UPDATE_USER":
        query1 = `UPDATE users
                  SET
                      org_id = ${params.org_id},
                      role_id = ${params.role_id},
                      role_name = '${params.role_name}',
                      user_first_name = '${params.user_first_name}',
                      user_last_name = '${params.user_last_name}',
                      user_profile = '${params.user_profile}',
                      user_email = '${params.user_email}',
                      user_phone_no = '${params.user_phone_no}',
                      user_address = '${JSON.stringify(params.user_address)}',
                      created_by = ${params.created_by},
                      sector_id = ${params.sector_id},
                      sector_name = '${params.sector_name}',
                      org_name = '${params.org_name}',
                      industry_id = ${params.industry_id},
                      industry_name = '${params.industry_name}'
                      ${params.is_active == true || params.is_active == false ? `, is_active = ${params.is_active}` : ""}
                  WHERE user_id = ${params.user_id};
            `;
        break;
      case "UPADTE_USER_STATUS":
        query1 = `UPDATE users SET is_active = ${params.is_active} WHERE user_id = ${params.user_id};`;
        break;
      case "GET_ORGANIZATION_ADMIN":
        query1 = `SELECT JSON_ARRAYAGG(user_id) AS org_admin FROM users WHERE role_name = 'Org Super Admin' AND org_id = ${params.organization_id};`;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`User dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error("User dao", err);
  }
};

module.exports = {
  userQuery,
};
