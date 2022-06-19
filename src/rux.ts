import lodash from "lodash";

type CallBack<T> = (state: T) => void;
type TObj = { [key: string]: any };
export function initState<T extends TObj>(init: { state: () => T }) {
  let observers: CallBack<T>[] = [];
  let currentState = init.state();
  return {
    setState(cb: CallBack<T>) {
      cb(currentState);
      notifyObservers<T>(observers, lodash.cloneDeep(currentState));
    },
    $observe: (observerCallback: CallBack<T>) => {
      observers.push(observerCallback);
    },
  };
}

function notifyObservers<T>(observers: CallBack<T>[], state: T) {
  if (observers.length !== 0) {
    observers.forEach((observer) => {
      observer(state);
    });
  }
}

// type ValueOfKey<T, Key extends keyof T> = T[Key];

// function getProperty<T, Key extends keyof T>(
//   input: T,
//   key: Key
// ): ValueOfKey<T, Key> {
//   return input[key];
// }
// getProperty({ key: "Val" }, "key");
