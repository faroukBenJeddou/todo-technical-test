import React, { useState } from 'react'

export default function AddTodo({ onAdded }) {
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Please enter a title'); return }
    setLoading(True)
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Failed to add')
      }
      setTitle('')
      onAdded?.()
    } catch (e) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8 }}>
      <input
        placeholder="Add a todo (Easy)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ flex: 1, padding: 8 }}
      />
      <button disabled={loading} type="submit">{loading ? 'Adding…' : 'Add'}</button>
      {error && <span style={{ color: 'crimson', marginLeft: 8 }}>{error}</span>}
    </form>
  )
}
