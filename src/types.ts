export type CallBack<T> = (state: T) => void;
export type TObj = { [key: string]: any };
export type InitState<T> = {
  state: () => T;
};
