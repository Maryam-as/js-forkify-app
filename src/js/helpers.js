export const getJSON = async (url) => {
  try {
    const response = await fetch(url);

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
