import React, { useEffect, useMemo, useState } from 'react'
import AddTodo from './components/AddTodo.jsx'
import TodoItem from './components/TodoItem.jsx'

export default function App() {
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 5 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const params = useMemo(() => new URLSearchParams({ q, page, limit }), [q, page, limit])

  async function fetchTodos() {
    setLoading(true); setError('')
    try {
      const res = await fetch(`/api/todos?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTodos() }, [q, page, limit])

  const canPrev = page > 1
  const canNext = data.total > page * data.limit

  const onAdded = () => { setPage(1); fetchTodos() }

  const onToggle = async (id) => {
    // Optimistic (Hard): flip locally first
    const prev = data.items
    setData(d => ({ ...d, items: d.items.map(t => t._id === id ? { ...t, completed: !t.completed } : t) }))
    try {
      const res = await fetch(`/api/todos/${id}/toggle`, { method: 'PATCH' })
      if (!res.ok) throw new Error('Toggle failed')
      // refresh to sync
      fetchTodos()
    } catch (e) {
      setData(d => ({ ...d, items: prev }))
      alert('Failed to toggle todo.')
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Todo List (JSON)</h1>
      <AddTodo onAdded={onAdded} />
      <div style={{ marginTop: 16 }}>
        <input
          placeholder="Search (Medium)"
          value={q}
          onChange={e => { setPage(1); setQ(e.target.value) }}
          style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
        />
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
        {data.items.map(t => (
          <TodoItem key={t._id} todo={t} onToggle={() => onToggle(t._id)} />
        ))}
      </ul>

      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button disabled={!canPrev} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
        <div style={{ flex: 1 }} />
        <span>Page {data.page} / {Math.max(1, Math.ceil(data.total / data.limit))}</span>
        <div style={{ flex: 1 }} />
        <button disabled={!canNext} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  )
}
