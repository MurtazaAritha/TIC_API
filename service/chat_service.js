const { logger } = require('../utils/logger');
// const { chatQuery } = require('../dao/chat_dao');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const stream = require('stream');
const { getFromS3 } = require('../config/aws_config');

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;

const chatQuestionService = async (params) => {
  try {
    // console.log(
    //   'Request URL:',
    //   `${PYTHON_SERVICE_URL}/chat_standard?user_question=${encodeURIComponent(params.user_question)}`,
    // );

    const response = await fetch(
      `${PYTHON_SERVICE_URL}/chat_standard?user_question=${encodeURIComponent(params.user_question)}`,
    );

    if (response.ok) {
      const responseData = await response.json();
      return { success: true, data: responseData };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.status}`,
      };
    }
  } catch (error) {
    // Log the error and return a consistent structure
    console.error('Chat question service error:', error);
    return { success: false, error: 'An error occurred while fetching data' };
  }
};

// const uploadStandardChatService = async (params) => {
//   try {
//     const files = Object.values(params);

//     const response = await fetch(`${PYTHON_SERVICE_URL}/uploadstd_chat/`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       // body: { 'form-data': { file: files[0] } },
//       body
//     });
//     console.log('response: ' + JSON.stringify(response));

//     if (response.ok) {
//       const responseData = await response.json();
//       return { response: true, data: responseData };
//     }
//     return response;
//   } catch (error) {
//     logger.error('chat upload  service', error);
//   }
// };

const uploadStandardChatService = async () => {
  try {
    const filePath = path.join(__dirname, '../utils/IEC-61400-12-2022.pdf');
    const form = new FormData();

    // Append the PDF file to the form
    const fileStream = fs.createReadStream(filePath);
    if (!fileStream) {
      console.log('fileStream isnot found');
    }

    // Append the PDF file to the form
    form.append('file', fileStream, {
      filename: 'your-file.pdf', // File name sent to the server
      ContentType: 'multipart/form-data; boundary=----boundary123',
      Accept: 'application/json',
    });

    const apiUrl = `${PYTHON_SERVICE_URL}/uploadstd_chat/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        // Optional: Include your auth token if needed
        'User-Agent': 'MyCustomUserAgent/1.0', // Add custom User-Agent header
      },
    });

    // Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    logger.error('Chat upload service error', error);
    return { response: false, error };
  }
};

const uploadStandardChatService2 = async (imageKey) => {
  try {
    const form = await getFileDetailsFromS3(imageKey);

    const apiUrl = `${PYTHON_SERVICE_URL}/uploadstd_chat/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(),
        'User-Agent': 'MyCustomUserAgent/1.0',
      },
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    console.error('Error during upload:', error);
    return { success: false, error: error.message };
  }
};

const uploadStandardCheckListService2 = async (imageKey) => {
  try {
    const form = await getFileDetailsFromS3(imageKey);
    // Step 5: Send the form data with the file to the API
    const apiUrl = `${PYTHON_SERVICE_URL}/uploadstd_checklist_crt/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        'User-Agent': 'MyCustomUserAgent/1.0', // Add custom User-Agent header
      },
    });

    // Step 6: Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    logger.error('Chat upload service error', error);
    return { response: false, error };
  }
};

const uploadProjectDocsService2 = async (imageKey) => {
  try {
    const form = await getFileDetailsFromS3(imageKey);
    // Step 5: Send the form data with the file to the API
    const apiUrl = `${PYTHON_SERVICE_URL}/upload_project_docs_summarize/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        'User-Agent': 'MyCustomUserAgent/1.0', // Add custom User-Agent header
      },
    });

    // Step 6: Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    logger.error('Chat upload service error', error);
    return { response: false, error };
  }
};

const uploadStandardCheckListService = async () => {
  const filePath = path.join(__dirname, '../utils/IEC-61400-12-2022.pdf');

  try {
    const form = new FormData();

    // Append the PDF file to the form
    const fileStream = fs.createReadStream(filePath);
    if (!fileStream) {
      console.log('fileStream isnot found');
    }

    // Append the PDF file to the form
    form.append('file', fileStream, {
      filename: 'your-file.pdf', // File name sent to the server
      ContentType: 'multipart/form-data; boundary=----boundary123',
      Accept: 'application/json',
    });

    // const headers = {
    //   'Content-Type': 'multipart/form-data; boundary=----boundary123',
    //   Accept: 'application/json',
    //   'User-Agent': 'MyCustomUserAgent/1.0',
    //   Connection: 'keep-alive',
    // };

    const apiUrl = `${PYTHON_SERVICE_URL}/uploadstd_checklist_crt/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        // Optional: Include your auth token if needed
        'User-Agent': 'MyCustomUserAgent/1.0', // Add custom User-Agent header
      },
    });

    // Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    // Handle errors and log them
    console.error('Upload service error:', error);
    return { success: false, error: 'An error occurred while uploading files' };
  }
};

