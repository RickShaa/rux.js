import { doesNotMatch } from "assert";
import { initState } from "./rux";

interface TodoState {
  todos: string[];
  done: string[];
}

const { setters, getState, setState, $observe } = initState<TodoState>({
  state() {
    return {
      todos: [],
      done: [],
    };
  },
  setters: {
    addTodos(state, object) {
      state.todos.push(object);
    },
    markLastTodoAsDone(state, object) {
      const lastItem = state.todos.pop();
      if (lastItem) {
        state.done.push(lastItem);
      }
    },
  },
});

$observe((state) => {
  console.log(state);
});

setters.addTodos("Hello");
setters.markLastTodoAsDone();
setters.markLastTodoAsDone();
