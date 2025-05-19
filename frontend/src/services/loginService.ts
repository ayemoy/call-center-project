import http from "../http"; 
    
    
export const loginUser = async (email: string, password: string) => {
    try {
        const response = await http.post("/api/login", { email, password });
        return response.data.user; 
    } catch (err: any) {
        throw new Error(err.response?.data?.message || "Login failed");
    }
};
