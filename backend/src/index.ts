import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRoutes from './routes/loginRoutes';
import tagsRoutes from './routes/tagsRoutes';
import callsRoutes from './routes/callsRoutes';
import suggestedTasksRoutes from './routes/suggestedTasksRoutes';


dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running ');
});

app.use('/api', loginRoutes);
app.use('/api', tagsRoutes);
app.use('/api', callsRoutes);
app.use("/api", suggestedTasksRoutes);



app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
