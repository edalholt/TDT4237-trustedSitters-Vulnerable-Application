import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const createUser = (credentials) => {
  const request = axios.post(`/register`, credentials);
  return request.then((response) => response.data);
};

const login = async (credentials) => {
  const response = await axios.post(`/login/`, credentials);
  return response.data;
};

export default { createUser, login };
