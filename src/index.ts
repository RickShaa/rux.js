import initState from "./rux";

interface Position {
  x: number;
  y: number;
}

const [getPosition, setPosition, observePosition, timeTravelPos] = initState<
  Position[]
>([]);
observePosition((state) => {
  console.log(state);
});

for (let i = 0; i < 3; i++) {
  setPosition((state) => {
    return [...state, { x: 100 * i, y: 100 - i * 10 }];
  });
}

timeTravelPos.moveBack();

const [getCount, setCount, observeCount, timeTravelCount] = initState(0);

observeCount((state) => {
  console.log(state);
});

for (let i = 0; i < 3; i++) {
  setCount((count) => ++count);
}

timeTravelCount.moveBack();

console.log(getCount());
