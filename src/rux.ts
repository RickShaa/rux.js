import { CallBack, TObj, InitState } from './types';

export function initState<T extends TObj>(init: InitState<T>) {
  const observers: CallBack<T>[] = [];
  let currentState = init.state();
  const stateMachine = {
    getState() {
      return currentState;
    },
    update(cb: (state: T) => void) {
      cb(currentState);
      notifyObservers<T>(observers, currentState);
    },
    reset(reset: T) {
      currentState = reset;
    },
    $observe: (observerCallback: CallBack<T>) => {
      observers.push(observerCallback);
    },
  };
  return stateMachine;
}

function notifyObservers<T>(observers: CallBack<T>[], state: T) {
  if (observers.length !== 0) {
    observers.forEach((observer) => {
      observer(state);
    });
  }
}
