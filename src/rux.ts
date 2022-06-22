import lodash from "lodash";

type CallBack<T> = (state: T) => void;
type TObj = { [key: string]: any };
type SetterObj<T, K extends keyof T> = {
  [key: string]: (
    state: T,
    stateModifier: T[K] extends Array<any> ? T[K][number] : T[K]
  ) => void;
};

type InitState<T, K extends keyof T> = {
  state: () => T;
  setters: SetterObj<T, K>;
};
export function initState<T extends TObj, K extends keyof T>(
  init: InitState<T, K>
) {
  let observers: CallBack<T>[] = [];
  let currentState = init.state();
  let functionNames: string[] = [];
  for (let fn in init.setters) {
    let fnName = fn.toString();
    functionNames.push(fnName);
  }
  let setterState: {
    [key: typeof functionNames[number]]: (
      stateModifier: T[K] extends Array<any> ? T[K][number] : T[K]
    ) => void;
  };
  setterState = Object.create({});
  functionNames.forEach((functionName) => {
    setterState[functionName] = (
      stateModifier: T[K] extends Array<any> ? T[K][number] : T[K]
    ) => {
      init.setters[functionName].apply(null, [currentState, stateModifier]);
      notifyObservers<T>(observers, lodash.cloneDeep(currentState));
    };
  });
  const stateMachine = {
    setters: setterState,
    getState() {
      lodash.cloneDeep(currentState);
    },
    setState(cb: CallBack<T>) {
      cb(currentState);
      notifyObservers<T>(observers, lodash.cloneDeep(currentState));
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
