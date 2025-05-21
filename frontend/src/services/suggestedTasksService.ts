import http from "../http";

export const createSuggestedTask = async (
  id: string,
  task: { name: string; tags: string[] }
) => {
  const res = await http.post(`/api/suggested-tasks/${id}`, task);
  return res.data;
};
