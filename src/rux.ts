type ReturnState<T, TNew extends T> = [
  () => T,
  (cb: SetStateCallback<T, TNew>) => T
];
type SetStateCallback<T, TNew extends T> = (oldState: T) => TNew;

function cloneState<T>(state: T) {
  if (typeof state === "object" && !Array.isArray(state) && state) {
    return { ...state };
  } else if (Array.isArray(state)) {
    return Object.assign([], state);
  } else {
    return state;
  }
}

function rux<T, TNew extends T>(state: T): ReturnState<T, TNew> {
  let previousStates: T[] = [];
  let currentState = state;
  let clone = cloneState(currentState);
  return [
    () => clone,
    (cb) => {
      previousStates.push(currentState);
      currentState = cb(currentState);
      clone = cloneState(currentState);
      return currentState;
    },
  ];
}

const [state, setState] = rux({ name: "Rick", age: 2 });
console.log(state());
setState((old) => {
  return { ...old, name: "R", lastName: "Shaffer" };
});
console.log(state());
