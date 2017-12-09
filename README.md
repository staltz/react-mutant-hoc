# react-mutant-hoc

```
npm install --save react-mutant-hoc
```

A utility function (higher-order component, 'HOC') that takes a React component as input, and returns a React component that behaves like the input but knows how to observe [Mutant](https://github.com/mmckegg/mutant) observables from props

## What problem this package solves

Let's say you have a normal React component that accepts normal props:

```jsx
<MyComponent isBlue={true} />
```

But you want the component to accept `isBlue` as a Mutant observable, and have that component automatically watch the observable and update accordingly.

## Usage

```js
import {withMutantProps} from 'react-mutant-hoc';

const MyMutantComponent = withMutantProps(MyComponent, 'isBlue');

// ... then in a render function ...
<MyMutantComponent isBlue={obs} />
```

