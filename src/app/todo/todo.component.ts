import { Component, computed, effect, signal } from '@angular/core';

import { TodoListComponent } from '../todo-list/todo-list.component';
import { Todo, TodoFilter } from './todo.model';
import { TODO_SEEDS } from '../constants/todo-seeds';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodoListComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent {
  private static readonly TODOS_STORAGE_KEY = 'signal-todo-items';

  private readonly seedTodos: Todo[] = TODO_SEEDS.map(todo => ({
    ...todo,
    id: String(todo.id)
  }))

  private readonly nextId = this.seedTodos.length + 1;

  protected readonly title = 'Signal Todo';
  protected readonly draft = signal('');
  protected readonly filter = signal<TodoFilter>('all');
  protected readonly todos = signal<Todo[]>(this.seedTodos);

  constructor() {
    const storedTodos = this.readTodosFromStorage();

    if (storedTodos) {
      this.todos.update(() => storedTodos);
      this.nextId = storedTodos.reduce((maxId, todo) => Math.max(Number(maxId), Number(todo.id)), 0) + 1;
    }

    effect(() => {
      const items = this.todos();
      localStorage.setItem(TodoComponent.TODOS_STORAGE_KEY, JSON.stringify(items));
    });
  }

  protected readonly filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const items = this.todos();

    if (currentFilter === 'active') {
      return items.filter((todo) => !todo.completed);
    }

    if (currentFilter === 'completed') {
      return items.filter((todo) => todo.completed);
    }

    return items;
  });

  protected readonly remainingCount = computed(() => {
    return this.todos().filter((todo) => !todo.completed).length;
  });

  protected readonly completedCount = computed(() => {
    return this.todos().filter((todo) => todo.completed).length;
  });

  protected onDraftInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.draft.set(target?.value ?? '');
  }

  protected addTodo(): void {
    const text= this.draft().trim();

    if(!text) {
      return;
    }
    this.todos.update((items) => [
      {
        id: uuidv4().substring(0,8),
        text,
        completed: false
      },
      ...items
    ]);
  }

  protected toggleTodo(id: string): void {
    this.todos.update((items) =>
      items.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  protected deleteTodo(id: string): void {
    this.todos.update((items) => items.filter((todo) => todo.id !== id));
  }

  protected setFilter(nextFilter: TodoFilter): void {
    this.filter.set(nextFilter);
  }

  protected clearCompleted(): void {
    this.todos.update((items) => items.filter((todo) => !todo.completed));
  }

  private readTodosFromStorage(): Todo[] | null {
    const raw = localStorage.getItem(TodoComponent.TODOS_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw);

      if (!Array.isArray(parsed)) {
        return null;
      }

      const validTodos = parsed.filter((item): item is Todo => {
        return (
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.text === 'string' &&
          typeof item.completed === 'boolean'
        );
      });

      return validTodos;
    } catch {
      return null;
    }
  }
}
