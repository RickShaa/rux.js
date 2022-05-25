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

type ReturnState<T> = [() => T | T[], (cb:Function) => void];

function rux <T> (state:T ):ReturnState<T> {
    let currentState = state;
    let clone = cloneState(currentState);
    return [() => clone, (cb:Function) => {
        currentState = cb(currentState)
        clone = cloneState(currentState);
        return currentState;
    }];
}

const [state, setState] = rux([1,2]);
console.log(state());
console.log(setState((old: any) => [...old,3,4,5]));
console.log(state());

