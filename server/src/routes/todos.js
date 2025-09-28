import express from 'express';
import { readTodos, writeTodos, nextId } from '../lib/db.js';

const router = express.Router();

function validateTitle(title) {
  return typeof title === 'string' && title.trim().length >= 1 && title.trim().length <= 120;
}

// GET /api/todos  (Easy + Medium with q, page, limit)
router.get('/', (req, res) => {
  const { q = '', page = '1', limit = '5' } = req.query;
  const qTrim = String(q || '').trim();
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(20, Math.max(1, parseInt(limit, 10) || 5));

  let items = readTodos();

  // search
  if (qTrim) {
    const needle = qTrim.toLowerCase();
    items = items.filter(t => (t.title || '').toLowerCase().includes(needle));
  }

  // newest first
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = items.length;
  const start = (pageNum - 1) * limitNum;
  const pageItems = items.slice(start, start + limitNum);
  res.json({ items: pageItems, page: pageNum, limit: limitNum, total });
});

// POST /api/todos  (Easy)
router.post('/', (req, res) => {
  const { title } = req.body || {};
  if (!validateTitle(title)) {
    return res.status(400).json({ error: 'Title is required (1–120 chars).' });
  }
  const all = readTodos();
  const todo = {
    _id: nextId(all),
    title: String(title).trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  all.push(todo);
  writeTodos(all);
  res.status(201).json(todo);
});

// PATCH /api/todos/:id/toggle  (Hard)
router.patch('/:id/toggle', (req, res) => {
  const { id } = req.params;
  const all = readTodos();
  const idx = all.findIndex(t => String(t._id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  all[idx].completed = !all[idx].completed;
  writeTodos(all);
  res.json(all[idx]);
});

export default router;
