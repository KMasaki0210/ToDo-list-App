// src/app/api/todos/route.ts
import fs from 'fs'
import { NextRequest, NextResponse } from 'next/server'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { nanoid } from 'nanoid'
import { Todo } from '@/types'

// data/db.json のパスはプロジェクトルートからの相対か絶対で指定
const file = new JSONFile<{ todos: Todo[] }>('data/db.json')
const db = new Low<{ todos: Todo[] }>(file, { todos: [] })

db.write = async () => {
  // JSON.stringify で直接ファイルに書き込む
  fs.writeFileSync('data/db.json', JSON.stringify(db.data, null, 2), 'utf-8')
}

// GET /api/todos
export async function GET() {
  await db.read()
  return NextResponse.json(db.data.todos)
}

// POST /api/todos
export async function POST(req: NextRequest) {
  await db.read()
  const { title } = await req.json()
  if (!title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }
  const newTodo: Todo = {
    id: nanoid(),
    title,
    done: false,
    createdAt: Date.now(),
  }
  db.data.todos.push(newTodo)
  await db.write()
  return NextResponse.json(newTodo, { status: 201 })
}

// PUT /api/todos
export async function PUT(req: NextRequest) {
  await db.read()
  const { id, done, newTitle } = await req.json() as {
    id: string
    done?: boolean
    newTitle?: string
  }
  const todo = db.data.todos.find(t => t.id === id)
  if (!todo) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (done !== undefined) todo.done = done
  if (newTitle) todo.title = newTitle
  await db.write()
  return NextResponse.json(todo)
}

// DELETE /api/todos
export async function DELETE(req: NextRequest) {
  await db.read()
  const { id } = await req.json() as { id: string }
  db.data.todos = db.data.todos.filter(t => t.id !== id)
  await db.write()
  return new NextResponse(null, { status: 204 })
}