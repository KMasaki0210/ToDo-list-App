'use client'

import { useEffect, useState } from 'react'
import { Todo } from '@/types'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]) //todo欄
  const [input, setInput] = useState('') //入力欄

  useEffect(() => {
    fetch('/api/todos').then(res => res.json()).then(setTodos)
  }, [])

  const addTodo = async () => {
    if (!input) return
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ title: input }),
    })
    const newTodo = await res.json();  // ← レスポンスから新規Todoを取得
    setTodos(prevTodos => [...prevTodos, newTodo]);  // ← 状態を更新
    setInput('');
  }

  const toggleTodo = async (id: string, done: boolean) => {
    const res = await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ id, done }),
    })
    const updated = await res.json()
    setTodos(todos.map(todo => (todo.id === id ? updated : todo)))
  }

  const deleteTodo = async (id: string) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ id })
    })
    setTodos(todos.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-900">My ToDo List</h1>

        {/* 入力エリア */}
        <div className="flex mb-4">
          <input
            className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-indigo-800"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="新しいタスクを入力"
          />
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded-r-md hover:bg-indigo-600 transition"
            onClick={addTodo}
          >
            追加
          </button>
        </div>

        {/* ToDo 一覧 */}
        <ul className="space-y-2">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg hover:bg-gray-100"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id, !todo.done)}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span
                  className={`ml-3 ${todo.done ? 'line-through text-gray-400' : 'text-gray-800'}`}
                >
                  {todo.title}
                </span>
              </div>
              <button
                className="text-red-500 hover:text-red-700 transition"
                onClick={() => deleteTodo(todo.id)}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}