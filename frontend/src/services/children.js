import api from "./api";

const GetChildren = () => {
  const request = api.get("/children/");
  return request.then((response) => response.data);
};

const CreateChild = (data) => {
  const request = api.post("/children/", data);
  return request.then((response) => response.data);
};

const EditChild = (id, data) => {
  const request = api.patch(`/children/${id}/`, data);
  return request.then((response) => response.data);
};

const UploadChildFile = (data) => {
  const request = api.post("/child-file/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return request.then((response) => response.data);
};
const ChildrenService = {
  GetChildren,
  CreateChild,
  EditChild,
  UploadChildFile,
};

export default ChildrenService;
