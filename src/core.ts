type Listener<T> = (state: T) => void;

export function createStore<T extends object>(initialState: T) {
    let state = { ...initialState };
    const listeners = new Set<Listener<T>>();

    return {
        getState: () => state,

        setState: (partial: Partial<T>) => {
            state = { ...state, ...partial };
            listeners.forEach((listener) => listener(state));
        },

        subscribe: (listener: Listener<T>) => {
            listeners.add(listener);
            return () => {
                listeners.delete(listener)
            };
        },
    };
}