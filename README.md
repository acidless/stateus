# Stateus

**Stateus** is a lightweight state management library with React hook support.
Perfect for both TypeScript and JavaScript projects.

- Minimal core, zero dependencies.
- Optional React hook for easy usage in components.
- Fully compatible with TS and JS.

## 🔹Installation
```bash
npm install stateusjs
# or
yarn add stateusjs
```

## 🔹Usage
1. With React
```jsx
import React from "react";
import { createStore } from "stateus/react";

const counterStore = createStore({ count: 0 });

export function Counter() {
  const count = counterStore.useStore((s) => s.count);

  return (
    <button onClick={() => counterStore.setState({ count: count + 1 })}>
      Count: {count}
    </button>
  );
}
```

2. Core (no React)
```jsx
import { createStore } from "stateus";

const store = createStore({ count: 0 });

store.subscribe((state) => {
  console.log("New state:", state);
});

store.setState({ count: store.getState().count + 1 });
```

## 🔹API
`createStore(initialState)` - Creates a new store.

**Methods**
  - `getState()` — returns the current state.
  - `setState(partial)` — updates the state (immutable).
  - `subscribe(listener)` — subscribes to state changes; returns an unsubscribe function.
  - `useStore(selector)` — React hook to select a part of the state (only in stateus/react).

## 🔹Roadmap


## 🔹Contribution
Contributions are welcome! 🙌
1) Fork the repository.
2) Create your feature branch: `git checkout -b feature/my-feature`.
3) Commit your changes: `git commit -m "Add some feature"`.
4) Push to the branch: `git push origin feature/my-feature`.
5) Open a Pull Request.
6) Please follow coding conventions and write meaningful commit messages.

## 🔹License
This project is licensed under the MIT License.
