import axios from "axios";

const http = axios.create({
    // baseURL: "http://localhost:3001", // backend base URL
    baseURL: process.env.REACT_APP_API_BASE_URL,

    headers: {
        "Content-Type": "application/json",
    },
});

export default http;
