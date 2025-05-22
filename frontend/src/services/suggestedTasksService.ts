import http from "../http";

export const createSuggestedTask = async (
  task: { name: string; tags: string[] }
) => {
  const res = await http.post("/api/suggestedTasks", task);
  return res.data;
};



export const getSuggestedTasksByTags = async (tags: string[]) => {
  const res = await http.post("/api/suggestedTasks/by-tags", { tags });
  return res.data.tasks; // [{ id, name }]
};


export const fetchAllSuggestedTasks = async () => {
  const res = await http.get("/api/suggestedTasks/all"); 
  return res.data.tasks;
};


export const deleteSuggestedTaskById = async (id: string) => {
  await http.delete(`/api/suggestedTasks/${id}`);
};

export const updateSuggestedTaskName = async (id: string, name: string) => {
  await http.put(`/api/suggestedTasks/${id}`, { name });
};
