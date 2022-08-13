import axiosClient from "./axiosClient";

const sectionApi = {
  create: (boardId) => axiosClient.post(`boards/${boardId}/sections`),
  delete: (boardId, sectionId) =>
    axiosClient.delete(`boards/${boardId}/sections/${sectionId}`),
  update: (boardId, sectionId, params) =>
    axiosClient.put(`boards/${boardId}/sections/${sectionId}`, params),
};

export default sectionApi;
