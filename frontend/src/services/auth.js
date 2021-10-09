import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const createUser = async (credentials) => {
  const response = await axios.post(`/register/`, credentials);
  return response.data;
};

const login = async (credentials) => {
  const response = await axios.post(`/login/`, credentials);
  return response.data;
};

export default { createUser, login };
