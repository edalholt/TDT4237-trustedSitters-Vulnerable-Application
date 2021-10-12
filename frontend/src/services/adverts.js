import api from "./api";

const GetNeedSitterAdverts = () => {
  var request = api.get("/adverts/needsitter");
  return request.then((response) => response.data);
};

const GetIsSitterAdverts = () => {
  var request = api.get("/adverts/issitter");
  return request.then((response) => response.data);
};

const AdvertsService = {
  GetNeedSitterAdverts,
  GetIsSitterAdverts,
};

export default AdvertsService;
