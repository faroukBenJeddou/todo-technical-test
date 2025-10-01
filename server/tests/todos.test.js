// Minimal integration test using Node test runner + Supertest
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import fs from 'node:fs';
import path from 'node:path';

// Reset test data to a clean state before importing app
const dataFile = path.resolve(process.cwd(), 'data', 'todos.json');
fs.mkdirSync(path.dirname(dataFile), { recursive: true });
fs.writeFileSync(dataFile, '[]', 'utf-8');

import app from '../src/index.js';

test('POST /api/todos - should create a new todo', async () => {
    const todoData = { title: 'Test todo item' };

    const response = await request(app)
        .post('/api/todos')
        .send(todoData)
        .expect(201);

    assert.ok(response.body._id, 'Should have an ID');
    assert.equal(response.body.title, 'Test todo item');
    assert.equal(response.body.completed, false);
    assert.ok(response.body.createdAt, 'Should have createdAt timestamp');
});


