import {describe, expect} from '@jest/globals';
import {createStore, Middleware} from "../src";
import {withThunk} from "../src/middlewares/withThunk";

jest.mock("../src/middlewares/withThunk", () => ({
    withThunk: jest.fn((store, changed, next) => next(changed)),
}));

describe("createStore", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("should create store with the given initial state", () => {
        const store = createStore({counter: 10});
        expect(store.getState()).toEqual({counter: 10});
    });

    it("should change state when setState is called", () => {
        const store = createStore({counter: 10});
        store.setState({counter: store.getState().counter + 1});

        expect(store.getState()).toEqual({counter: 11});
    });

    it("should notify subscribers when state changes", () => {
        const store = createStore({counter: 10});

        const subscriber = jest.fn();

        store.subscribe(subscriber);
        store.setState({counter: store.getState().counter + 1});

        expect(subscriber).toHaveBeenCalledWith({counter: 11});
    });

    it("should unsubscribe listeners correctly", () => {
        const store = createStore({ counter: 10 });
        const subscriber = jest.fn();

        const unsubscribe = store.subscribe(subscriber);

        store.setState({ counter: store.getState().counter + 1 });
        expect(subscriber).toHaveBeenCalledTimes(1);

        unsubscribe();
        store.setState({ counter: store.getState().counter + 1 });

        expect(subscriber).toHaveBeenCalledTimes(1);
    });

    it("should notify multiple subscribers", () => {
        const store = createStore({ counter: 10 });
        const sub1 = jest.fn();
        const sub2 = jest.fn();

        store.subscribe(sub1);
        store.subscribe(sub2);

        store.setState({ counter: store.getState().counter + 1 });

        expect(sub1).toHaveBeenCalledWith({ counter: 11 });
        expect(sub2).toHaveBeenCalledWith({ counter: 11 });
    });

    it("should merge state with new keys", () => {
        const store = createStore({ counter: 10 });
        store.setState({ user: "John" } as any);

        expect(store.getState()).toEqual({ counter: 10, user: "John" });
    });

    it("should return a new state object after setState", () => {
        const store = createStore({ counter: 10 });
        const prevState = store.getState();

        store.setState({ counter: 10 });

        expect(store.getState()).not.toBe(prevState);
        expect(store.getState()).toEqual({ counter: 10 });
    });

    it("should call middleware first", () => {
        const middleware: Middleware<any> = jest.fn((store, changed, next) => {
            next(changed);
        });

        const store = createStore({ counter: 10, name: "John" }, {middlewares: [middleware]});
        store.setState({ counter: store.getState().counter + 1 });

        expect(middleware).toHaveBeenCalledWith(store, {counter: 11}, expect.any(Function));
    });

    it("shouldn't call any of default middlewares", () => {
        const store = createStore({ counter: 10, name: "John" }, {middlewares: []});
        store.setState({ counter: store.getState().counter + 1 });

        expect(withThunk).not.toHaveBeenCalled();
    });
});