// components/TodoList.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Moon, Sun, Plus, X, Check } from 'lucide-react';

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
    const [darkMode, setDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('/api/todos');
            const data = await response.json();
            setTodos(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch todos:', error);
            setIsLoading(false);
        }
    };

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTodo.trim()) return;

        const todo = {
            id: Date.now().toString(),
            text: newTodo.trim(),
            completed: false
        };

        try {
            const response = await fetch('/api/todos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(todo)
            });

            if (response.ok) {
                setTodos([...todos, todo]);
                setNewTodo('');
            }
        } catch (error) {
            console.error('Failed to add todo:', error);
        }
    };

    const toggleTodo = async (id: string) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !todo.completed })
            });

            if (response.ok) {
                setTodos(todos.map(t =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                ));
            }
        } catch (error) {
            console.error('Failed to toggle todo:', error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            const response = await fetch(`/api/todos/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setTodos(todos.filter(todo => todo.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete todo:', error);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen p-4 bg-gray-50">
            <div className="max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">TODO</h1>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </button>
                </div>

                <form onSubmit={addTodo} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            placeholder="Create a new todo..."
                            className="flex-1 p-3 rounded-lg border"
                        />
                        <button
                            type="submit"
                            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            <Plus className="w-6 h-6" />
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-lg shadow">
                    {todos.map(todo => (
                        <div
                            key={todo.id}
                            className="flex items-center gap-3 p-4 border-b"
                        >
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className={`w-6 h-6 rounded-full border ${todo.completed
                                        ? 'bg-green-500 border-green-500'
                                        : 'border-gray-300'
                                    } flex items-center justify-center`}
                            >
                                {todo.completed && <Check className="w-4 h-4 text-white" />}
                            </button>
                            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                {todo.text}
                            </span>
                            <Link
                                href={`/todo/${todo.id}`}
                                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                View
                            </Link>
                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="text-red-500 hover:text-red-600"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}