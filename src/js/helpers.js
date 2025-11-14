import { REQUEST_TIMEOUT_SEC } from './config';

// Utility function to handle timeout for API calls
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async (url) => {
  try {
    // Use Promise.race() to race the fetch request against a timeout promise
    // This ensures the request fails if it takes longer than REQUEST_TIMEOUT_SEC seconds
    const response = await Promise.race([
      fetch(url),
      timeout(REQUEST_TIMEOUT_SEC),
    ]);

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(`${resData.message} (${response.status})`);
    }

    return resData;
  } catch (error) {
    // Re-throw the error so it can be handled by the function that called getJSON
    throw error;
  }
};

export const sendJSON = async (url, data) => {
  try {
    const response = await Promise.race([
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
      timeout(REQUEST_TIMEOUT_SEC),
    ]);

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(`${resData.message} (${response.status})`);
    }

    return resData;
  } catch (error) {
    throw error;
  }
};
