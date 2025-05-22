import http from "../http";

export const fetchCalls = async () => {
  const res = await http.get("/api/calls");
  return res.data.calls;
};


export const createCall = async (name: string) => {
  const res = await http.post("/api/calls", { name });
  return res.data.call;
};



export const createTask = async (
  callId: string,
  task: { name: string }
) => {
  const res = await http.post(`/api/calls/${callId}/tasks`, task);
  return res.data.task;
};




export const updateCallTags = async (callId: string, tags: string[]) => {
  const res = await http.put(`/api/calls/${callId}/tags`, { tags });
  return res.data;
};



export const updateTaskStatus = async (callId: string, taskId: string, status: string) => {
  const res = await http.put(`/api/calls/${callId}/tasks/${taskId}`, { status });
  return res.data;
};



export const deleteTask = async (callId: string, taskName: string) => {
  const res = await http.delete(`/api/calls/${callId}/tasks/${taskName}`);
  return res.data;
};
