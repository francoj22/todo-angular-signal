import { Component, input, output } from '@angular/core';

import { Todo } from '../todo/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  readonly todos = input.required<Todo[]>();

  readonly toggleTodo = output<string>();
  readonly remove = output<string>();

  protected onToggle(id: string): void {
    this.toggleTodo.emit(id);
  }

  protected onRemove(id: string): void {
    this.remove.emit(id);
  }
}
