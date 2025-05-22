// src/socket.ts
import { io } from "socket.io-client";

// const socket = io("http://localhost:3001", {
const socket = io(process.env.REACT_APP_API_BASE_URL || "", {

  transports: ["websocket"],
  withCredentials: true,
});

export default socket;
