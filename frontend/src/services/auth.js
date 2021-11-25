import api from "./api";
import TokenService from "./token";

const createUser = (credentials) => {
  return api.post(`/register/`, credentials).then((response) => {
    if (response.data.access) {
      TokenService.setUser(response.data.user);
      TokenService.updateLocalAccessToken(response.data.access);
      TokenService.setLocalRefreshToken(response.data.refresh);
    }

    return response.data;
  });
};

const login = (credentials) => {
  return api.post("/login/", credentials).then((response) => {
    if (response.data.access) {
      TokenService.setUser(response.data.user);
      TokenService.updateLocalAccessToken(response.data.access);
      TokenService.setLocalRefreshToken(response.data.refresh);
    }

    return response.data;
  });
};

const logout = () => {
  TokenService.removeUser();
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getMFAToken = () => {
  return api.get('/mfa/').then((response)=>{
    return {'mfa_token': response.data.mfa_token, 'active': response.data.active}
  })
}

const postMFAToken = (otp) => {
  return api.post('/mfa/', {'otp': otp}).then(()=>{
    return true
  }).catch((error)=>{
    return false
  })
}

const Authservice = { createUser, login, logout, getCurrentUser, getMFAToken, postMFAToken };

export default Authservice;
