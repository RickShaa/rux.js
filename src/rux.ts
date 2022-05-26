function cloneState<T>(state: T) {
  if (typeof state === "object" && !Array.isArray(state) && state) {
    return { ...state };
  } else if (Array.isArray(state)) {
    return Object.assign([], state);
  } else {
    return state;
  }
}

type ReturnState<T> = [() => T, (cb: (state: T) => T) => T];

function rux<T>(state: T): ReturnState<T> {
  let currentState = state;
  let clone = cloneState(currentState);
  return [
    () => clone,
    (cb: (oldState: T) => T) => {
      currentState = cb(currentState);
      clone = cloneState(currentState);
      return currentState;
    },
  ];
}

const [state, setState] = rux({ name: "Rick", age: [1, 2, 3] });
console.log(state());
console.log(
  setState((old) => {
    return { ...old, name: "R" };
  })
);
console.log(state());
