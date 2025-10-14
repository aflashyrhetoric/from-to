# From To - Animation Library

## Feature Checklist

-   [x] Basic one-shot useState-based animation
-   [ ] Animate multiple elements with a single hook
    -   [ ] Add staggerability

# react-components-starter

.from() and .to() could work for simple fade-in animations

.add("nameOfAnimation", {from: {}, to: {}}) and then we can ref.play("nameOfAnimation") imperatively on certain button clicks or whatever???

.fork(someBoolean, {from :{}, to: {}}, {from: {}, to:{}) could be a more declarative ternary for former if true, latter if false???

.stateMachine({ some sort of huge config here})

## Development

-   Install dependencies:

```bash
npm install
```

-   Run the playground:

```bash
npm run playground
```

-   Run the unit tests:

```bash
npm run test
```

-   Build the library:

```bash
npm run build
```
