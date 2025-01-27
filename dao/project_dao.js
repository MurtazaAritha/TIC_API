const { connectDB } = require('../config/database');
const { logger } = require('../utils/logger');

var pool = connectDB();

const projectQuery = async (queryType, params = {}) => {
  try {
    let query1 = '';
    switch (queryType) {
      case 'GET_PROJECTS':
        // query1 = `SELECT *
        //           FROM projects
        //           ORDER BY
        //               CASE
        //                   WHEN status = 'Draft' THEN 1
        //                   ELSE 2
        //               END,
        //               last_run DESC;
        //         `;
        query1 = `SELECT 
                      o.org_id, 
                      o.org_name, 
                      o.org_logo, 
                      o.sector_id, 
                      o.sector_name,
                      -- Aggregate the industries into a JSON array
                      JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'industry_id', industry_id,
                              'industry_name', i.industry_name,
                              -- For each industry, aggregate the associated projects into a JSON array
                              'projects', (
                                  SELECT JSON_ARRAYAGG(
                                      JSON_OBJECT(
                                          'project_id', p.project_id,
                                          'project_name', p.project_name,
                                          'project_no', p.project_no,
                                          'project_description', p.project_description,
                                          'regulatory_standard', p.regulatory_standard,
                                          'invite_members', p.invite_members,
                                          'status', p.status,
                                          'no_of_runs', p.no_of_runs,
                                          'success_count', p.success_count,
                                          'fail_count', p.fail_count,
                                          'last_run', p.last_run,
                                          'created_at', p.created_at,
                                          'updated_at', p.updated_at,
                                          'isActive', p.isActive
                                      )
                                  )
                                  FROM projects p
                                    WHERE p.org_id = o.org_id
                              )
                          )
                      ) AS industries
                  FROM organizations o
                  LEFT JOIN industries i ON i.industry_id = o.industries
                  GROUP BY o.org_id, o.sector_id;
            `;
        break;
      case 'GET_USER_CREATED_PROJECTS':
        query1 = `SELECT * 
                  FROM projects
                  WHERE created_by_id = ${params.user_id} 
                  ORDER BY 
                      CASE 
                          WHEN status = 'Draft' THEN 1 
                          ELSE 2 
                      END, 
                      last_run DESC;
                `;
        break;
      case 'GET_ORG_PROJECTS':
        query1 = `SELECT 
                      u.user_id,
                      u.user_first_name,
                      u.user_last_name,
                      u.user_profile,
                      u.role_id,
                      u.role_name,
                      u.industry_id,
                      u.industry_name,
                      u.sector_id,
                      u.sector_name,
                      JSON_ARRAYAGG(
                          JSON_OBJECT(
                              'project_id', p.project_id,
                              'project_name', p.project_name,
                              'project_no', p.project_no,
                              'project_description', p.project_description,
                              'regulatory_standard', p.regulatory_standard,
                              'invite_members', p.invite_members,
                              'status', p.status,
                              'no_of_runs', p.no_of_runs,
                              'success_count', p.success_count,
                              'fail_count', p.fail_count,
                              'last_run', p.last_run,
                              'created_at', p.created_at,
                              'updated_at', p.updated_at,
                              'isActive', p.isActive
                          )
                      ) AS projects
                  FROM 
                      users u
                  JOIN 
                      (
                          SELECT 
                              *
                          FROM 
                              projects
                          WHERE 
                              org_id = ${params.org_id}
                              ${params.industry_id ? ` AND industry_id = ${params.industry_id}` : ''}
                          ORDER BY 
                              CASE 
                                  WHEN status = 'Draft' THEN 1 
                                  ELSE 2 
                              END, 
                              last_run DESC
                      ) p 
                  ON 
                      u.user_id = p.created_by_id
                  WHERE 
                      u.org_id = ${params.org_id}
                  GROUP BY 
                      u.user_id;
                `;
        break;
      case 'GET_SINGLE_PROJECT':
        query1 = `SELECT * FROM projects 
                  WHERE project_id = ${params.project_id} 
                  ORDER BY 
                      CASE 
                          WHEN status = 'Draft' THEN 1 
                          ELSE 2 
                      END, 
                      last_run DESC;
                  `;
        break;
      case 'CREATE_PROJECT':
        query1 = `INSERT INTO projects (
                      project_name, 
                      project_no, 
                      project_description, 
                      regulatory_standard, 
                      invite_members, 
                      documents, 
                      org_id, 
                      org_name, 
                      created_by_id, 
                      created_by_name, 
                      sector_id, 
                      sector_name, 
                      industry_id, 
                      industry_name, 
                      status,
                      mapping_standards, 
                      summary_report
                      ${params.last_run ? `, last_run` : ''}
                      ${params.history ? `, history` : ''}
                      ${params.no_of_runs ? `, no_of_runs` : ''}
                      ${params.base64 ? `, base64` : ''}
                  ) 
                  VALUES (
                      '${params.project_name}',
                      '${params.project_no}',
                      '${params.project_description.replace(/'/g, '')}',
                      '${JSON.stringify(params.regulatory_standard)}',
                      '${JSON.stringify(params.invite_members)}',
                      '${JSON.stringify(params.documents)}',
                      ${params.org_id},
                      '${params.org_name}',
                      ${params.created_by_id},
                      '${params.created_by_name}',
                      ${params.sector_id},
                      '${params.sector_name}',
                      ${params.industry_id},
                      '${params.industry_name}',
                      '${params.status}',
                      '${params.mapping_standards}',
                      '${JSON.stringify(params.summary_report)}'
                      ${params.last_run ? `, '${params.last_run}'` : ''}
                      ${params.history ? `, '${JSON.stringify(params.history)}'` : ''}
                      ${params.no_of_runs ? `, ${params.no_of_runs}` : ''}
                      ${params.base64 ? `, '${JSON.stringify(params.base64)}'` : ''}
                  );
                  `;
        break;
      case 'UPDATE_PROJECT':
        query1 = `UPDATE projects 
                          SET 
                              project_name = '${params.project_name}',
                              project_no = '${params.project_no}',
                              project_description = '${params.project_description}',
                              regulatory_standard = '${JSON.stringify(
                                params.regulatory_standard,
                              )}',
                              invite_members = '${JSON.stringify(params.invite_members)}',
                              documents = '${JSON.stringify(params.documents)}',
                              org_id = ${params.org_id},
                              org_name = '${params.org_name}',
                              created_by_id = ${params.created_by_id},
                              created_by_name = '${params.created_by_name}',
                              sector_id = ${params.sector_id},
                              sector_name = '${params.sector_name}',
                              industry_id = ${params.industry_id},
                              industry_name = '${params.industry_name}',
                              status = '${params.status}',
                              last_run = '${params.last_run != null ? params.last_run : null}',
                              mapping_standards = '${params.mapping_standards}',
                              summary_report = '${JSON.stringify(params.summary_report)}'
                              ${params.complianceAssesment ? `, complianceAssesment = '${params.complianceAssesment}'` : ''}
                              ${params.history ? `, history = '${JSON.stringify(params.history)}'` : ''}
                              ${params.no_of_runs ? ` , no_of_runs = ${params.no_of_runs}` : ''}
                              ${params.standardUploaded != null ? ` , standardUploaded = '${params.standardUploaded}'` : ''}
                              ${params.base64 ? `, base64 = '${JSON.stringify(params.base64)}'` : ''}
                        `;

        // Conditionally append checkListResponse and chatResponse
        if (params.checkListResponse) {
          const escapedCheckListResponse = params.checkListResponse.replace(
            /'/g,
            "''",
          );
          query1 += `, checkListResponse = '${escapedCheckListResponse}'`;
        }
        if (params.chatResponse) {
          query1 += `, chatResponse = '${JSON.stringify(params.chatResponse)}'`;
        }

        query1 += ` WHERE project_id = ${params.project_id};`;
        break;
      case 'DELETE_PROJECT':
        query1 = ``;
        break;
      case 'GET_PROJECT_COUNTS':
        query1 = `SELECT
                      COUNT(*) AS total_projects_count,
                      SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END) AS draft_count,
                      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_count,
                      SUM(CASE WHEN status = 'Success' THEN 1 ELSE 0 END) AS success_count,
                      SUM(CASE WHEN status = 'Failed' THEN 1 ELSE 0 END) AS failed_count
                  FROM projects 
                  WHERE 
                    created_by_id = ${params.user_id};`;
        break;
      case 'GET_ORG_PROJECT_COUNTS':
        query1 = `SELECT
                      COUNT(*) AS total_projects_count,
                      SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END) AS draft_count,
                      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_count,
                      SUM(CASE WHEN status = 'Success' THEN 1 ELSE 0 END) AS success_count,
                      SUM(CASE WHEN status = 'Failed' THEN 1 ELSE 0 END) AS failed_count
                  FROM projects 
                  WHERE 
                    org_id = ${params.org_id} 
                    ${params.industry_id ? ` AND industry_id = ${params.industry_id}` : ''};`;
        break;
      case 'GET_SA_PROJECT_COUNTS':
        query1 = `SELECT
                      COUNT(*) AS total_projects_count,
                      SUM(CASE WHEN status = 'Draft' THEN 1 ELSE 0 END) AS draft_count,
                      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_count,
                      SUM(CASE WHEN status = 'Success' THEN 1 ELSE 0 END) AS success_count,
                      SUM(CASE WHEN status = 'Failed' THEN 1 ELSE 0 END) AS failed_count
                  FROM projects`;
        break;
      case 'GET_SA_TOP_PROJECTS':
        query1 = `SELECT 
                      i.industry_name,
                      COUNT(p.project_id) AS project_count
                  FROM industries i
                  LEFT JOIN projects p ON p.industry_id = i.industry_id
                  GROUP BY i.industry_id, i.industry_name
                  ORDER BY project_count DESC
                  LIMIT 10;
                `;
        break;
      case 'GET_SA_ORG_PROJECT_COUNTS':
        query1 = `SELECT o.org_name, COUNT(p.project_id) AS project_count
                  FROM organizations o
                  LEFT JOIN projects p ON o.org_id = p.org_id
                  GROUP BY o.org_name
                  ORDER BY project_count DESC;
                `;
        break;
      case 'GET_ORG_TOP_PROJECTS':
        query1 = `SELECT 
                      u.user_first_name, u.user_last_name,
                      COUNT(p.project_id) AS project_count
                  FROM users u
                  LEFT JOIN projects p ON p.created_by_id = u.user_id
                  WHERE p.org_id = ${params.org_id}
                  GROUP BY u.user_id
                  ORDER BY project_count DESC
                  LIMIT 10;
                `;
        break;
      case 'GET_USER_TOP_PROJECTS':
        query1 = `WITH RECURSIVE DateRange AS (
                      SELECT '${params.from}' AS project_date
                      UNION ALL
                      SELECT DATE_ADD(project_date, INTERVAL 1 DAY)
                      FROM DateRange
                      WHERE project_date <=  '${params.to}'
                  )
                  SELECT 
                      dr.project_date, 
                      IFNULL(COUNT(p.project_name), 0) AS project_count
                  FROM DateRange dr
                  LEFT JOIN projects p
                      ON DATE(p.created_at) = dr.project_date
                      AND p.created_by_id = ${params.user_id}
                  GROUP BY dr.project_date
                  ORDER BY dr.project_date DESC;
                  `;
        // query1 = `SELECT
        //               DATE(p.created_at) AS project_date,
        //               COUNT(p.project_name) AS no_of_projects
        //           FROM projects p
        //           WHERE p.created_by_id = ${params.user_id}
        //             AND p.created_at >= ${params.from} <= ${params.to}
        //           GROUP BY project_date
        //           ORDER BY project_date DESC;
        //         `;

        // Dynamically add filters based on parameters
        // if (params.month && params.month !== 0) {
        //   query1 += ` AND EXTRACT(MONTH FROM created_at) = ${params.month}`;
        // }
        // if (params.year && params.year !== 0) {
        //   query1 += ` AND EXTRACT(YEAR FROM created_at) = ${params.year}`;
        // }
        // if (params.week && params.week !== 0) {
        //   query1 += ` AND EXTRACT(WEEK FROM created_at) = ${params.week}`;
        // }
        break;
      case 'GET_ORG_RECENT_PROJECTS':
        query1 = `SELECT 
                      project_name, 
                      project_id, 
                      project_no, 
                      project_description, 
                      regulatory_standard, 
                      invite_members,  
                      status, 
                      no_of_runs, 
                      success_count, 
                      fail_count, 
                      last_run, 
                      created_at, 
                      created_by_id, 
                      created_by_name, 
                      updated_at, 
                      isActive 
                  FROM projects 
                  WHERE org_id = ${params.org_id} 
                  ORDER BY created_at DESC 
                  LIMIT ${params.limit};
                  `;
        break;
    }

    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        connection.query(query1, Object.values(params), (err, results) => {
          connection.release();
          if (err) {
            logger.error(`project dao ${queryType}`, err);
            reject(err);
          } else {
            resolve(results);
          }
        });
      });
    });
  } catch (err) {
    logger.error('project dao', err);
  }
};

module.exports = {
  projectQuery,
};
