type ReturnState<T, TNew extends T> = [
  () => T,
  (cb: SetStateCallback<T, TNew>) => void,
  (cb: () => void) => void
];
type SetStateCallback<T, TNew extends T> = (oldState: T) => TNew;

type ObserverFunction = () => any;

function cloneState<T>(state: T) {
  if (typeof state === "object" && !Array.isArray(state) && state) {
    return { ...state };
  } else if (Array.isArray(state)) {
    return Object.assign([], state);
  } else {
    return state;
  }
}

function rux() {
  let states: any[] = [];
  return function <T, TNew extends T>(state: T): ReturnState<T, TNew> {
    let observers: ObserverFunction[] = [];
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
            observer();
          });
        }
      },
      (observerCallback: any) => {
        observers.push(observerCallback);
      },
    ];
  };
}

//TEST
interface Student {
  id: number;
  name: string;
}
interface Professor {
  id: number;
  rank: string;
}

const student = () => {
  return { id: 1, name: "Rick" };
};

const initState = rux();

const [getStudent, setStudent, studentObserver] = initState([student()]);
studentObserver(() => console.log("StudentObserver 1 called on change"));
studentObserver(() => console.log("StudentObserver 2 called on change"));
studentObserver(() => console.log(getStudent()));
const [getProfessors, setProfessors, professorObserver] = initState({
  id: 2,
  rank: "dozent",
});

professorObserver(() => console.log("ProfessorObserver fired"));

console.log(getProfessors());
console.log(getStudent());

//observers should fire on state change
console.log("set Student called ");
setStudent((oldState) => {
  return [...oldState, student()];
});
console.log("set Student called ");
setStudent((oldState) => {
  return [...oldState, student()];
});
console.log("Set profs called");
setProfessors((oldState) => {
  return { ...oldState, lastName: "test" };
});
