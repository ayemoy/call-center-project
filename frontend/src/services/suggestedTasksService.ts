import http from "../http";

export const createSuggestedTask = async (id: string, task: { name: string; tags: string[] }) => {
  const res = await http.post("/api/suggestedTasks", {
    id,
    ...task,
  });
  return res.data;
};



export const getSuggestedTasksByTags = async (tags: string[]) => {
  const res = await http.post("/api/suggestedTasks/by-tags", { tags });
  return res.data.tasks; // [{ id, name }]
};
