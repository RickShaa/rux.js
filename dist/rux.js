"use strict";
function cloneState(state) {
    if (typeof state === "object" && !Array.isArray(state) && state) {
        return Object.assign({}, state);
    }
    else if (Array.isArray(state)) {
        return Object.assign([], state);
    }
    else {
        return state;
    }
}
function rux() {
    let states = [];
    let stateIndex = 0;
    return function (state) {
        states.push(state);
        stateIndex = states.length - 1;
        const stateClone = cloneState(state);
        return [
            () => stateClone,
            (cb) => {
                states[stateIndex] = cb(states[stateIndex]);
                return states[states.length - 1];
            },
        ];
    };
}
const initState = rux();
const [getStudent, setStudent] = initState({ id: 1, name: "Nico" });
const [getProfessors, setProfessors] = initState({
    id: 2,
    rank: "dozent",
});
console.log(getProfessors());
// const [state, setState] = rux({ name: "Rick", age: 2 });
// console.log(state());
// setState((old) => {
//   return { ...old, name: "R", lastName: "Shaffer" };
// });
// console.log(state());
// type ReturnState<T, TNew extends T> = [
//   () => T,
//   (cb: SetStateCallback<T, TNew>) => T
// ];
// type SetStateCallback<T, TNew extends T> = (oldState: T) => TNew;
// class Rux<T, TNew extends T> {
//   states: T[];
//   stateIndex?: number;
//   constructor() {
//     this.states = [];
//     this.stateIndex = 0;
//   }
//   initState(state: T): ReturnState<T, TNew> {
//     this.states.push(state);
//     const stateClone = cloneState(state);
//     return [
//       () => stateClone,
//       (cb) => {
//         this.states[this.states.length - 1] = cb(
//           this.states[this.states.length - 1]
//         );
//         return this.states[this.states.length - 1];
//       },
//     ];
//   }
// }
