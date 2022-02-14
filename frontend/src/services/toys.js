import api from "./api";

const GetToys = () => {
  const request = api.get("/toys/");
  return request.then((response) => response.data);
};

const CreateToy = (data) => {
  const request = api.post("/toys/", data);
  return request.then((response) => response.data);
};

const ToysService = {
  GetToys,
  CreateToy,
};

export default ToysService;
