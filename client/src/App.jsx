import React, { useEffect, useMemo, useState, useCallback } from 'react'
import AddTodo from './components/AddTodo.jsx'
import TodoItem from './components/TodoItem.jsx'

// Debounce hook
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

export default function App() {
    const [q, setQ] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('q') || ''
    })
    const [page, setPage] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return parseInt(params.get('page')) || 1
    })
    const [limit] = useState(5)
    const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 5 })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const debouncedQ = useDebounce(q, 300)

    const params = useMemo(() => new URLSearchParams({
        q: debouncedQ,
        page: page.toString(),
        limit: limit.toString()
    }), [debouncedQ, page, limit])

    // Update URL when search or page changes
    useEffect(() => {
        const newUrl = new URL(window.location)
        if (debouncedQ) {
            newUrl.searchParams.set('q', debouncedQ)
        } else {
            newUrl.searchParams.delete('q')
        }
        if (page > 1) {
            newUrl.searchParams.set('page', page.toString())
        } else {
            newUrl.searchParams.delete('page')
        }
        window.history.replaceState({}, '', newUrl.toString())
    }, [debouncedQ, page])

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

    useEffect(() => { fetchTodos() }, [debouncedQ, page, limit])

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

    const handleSearchChange = useCallback((e) => {
        setPage(1) // Reset to first page when searching
        setQ(e.target.value)
    }, [])

    return (
        <div style={{ maxWidth: 640, margin: '40px auto', padding: 16, fontFamily: 'system-ui, sans-serif' }}>
            <h1>Todo List (JSON)</h1>
            <AddTodo onAdded={onAdded} />
            <div style={{ marginTop: 16 }}>
                <input
                    placeholder="Search todos... (debounced 300ms)"
                    value={q}
                    onChange={handleSearchChange}
                    style={{ padding: 8, width: '100%', boxSizing: 'border-box' }}
                />
            </div>

            {loading && <p>Loading…</p>}
            {error && <p style={{ color: 'crimson' }}>{error}</p>}

            {data.items.length === 0 && !loading && (
                <p style={{ textAlign: 'center', opacity: 0.6, marginTop: 32 }}>
                    {debouncedQ ? `No todos found for "${debouncedQ}"` : 'No todos yet. Add one above!'}
                </p>
            )}

            <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
                {data.items.map(t => (
                    <TodoItem key={t._id} todo={t} onToggle={() => onToggle(t._id)} />
                ))}
            </ul>

            {data.total > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 16, alignItems: 'center' }}>
                    <button disabled={!canPrev} onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</button>
                    <div style={{ flex: 1 }} />
                    <span>
            Page {data.page} of {Math.max(1, Math.ceil(data.total / data.limit))}
                        {debouncedQ && ` (${data.total} found)`}
                        {!debouncedQ && ` (${data.total} total)`}
          </span>
                    <div style={{ flex: 1 }} />
                    <button disabled={!canNext} onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
            )}
        </div>
    )
}
