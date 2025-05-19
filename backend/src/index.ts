import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import loginRoutes from './routes/loginRoutes';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json());

app.use('/api', loginRoutes);

app.get('/', (req, res) => {
    res.send('Server is running 🚀');
});

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
