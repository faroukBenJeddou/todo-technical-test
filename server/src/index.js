import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import todosRouter from './routes/todos.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/todos', todosRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));

export default app;
