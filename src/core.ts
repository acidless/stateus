type Listener<T> = (state: T) => void;

export interface Store<T> {
    getState: () => T;
    setState: (changed: Partial<T>) => void;
    subscribe: (listener: Listener<T>) => () => void;
}

export type Middleware<T> = (store: Store<T>, changed: Partial<T>, next: (changed: Partial<T>) => void,) => void;

export function createStore<T extends object>(initialState: T, middlewares: Middleware<T>[] = []) {
    let state = { ...initialState };
    const listeners = new Set<Listener<T>>();

    const coreSetState = (changed: Partial<T>) => {
        state = { ...state, ...changed };
        listeners.forEach((l) => l(state));
    };

    const store = {
        getState: () => state,

        setState: (changed: Partial<T>) => {
            if (middlewares.length > 0) {

                const run = (index: number, changed: Partial<T>) => {
                    if (index < middlewares.length) {
                        middlewares[index](store, changed, (nextP) => run(index + 1, nextP));
                    } else {
                        coreSetState(changed);
                    }
                };

                run(0, changed);
            } else {
                coreSetState(changed);
            }
        },

        subscribe: (listener: Listener<T>) => {
            listeners.add(listener);
            return () => {
                listeners.delete(listener)
            };
        }
    };

    return store;
}