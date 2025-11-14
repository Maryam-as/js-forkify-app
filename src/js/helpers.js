import { REQUEST_TIMEOUT_SEC } from './config';

// Utility function to handle timeout for API calls
const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async (url, data = undefined) => {
  try {
    const fetchPromise = data
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      : fetch(url);

    const response = await Promise.race([
      fetchPromise,
      timeout(REQUEST_TIMEOUT_SEC),
    ]);

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(`${resData.message} (${response.status})`);
    }

    return resData;
  } catch (err) {
    throw err;
  }
};
