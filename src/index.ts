import { initState } from "./rux";

const gameState = initState({
  state() {
    return {
      count: 1,
    };
  },
});

gameState.$observe((state) => {
  console.log("TRIGGER", state);
});

gameState.setState((state) => {
  state.count += 1;
});
