// app/api/todos/route.ts
import { readTodos, saveTodos } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const todos = await readTodos();
        return NextResponse.json(todos);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const todo = await request.json();
        const todos = await readTodos();

        const updatedTodos = [...todos, todo];
        await saveTodos(updatedTodos);

        return NextResponse.json(todo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
    }
}