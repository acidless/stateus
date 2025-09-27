import * as React from "react";
import { createStore as createCoreStore } from "../core";

export function createStore<T extends object>(initialState: T) {
    const store = createCoreStore(initialState);

    const useStore = <U,>(selector: (s: T) => U): U => {
        if ((React as any).useSyncExternalStore) {
            return (React as any).useSyncExternalStore(
                store.subscribe,
                () => selector(store.getState())
            );
        }

        const [selected, setSelected] = React.useState(() =>
            selector(store.getState())
        );

        React.useEffect(() => {
            return store.subscribe((nextState) => {
                const nextSelected = selector(nextState);
                setSelected((prev) =>
                    Object.is(prev, nextSelected) ? prev : nextSelected
                );
            });
        }, []);

        return selected;
    };

    return { ...store, useStore };
}