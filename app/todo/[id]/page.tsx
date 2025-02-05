// app/todo/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Trash, Check } from 'lucide-react';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export default function TodoPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [todo, setTodo] = useState<Todo | null>(null);
    const [editText, setEditText] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTodo();
    }, [params.id]);

    const fetchTodo = async () => {
        try {
            const response = await fetch('/api/todos');
            const todos = await response.json();
            const foundTodo = todos.find((t: Todo) => t.id === params.id);

            if (foundTodo) {
                setTodo(foundTodo);
                setEditText(foundTodo.text);
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch todo:', error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    if (!todo) {
        return <div className="p-4">Todo not found</div>;
    }

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-blue-500 hover:text-blue-600"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to todos
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold mb-6">Edit Todo</h1>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Todo Text
                            </label>
                            <input
                                type="text"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full p-3 border rounded-lg"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch(`/api/todos/${todo.id}`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ text: editText })
                                        });
                                        if (response.ok) {
                                            router.push('/');
                                        }
                                    } catch (error) {
                                        console.error('Failed to update todo:', error);
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch(`/api/todos/${todo.id}`, {
                                            method: 'DELETE'
                                        });
                                        if (response.ok) {
                                            router.push('/');
                                        }
                                    } catch (error) {
                                        console.error('Failed to delete todo:', error);
                                    }
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                <Trash className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}