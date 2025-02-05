// lib/db.ts
import { promises as fs } from 'fs';
import { join } from 'path';

const dbPath = join(process.cwd(), 'db.json');

interface Todo {
    id: string;
    text: string;
    completed: boolean;
}

export async function readTodos(): Promise<Todo[]> {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData.todos;
    } catch (error) {
        // If file doesn't exist, create it with empty todos array
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            await saveTodos([]);
            return [];
        }
        throw error;
    }
}

export async function saveTodos(todos: Todo[]): Promise<void> {
    const data = {
        todos
    };
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
}