const { logger } = require("../utils/logger");
// const { chatQuery } = require('../dao/chat_dao');
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const stream = require("stream");
const { getFromS3 } = require("../config/aws_config");

const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL;

const chatQuestionService = async (params) => {
  try {
    const response = await fetch(
      `${PYTHON_SERVICE_URL}/chat_standard?user_question=${encodeURIComponent(params.user_question)}`,
    );

    if (response.ok) {
      const responseData = await response.json();
      return { success: true, data: responseData };
    } else {
      // Handle non-OK responses
      console.error(
        "Error: Non-OK response received",
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
    console.error("Chat question service error:", error);
    return { success: false, error: "An error occurred while fetching data" };
  }
};

const uploadStandardChatService = async () => {
  try {
    const filePath = path.join(__dirname, "../utils/IEC-61400-12-2022.pdf");
    const form = new FormData();

    // Append the PDF file to the form
    const fileStream = fs.createReadStream(filePath);
    if (!fileStream) {
      console.log("fileStream isnot found");
    }

    // Append the PDF file to the form
    form.append("file", fileStream, {
      filename: "your-file.pdf", // File name sent to the server
      ContentType: "multipart/form-data; boundary=----boundary123",
      Accept: "application/json",
    });

    const apiUrl = `${PYTHON_SERVICE_URL}/uploadstd_chat/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        // Optional: Include your auth token if needed
        "User-Agent": "MyCustomUserAgent/1.0", // Add custom User-Agent header
      },
    });

    // Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        "Error: Non-OK response received",
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    logger.error("Chat upload service error", error);
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
        "User-Agent": "MyCustomUserAgent/1.0",
      },
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      console.error(
        "Error: Non-OK response received",
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    console.error("Error during upload:", error);
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
        "User-Agent": "MyCustomUserAgent/1.0", // Add custom User-Agent header
      },
    });

    // Step 6: Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        "Error: Non-OK response received",
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    logger.error("Chat upload service error", error);
    return { response: false, error };
  }
};

const uploadProjectDocsService2 = async (imageKey) => {
  try {
    const form = await getFileDetailsFromS3Service(imageKey);
    // Step 5: Send the form data with the file to the API
    const apiUrl = `${PYTHON_SERVICE_URL}/upload_project_docs_summarize/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        "User-Agent": "MyCustomUserAgent/1.0", // Add custom User-Agent header
      },
    });

    // Step 6: Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        "Error: Non-OK response received",
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    logger.error("Chat upload service error", error);
    return { response: false, error };
  }
};

