import { initState } from "./rux";

interface Todos {
  todos: string[];
}

const todoStore = initState<Todos>({
  state() {
    return {
      todos: [],
    };
  },
});

const addTodo = (todo: string) =>
  todoStore.update((state) => {
    state.todos.push(todo);
  });

export default {
  $observer: todoStore.$observe,
  setter: {
    addTodo,
  },
};
