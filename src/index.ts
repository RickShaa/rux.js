import { initState } from "./rux";

const { setters, getState, setState, $observe } = initState<
  { todos: { [key: string]: number }[] },
  "todos"
>({
  state() {
    return {
      todos: [],
    };
  },
  setters: {
    addTodos(state, object) {
      state.todos.push(object);
    },
  },
});

$observe((state) => {
  console.log(state);
});

setters.addTodos({ count: 2 });