const uploadStandardCheckListService = async () => {
  const filePath = path.join(__dirname, "../utils/IEC-61400-12-2022.pdf");

  try {
    const form = new FormData();

    // Append the PDF file to the form
    const fileStream = fs.createReadStream(filePath);
    if (!fileStream) {
      console.log("fileStream isnot found");
    }

    // Append the PDF file to the form
    form.append("file", fileStream, {
      filename: "your-file.pdf", // File name sent to the server
      ContentType: "multipart/form-data; boundary=----boundary123",
      Accept: "application/json",
    });

    const apiUrl = `${PYTHON_SERVICE_URL}/uploadstd_checklist_crt/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        // Optional: Include your auth token if needed
        "User-Agent": "MyCustomUserAgent/1.0", // Add custom User-Agent header
      },
    });

    // Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        "Error: Non-OK response received",
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
    console.error("Upload service error:", error);
    return { success: false, error: "An error occurred while uploading files" };
  }
};

const getFileDetailsFromS3 = async (imageKeys) => {
  try {
    const form = new FormData();

    const getParams = (imageKey) => ({
      Key: imageKey,
      Bucket: process.env.BUCKET_NAME,
    });

    // for (let imageKey of imageKeys) {
      // Fetch the image from S3
      const s3Object = await getFromS3(getParams(imageKeys));

      // Decode the base64 data to binary data
      const binaryData = Buffer.from(s3Object, "base64");

      // Extract the file extension from the image key
      const fileExtension = imageKeys.split(".").pop();

      // Define the file path to save the file with appropriate extension
      const filePath = path.join(
        __dirname,
        `../utils/output-file-${imageKeys}.${fileExtension}`,
      );

      // Write the binary data to the file system
      await fs.promises.writeFile(filePath, binaryData);
      console.log(`File written successfully for ${imageKeys}`);

      // Create a file stream from the saved file
      const fileStream = fs.createReadStream(filePath);

      if (!fileStream) {
        console.log(`fileStream is not found for ${imageKeys}`);
        return { success: false, error: `fileStream is not found for ${imageKeys}` };
      }

      // Append the file to the form data
      form.append("file", fileStream, {
        filename: `your-file-${imageKeys}`, // File name sent to the server
        ContentType: `application/${fileExtension}`, // Content type based on file extension
        Accept: "application/json",
      });
    // }

    // Return the form containing all the files
    return form;
  } catch (error) {
    // Handle errors and log them
    console.error("Upload service error:", error);
    return { success: false, error: "An error occurred while uploading files" };
  }
};

const getParams = (imageKey) => ({
  Key: imageKey,
  Bucket: process.env.BUCKET_NAME,
});

const getFileDetailsFromS3Service = async (imageKeys) => {
  try {
    const form = new FormData();
    imageKeys = JSON.parse(imageKeys);
    for (let imageKey of imageKeys) {
      // Fetch the image from S3
      const s3Object = await getFromS3(getParams(imageKey));

      // Decode the base64 data to binary data
      const binaryData = Buffer.from(s3Object, "base64");

      // Extract the file extension from the image key
      const fileExtension = imageKey.split(".").pop();

      // Define the file path to save the file with appropriate extension
      const filePath = path.join(
        __dirname,
        `../utils/output-file-${imageKey}.${fileExtension}`,
      );

      // Write the binary data to the file system
      await fs.promises.writeFile(filePath, binaryData);
      console.log(`File written successfully for ${imageKey}`);

      // Create a file stream from the saved file
      const fileStream = fs.createReadStream(filePath);

      if (!fileStream) {
        console.log(`fileStream is not found for ${imageKey}`);
        continue;
      }

      // Append the file to the form data
      form.append("files", fileStream, {
        filename: `your-file-${imageKey}`, // File name sent to the server
        ContentType: `application/${fileExtension}`, // Content type based on file extension
        Accept: "application/json",
      });
    }

    // Return the form containing all the files
    return form;
  } catch (error) {
    // Handle errors and log them
    console.error("Upload service error:", error);
    return { success: false, error: "An error occurred while uploading files" };
  }
};

const uploadProjectDocsService = async (params) => {
  try {
    const filePath = path.join(__dirname, "../utils/project doc.pdf");
    const form = new FormData();

    // Append the PDF file to the form
    const fileStream = fs.createReadStream(filePath);
    if (!fileStream) {
      console.log("fileStream isnot found");
    }

    // Append the PDF file to the form
    form.append("file", fileStream, {
      filename: "your-file.pdf", // File name sent to the server
      ContentType: "multipart/form-data; boundary=----boundary123",
      Accept: "application/json",
    });

    const apiUrl = `${PYTHON_SERVICE_URL}/upload_project_docs_summarize/`;

    const response = await axios.post(apiUrl, form, {
      headers: {
        ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        // Optional: Include your auth token if needed
        "User-Agent": "MyCustomUserAgent/1.0", // Add custom User-Agent header
      },
    });

    // Handle successful responses
    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        "Error: Non-OK response received",
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.statusText}`,
      };
    }
  } catch (error) {
    logger.error("Chat data service error", error);
    return { response: false, error };
  }
};

const chatDataService = async () => {
  try {
    const response = await fetch(`${PYTHON_SERVICE_URL}/api/data`, {
      method: "GET",
    });
    if (response.ok) {
      const responseData = await response.json();
      return { success: true, data: responseData };
    } else {
      // Handle non-OK responses
      console.error(
        "Error: Non-OK response received",
        response.status,
        response.statusText,
      );
      return {
        success: false,
        error: `Server returned status ${response.status}`,
      };
    }
  } catch (error) {
    logger.error("Chat data service error", error);
    return { response: false, error };
  }
};

const chatRunComplainceAssessmentService = async (requirements) => {
  try {
    // const response = await fetch(
    //   `${PYTHON_SERVICE_URL}/run_complaince_assessment/?requirements=${requirements}`,
    // );
    // const form = new FormData();
    // form.append('requirements', requirements, {
    //   // filename: 'your-file.pdf', // File name sent to the server
    //   ContentType: 'multipart/form-data; boundary=----boundary123',
    //   Accept: 'application/json',
    // });
    const apiUrl = `${PYTHON_SERVICE_URL}/run_complaince_assessment/`;

    const response = await axios.post(apiUrl, (requirements = requirements), {
      headers: {
        // ...form.getHeaders(), // Automatically set appropriate headers for multipart/form-data
        "User-Agent": "MyCustomUserAgent/1.0", // Add custom User-Agent header
      },
    });

    if (response.status === 200) {
      return { success: true, data: response.data };
    } else {
      // Handle non-OK responses
      console.error(
        "Error: Non-OK response received",
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
    console.error("Chat run complaince assessment service error:", error);
    return { success: false, error: "An error occurred while fetching data" };
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
  chatRunComplainceAssessmentService,
};
