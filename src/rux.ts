import lodash from "lodash";

type CallBack<T> = (state: T) => void;
type TObj = { [key: string]: any };

type AllowedMutations<T extends TObj> = T[keyof T];

type InitState<T> = {
  state: () => T;
};
type Update<T> = {
  [key: string]: (state: T, mutation?: AllowedMutations<T>) => void;
};
export function initState<T extends TObj>(init: InitState<T>) {
  let observers: CallBack<T>[] = [];
  let currentState = init.state();
  let stateMachine = {
    getState() {
      return lodash.cloneDeep(currentState);
    },
    update(cb: (state: T) => void) {
      cb(currentState);
      notifyObservers<T>(observers, lodash.cloneDeep(currentState));
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

// let fnNames: string[] = [];

// for (let fn in init.update) {
//   let fnName = fn.toString();
//   fnNames.push(fnName);
// }
// const functionNames = [...fnNames] as const;
// type UpdatePropertyNames = typeof functionNames[number];
// type UpdateState = {
//   [K in UpdatePropertyNames]: (stateModifier?: AllowedMutations<T>) => void;
// };
// let updateState: UpdateState;
// updateState = {};
// functionNames.forEach((functionName) => {
//   updateState[functionName] = (stateModifier) => {
//     init.update[functionName].apply(null, [currentState, stateModifier]);
//     notifyObservers<T>(observers, lodash.cloneDeep(currentState));
//   };
// });

// type AllowedMutations<T extends TObj> = T[keyof T] extends any[]
// ? AllowedMutations<T[keyof T]>
// : T[keyof T];
// type Update<T> = {
//   [Property in keyof T as `update${Capitalize<string & Property>}`]: (
//     state: T,
//     mutation?: AllowedMutations<T>
//   ) => void;
// };
