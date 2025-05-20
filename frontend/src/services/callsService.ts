import http from "../http";

export const fetchCalls = async () => {
  const res = await http.get("/api/calls");
  return res.data.calls;
};
