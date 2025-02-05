// app/api/todos/[id]/route.ts
import { readTodos, saveTodos } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const updatedTodo = await request.json();
        const todos = await readTodos();

        const updatedTodos = todos.map((todo: any) =>
            todo.id === params.id ? { ...todo, ...updatedTodo } : todo
        );

        await saveTodos(updatedTodos);
        return NextResponse.json(updatedTodo);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update todo' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const todos = await readTodos();
        const updatedTodos = todos.filter((todo: any) => todo.id !== params.id);

        await saveTodos(updatedTodos);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete todo' }, { status: 500 });
    }
}