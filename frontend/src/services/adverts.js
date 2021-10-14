import api from "./api";

const GetAllAdverts = () => {
  const request = api.get("/adverts/");
  return request.then((response) => response.data);
};

const GetNeedSitterAdverts = () => {
  const request = api.get("/adverts/needsitter/");
  return request.then((response) => response.data);
};

const GetIsSitterAdverts = () => {
  const request = api.get("/adverts/issitter/");
  return request.then((response) => response.data);
};

const CreateIsSitterAdvert = (data) => {
  const request = api.post("/adverts/issitter/", data);
  return request.then((response) => response.data);
};

const CreateNeedSitterAdvert = (data) => {
  const request = api.post("/adverts/needsitter/", data);
  return request.then((response) => response.data);
};

const AdvertsService = {
  GetAllAdverts,
  GetNeedSitterAdverts,
  GetIsSitterAdverts,
  CreateIsSitterAdvert,
  CreateNeedSitterAdvert,
};

export default AdvertsService;
