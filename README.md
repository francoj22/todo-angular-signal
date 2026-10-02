# Todo App With Angular Signals

This project is a Todo app built with Angular standalone components and Signals-based state management.

It intentionally uses Angular Signals instead of NgRx to keep local UI state simple, readable, and lightweight.

## Why Signals Instead Of NgRx

This app manages only local feature state (todos, filter, input text), so Signals are a better fit than a global store.

### Signals benefits in this project

- Less boilerplate: no actions, reducers, effects, selectors, or store setup.
- State and updates live close to the component that owns them.
- Computed values are straightforward with computed signals.
- Easier onboarding for small-to-medium feature scope.

### When NgRx would be a better choice

- Very large applications with many domains and shared global state.
- Complex side effects and orchestration across multiple features.
- Need for advanced tooling around action timelines and strict event-driven architecture.

## Architecture

- Root shell: app component
- Feature container: todo component (state, filtering, mutations)
- Presentational list: todo-list component (rendering + events)

## State Model

Todos are modeled as:

- id: number
- text: string
- completed: boolean

State is stored in Signals:

- todos
- draft
- filter

Derived state uses computed signals:

- filteredTodos
- remainingCount
- completedCount

## Persistence

The todo list is persisted in localStorage.

On startup, the app hydrates from localStorage if data exists.
On every state change, todos are saved again.

## Run The Project

Install dependencies:

```bash
npm install
```

Start development server:

```bash
ng serve
```

Open:

http://localhost:4200/

Build for production:

```bash
ng build
```

Run tests:

```bash
ng test
```

## Future Enhancements

- Persist filter and draft input in localStorage.
- Add due dates and priorities.
- Add edit-in-place for existing todos.
- Add backend sync if multi-device support is needed.
