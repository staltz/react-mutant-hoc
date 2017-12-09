import {Component, createElement, ComponentClass as CClass} from 'react';
const {watch} = require('mutant');

// TODO this should come from @types/mutant or should be inside mutant itself
export interface Mutant<T> {}

export type MutantProps<P, K extends keyof P> = {
  [Key in K]: P[Key] | Mutant<P[Key]>
};

export function withMutantProps<P, K extends keyof P, M extends K>(
  Comp: CClass<P>,
  ...names: Array<M>
): CClass<MutantProps<P, K>> {
  const WMP: CClass<MutantProps<P, K>> = class extends Component<
    MutantProps<P, K>
  > {
    constructor(props: any) {
      super(props);
      const initialState: any = {};
      for (let n = names.length, i = 0; i < n; i++) {
        initialState[names[i]] = null;
      }
      this.state = initialState;
    }

    private _watchers: any;

    public componentDidMount() {
      const props = this.props as MutantProps<P, K>;
      this._watchers = {};
      names.forEach(name => {
        this._watchers[name] = watch(props[name], (val: any) => {
          this.setState((prev: any) => ({...prev, [name]: val}));
        });
      });
    }

    public componentWillUnmount() {
      let name: string;
      for (let n = names.length, i = 0; i < n; i++) {
        name = names[i];
        if (this._watchers[name]) {
          this._watchers[name]();
        }
      }
      this._watchers = null;
    }

    public render() {
      const props: P = {...this.props as any, ...this.state as any};
      return createElement(Comp, props, this.props.children);
    }
  };
  WMP.displayName =
    'WithMutantProps(' +
    (Comp.displayName || (Comp as any).name || 'Component') +
    ')';
  return WMP;
}
