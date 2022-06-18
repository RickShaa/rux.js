type StateToolBox<T> = [
  () => T,
  (cb: (oldState: T) => T) => void,
  (cb: ObserverCallback<T>) => void,
  {
    moveBack: () => void;
    toPresent: () => void;
  }
];

type ObserverCallback<T> = (state: T) => void;

type StateType<T> = T extends any[]
  ? T[]
  : T extends Object
  ? T
  : number | string | boolean;

interface StateMachine<T> {
  observers: ObserverCallback<T>[];
  currentState: T;
  memories: T[];
}

//type ArrayItem<T extends any[], TItem> = T[number] extends TItem ? TItem : any;

function cloneState<T>(state: T) {
  if (typeof state === "object" && !Array.isArray(state) && state) {
    return { ...state };
  } else if (Array.isArray(state)) {
    return Object.assign([], state);
  } else {
    return state;
  }
}

function notify<T>(observers: ObserverCallback<T>[], state: T) {
  if (observers.length !== 0) {
    observers.forEach((observer) => {
      observer(state);
    });
  }
}

export default function initState<T>(state: T): StateToolBox<T> {
  const stateMachine: StateMachine<T> = {
    observers: [],
    currentState: state,
    memories: [],
  };
  let currentMemoryPosition = getLength(stateMachine.memories);
  let currentMemory = stateMachine.memories[currentMemoryPosition];
  return [
    () => cloneState(stateMachine.currentState),
    (cb) => {
      stateMachine.currentState = cb(cloneState(stateMachine.currentState));
      stateMachine.memories.push(cloneState(stateMachine.currentState));
      currentMemoryPosition = getLength(stateMachine.memories);
      currentMemory = stateMachine.memories[currentMemoryPosition];
      notify(stateMachine.observers, cloneState(stateMachine.currentState));
    },
    (observerCallback) => {
      stateMachine.observers.push(observerCallback);
    },
    {
      moveBack() {
        if (currentMemoryPosition > 0) {
          currentMemoryPosition = currentMemoryPosition - 1;
        }
        currentMemory = stateMachine.memories[currentMemoryPosition];
        notify(stateMachine.observers, currentMemory);
      },
      toPresent() {
        currentMemoryPosition = getLength(stateMachine.memories);
        currentMemory = stateMachine.memories[currentMemoryPosition];
        notify(stateMachine.observers, currentMemory);
      },
    },
  ];
}

function getLength<T>(memories: T[]) {
  return memories.length - 1;
}
