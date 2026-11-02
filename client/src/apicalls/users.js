const { default: axiosInstance } = require(".");

export const registerUser = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/users/register', payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const loginUser = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/users/login', payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.post('/api/users/get-user-info');
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const updateUserProfile = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/users/update-profile', payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.post('/api/users/get-all-users');
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: error.message };
  }
};

export const updateUserRole = async (payload) => {
  try {
    const response = await axiosInstance.post('/api/users/update-user-role', payload);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { success: false, message: error.message };
  }
};
