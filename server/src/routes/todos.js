import express from 'express';
import { readTodos, writeTodos, nextId } from '../lib/db.js';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        const todos = readTodos();

        const { q = '', page = '1', limit = '5' } = req.query;

        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.min(20, Math.max(1, parseInt(limit) || 5)); // Max 20, default 5

        let filteredTodos = todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (q.trim()) {
            const searchTerm = q.trim().toLowerCase();
            filteredTodos = filteredTodos.filter(todo =>
                todo.title.toLowerCase().includes(searchTerm)
            );
        }

        const total = filteredTodos.length;
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedTodos = filteredTodos.slice(startIndex, endIndex);

        res.json({
            items: paginatedTodos,
            page: pageNum,
            limit: limitNum,
            total: total
        });
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', (req, res) => {
    try {
        const { title } = req.body;


        if (!title || typeof title !== 'string') {
            return res.status(400).json({ error: 'Title is required and must be a string' });
        }

        const trimmedTitle = title.trim();
        if (trimmedTitle.length === 0) {
            return res.status(400).json({ error: 'Title cannot be empty' });
        }

        if (trimmedTitle.length > 120) {
            return res.status(400).json({ error: 'Title must be 120 characters or less' });
        }


        const todos = readTodos();


        const newTodo = {
            _id: nextId(todos),
            title: trimmedTitle,
            completed: false,
            createdAt: new Date().toISOString()
        };

        todos.unshift(newTodo);

        writeTodos(todos);

        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error creating todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/:id/toggle', (req, res) => {
    try {
        const { id } = req.params;

        const todos = readTodos();

        const todoIndex = todos.findIndex(todo => todo._id === id);

        if (todoIndex === -1) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        todos[todoIndex].completed = !todos[todoIndex].completed;

        writeTodos(todos);

        res.json(todos[todoIndex]);
    } catch (error) {
        console.error('Error toggling todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
