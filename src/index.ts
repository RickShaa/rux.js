import rux from "./rux";

const initState = rux();

const product = {
  id: 2,
  name: "TShirt",
  sizes: ["S", "M", "L", "XL"],
  origin: {
    country: "China",
    state: "Beijing",
  },
};

const [getProducts, setProducts, productsObserver] = initState(product);
productsObserver((state) => {
  renderNewHTML(state);
});

console.log(getProducts());
//clone manipulation -  has no effect on initial State
getProducts().origin = {
  country: "NNNN",
  state: "gggggg",
};

//setter manipulation
setProducts((product) => {
  return { ...product, name: "Shoes" };
});

function renderNewHTML(whatever: any) {
  console.log(whatever);
}

//TEST;
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
