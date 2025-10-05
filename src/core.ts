import {withImmer} from "./middlewares/withImmer";
import {withThunk} from "./middlewares/withThunk";

type Listener<T> = (state: T) => void;

export interface Store<T> {
    getState: () => T;
    setState: (changed: Partial<T>) => void;
    subscribe: (listener: Listener<T>) => () => void;
}

export type Middleware<T = unknown> = (
    store: Store<T>,
    changed: Partial<T> | ((store: Store<T>) => unknown),
    next: (partial: Partial<T>) => void
) => void;

export const defaultMiddlewares = [withThunk, withImmer];

export function createStore<T extends object>(initialState: T, options?: { middlewares?: Middleware[] }) {
    const middlewares = options?.middlewares ?? defaultMiddlewares;

    let state = {...initialState};
    const listeners = new Set<Listener<T>>();

    const coreSetState = (changed: Partial<T>) => {
        state = {...state, ...changed};
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