const getFileDetailsFromS3 = async (imageKey) => {
  try {
    // const regex = /^data:([A-Za-z-+/]+);base64,/;
    // const match = imageKey.match(regex);
    // let fileType = 'application/octet-stream'; // Default to binary if no match
    // let base64Data = imageKey;

    // if (match) {
    //   fileType = match[1]; // Extract MIME type from the base64 string
    //   base64Data = imageKey.replace(regex, ''); // Remove the base64 prefix
    // }

    const getParams = {
      Key: imageKey,
      Bucket: process.env.BUCKET_NAME,
    };

    let s3Object = await getFromS3(getParams);

    // Step 2: Decode the base64 data to binary data
    const binaryData = Buffer.from(s3Object, 'base64');

    // Step 3: Determine the file extension based on MIME type
    // let fileExtension = '.bin'; // Default extension for unknown file types

    // // Mapping MIME types to file extensions
    // const mimeToExt = {
    //   'application/pdf': '.pdf',
    //   'image/jpeg': '.jpg',
    //   'image/png': '.png',
    //   'application/msword': '.doc',
    //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    //     '.docx',
    //   'application/vnd.ms-excel': '.xls',
    //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
    //     '.xlsx',
    //   'application/zip': '.zip',
    //   'image/svg+xml': '.svg',
    //   'image/svg': '.svg',
    // };

    // // If the MIME type is recognized, use the corresponding extension
    // if (mimeToExt[fileType]) {
    //   fileExtension = mimeToExt[fileType];
    // }

    const fileExtension = imageKey.split('.').pop();

    // Step 4: Define the file path to save the file with appropriate extension
    const filePath = path.join(
      __dirname,
      `../utils/output-file.${fileExtension}`,
    );
    console.log(`Saving file as: ${filePath}`);

    await fs.promises.writeFile(filePath, binaryData);
    console.log('File written successfully!');
    // Step 4: Create FormData and append the PDF file to the form
    const form = new FormData();
    const fileStream = fs.createReadStream(filePath);

    if (!fileStream) {
      console.log('fileStream is not found');
    }

    form.append('file', fileStream, {
      // filename: 'your-file.pdf', // File name sent to the server
      ContentType: 'application/pdf', // Ensure content type matches the file type
      Accept: 'application/json',
    });
    return form;
  } catch (error) {
    // Handle errors and log them
    console.error('Upload service error:', error);
    return { success: false, error: 'An error occurred while uploading files' };
  }
};

const uploadProjectDocsService = async (params) => {
  try {
    const filePath = path.join(__dirname, '../utils/project doc.pdf');
    const form = new FormData();

    // Append the PDF file to the form
    const fileStream = fs.createReadStream(filePath);
    if (!fileStream) {
      console.log('fileStream isnot found');
    }

    // Append the PDF file to the form
    form.append('file', fileStream, {
      filename: 'your-file.pdf', // File name sent to the server
      ContentType: 'multipart/form-data; boundary=----boundary123',
      Accept: 'application/json',
    });

    const apiUrl = `${PYTHON_SERVICE_URL}/upload_project_docs_summarize/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        // Optional: Include your auth token if needed
        'User-Agent': 'MyCustomUserAgent/1.0', // Add custom User-Agent header
      },
    });

    // Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    logger.error('Chat data service error', error);
    return { response: false, error };
  }
};

const chatDataService = async () => {
  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}/api/data`, {
      method: 'GET',
    });
    if (response.ok) {
      const responseData = await response.json();
      return { success: true, data: responseData };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.status}`,
      };
    }
  } catch (error) {
    logger.error('Chat data service error', error);
    return { response: false, error };
  }
};

const chatRunComplainceAssessmentService = async (requirements) => {
  try {
    // Split the response by '---' to separate sections
    const sections = requirements.split('---').slice(1); // Skip the first "Title" section
    // console.log("sections",sections)

    // Check if the last section is the Summary and ensure it's handled correctly
    const lastSection = sections[sections.length - 1]?.trim();

    // If the last section starts with "Summary:", we explicitly name it
    if (lastSection?.startsWith('Summary:')) {
      // Set the last section as Summary with a defined title
      sections[sections.length - 1] = `**Summary**\n${lastSection}`;
    }

    const pointsArray = [];
    // Now process all sections
    sections.map((section, index) => {
      let lines = section?.trim()?.split('\n'); // Split the section into lines

      // Extract and clean the title of the section
      let title = lines[0]
        .replace('**', '') // Remove asterisks around the title
        .replace(':', '') // Remove colon after section title
        .trim();
      title = title.replace('**', '');
      if (title?.startsWith('Summary')) {
        lines.push(title.replace('Summary', `${index}.`));
        lines[0] = title.replace('Summary** ', `${index}.`);

        title = 'Summary';
      } else {
        title = title.replace(`Section ${index + 1}`, '')?.trim();
      }

      // Process the remaining lines as "points" and clean the list
      const points = lines
        .slice(1) // Skip the first line if necessary, or use `.map()` without `.slice()`
        .map((line) => {
          // Regular expression to remove number, dot, and optional space
          let lineValue = line.replace(/^\d+\.\s*/, '').trim();
          if (lineValue) {
            pointsArray.push(lineValue); // Push the cleaned value into pointsArray
          }
        });
      // console.log("title",title);
      // console.log("points",points);x

      return { title, points };
    });

    const response = await fetch(
      `${PYTHON_SERVICE_URL}/run_complaince_assessment/?requirements=${encodeURIComponent(pointsArray)}`,
    );

    if (response.ok) {
      const responseData = await response.json();
      return { success: true, data: responseData };
    } else {
      // Handle non-OK responses
      console.error(
        'Error: Non-OK response received',
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.status}`,
      };
    }
  } catch (error) {
    // Log the error and return a consistent structure
    console.error('Chat run complaince assessment service error:', error);
    return { success: false, error: 'An error occurred while fetching data' };
  }
};

module.exports = {
  uploadStandardChatService,
  uploadStandardChatService2,
  uploadStandardCheckListService2,
  uploadProjectDocsService2,
  chatQuestionService,
  uploadStandardCheckListService,
  uploadProjectDocsService,
  chatDataService,
};
