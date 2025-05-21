import http from "../http";

export const fetchTags = async (): Promise<string[]> => {
  const res = await http.get("/api/tags");
  console.log("res", res);
  return res.data.tags;
};

export const createTag = async (name: string): Promise<{ message: string }> => {
  const res = await http.post("/api/tags", { name });
  return res.data;
};


export const renameTag = async (oldName: string, newName: string) => {
  const res = await http.put("/api/tags/rename", { oldName, newName });
  return res.data;
};

export const deleteTag = async (name: string) => {
  const res = await http.delete(`/api/tags/${name}`);
  return res.data;
};
