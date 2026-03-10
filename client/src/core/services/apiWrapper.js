export const apiWrapper = async (request, ...args) => {
  try {
    const response = await request(...args);
    console.log("API Response:", response);
    return response.data;
  } catch (error) {
    const errorMessage = error.response
      ? error.response.data
      : { message: error.message };

    console.error("API Error Trace:", errorMessage);

    throw errorMessage;
  }
};
