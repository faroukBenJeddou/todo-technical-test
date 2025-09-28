import React from 'react'

export default function TodoItem({ todo, onToggle }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid #eee' }}>
      <input type="checkbox" checked={!!todo.completed} onChange={onToggle} />
      <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</div>
      <div style={{ marginLeft: 'auto', opacity: 0.6, fontSize: 12 }}>{new Date(todo.createdAt).toLocaleString()}</div>
    </li>
  )
}
