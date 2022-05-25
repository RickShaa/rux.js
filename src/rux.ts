function cloneState<T> (state:T | T[]){
    if(typeof state === "object" && 
    !Array.isArray(state) 
    && state !==null){
        return {...state};
    }
    else if(Array.isArray(state)) {
        return Array.from(state);
    }
    else{
        return state;
    }
}

type ReturnState<T> = [() => T | T[], (cb:(state:T) => T) => void];


function rux <T> (state:T ):ReturnState<T> {
    let currentState = state;
    let clone = cloneState(currentState);
    return [() => clone, (cb:(oldState:T) => T) => {
        currentState = cb(currentState)
        clone = cloneState(currentState);
        return currentState;
    }];
}

const [state, setState] = rux({name:"Rick"});
console.log(state());
console.log(setState((old) => {
    return {...old, name: "R"}
}));
console.log(state());

