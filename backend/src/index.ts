// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import loginRoutes from './routes/loginRoutes';
// import tagsRoutes from './routes/tagsRoutes';
// import callsRoutes from './routes/callsRoutes';
// import suggestedTasksRoutes from './routes/suggestedTasksRoutes';


// dotenv.config();

// const app = express();

// const PORT = process.env.PORT || 3001;
// const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

// app.use(cors({ origin: ALLOWED_ORIGIN }));
// app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('Server is running ');
// });

// app.use('/api', loginRoutes);
// app.use('/api', tagsRoutes);
// app.use('/api', callsRoutes);
// app.use("/api", suggestedTasksRoutes);



// app.listen(PORT, () => {
//     console.log(`Backend server is running on http://localhost:${PORT}`);
// });


// ================socket======================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import loginRoutes from './routes/loginRoutes';
import tagsRoutes from './routes/tagsRoutes';
import callsRoutes from './routes/callsRoutes';
import suggestedTasksRoutes from './routes/suggestedTasksRoutes';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.use('/api', loginRoutes);
app.use('/api', tagsRoutes);
app.use('/api', callsRoutes);
app.use('/api', suggestedTasksRoutes);

// --- Socket.io Setup ---
const io = new Server(server, {
    cors: {
        origin: ALLOWED_ORIGIN,
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Export io for other modules
export { io };

// --- Start server ---
server.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
