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
