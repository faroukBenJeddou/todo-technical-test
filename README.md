# MERN Junior Technical Test (JSON-only, no Mongo)

This variant uses a **JSON file** as storage—no MongoDB required. It’s split into **Easy**, **Medium**, and **Hard** tiers. Target time **~60–90 minutes** total. Partial credit is fine.

---

## Stack
- **Server**: Node.js + Express (data persisted to `server/data/todos.json`)
- **Client**: React (Vite) + Fetch API
- **Tests**: Node test runner + Supertest (server only)

---

## Getting Started

```bash
npm install
npm run setup
npm run dev
```
- API base URL: `http://localhost:4000/api`
- Client dev server: `http://localhost:5173`

> You can pre-populate `server/data/todos.json` with your own rows. One sample row is already included.

---

## What you’re building

A minimal Todo app with create/list/toggle. Then extend with search & pagination (Medium) and optimistic UI + one test (Hard).

---

## Tiers & Acceptance Criteria

### ✅ Easy (foundations)
**Goal:** Create and display todos.

**Tasks**
1. **Server**: Ensure `POST /api/todos` creates a todo with fields:
   - `title` (string, required, 1–120 chars)
   - `completed` (boolean, default false)
   - `createdAt` (date ISO string, default now)
   Server persists to JSON file.
2. **Client**: Implement the “Add Todo” form in `client/src/components/AddTodo.jsx`:
   - Controlled input + submit calls `POST /api/todos`
   - On success, refresh the list (or append locally)
3. **Ordering**: Ensure `GET /api/todos` returns newest first (`createdAt` desc).

**Acceptance**
- Typing a title and clicking “Add” shows the new item at the top.
- Validation: empty titles rejected with a visible error.

---

### ✅✅ Medium (search & pagination)
**Goal:** Make it usable with longer lists.

**Tasks**
1. **Server**: Update `GET /api/todos` to support query params:
   - `q` (case-insensitive substring match on `title`)
   - `page` (1-based), `limit` (default 5, max 20)
   Return shape:
   ```json
   { "items": [...], "page": 1, "limit": 5, "total": 17 }
   ```
2. **Client**: Add a search input and “Prev/Next” pagination controls.
   - Debounce search input (~300ms) is a plus
   - Preserve query in the URL (e.g., `?q=...&page=...`) is a plus

**Acceptance**
- Searching narrows results.
- Changing page updates the list.
- Server returns the correct `total`, and client controls enable/disable appropriately.

---

### ✅✅✅ Hard (polish + correctness)
**Goal:** Production-feel touch + one meaningful test.

**Tasks**
1. **Server**: Implement `PATCH /api/todos/:id/toggle` that flips `completed`. Return the updated todo.
2. **Client**: Add an **optimistic UI** toggle on each todo item:
   - Immediately updates UI on click.
   - If server fails, revert and show a toast/error.
3. **Test**: Add **one** integration test for either:
   - creating a todo (`POST /api/todos`) **or**
   - toggling a todo (`PATCH /api/todos/:id/toggle`)

**Acceptance**
- Toggle feels instant; failures recover gracefully.
- The added test passes (`npm test`).

---

## Evaluation
- Clear, readable code & small commits
- Error handling & validation
- API design & edge cases
- UI responsiveness/state management
- Optional: typing via JSDoc/TS earns bonus points

---

## Submission
- Push to a public Git repo (or send a zip).
- Include **NOTES.md** if you want to highlight decisions, time spent, or stretch ideas.
