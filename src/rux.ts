type ReturnState<T, TNew extends T> = [
  () => T,
  (cb: SetStateCallback<T, TNew>) => void,
  (cb: ObserverCallback<T>) => void
];
type SetStateCallback<T, TNew extends T> = (oldState: T) => TNew;

type ObserverCallback<T> = (state: T) => any;

function cloneState<T>(state: T) {
  if (typeof state === "object" && !Array.isArray(state) && state) {
    return { ...state };
  } else if (Array.isArray(state)) {
    return Object.assign([], state);
  } else {
    return state;
  }
}

export default function rux() {
  let states: any[] = [];
  return function <T, TNew extends T>(state: T): ReturnState<T, TNew> {
    let observers: ObserverCallback<T>[] = [];
    states.push(state);
    const stateIndex = states.length - 1;
    let stateClone = cloneState(state);
    return [
      () => stateClone,
      (cb: SetStateCallback<T, TNew>) => {
        states[stateIndex] = cb(states[stateIndex]);
        stateClone = cloneState(states[stateIndex]);
        if (observers.length !== 0) {
          observers.forEach((observer) => {
            observer(stateClone);
          });
        }
      },
      (observerCallback: any) => {
        observers.push(observerCallback);
      },
    ];
  };
}
