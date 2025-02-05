const _ = require('lodash');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { EMAIL, PASSWORD } = require('../constants/constants');

const validate = (
  strArrObj = {},
  emails = {},
  numbers = {},
  passwords = {},
  dates = {},
) => {
  // Initialize errors object with default null values
  const errors = {
    strArrObj: {},
    emails: {},
    numbers: {},
    passwords: {},
    dates: {},
  };

  // Helper function to set an error message
  const setError = (category, key, message) => {
    if (!errors[category]) return;
    errors[category][key] = message;
  };

  // Validate string array objects
  Object.entries(strArrObj).forEach(([key, item]) => {
    if (_.isEmpty(item?.trim())) {
      setError('strArrObj', key, `Field ${key} is empty`);
    }
  });

  // Validate emails
  Object.entries(emails).forEach(([key, item]) => {
    if (!item.match(EMAIL)) {
      setError('emails', key, `Field ${key} is not a valid email`);
    }
  });

  // Validate numbers
  Object.entries(numbers).forEach(([key, item]) => {
    if (item <= 0) {
      setError('numbers', key, `Field ${key} is not a valid number`);
    }
  });

  // Validate passwords
  Object.entries(passwords).forEach(([key, item]) => {
    if (!item.match(PASSWORD)) {
      setError('passwords', key, `Field ${key} is not a valid password`);
    }
  });

  // Validate dates
  Object.entries(dates).forEach(([key, item]) => {
    // Check if the date matches the correct format 'YYYY-MM-DD'
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!item.match(dateRegex)) {
      setError('dates', key, `Field ${key} is not a valid date format`);
    } else {
      // Check if the date is valid using the Date object
      const date = new Date(item);
      if (date.toString() === 'Invalid Date') {
        setError('dates', key, `Field ${key} is not a valid date`);
      }
    }
  });
  // Determine if all validations passed
  const isValid = Object.values(errors).every((category) =>
    Object.values(category).every((message) => !message),
  );

  return { isValid, errors };
};

const getOtp = () => {
  const number = Math.random().toString().slice(2, 8);
  return number;
};

const getToken = (data) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let token = jwt.sign(data, jwtSecretKey, { expiresIn: '1d' });
  return token;
};

const getRefreshToken = (data) => {
  let jwtRefreshSecretKey = process.env.JWT_SECRET_KEY;
  let token = jwt.sign(data, jwtRefreshSecretKey, { expiresIn: '7d' });
  return token;
};

const smtpTransporter = nodemailer.createTransport({
  port: process.env.SMTP_PORT,
  host: process.env.SMTP_HOST,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  debug: true,
});

const generateRandomPassword = () => {
  const length = Math.floor(Math.random() * 3) + 6; // Random length between 6 and 8
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
};

const getExpiryTimeStamp = () => {
  const now = new Date();
  const utcTimestamp = now.toISOString().replace('T', ' ').slice(0, 19);

  // Set the expiry time to 3 days from the current time
  const noOfMinutes = 3 * 24 * 60; // 3 days in minutes

  const expiryTimeStamp = new Date(
    new Date(utcTimestamp).getTime() + noOfMinutes * 60000,
  );
  return expiryTimeStamp;
};

module.exports = {
  validate,
  getOtp,
  getToken,
  getRefreshToken,
  generateRandomPassword,
  getExpiryTimeStamp,
};
