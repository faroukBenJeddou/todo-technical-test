import express from 'express';
import { readTodos, writeTodos, nextId } from '../lib/db.js';

const router = express.Router();



export default router;
