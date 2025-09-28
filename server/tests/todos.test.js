// Minimal integration test using Node test runner + Supertest
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import fs from 'node:fs';
import path from 'node:path';

// Reset test data to a clean state before importing app
const dataFile = path.resolve(process.cwd(), 'server', 'data', 'todos.json');
fs.mkdirSync(path.dirname(dataFile), { recursive: true });
fs.writeFileSync(dataFile, '[]', 'utf-8');

import app from '../src/index.js';

test('POST /api/todos creates a todo', async () => {
  const title = 'Write a test';
  const res = await request(app).post('/api/todos').send({ title });
  assert.equal(res.status, 201);
  assert.equal(res.body.title, title);
  assert.equal(typeof res.body._id, 'string');
});
