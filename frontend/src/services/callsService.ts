import http from "../http";

export const fetchCalls = async () => {
  const res = await http.get("/api/calls");
  return res.data.calls;
};


export const createCall = async (name: string) => {
  const res = await http.post("/api/calls", { name });
  return res.data.call;
};
